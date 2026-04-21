package ua.ies.api.controller;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ua.ies.api.dto.CreateFarmerRequest;
import ua.ies.api.dto.CreateFarmerResponse;
import ua.ies.api.dto.FarmerResponse;
import ua.ies.api.dto.UpdateFarmerRequest;
import ua.ies.api.service.FarmService;
import ua.ies.api.service.KeycloakService;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final KeycloakService keycloakService;
    private final FarmService farmService;

    @PostMapping("/farmers")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<CreateFarmerResponse> createFarmer(@RequestBody CreateFarmerRequest request) {
        CreateFarmerResponse response = keycloakService.createFarmer(request);
        return ResponseEntity.ok(response);
    }

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

    @DeleteMapping("/farmers/{id}")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<Void> deleteFarmer(@PathVariable String id) {
        keycloakService.deleteFarmer(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/farmers/{id}")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<Void> updateFarmer(@PathVariable String id, @RequestBody UpdateFarmerRequest request) {
        keycloakService.updateFarmer(id, request);
        return ResponseEntity.ok().build();
    }
}
