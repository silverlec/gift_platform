package com.giftpick.domain.option.repository;

import com.giftpick.domain.option.entity.GiftOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GiftOptionRepository extends JpaRepository<GiftOption, Long> {

    List<GiftOption> findByEventIdOrderByIdAsc(Long eventId);
}
