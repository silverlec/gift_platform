package com.giftpick.domain.event.service;

import com.giftpick.common.exception.CustomException;
import com.giftpick.common.exception.ErrorCode;
import com.giftpick.domain.event.dto.CreateEventRequest;
import com.giftpick.domain.event.dto.EventResponse;
import com.giftpick.domain.event.dto.UpdateEventRequest;
import com.giftpick.domain.event.entity.GiftEvent;
import com.giftpick.domain.event.repository.GiftEventRepository;
import com.giftpick.domain.user.entity.User;
import com.giftpick.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GiftEventService {

    private final GiftEventRepository eventRepository;
    private final UserRepository userRepository;

    /**
     * 선물 이벤트 생성
     */
    @Transactional
    public EventResponse createEvent(CreateEventRequest request, String giverEmail) {
        User giver = userRepository.findByEmail(giverEmail)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        GiftEvent event = GiftEvent.builder()
                .name(request.getName())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .giver(giver)
                .recipientName(request.getRecipientName())
                .build();

        GiftEvent savedEvent = eventRepository.save(event);
        log.info("이벤트 생성 완료: id={}, name={}", savedEvent.getId(), savedEvent.getName());
        return EventResponse.from(savedEvent);
    }

    /**
     * 나의 이벤트 목록 조회 (Giver용)
     */
    @Transactional(readOnly = true)
    public List<EventResponse> getMyEvents(String giverEmail) {
        User giver = userRepository.findByEmail(giverEmail)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<GiftEvent> events = eventRepository.findByGiverIdOrderByCreatedAtDesc(giver.getId());
        return events.stream()
                .map(EventResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 이벤트 상세 조회
     */
    @Transactional(readOnly = true)
    public EventResponse getEventDetail(Long eventId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        GiftEvent event = eventRepository.findByIdWithDetails(eventId)
                .orElseThrow(() -> new CustomException(ErrorCode.EVENT_NOT_FOUND));

        // 권한 확인: 생성한 기버 본인이거나 지정된 수혜자여야 접근 가능
        if (!event.isOwnedBy(user.getId()) && 
            (event.getRecipient() == null || !event.getRecipient().getId().equals(user.getId()))) {
            throw new CustomException(ErrorCode.EVENT_ACCESS_DENIED);
        }

        return EventResponse.from(event);
    }

    /**
     * 비로그인 상태에서 초대받은 이벤트 정보 조회 (초대 링크 열었을 때)
     */
    @Transactional(readOnly = true)
    public EventResponse getInviteEventDetail(Long eventId) {
        GiftEvent event = eventRepository.findByIdWithDetails(eventId)
                .orElseThrow(() -> new CustomException(ErrorCode.EVENT_NOT_FOUND));

        // 이미 종료된 이벤트인지 체크
        if (event.isExpired()) {
            throw new CustomException(ErrorCode.EVENT_EXPIRED);
        }

        return EventResponse.from(event);
    }

    /**
     * 이벤트 정보 수정
     */
    @Transactional
    public EventResponse updateEvent(Long eventId, UpdateEventRequest request, String giverEmail) {
        User giver = userRepository.findByEmail(giverEmail)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        GiftEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new CustomException(ErrorCode.EVENT_NOT_FOUND));

        if (!event.isOwnedBy(giver.getId())) {
            throw new CustomException(ErrorCode.EVENT_ACCESS_DENIED);
        }

        event.updateInfo(
                request.getName(),
                request.getDescription(),
                request.getStartDate(),
                request.getEndDate()
        );

        log.info("이벤트 수정 완료: id={}", event.getId());
        return EventResponse.from(event);
    }

    /**
     * 이벤트 삭제
     */
    @Transactional
    public void deleteEvent(Long eventId, String giverEmail) {
        User giver = userRepository.findByEmail(giverEmail)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        GiftEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new CustomException(ErrorCode.EVENT_NOT_FOUND));

        if (!event.isOwnedBy(giver.getId())) {
            throw new CustomException(ErrorCode.EVENT_ACCESS_DENIED);
        }

        eventRepository.delete(event);
        log.info("이벤트 삭제 완료: id={}", eventId);
    }

    /**
     * 초대장 발송 처리 (STATUS를 SENT로 변경하고, 수혜자 가입에 대응하기 위해 기버가 전송 버튼 누를 시 처리)
     */
    @Transactional
    public EventResponse sendInvitation(Long eventId, String giverEmail) {
        User giver = userRepository.findByEmail(giverEmail)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        GiftEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new CustomException(ErrorCode.EVENT_NOT_FOUND));

        if (!event.isOwnedBy(giver.getId())) {
            throw new CustomException(ErrorCode.EVENT_ACCESS_DENIED);
        }

        // 옵션이 최소 한 개 이상 등록되어야 발송 가능하도록 체크할 수도 있습니다.
        if (event.getOptions().isEmpty()) {
            throw new CustomException(ErrorCode.INVALID_REQUEST, "최소 한 개 이상의 선물 옵션을 등록해야 초대장을 발송할 수 있습니다.");
        }

        if (event.getStatus() == GiftEvent.EventStatus.CREATED) {
            // status 변경 등 (기본 팩토리 빌더 상에서는 created일 때 option 추가되면 sent가 되거나, 혹은 명시적으로 발송 처리)
            event.assignRecipient(null); // recipient는 링크 타고 들어와 수락할 때 바인딩됨
        }

        return EventResponse.from(event);
    }

    /**
     * 기버가 선물 최종 구매 완료 처리
     */
    @Transactional
    public EventResponse completeEvent(Long eventId, String giverEmail) {
        User giver = userRepository.findByEmail(giverEmail)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        GiftEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new CustomException(ErrorCode.EVENT_NOT_FOUND));

        if (!event.isOwnedBy(giver.getId())) {
            throw new CustomException(ErrorCode.EVENT_ACCESS_DENIED);
        }

        if (event.getStatus() != GiftEvent.EventStatus.SELECTED) {
            throw new CustomException(ErrorCode.INVALID_REQUEST, "수혜자가 선물을 고른 후에만 완료 처리가 가능합니다.");
        }

        event.markCompleted();
        log.info("이벤트 구매 및 최종 완료 처리: id={}", event.getId());
        return EventResponse.from(event);
    }
}
