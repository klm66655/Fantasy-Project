package com.pl.premier_zone.controllers;

import com.pl.premier_zone.player.PlayerReview;
import com.pl.premier_zone.player.ReviewRequest;
import com.pl.premier_zone.services.PlayerReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PlayerReviewController {

    @Autowired
    private PlayerReviewService reviewService;

    // Dodavanje recenzije
    @PostMapping("/{playerId}")
    public PlayerReview addReview(
            @PathVariable Integer playerId,
            @RequestBody ReviewRequest request
    ) {
        return reviewService.addReview(playerId, request.getUserId(), request.getRating());
    }

    // Sve recenzije za određenog igrača
    @GetMapping("/{playerId}")
    public List<PlayerReview> getReviews(@PathVariable Integer playerId) {
        return reviewService.getReviewsForPlayer(playerId);
    }

    // Prosečna ocena igrača
    @GetMapping("/{playerId}/average")
    public Double getAverageRating(@PathVariable Integer playerId) {
        return reviewService.getAverageRating(playerId);
    }
}
