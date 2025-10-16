package com.pl.premier_zone.controllers;

import com.pl.premier_zone.comment.Comment;
import com.pl.premier_zone.comment.CommentRequest;
import com.pl.premier_zone.comment.CommentResponseDTO;
import com.pl.premier_zone.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    // Dohvati sve komentare za igrača
    @GetMapping("/{playerId}")
    public ResponseEntity<List<CommentResponseDTO>> getCommentsByPlayer(@PathVariable Integer playerId) {
        List<CommentResponseDTO> comments = commentService.getCommentsByPlayer(playerId);
        return ResponseEntity.ok(comments);
    }

    // Dodaj komentar za igrača
    @PostMapping("/{playerId}")
    public ResponseEntity<Comment> addComment(
            @PathVariable Integer playerId,
            @RequestBody CommentRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Comment comment = commentService.addComment(playerId, username, request.getContent());
        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }


}
