package com.giftpick.domain.option.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class CreateOptionRequest {

    @NotBlank(message = "선물 후보 이름을 입력해주세요.")
    @Size(max = 200, message = "선물 후보 이름은 200자 이하여야 합니다.")
    private String name;

    private String description;

    @Size(max = 1000, message = "이미지 URL은 1000자 이하여야 합니다.")
    private String imageUrl;

    @NotNull(message = "점수를 입력해주세요.")
    @Min(value = 0, message = "점수는 0점 이상이어야 합니다.")
    private Integer points;
}
