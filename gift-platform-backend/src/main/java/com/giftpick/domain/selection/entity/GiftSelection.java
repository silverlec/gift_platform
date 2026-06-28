package com.giftpick.domain.selection.entity;

import com.giftpick.domain.event.entity.GiftEvent;
import com.giftpick.domain.option.entity.GiftOption;
import com.giftpick.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 수혜자의 선물 선택 엔티티.
 * 하나의 GiftEvent에 대해 단 하나의 GiftSelection이 존재합니다(1:1).
 */
@Entity
@Table(name = "gift_selections")
@EntityListeners(AuditingEntityListener.class)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GiftSelection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 선택이 이루어진 이벤트 (1:1)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false, unique = true)
    private GiftEvent event;

    // 선택한 수혜자
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    // 수혜자가 선택한 선물 옵션
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_option_id", nullable = false)
    private GiftOption selectedOption;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime selectionDate;

    @Builder
    public GiftSelection(GiftEvent event, User recipient, GiftOption selectedOption) {
        this.event = event;
        this.recipient = recipient;
        this.selectedOption = selectedOption;
    }
}
