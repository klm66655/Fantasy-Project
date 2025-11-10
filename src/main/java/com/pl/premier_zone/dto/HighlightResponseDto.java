package com.pl.premier_zone.dto;

import com.pl.premier_zone.highlight.HighlightType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HighlightResponseDto {
    private Long id;
    private Long playerId;
    private String playerName;
    private String teamName;
    private String videoUrl;
    private String thumbnailUrl;
    private HighlightType type;
    private String title;
    private String description;
    private Integer viewsCount;
    private Integer likesCount;
    private Boolean isLikedByUser;
    private LocalDateTime createdAt;
}