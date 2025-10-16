package com.pl.premier_zone.services;

import com.pl.premier_zone.favorite.Favorite;
import com.pl.premier_zone.player.Player;
import com.pl.premier_zone.player.PlayerRepository;
import com.pl.premier_zone.repo.FavoriteRepository;
import com.pl.premier_zone.user.Users;
import com.pl.premier_zone.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private UserRepo usersRepository;

    @Autowired
    private PlayerRepository playerRepository;

    public List<Favorite> getFavoritesByUserId(Integer userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return favoriteRepository.findByUser(user);
    }

    public Favorite addFavorite(Integer userId, Integer playerId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found"));

        // Provjera da li već postoji
        if (favoriteRepository.findByUserAndPlayer(user, player).isPresent()) {
            throw new RuntimeException("Already in favorites");
        }

        Favorite favorite = new Favorite(user, player);
        return favoriteRepository.save(favorite);
    }

    public void removeFavorite(Integer userId, Integer playerId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found"));

        Favorite favorite = favoriteRepository.findByUserAndPlayer(user, player)
                .orElseThrow(() -> new RuntimeException("Favorite not found"));

        favoriteRepository.delete(favorite);
    }
}
