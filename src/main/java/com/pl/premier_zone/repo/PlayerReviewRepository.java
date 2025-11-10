package com.pl.premier_zone.repo;

import com.pl.premier_zone.player.PlayerReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PlayerReviewRepository extends JpaRepository<PlayerReview, Integer> {

    List<PlayerReview> findByPlayerId(Integer playerId);

    Optional<PlayerReview> findByPlayerIdAndUserId(Integer playerId, Integer userId);

    @Query("SELECT AVG(r.rating) FROM PlayerReview r WHERE r.player.id = :playerId")
    Double findAverageRatingByPlayerId(Integer playerId);
}
