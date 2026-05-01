package ua.ies.api.controller;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ua.ies.api.dto.CreateFarmerRequest;
import ua.ies.api.dto.CreateFarmerResponse;
import ua.ies.api.dto.FarmDTO;
import ua.ies.api.dto.FarmerResponse;
import ua.ies.api.dto.UpdateFarmerRequest;
import ua.ies.api.service.FarmService;
import ua.ies.api.service.KeycloakService;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
@Tag(name = "Manager", description = "CRUD operations for manager")
public class ManagerController {

    private final KeycloakService keycloakService;
    private final FarmService farmService;

    @PostMapping("/farmers")
    @PreAuthorize("hasRole('manager')")
    @Operation(summary = "Create farmer")
    public ResponseEntity<CreateFarmerResponse> createFarmer(@RequestBody CreateFarmerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(keycloakService.createFarmer(request));
    }

    @GetMapping("/farmers")
    @PreAuthorize("hasRole('manager')")
    @Operation(summary = "Get farmers list")
    public ResponseEntity<List<FarmerResponse>> getFarmersList() {
        List<UserRepresentation> keycloakFarmers = keycloakService.getAllFarmers();

        List<FarmerResponse> response = keycloakFarmers.stream()
                .map(u -> new FarmerResponse(u.getId(), u.getFirstName(), u.getLastName(), u.getEmail(),
                        farmService.getFarmsByFarmer(u.getId())))
                .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/farmers/{farmerId}/farms")
    @PreAuthorize("hasAnyRole('manager', 'farmer')")
    @Operation(summary = "Get farmer's farms")
    public ResponseEntity<List<FarmDTO>> getFarmsByFarmer(@PathVariable String farmerId) {
        return ResponseEntity.ok(farmService.getFarmsByFarmer(farmerId));
    }

    @DeleteMapping("/farmers/{id}")
    @PreAuthorize("hasRole('manager')")
    @Operation(summary = "Delete a farmer")
    public ResponseEntity<Void> deleteFarmer(@PathVariable String id) {
        keycloakService.deleteFarmer(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/farmers/{id}")
    @PreAuthorize("hasRole('manager')")
    @Operation(summary = "Update a farmer")
    public ResponseEntity<Void> updateFarmer(@PathVariable String id, @RequestBody UpdateFarmerRequest request) {
        keycloakService.updateFarmer(id, request);
        return ResponseEntity.noContent().build();
    }
}
