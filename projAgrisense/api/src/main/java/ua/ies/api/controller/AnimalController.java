package ua.ies.api.controller;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import ua.ies.api.dto.AnimalMetricDTO;
import ua.ies.api.dto.DailyMovementDTO;
import ua.ies.api.dto.WeeklyWeightDTO;
import ua.ies.api.service.AnimalService;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/animals")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('farmer')")
@Tag(name = "Animal Management", description = "Endpoints for managing the farm's animal database")
public class AnimalController {

    private final AnimalService animalService;

    public AnimalController(AnimalService animalService) {
        this.animalService = animalService;
    }

    @Operation(
        summary = "Get the latest metrics",
        description = "Retrieves the most recent health or status metric recorded for a specific animal."
    )
    @ApiResponse(responseCode = "200", description = "Successfully retrieved the latest metric")
    @ApiResponse(responseCode = "404", description = "Animal or metric not found")
    @GetMapping("/{id}/metrics/latest")
    public Optional<AnimalMetricDTO> latestMetric(@PathVariable String id) {
        return animalService.getLatestMetric(id);
    }

    @Operation(
        summary = "Get daily movement history",
        description = "Fetches the daily movement tracking data (e.g., steps, distance) for a specific animal within a given date range."
    )
    @ApiResponse(responseCode = "200", description = "Successfully retrieved the movement data")
    @GetMapping("/{id}/movement")
    public List<DailyMovementDTO> movement(
            @PathVariable String id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return animalService.getDailyMovement(id, from, to);
    }

    @Operation(
        summary = "Get weekly weight history",
        description = "Fetches the weekly weight records for a specific animal within a given date range."
    )
    @ApiResponse(responseCode = "200", description = "Successfully retrieved the weight data")
    @GetMapping("/{id}/weight")
    public List<WeeklyWeightDTO> weight(
            @PathVariable String id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return animalService.getWeeklyWeight(id, from, to);
    }
}