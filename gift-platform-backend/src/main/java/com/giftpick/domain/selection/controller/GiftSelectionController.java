package com.giftpick.domain.selection.controller;

import com.giftpick.common.dto.ApiResponse;
import com.giftpick.domain.selection.dto.SelectGiftRequest;
import com.giftpick.domain.selection.dto.SelectionResponse;
import com.giftpick.domain.selection.service.GiftSelectionService;
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

@Tag(name = "GiftSelection", description = "수혜자 선물 선택 API")
@RestController
@RequestMapping("/api/events/{eventId}")
@RequiredArgsConstructor
public class GiftSelectionController {

    private final GiftSelectionService selectionService;

    @Operation(summary = "선물 선택하기 (RECIPIENT)", description = "수혜자가 자신이 받을 선물을 최종 선택합니다.")
    @PreAuthorize("hasRole('RECIPIENT')")
    @PostMapping("/select")
    public ResponseEntity<ApiResponse<SelectionResponse>> selectGift(
            @PathVariable Long eventId,
            @Valid @RequestBody SelectGiftRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        SelectionResponse response = selectionService.selectGift(eventId, request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response));
    }

    @Operation(summary = "선택 결과 조회 (기버 & 수혜자)", description = "특정 이벤트의 선물 선택 결과를 상세히 조회합니다.")
    @GetMapping("/selection")
    public ResponseEntity<ApiResponse<SelectionResponse>> getSelection(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        SelectionResponse response = selectionService.getSelection(eventId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
