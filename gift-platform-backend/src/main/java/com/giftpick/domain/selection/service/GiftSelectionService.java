package com.giftpick.domain.selection.service;

import com.giftpick.common.exception.CustomException;
import com.giftpick.common.exception.ErrorCode;
import com.giftpick.domain.event.entity.GiftEvent;
import com.giftpick.domain.event.repository.GiftEventRepository;
import com.giftpick.domain.option.entity.GiftOption;
import com.giftpick.domain.option.repository.GiftOptionRepository;
import com.giftpick.domain.selection.dto.SelectGiftRequest;
import com.giftpick.domain.selection.dto.SelectionResponse;
import com.giftpick.domain.selection.entity.GiftSelection;
import com.giftpick.domain.selection.repository.GiftSelectionRepository;
import com.giftpick.domain.user.entity.User;
import com.giftpick.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class GiftSelectionService {

    private final GiftSelectionRepository selectionRepository;
    private final GiftEventRepository eventRepository;
    private final GiftOptionRepository optionRepository;
    private final UserRepository userRepository;

    /**
     * 수혜자의 선물 옵션 최종 선택
     */
    @Transactional
    public SelectionResponse selectGift(Long eventId, SelectGiftRequest request, String recipientEmail) {
        User recipient = userRepository.findByEmail(recipientEmail)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 수혜자 역할이 맞는지 검증
        if (recipient.getRole() != User.UserRole.RECIPIENT) {
            throw new CustomException(ErrorCode.FORBIDDEN, "수혜자(RECIPIENT) 계정만 선물을 선택할 수 있습니다.");
        }

        GiftEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new CustomException(ErrorCode.EVENT_NOT_FOUND));

        // 이벤트가 만료되었거나, 이미 선택 완료되었거나, 아직 활성화되지 않은 경우
        if (event.isExpired()) {
            throw new CustomException(ErrorCode.EVENT_EXPIRED);
        }
        if (event.getStatus() == GiftEvent.EventStatus.SELECTED || 
            event.getStatus() == GiftEvent.EventStatus.COMPLETED) {
            throw new CustomException(ErrorCode.EVENT_ALREADY_SELECTED);
        }
        if (!event.isSelectable()) {
            throw new CustomException(ErrorCode.INVALID_REQUEST, "현재 선물을 고를 수 없는 이벤트 상태입니다.");
        }

        // 선택한 옵션 확인
        GiftOption option = optionRepository.findById(request.getSelectedOptionId())
                .orElseThrow(() -> new CustomException(ErrorCode.OPTION_NOT_FOUND));

        if (!option.belongsToEvent(eventId)) {
            throw new CustomException(ErrorCode.OPTION_NOT_BELONG_TO_EVENT);
        }

        // 이미 선택 정보가 존재하는지 최종 검증 (데이터 무결성)
        if (selectionRepository.existsByEventId(eventId)) {
            throw new CustomException(ErrorCode.EVENT_ALREADY_SELECTED);
        }

        // 선물 선택 정보 저장
        GiftSelection selection = GiftSelection.builder()
                .event(event)
                .recipient(recipient)
                .selectedOption(option)
                .build();

        // 이벤트 상태 및 수혜자 정보 매핑
        event.assignRecipient(recipient);
        event.markSelected();

        GiftSelection savedSelection = selectionRepository.save(selection);
        log.info("선물 선택 완료: eventId={}, recipientId={}, selectedOptionId={}", 
                eventId, recipient.getId(), option.getId());

        return SelectionResponse.from(savedSelection);
    }

    /**
     * 특정 이벤트의 선물 선택 결과 조회
     */
    @Transactional(readOnly = true)
    public SelectionResponse getSelection(Long eventId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        GiftEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new CustomException(ErrorCode.EVENT_NOT_FOUND));

        // 권한 확인: 생성 기버이거나 해당 수혜자 본인이어야 함
        if (!event.isOwnedBy(user.getId()) && 
            (event.getRecipient() == null || !event.getRecipient().getId().equals(user.getId()))) {
            throw new CustomException(ErrorCode.EVENT_ACCESS_DENIED);
        }

        GiftSelection selection = selectionRepository.findByEventId(eventId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_REQUEST, "아직 선물이 선택되지 않았습니다."));

        return SelectionResponse.from(selection);
    }
}
