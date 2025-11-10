package com.pl.premier_zone.player;

import com.pl.premier_zone.user.Users;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "player_reviews",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"player_id", "user_id"})
        }
)
public class PlayerReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    private int rating;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getteri i setteri
    public Long getId() {
        return id;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
