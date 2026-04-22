package ua.ies.api.controller;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ua.ies.api.dto.AnimalMetricDTO;
import ua.ies.api.dto.DailyMovementDTO;
import ua.ies.api.dto.WeeklyWeightDTO;
import ua.ies.api.service.AnimalService;
import ua.ies.api.dto.AnimalDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/animals")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('farmer')")
@Tag(name = "Animals", description = "CRUD operations for animals")
public class AnimalController {

    private final AnimalService animalService;

    public AnimalController(AnimalService animalService) {
        this.animalService = animalService;
    }

    @Operation(summary = "Get latest metrics")
    @GetMapping("/{id}/metrics/latest")
    public Optional<AnimalMetricDTO> latestMetric(@PathVariable String id) {
        return animalService.getLatestMetric(id);
    }

    @Operation(summary = "Get animal movement")
    @GetMapping("/{id}/movement")
    public List<DailyMovementDTO> movement(
            @PathVariable String id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return animalService.getDailyMovement(id, from, to);
    }

    @Operation(summary = "Get animal weight")
    @GetMapping("/{id}/weight")
    public List<WeeklyWeightDTO> weight(
            @PathVariable String id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return animalService.getWeeklyWeight(id, from, to);
    }

    @Operation(summary = "Get barn")
    @GetMapping("/barn/{barnId}")
    public List<AnimalDTO> getByBarn(@PathVariable Long barnId) {
        return animalService.getAnimalsByBarn(barnId);
    }

    @Operation(summary = "Delete animal")
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
