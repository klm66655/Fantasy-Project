package com.pl.premier_zone.dto;

import com.pl.premier_zone.highlight.HighlightType;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateHighlightDto {

    @Size(max = 500)
    @Pattern(regexp = "^https?://.*", message = "URL mora počinjati sa http:// ili https://")
    private String videoUrl;

    @Size(max = 500)
    private String thumbnailUrl;

    private HighlightType type;

    @Size(max = 200)
    private String title;

    @Size(max = 5000)
    private String description;
}