package com.pl.premier_zone.comment;

import java.time.LocalDateTime;

public class CommentResponseDTO {

    private String content;
    private String username;
    private LocalDateTime createdAt;

    public CommentResponseDTO() {
    }

    public CommentResponseDTO(String content, String username, LocalDateTime createdAt) {
        this.content = content;
        this.username = username;
        this.createdAt = createdAt;
    }

    // Getteri i setteri
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
