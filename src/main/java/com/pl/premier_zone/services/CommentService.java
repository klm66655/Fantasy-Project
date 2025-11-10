package com.pl.premier_zone.services;

import com.pl.premier_zone.comment.Comment;
import com.pl.premier_zone.player.Player;
import com.pl.premier_zone.player.PlayerRepository;
import com.pl.premier_zone.repo.CommentRepository;
import com.pl.premier_zone.repo.UserRepo;
import com.pl.premier_zone.user.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.pl.premier_zone.comment.CommentResponseDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PlayerRepository playerRepository;
    private final UserRepo userRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository, PlayerRepository playerRepository, UserRepo userRepository) {
        this.commentRepository = commentRepository;
        this.playerRepository = playerRepository;
        this.userRepository = userRepository;
    }

    public List<CommentResponseDTO> getCommentsByPlayer(Integer playerId) {
        List<Comment> comments = commentRepository.findByPlayerId(playerId);
        return comments.stream()
                .map(c -> {
                    CommentResponseDTO dto = new CommentResponseDTO();
                    dto.setId(c.getId());
                    dto.setContent(c.getContent());
                    dto.setUsername(c.getUser() != null ? c.getUser().getUsername() : "Unknown");
                    dto.setCreatedAt(c.getCreatedAt());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public CommentResponseDTO addComment(Integer playerId, String username, String content) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found"));

        Users user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Comment comment = new Comment();
        comment.setPlayer(player);
        comment.setUser(user);
        comment.setContent(content);

        Comment savedComment = commentRepository.save(comment);

        // Kreiraj i vrati DTO
        CommentResponseDTO dto = new CommentResponseDTO();
        dto.setId(savedComment.getId());
        dto.setContent(savedComment.getContent());
        dto.setUsername(savedComment.getUser().getUsername());
        dto.setCreatedAt(savedComment.getCreatedAt());

        return dto;
    }

    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));

        commentRepository.delete(comment);
    }
}