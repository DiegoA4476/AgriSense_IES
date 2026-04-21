package ua.ies.api.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

public record CreateFarmerRequest(
    @JsonAlias({"firstName", "first_name"}) String firstName, 
    @JsonAlias({"lastName", "last_name"}) String lastName, 
    @JsonAlias({"email"}) String email
) {}