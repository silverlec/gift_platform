package com.giftpick.domain.selection.repository;

import com.giftpick.domain.selection.entity.GiftSelection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GiftSelectionRepository extends JpaRepository<GiftSelection, Long> {

    Optional<GiftSelection> findByEventId(Long eventId);

    boolean existsByEventId(Long eventId);
}
