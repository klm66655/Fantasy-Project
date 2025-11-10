package com.pl.premier_zone.services;

import com.pl.premier_zone.player.Player;
import com.pl.premier_zone.player.PlayerReview;
import com.pl.premier_zone.user.Users;
import com.pl.premier_zone.player.PlayerRepository;
import com.pl.premier_zone.repo.PlayerReviewRepository;
import com.pl.premier_zone.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PlayerReviewService {

    @Autowired
    private PlayerReviewRepository reviewRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private UserRepo userRepository;

    public PlayerReview addReview(Integer playerId, Integer userId, int rating) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found"));
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Spriječi duplu recenziju istog korisnika za istog igrača
        reviewRepository.findByPlayerIdAndUserId(playerId, userId)
                .ifPresent(r -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "User already rated this player"); });

        PlayerReview review = new PlayerReview();
        review.setPlayer(player);
        review.setUser(user);
        review.setRating(rating);
        return reviewRepository.save(review);
    }

    public List<PlayerReview> getReviewsForPlayer(Integer playerId) {
        return reviewRepository.findByPlayerId(playerId);
    }

    public Double getAverageRating(Integer playerId) {
        Double avg = reviewRepository.findAverageRatingByPlayerId(playerId);
        return avg != null ? avg : 0.0; // vraća 0 ako nema ocena
    }
}
