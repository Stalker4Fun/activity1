package edu.cit.valendez.activity1.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import edu.cit.valendez.activity1.ServiceRequest;

import java.time.LocalDateTime;

public class ServiceRequestResponse {

    private Long id;
    private String title;
    private String description;
    private String category;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dateCreated;

    private String createdBy;

    public ServiceRequestResponse() {
    }

    public ServiceRequestResponse(Long id, String title, String description, String category, LocalDateTime dateCreated, String createdBy) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.dateCreated = dateCreated;
        this.createdBy = createdBy;
    }

    public static ServiceRequestResponse fromEntity(ServiceRequest entity) {
        return new ServiceRequestResponse(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getCategory(),
                entity.getDateCreated(),
                entity.getCreatedBy()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(LocalDateTime dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}

