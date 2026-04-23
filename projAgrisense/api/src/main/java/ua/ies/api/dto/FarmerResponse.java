package ua.ies.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import ua.ies.api.entity.Farm;

import java.util.List;

@Data
public class FarmerResponse {
    
    private String id;

    @JsonProperty("first_name")
    private String firstName;

    @JsonProperty("last_name")
    private String lastName;

    private String email;
    
    private List<Farm> farms;
}