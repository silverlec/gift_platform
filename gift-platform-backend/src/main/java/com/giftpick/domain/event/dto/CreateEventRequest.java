package com.giftpick.domain.event.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class CreateEventRequest {

    @NotBlank(message = "이벤트 이름을 입력해주세요.")
    @Size(max = 200, message = "이벤트 이름은 200자 이하여야 합니다.")
    private String name;

    private String description;

    @NotNull(message = "이벤트 시작일을 선택해주세요.")
    private LocalDate startDate;

    @NotNull(message = "이벤트 종료일을 선택해주세요.")
    private LocalDate endDate;

    @NotBlank(message = "수혜자 이름을 입력해주세요.")
    @Size(max = 100, message = "수혜자 이름은 100자 이하여야 합니다.")
    private String recipientName;
}
