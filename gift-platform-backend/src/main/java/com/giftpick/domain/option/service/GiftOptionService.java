package com.giftpick.domain.option.service;

import com.giftpick.common.exception.CustomException;
import com.giftpick.common.exception.ErrorCode;
import com.giftpick.domain.event.entity.GiftEvent;
import com.giftpick.domain.event.repository.GiftEventRepository;
import com.giftpick.domain.option.dto.CreateOptionRequest;
import com.giftpick.domain.option.dto.OptionResponse;
import com.giftpick.domain.option.entity.GiftOption;
import com.giftpick.domain.option.repository.GiftOptionRepository;
import com.giftpick.domain.user.entity.User;
import com.giftpick.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class GiftOptionService {

    private final GiftOptionRepository optionRepository;
    private final GiftEventRepository eventRepository;
    private final UserRepository userRepository;

    /**
     * 특정 이벤트에 선물 옵션 추가
     */
    @Transactional
    public OptionResponse addOption(Long eventId, CreateOptionRequest request, String giverEmail) {
        User giver = userRepository.findByEmail(giverEmail)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        GiftEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new CustomException(ErrorCode.EVENT_NOT_FOUND));

        // 기버 본인의 이벤트인지 확인
        if (!event.isOwnedBy(giver.getId())) {
            throw new CustomException(ErrorCode.EVENT_ACCESS_DENIED);
        }

        // 이미 완료된 이벤트이거나 수혜자가 선물을 골랐다면 수정 불가
        if (event.getStatus() == GiftEvent.EventStatus.SELECTED || 
            event.getStatus() == GiftEvent.EventStatus.COMPLETED) {
            throw new CustomException(ErrorCode.INVALID_REQUEST, "이미 완료되었거나 선물 선택이 끝난 이벤트에는 옵션을 추가할 수 없습니다.");
        }

        GiftOption option = GiftOption.builder()
                .name(request.getName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .points(request.getPoints())
                .event(event)
                .build();

        event.addOption(option); // 이벤트 엔티티에서 연관관계 편의 메서드 및 상태 변경 가능
        GiftOption savedOption = optionRepository.save(option);
        log.info("선물 옵션 추가 완료: eventId={}, optionId={}", eventId, savedOption.getId());
        return OptionResponse.from(savedOption);
    }

    /**
     * 특정 이벤트의 선물 옵션 삭제
     */
    @Transactional
    public void deleteOption(Long eventId, Long optionId, String giverEmail) {
        User giver = userRepository.findByEmail(giverEmail)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        GiftEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new CustomException(ErrorCode.EVENT_NOT_FOUND));

        if (!event.isOwnedBy(giver.getId())) {
            throw new CustomException(ErrorCode.EVENT_ACCESS_DENIED);
        }

        if (event.getStatus() == GiftEvent.EventStatus.SELECTED || 
            event.getStatus() == GiftEvent.EventStatus.COMPLETED) {
            throw new CustomException(ErrorCode.INVALID_REQUEST, "이미 완료되었거나 선물 선택이 끝난 이벤트의 옵션은 삭제할 수 없습니다.");
        }

        GiftOption option = optionRepository.findById(optionId)
                .orElseThrow(() -> new CustomException(ErrorCode.OPTION_NOT_FOUND));

        if (!option.belongsToEvent(eventId)) {
            throw new CustomException(ErrorCode.OPTION_NOT_BELONG_TO_EVENT);
        }

        optionRepository.delete(option);
        log.info("선물 옵션 삭제 완료: eventId={}, optionId={}", eventId, optionId);
    }
}
