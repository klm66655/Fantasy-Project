package com.pl.premier_zone.repo;

import com.pl.premier_zone.favorite.Favorite;
import com.pl.premier_zone.player.Player;
import com.pl.premier_zone.user.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {
    List<Favorite> findByUser(Users user);
    Optional<Favorite> findByUserAndPlayer(Users user, Player player);
}
