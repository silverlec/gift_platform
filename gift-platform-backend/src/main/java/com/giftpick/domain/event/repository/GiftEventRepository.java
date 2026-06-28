package com.giftpick.domain.event.repository;

import com.giftpick.domain.event.entity.GiftEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GiftEventRepository extends JpaRepository<GiftEvent, Long> {

    // 특정 관리자의 이벤트 목록 (최신 순)
    List<GiftEvent> findByGiverIdOrderByCreatedAtDesc(Long giverId);

    // 이벤트 + 옵션 + 선택 정보를 한 번에 fetch join (N+1 방지)
    @Query("""
        SELECT e FROM GiftEvent e
        LEFT JOIN FETCH e.options
        LEFT JOIN FETCH e.selection s
        LEFT JOIN FETCH s.selectedOption
        WHERE e.id = :eventId
    """)
    Optional<GiftEvent> findByIdWithDetails(@Param("eventId") Long eventId);
}
