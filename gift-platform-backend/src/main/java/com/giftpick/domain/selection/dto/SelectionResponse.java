package com.giftpick.domain.selection.dto;

import com.giftpick.domain.option.dto.OptionResponse;
import com.giftpick.domain.selection.entity.GiftSelection;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class SelectionResponse {
    private Long id;
    private Long eventId;
    private Long recipientId;
    private String recipientName;
    private OptionResponse selectedOption;
    private LocalDateTime selectionDate;

    public static SelectionResponse from(GiftSelection selection) {
        if (selection == null) return null;
        return SelectionResponse.builder()
                .id(selection.getId())
                .eventId(selection.getEvent().getId())
                .recipientId(selection.getRecipient().getId())
                .recipientName(selection.getRecipient().getUsername())
                .selectedOption(OptionResponse.from(selection.getSelectedOption()))
                .selectionDate(selection.getSelectionDate())
                .build();
    }
}
