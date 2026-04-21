package ua.ies.api.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

public record UpdateFarmerRequest(
    @JsonAlias({"firstName", "first_name"}) String firstName,
    @JsonAlias({"lastName", "last_name"}) String lastName
) {}