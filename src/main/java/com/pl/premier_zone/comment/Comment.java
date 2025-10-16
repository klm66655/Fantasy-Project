package com.pl.premier_zone.comment;

import com.pl.premier_zone.user.Users;
import com.pl.premier_zone.player.Player;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "player_comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // No-args constructor
    public Comment() {
        this.createdAt = LocalDateTime.now();
    }

    // All-args constructor
    public Comment(String content, Player player, Users user) {
        this.content = content;
        this.player = player;
        this.user = user;
        this.createdAt = LocalDateTime.now();
    }

    // Getters i Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
