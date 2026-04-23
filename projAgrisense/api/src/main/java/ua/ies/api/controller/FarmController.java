package ua.ies.api.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ua.ies.api.dto.CreateFarmRequest;
import ua.ies.api.entity.Farm;
import ua.ies.api.service.FarmService;

import java.util.List;

@RestController
@RequestMapping("/api/farms")
@RequiredArgsConstructor
@Tag(name = "Farms", description = "CRUD operations for farms")
public class FarmController {

    private final FarmService farmService;

    @PostMapping
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<Farm> createFarm(@RequestBody CreateFarmRequest request) {
        Farm farm = farmService.createFarm(request);
        return ResponseEntity.ok(farm);
    }

    @GetMapping("/farmer/{farmerId}")
    @PreAuthorize("hasAnyRole('manager', 'farmer')")
    @Operation(summary = "Get farmer's farms")
    public ResponseEntity<List<Farm>> getFarmsByFarmer(@PathVariable String farmerId) {
        List<Farm> farms = farmService.getFarmsByFarmer(farmerId);
        return ResponseEntity.ok(farms);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('manager')")
    @Operation(summary = "Update farm")
    public ResponseEntity<Farm> updateFarm(@PathVariable Long id, @RequestBody CreateFarmRequest request) {
        Farm farm = farmService.updateFarm(id, request);
        return ResponseEntity.ok(farm);
    }
}
