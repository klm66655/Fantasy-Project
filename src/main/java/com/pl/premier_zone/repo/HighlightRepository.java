package com.pl.premier_zone.repo;

import com.pl.premier_zone.highlight.Highlight;
import com.pl.premier_zone.highlight.HighlightType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HighlightRepository extends JpaRepository<Highlight, Long> {

    // Custom query sa joinovima
    @Query("SELECT h FROM Highlight h " +
            "LEFT JOIN FETCH h.player p " +
            "LEFT JOIN FETCH p.team " +
            "WHERE h.id = :id")
    Optional<Highlight> findByIdWithRelations(@Param("id") Long id);

    // Filter po tipu
    Page<Highlight> findByType(HighlightType type, Pageable pageable);

    // Filter po igraču
    Page<Highlight> findByPlayerId(Long playerId, Pageable pageable);

    // Filter po tipu i igraču
    Page<Highlight> findByTypeAndPlayerId(HighlightType type, Long playerId, Pageable pageable);

    // Top highlighti za igrača
    List<Highlight> findTop10ByPlayerIdOrderByCreatedAtDesc(Long playerId);
}