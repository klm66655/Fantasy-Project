package com.pl.premier_zone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LikeResponseDto {
    private boolean liked;
    private int likesCount;
}