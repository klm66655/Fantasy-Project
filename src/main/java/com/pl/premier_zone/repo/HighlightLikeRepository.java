package com.pl.premier_zone.repo;

import com.pl.premier_zone.highlight.HighlightLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HighlightLikeRepository extends JpaRepository<HighlightLike, Long> {

    // Promeni sve Integer userId u Long userId
    Optional<HighlightLike> findByHighlightIdAndUserId(Long highlightId, Long userId);

    boolean existsByHighlightIdAndUserId(Long highlightId, Long userId);

    @Query("SELECT hl.highlightId FROM HighlightLike hl WHERE hl.userId = :userId AND hl.highlightId IN :highlightIds")
    List<Long> findLikedHighlightIdsByUserAndHighlights(
            @Param("userId") Long userId,
            @Param("highlightIds") List<Long> highlightIds
    );
}