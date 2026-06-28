package com.giftpick.domain.event.entity;

import com.giftpick.domain.option.entity.GiftOption;
import com.giftpick.domain.selection.entity.GiftSelection;
import com.giftpick.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 선물 이벤트 엔티티.
 * 관리자(giver)가 생성하고, 수혜자(recipient)가 초대를 받아 선물을 고릅니다.
 */
@Entity
@Table(name = "gift_events")
@EntityListeners(AuditingEntityListener.class)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GiftEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EventStatus status;

    // 이벤트를 생성한 관리자
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giver_id", nullable = false)
    private User giver;

    // 초대된 수혜자 (이메일 초대 시 null 가능 → 수락 후 설정)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id")
    private User recipient;

    // 수혜자 이름 (수혜자가 아직 가입 전일 때도 이름을 저장)
    @Column(length = 100)
    private String recipientName;

    // 이벤트의 선물 옵션 목록 (cascade로 함께 관리)
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private List<GiftOption> options = new ArrayList<>();

    // 수혜자의 최종 선물 선택 (1:1)
    @OneToOne(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private GiftSelection selection;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Builder
    public GiftEvent(String name, String description, LocalDate startDate,
                     LocalDate endDate, User giver, String recipientName) {
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.giver = giver;
        this.recipientName = recipientName;
        this.status = EventStatus.CREATED;
    }

    // ===== 도메인 메서드 =====

    public void updateInfo(String name, String description,
                           LocalDate startDate, LocalDate endDate) {
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public void assignRecipient(User recipient) {
        this.recipient = recipient;
        this.status = EventStatus.SENT;
    }

    public void markSelected() {
        this.status = EventStatus.SELECTED;
    }

    public void markCompleted() {
        this.status = EventStatus.COMPLETED;
    }

    public void addOption(GiftOption option) {
        this.options.add(option);
        if (this.status == EventStatus.CREATED) {
            this.status = EventStatus.SENT;
        }
    }

    public boolean isOwnedBy(Long userId) {
        return this.giver.getId().equals(userId);
    }

    public boolean isExpired() {
        return LocalDate.now().isAfter(this.endDate);
    }

    public boolean isSelectable() {
        return this.status == EventStatus.SENT && !isExpired();
    }

    public enum EventStatus {
        CREATED,    // 이벤트 생성됨 (옵션 미등록)
        SENT,       // 초대장 발송 완료 (선물 선택 대기 중)
        SELECTED,   // 수혜자가 선물을 선택함
        COMPLETED   // 관리자가 실제 구매 완료
    }
}
