package com.giftpick.domain.selection.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class SelectGiftRequest {

    @NotNull(message = "선택할 선물 후보의 ID를 제공해주세요.")
    private Long selectedOptionId;
}
