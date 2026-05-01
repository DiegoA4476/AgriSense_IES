package ua.ies.api.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ua.ies.api.dto.CreateFarmRequest;
import ua.ies.api.dto.FarmDTO;
import ua.ies.api.service.FarmService;

@RestController
@RequestMapping("/api/farms")
@RequiredArgsConstructor
@Tag(name = "Farms", description = "CRUD operations for farms")
public class FarmController {

    private final FarmService farmService;

    @PostMapping
    @PreAuthorize("hasRole('manager')")
    @Operation(summary = "Create farm")
    public ResponseEntity<FarmDTO> createFarm(@RequestBody CreateFarmRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(farmService.createFarm(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('manager')")
    @Operation(summary = "Update farm")
    public ResponseEntity<FarmDTO> updateFarm(@PathVariable Long id, @RequestBody CreateFarmRequest request) {
        return ResponseEntity.ok(farmService.updateFarm(id, request));
    }
}
