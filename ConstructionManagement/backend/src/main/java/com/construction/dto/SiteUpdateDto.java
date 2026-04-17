package com.construction.dto;

import com.construction.entity.SiteUpdate;
import lombok.Data;
import java.util.List;

@Data
public class SiteUpdateDto {
    private String title;
    private String notes;
    private List<String> mediaUrls;
    private SiteUpdate.MediaType mediaType;
}
