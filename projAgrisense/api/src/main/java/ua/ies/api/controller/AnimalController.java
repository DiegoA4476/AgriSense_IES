package ua.ies.api.controller;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import ua.ies.api.dto.*;
import ua.ies.api.service.AnimalService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/animals")
@RequiredArgsConstructor
@PreAuthorize("hasRole('farmer')")
@Tag(name = "Animals")
public class AnimalController {

    private final AnimalService animalService;

    @GetMapping("/{id}/metrics/heart-rate")
    public ResponseEntity<HeartRateDTO> latestHeartRate(@PathVariable String id) {
        return animalService.getLatestHeartRate(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/metrics/temperature")
    public ResponseEntity<TemperatureDTO> latestTemperature(@PathVariable String id) {
        return animalService.getLatestTemperature(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/metrics/stress")
    public ResponseEntity<StressDTO> latestStress(@PathVariable String id) {
        return animalService.getLatestStress(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/metrics/movement")
    public ResponseEntity<MovementDTO> latestMovement(@PathVariable String id) {
        return animalService.getLatestMovement(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/metrics/movement/history")
    public ResponseEntity<List<DailyMovementDTO>> movementHistory(
            @PathVariable String id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(animalService.getDailyMovement(id, from, to));
    }

    @GetMapping("/{id}/metrics/weight/history")
    public ResponseEntity<List<WeeklyWeightDTO>> weightHistory(
            @PathVariable String id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(animalService.getWeeklyWeight(id, from, to));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        animalService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<AnimalDTO> create(@RequestBody AnimalDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(animalService.createAnimal(dto));
    }
}
