package com.pl.premier_zone.dto;

import com.pl.premier_zone.highlight.HighlightType;
import jakarta.validation.constraints.*;
import lombok.Data;
import jakarta.validation.constraints.NotNull;


@Data
public class CreateHighlightDto {

    @NotNull(message = "Player ID je obavezan")
    private Long playerId;

    @NotBlank(message = "Video URL je obavezan")
    @Size(max = 500, message = "Video URL ne može biti duži od 500 karaktera")
    @Pattern(regexp = "^https?://.*", message = "URL mora počinjati sa http:// ili https://")
    private String videoUrl;

    @Size(max = 500, message = "Thumbnail URL ne može biti duži od 500 karaktera")
    private String thumbnailUrl;

    @NotNull(message = "Tip highlighta je obavezan")
    private HighlightType type;

    @NotBlank(message = "Naslov je obavezan")
    @Size(max = 200, message = "Naslov ne može biti duži od 200 karaktera")
    private String title;

    @Size(max = 5000, message = "Opis ne može biti duži od 5000 karaktera")
    private String description;
}