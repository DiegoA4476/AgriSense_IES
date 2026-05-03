package ua.ies.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record FarmerResponse(
        String id,
        @JsonProperty("first_name") String firstName,
        @JsonProperty("last_name") String lastName,
        String email,
        List<FarmDTO> farms
) {}
