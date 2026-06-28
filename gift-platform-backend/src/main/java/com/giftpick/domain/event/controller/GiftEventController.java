package com.giftpick.domain.event.controller;

import com.giftpick.common.dto.ApiResponse;
import com.giftpick.domain.event.dto.CreateEventRequest;
import com.giftpick.domain.event.dto.EventResponse;
import com.giftpick.domain.event.dto.UpdateEventRequest;
import com.giftpick.domain.event.service.GiftEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "GiftEvent", description = "선물 이벤트 관리 API")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class GiftEventController {

    private final GiftEventService eventService;

    @Operation(summary = "이벤트 생성 (GIVER)", description = "새로운 선물 선택 이벤트를 생성합니다.")
    @PreAuthorize("hasRole('GIVER')")
    @PostMapping("/events")
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(
            @Valid @RequestBody CreateEventRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        EventResponse response = eventService.createEvent(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response));
    }

    @Operation(summary = "내 이벤트 목록 조회 (GIVER)", description = "로그인한 기버(선물 전달자)가 생성한 모든 이벤트를 조회합니다.")
    @PreAuthorize("hasRole('GIVER')")
    @GetMapping("/events")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getMyEvents(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<EventResponse> response = eventService.getMyEvents(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "이벤트 상세 조회 (기버 & 수혜자)", description = "특정 이벤트의 정보, 선물 후보 목록 및 선택 결과를 조회합니다.")
    @GetMapping("/events/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getEventDetail(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        EventResponse response = eventService.getEventDetail(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "비로그인 초대 이벤트 상세 조회 (공개)", description = "수혜자가 초대 링크를 열었을 때 로그인 없이 이벤트 정보를 확인합니다.")
    @GetMapping("/invite/{eventId}")
    public ResponseEntity<ApiResponse<EventResponse>> getInviteEventDetail(
            @PathVariable Long eventId
    ) {
        EventResponse response = eventService.getInviteEventDetail(eventId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "이벤트 정보 수정 (GIVER)", description = "이벤트 이름, 기간 등을 수정합니다.")
    @PreAuthorize("hasRole('GIVER')")
    @PutMapping("/events/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEventRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        EventResponse response = eventService.updateEvent(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "이벤트 삭제 (GIVER)", description = "이벤트를 완전히 삭제합니다.")
    @PreAuthorize("hasRole('GIVER')")
    @DeleteMapping("/events/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        eventService.deleteEvent(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success());
    }

    @Operation(summary = "초대장 발송 처리 (GIVER)", description = "수혜자에게 초대장을 전송 완료 처리(상태 변경)합니다.")
    @PreAuthorize("hasRole('GIVER')")
    @PostMapping("/events/{id}/send")
    public ResponseEntity<ApiResponse<EventResponse>> sendInvitation(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        EventResponse response = eventService.sendInvitation(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(summary = "선물 구매 완료 처리 (GIVER)", description = "기버가 선물 구매를 완료하고 이벤트를 최종 종료 처리합니다.")
    @PreAuthorize("hasRole('GIVER')")
    @PatchMapping("/events/{id}/complete")
    public ResponseEntity<ApiResponse<EventResponse>> completeEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        EventResponse response = eventService.completeEvent(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
