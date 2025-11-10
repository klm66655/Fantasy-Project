package com.pl.premier_zone.highlight;

import com.pl.premier_zone.dto.*;
import com.pl.premier_zone.repo.UserRepo;
import com.pl.premier_zone.user.Users;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/highlights")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HighlightController {

    private final HighlightService highlightService;
    private final UserRepo userRepository;

    @GetMapping
    public ResponseEntity<PagedHighlightResponse> getAllHighlights(
            @RequestParam(required = false) HighlightType type,
            @RequestParam(required = false) Long playerId,
            @RequestParam(defaultValue = "newest") String sortBy,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            Authentication authentication) {

        Integer userId = getUserId(authentication);
        PagedHighlightResponse response = highlightService.findAll(type, playerId, sortBy, page, limit, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HighlightResponseDto> getHighlight(
            @PathVariable Long id,
            Authentication authentication) {

        Integer userId = getUserId(authentication);
        HighlightResponseDto response = highlightService.findOne(id, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<HighlightResponseDto> createHighlight(
            @Valid @RequestBody CreateHighlightDto dto) {

        HighlightResponseDto response = highlightService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/addhighlight")
    public ResponseEntity<?> addHighlight(
            @Valid @RequestBody CreateHighlightDto dto,
            Authentication authentication) {

        try {
            Integer userId = getUserIdRequired(authentication);
            Users user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalStateException("User nije pronađen"));

            // ✅ Samo admin može dodati highlight
            if (!user.getRole().equalsIgnoreCase("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Samo admin može dodati highlight"));
            }

            HighlightResponseDto response = highlightService.create(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<HighlightResponseDto> updateHighlight(
            @PathVariable Long id,
            @Valid @RequestBody UpdateHighlightDto dto) {

        HighlightResponseDto response = highlightService.update(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteHighlight(@PathVariable Long id) {
        highlightService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Highlight uspešno obrisan"));
    }
    @PostMapping("/{id}/like")
    public ResponseEntity<LikeResponseDto> toggleLike(
            @PathVariable Long id,
            Authentication authentication) {

        Integer userId = getUserIdRequired(authentication);
        LikeResponseDto response = highlightService.toggleLike(id, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/player/{playerId}")
    public ResponseEntity<List<HighlightResponseDto>> getPlayerHighlights(
            @PathVariable Long playerId) {

        List<HighlightResponseDto> response = highlightService.getPlayerHighlights(playerId);
        return ResponseEntity.ok(response);
    }

    // ✅ ISPRAVLJEN - bez Optional
    private Integer getUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        try {
            String username = authentication.getName();
            Users user = userRepository.findByUsername(username); // Direktno vraća Users ili null
            return user != null ? user.getId() : null;
        } catch (Exception e) {
            return null;
        }
    }

    // ✅ ISPRAVLJEN - bez Optional
    private Integer getUserIdRequired(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("Morate biti ulogovani");
        }

        String username = authentication.getName();
        Users user = userRepository.findByUsername(username); // Direktno vraća Users ili null

        if (user == null) {
            throw new IllegalStateException("User nije pronađen");
        }

        return user.getId();
    }
}