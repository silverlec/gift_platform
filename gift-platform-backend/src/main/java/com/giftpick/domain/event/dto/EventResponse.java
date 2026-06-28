package com.giftpick.domain.event.dto;

import com.giftpick.domain.event.entity.GiftEvent;
import com.giftpick.domain.option.dto.OptionResponse;
import com.giftpick.domain.selection.dto.SelectionResponse;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class EventResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String giverName;
    private String recipientName;
    private List<OptionResponse> options;
    private SelectionResponse selection;

    public static EventResponse from(GiftEvent event) {
        if (event == null) return null;
        return EventResponse.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .status(event.getStatus().name())
                .giverName(event.getGiver().getUsername())
                .recipientName(event.getRecipientName())
                .options(event.getOptions() != null ? 
                        event.getOptions().stream()
                                .map(OptionResponse::from)
                                .collect(Collectors.toList()) : List.of())
                .selection(SelectionResponse.from(event.getSelection()))
                .build();
    }
}
