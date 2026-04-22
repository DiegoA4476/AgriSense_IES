package ua.ies.api.controller;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import ua.ies.api.dto.CreateFarmerRequest;
import ua.ies.api.dto.CreateFarmerResponse;
import ua.ies.api.dto.FarmerResponse;
import ua.ies.api.dto.UpdateFarmerRequest;
import ua.ies.api.service.FarmService;
import ua.ies.api.service.KeycloakService;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
@Tag(name = "Manager Operations", description = "Administrative endpoints restricted to managers, including farmer account management")
public class ManagerController {

    private final KeycloakService keycloakService;
    private final FarmService farmService;

    @Operation(
        summary = "Create a new farmer",
        description = "Registers a new farmer account in the Keycloak identity provider. This action is restricted to users with the 'manager' role."
    )
    @ApiResponse(responseCode = "200", description = "Farmer account successfully created")
    @ApiResponse(responseCode = "400", description = "Invalid input data provided in the request body")
    @ApiResponse(responseCode = "403", description = "Access denied (Manager role required)")
    @PostMapping("/farmers")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<CreateFarmerResponse> createFarmer(@RequestBody CreateFarmerRequest request) {
        CreateFarmerResponse response = keycloakService.createFarmer(request);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Get list of all farmers",
        description = "Retrieves a comprehensive list of all registered farmers from Keycloak, enriched with their assigned farms from the local database."
    )
    @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of farmers")
    @ApiResponse(responseCode = "403", description = "Access denied (Manager role required)")
    @GetMapping("/farmers")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<List<FarmerResponse>> getFarmersList() {
        List<UserRepresentation> keycloakFarmers = keycloakService.getAllFarmers();

        List<FarmerResponse> response = keycloakFarmers.stream().map(kcUser -> {
            FarmerResponse farmer = new FarmerResponse();
            farmer.setId(kcUser.getId());
            farmer.setFirstName(kcUser.getFirstName());
            farmer.setLastName(kcUser.getLastName());
            farmer.setEmail(kcUser.getEmail());

            farmer.setFarms(farmService.getFarmsByFarmer(kcUser.getId()));

            return farmer;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Delete a farmer",
        description = "Permanently removes a farmer account from Keycloak using their unique ID."
    )
    @ApiResponse(responseCode = "204", description = "Farmer successfully deleted (No Content)")
    @ApiResponse(responseCode = "403", description = "Access denied (Manager role required)")
    @ApiResponse(responseCode = "404", description = "Farmer account not found in Keycloak")
    @DeleteMapping("/farmers/{id}")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<Void> deleteFarmer(@PathVariable String id) {
        keycloakService.deleteFarmer(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(
        summary = "Update an existing farmer",
        description = "Updates the personal details of an existing farmer account in Keycloak."
    )
    @ApiResponse(responseCode = "200", description = "Farmer successfully updated")
    @ApiResponse(responseCode = "400", description = "Invalid input data provided")
    @ApiResponse(responseCode = "403", description = "Access denied (Manager role required)")
    @ApiResponse(responseCode = "404", description = "Farmer account not found in Keycloak")
    @PutMapping("/farmers/{id}")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<Void> updateFarmer(@PathVariable String id, @RequestBody UpdateFarmerRequest request) {
        keycloakService.updateFarmer(id, request);
        return ResponseEntity.ok().build();
    }
}