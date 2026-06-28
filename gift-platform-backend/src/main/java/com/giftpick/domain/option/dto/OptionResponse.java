package com.giftpick.domain.option.dto;

import com.giftpick.domain.option.entity.GiftOption;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OptionResponse {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private Integer points;

    public static OptionResponse from(GiftOption option) {
        if (option == null) return null;
        return OptionResponse.builder()
                .id(option.getId())
                .name(option.getName())
                .description(option.getDescription())
                .imageUrl(option.getImageUrl())
                .points(option.getPoints())
                .build();
    }
}
