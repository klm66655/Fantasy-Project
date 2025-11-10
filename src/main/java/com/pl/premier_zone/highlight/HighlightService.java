package com.pl.premier_zone.highlight;

import com.pl.premier_zone.dto.*;
import com.pl.premier_zone.exception.ResourceNotFoundException;
import com.pl.premier_zone.repo.HighlightLikeRepository;
import com.pl.premier_zone.repo.HighlightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HighlightService {

    private final HighlightRepository highlightRepository;
    private final HighlightLikeRepository highlightLikeRepository;

    @Transactional
    public HighlightResponseDto create(CreateHighlightDto dto) {
        Highlight highlight = new Highlight();
        highlight.setPlayerId(dto.getPlayerId());
        highlight.setVideoUrl(dto.getVideoUrl());
        highlight.setThumbnailUrl(dto.getThumbnailUrl());
        highlight.setType(dto.getType());
        highlight.setTitle(dto.getTitle());
        highlight.setDescription(dto.getDescription());
        highlight.setViewsCount(0);
        highlight.setLikesCount(0);

        Highlight saved = highlightRepository.save(highlight);
        return mapToDto(saved, false);
    }

    @Transactional(readOnly = true)
    public PagedHighlightResponse findAll(HighlightType type, Long playerId, String sortBy,
                                          int page, int limit, Integer userId) {
        Pageable pageable = createPageable(sortBy, page, limit);
        Page<Highlight> highlightPage;

        if (type != null && playerId != null) {
            highlightPage = highlightRepository.findByTypeAndPlayerId(type, playerId, pageable);
        } else if (type != null) {
            highlightPage = highlightRepository.findByType(type, pageable);
        } else if (playerId != null) {
            highlightPage = highlightRepository.findByPlayerId(playerId, pageable);
        } else {
            highlightPage = highlightRepository.findAll(pageable);
        }

        List<Highlight> highlights = highlightPage.getContent();
        List<Long> likedIds = getLikedHighlightIds(userId, highlights);

        List<HighlightResponseDto> dtos = highlights.stream()
                .map(h -> mapToDto(h, likedIds.contains(h.getId())))
                .collect(Collectors.toList());

        return new PagedHighlightResponse(
                dtos,
                highlightPage.getTotalElements(),
                page,
                limit,
                highlightPage.getTotalPages()
        );
    }

    @Transactional
    public HighlightResponseDto findOne(Long id, Integer userId) {
        Highlight highlight = highlightRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Highlight sa ID " + id + " nije pronađen"));

        // Increment views
        highlight.setViewsCount(highlight.getViewsCount() + 1);
        highlightRepository.save(highlight);

        // ✅ Konvertuj Integer u Long
        boolean isLiked = userId != null &&
                highlightLikeRepository.existsByHighlightIdAndUserId(id, userId.longValue());

        return mapToDto(highlight, isLiked);
    }

    @Transactional
    public HighlightResponseDto update(Long id, UpdateHighlightDto dto) {
        Highlight highlight = highlightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Highlight sa ID " + id + " nije pronađen"));

        if (dto.getVideoUrl() != null) highlight.setVideoUrl(dto.getVideoUrl());
        if (dto.getThumbnailUrl() != null) highlight.setThumbnailUrl(dto.getThumbnailUrl());
        if (dto.getType() != null) highlight.setType(dto.getType());
        if (dto.getTitle() != null) highlight.setTitle(dto.getTitle());
        if (dto.getDescription() != null) highlight.setDescription(dto.getDescription());

        Highlight updated = highlightRepository.save(highlight);
        return mapToDto(updated, false);
    }

    @Transactional
    public void delete(Long id) {
        if (!highlightRepository.existsById(id)) {
            throw new ResourceNotFoundException("Highlight sa ID " + id + " nije pronađen");
        }
        highlightRepository.deleteById(id);
    }

    @Transactional
    public LikeResponseDto toggleLike(Long highlightId, Integer userId) {
        Highlight highlight = highlightRepository.findById(highlightId)
                .orElseThrow(() -> new ResourceNotFoundException("Highlight sa ID " + highlightId + " nije pronađen"));

        // ✅ Konvertuj Integer u Long
        var existingLike = highlightLikeRepository.findByHighlightIdAndUserId(highlightId, userId.longValue());

        if (existingLike.isPresent()) {
            // Unlike
            highlightLikeRepository.delete(existingLike.get());
            highlight.setLikesCount(highlight.getLikesCount() - 1);
            highlightRepository.save(highlight);
            return new LikeResponseDto(false, highlight.getLikesCount());
        } else {
            // Like
            HighlightLike newLike = new HighlightLike();
            newLike.setHighlightId(highlightId);
            newLike.setUserId(userId.longValue()); // ✅ Konvertuj
            highlightLikeRepository.save(newLike);

            highlight.setLikesCount(highlight.getLikesCount() + 1);
            highlightRepository.save(highlight);
            return new LikeResponseDto(true, highlight.getLikesCount());
        }
    }

    @Transactional(readOnly = true)
    public List<HighlightResponseDto> getPlayerHighlights(Long playerId) {
        List<Highlight> highlights = highlightRepository.findTop10ByPlayerIdOrderByCreatedAtDesc(playerId);
        return highlights.stream()
                .map(h -> mapToDto(h, false))
                .collect(Collectors.toList());
    }

    // Helper methods
    private Pageable createPageable(String sortBy, int page, int limit) {
        Sort sort = switch (sortBy != null ? sortBy : "newest") {
            case "popular" -> Sort.by(Sort.Direction.DESC, "likesCount");
            case "views" -> Sort.by(Sort.Direction.DESC, "viewsCount");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
        return PageRequest.of(page - 1, limit, sort);
    }

    private List<Long> getLikedHighlightIds(Integer userId, List<Highlight> highlights) {
        if (userId == null || highlights.isEmpty()) {
            return List.of();
        }
        List<Long> highlightIds = highlights.stream()
                .map(Highlight::getId)
                .collect(Collectors.toList());

        // ✅ Konvertuj Integer u Long
        return highlightLikeRepository.findLikedHighlightIdsByUserAndHighlights(
                userId.longValue(),
                highlightIds
        );
    }

    private HighlightResponseDto mapToDto(Highlight highlight, boolean isLiked) {
        HighlightResponseDto dto = new HighlightResponseDto();
        dto.setId(highlight.getId());
        dto.setPlayerId(highlight.getPlayerId());
        dto.setVideoUrl(highlight.getVideoUrl());
        dto.setThumbnailUrl(highlight.getThumbnailUrl());
        dto.setType(highlight.getType());
        dto.setTitle(highlight.getTitle());
        dto.setDescription(highlight.getDescription());
        dto.setViewsCount(highlight.getViewsCount());
        dto.setLikesCount(highlight.getLikesCount());
        dto.setIsLikedByUser(isLiked);
        dto.setCreatedAt(highlight.getCreatedAt());

        if (highlight.getPlayer() != null) {
            dto.setPlayerName(highlight.getPlayer().getPlayer());

            if (highlight.getPlayer().getTeam() != null) {
                dto.setTeamName(highlight.getPlayer().getTeam().getName());
            }
        }

        return dto;
    }
}