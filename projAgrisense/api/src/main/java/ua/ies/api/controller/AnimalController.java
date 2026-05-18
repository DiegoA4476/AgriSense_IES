package ua.ies.api.controller;

import java.time.Instant;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import ua.ies.api.dto.AnimalDTO;
import ua.ies.api.dto.AnimalNotesDTO;
import ua.ies.api.dto.DailyMovementDTO;
import ua.ies.api.dto.HeartRateDTO;
import ua.ies.api.dto.MovementDTO;
import ua.ies.api.dto.StressDTO;
import ua.ies.api.dto.TemperatureDTO;
import ua.ies.api.dto.WeeklyWeightDTO;
import ua.ies.api.service.AnimalService;

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
            @RequestParam Instant from,
            @RequestParam Instant to) {
        return ResponseEntity.ok(animalService.getDailyMovement(id, from, to));
    }

    @GetMapping("/{id}/metrics/weight/history")
    public ResponseEntity<List<WeeklyWeightDTO>> weightHistory(
            @PathVariable String id,
            @RequestParam Instant from,
            @RequestParam Instant to) {
        return ResponseEntity.ok(animalService.getWeeklyWeight(id, from, to));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        animalService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/notes")
    public ResponseEntity<AnimalNotesDTO> getNotes(@PathVariable String id) {
        return ResponseEntity.ok(animalService.getNotes(id));
    }

    @PutMapping("/{id}/notes")
    public ResponseEntity<AnimalNotesDTO> updateNotes(@PathVariable String id, @RequestBody AnimalNotesDTO dto) {
        return ResponseEntity.ok(animalService.updateNotes(id, dto));
    }

    @PostMapping
    public ResponseEntity<AnimalDTO> create(@RequestBody AnimalDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(animalService.createAnimal(dto));
    }
}
