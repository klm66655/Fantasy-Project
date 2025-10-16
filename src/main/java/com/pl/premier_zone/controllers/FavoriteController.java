package com.pl.premier_zone.controllers;

import com.pl.premier_zone.favorite.Favorite;
import com.pl.premier_zone.services.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @PostMapping("/{userId}/{playerId}")
    public ResponseEntity<Favorite> addFavorite(@PathVariable("userId") Integer userId, @PathVariable("playerId") Integer playerId) {
        return ResponseEntity.ok(favoriteService.addFavorite(userId, playerId));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Favorite>> getFavorites(@PathVariable Integer userId) {
        return ResponseEntity.ok(favoriteService.getFavoritesByUserId(userId));
    }

    @DeleteMapping("/{userId}/{playerId}")
    public ResponseEntity<String> removeFavorite(@PathVariable("userId") Integer userId, @PathVariable("playerId") Integer playerId) {
        favoriteService.removeFavorite(userId, playerId);
        return ResponseEntity.ok("Favorite removed");
    }
}
