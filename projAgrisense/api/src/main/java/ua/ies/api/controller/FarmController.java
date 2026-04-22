package ua.ies.api.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import ua.ies.api.dto.CreateFarmRequest;
import ua.ies.api.entity.Farm;
import ua.ies.api.service.FarmService;

import java.util.List;

@RestController
@RequestMapping("/api/farms")
@RequiredArgsConstructor
@Tag(name = "Farm Management", description = "Endpoints for creating, reading, and updating farm locations and details")
public class FarmController {

    private final FarmService farmService;

    @Operation(
        summary = "Create a new farm",
        description = "Registers a new farm in the system. This action is restricted to users with the 'manager' role."
    )
    @ApiResponse(responseCode = "200", description = "Farm successfully created")
    @ApiResponse(responseCode = "400", description = "Invalid input data provided in the request body")
    @ApiResponse(responseCode = "403", description = "Access denied (Manager role required)")
    @PostMapping
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<Farm> createFarm(@RequestBody CreateFarmRequest request) {
        Farm farm = farmService.createFarm(request);
        return ResponseEntity.ok(farm);
    }

    @Operation(
        summary = "Get farms by farmer ID",
        description = "Retrieves a complete list of all farms associated with a specific farmer. Accessible by both managers and farmers."
    )
    @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of farms")
    @GetMapping("/farmer/{farmerId}")
    @PreAuthorize("hasAnyRole('manager', 'farmer')")
    public ResponseEntity<List<Farm>> getFarmsByFarmer(@PathVariable String farmerId) {
        List<Farm> farms = farmService.getFarmsByFarmer(farmerId);
        return ResponseEntity.ok(farms);
    }

    @Operation(
        summary = "Update an existing farm",
        description = "Updates the details of an existing farm using its unique database identifier. Restricted to users with the 'manager' role."
    )
    @ApiResponse(responseCode = "200", description = "Farm successfully updated")
    @ApiResponse(responseCode = "404", description = "Farm not found in the system")
    @ApiResponse(responseCode = "403", description = "Access denied (Manager role required)")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<Farm> updateFarm(@PathVariable Long id, @RequestBody CreateFarmRequest request) {
        Farm farm = farmService.updateFarm(id, request);
        return ResponseEntity.ok(farm);
    }
}