package com.pl.premier_zone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PagedHighlightResponse {
    private List<HighlightResponseDto> data;
    private long total;
    private int page;
    private int limit;
    private int totalPages;
}