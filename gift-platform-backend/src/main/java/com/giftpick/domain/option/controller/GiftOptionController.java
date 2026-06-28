package com.giftpick.domain.option.controller;

import com.giftpick.common.dto.ApiResponse;
import com.giftpick.domain.option.dto.CreateOptionRequest;
import com.giftpick.domain.option.dto.OptionResponse;
import com.giftpick.domain.option.service.GiftOptionService;
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

@Tag(name = "GiftOption", description = "선물 후보 옵션 관리 API")
@RestController
@RequestMapping("/api/events/{eventId}/options")
@RequiredArgsConstructor
public class GiftOptionController {

    private final GiftOptionService optionService;

    @Operation(summary = "선물 후보 추가 (GIVER)", description = "이벤트에 수혜자가 선택할 선물 옵션을 추가합니다.")
    @PreAuthorize("hasRole('GIVER')")
    @PostMapping
    public ResponseEntity<ApiResponse<OptionResponse>> addOption(
            @PathVariable Long eventId,
            @Valid @RequestBody CreateOptionRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        OptionResponse response = optionService.addOption(eventId, request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response));
    }

    @Operation(summary = "선물 후보 삭제 (GIVER)", description = "이벤트에 등록되어 있던 선물 옵션을 삭제합니다.")
    @PreAuthorize("hasRole('GIVER')")
    @DeleteMapping("/{optionId}")
    public ResponseEntity<ApiResponse<Void>> deleteOption(
            @PathVariable Long eventId,
            @PathVariable Long optionId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        optionService.deleteOption(eventId, optionId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success());
    }
}
