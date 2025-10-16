package com.pl.premier_zone.player;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Integer> {
    void deleteByPlayer(String playerName);
    Optional<Player> findByPlayer(String player);
    @Query("SELECT p FROM Player p WHERE LOWER(REPLACE(p.team, '-', ' ')) = LOWER(REPLACE(:team, '-', ' '))")
    List<Player> findByTeamFlexible(@Param("team") String team);

}
