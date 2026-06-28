package com.giftpick.domain.option.entity;

import com.giftpick.domain.event.entity.GiftEvent;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 선물 옵션 엔티티.
 * 하나의 GiftEvent에 여러 개의 선물 후보가 등록됩니다.
 */
@Entity
@Table(name = "gift_options")
@EntityListeners(AuditingEntityListener.class)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GiftOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 1000)
    private String imageUrl;

    @Column(nullable = false)
    private Integer points;

    // 이 옵션이 속한 이벤트
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private GiftEvent event;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public GiftOption(String name, String description, String imageUrl,
                      Integer points, GiftEvent event) {
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.points = points;
        this.event = event;
    }

    public void updateInfo(String name, String description, String imageUrl, Integer points) {
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.points = points;
    }

    public boolean belongsToEvent(Long eventId) {
        return this.event.getId().equals(eventId);
    }
}
