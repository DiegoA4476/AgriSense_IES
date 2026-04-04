package ua.ies.api.controller;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import ua.ies.api.entity.AnimalMetric;
import ua.ies.api.service.AnimalService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/animals")
@CrossOrigin(origins = "*")
public class AnimalController {

    private final AnimalService animalService;

    public AnimalController(AnimalService animalService) {
        this.animalService = animalService;
    }

    @GetMapping("/{id}/metrics/latest")
    public Optional<AnimalMetric> latestMetric(@PathVariable String id) {
        return animalService.getLatestMetric(id);
    }

    @GetMapping("/{id}/movement")
    public List<Map<String, Object>> movement(
            @PathVariable String id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return animalService.getDailyMovement(id, from, to);
    }

    @GetMapping("/{id}/weight")
    public List<Map<String, Object>> weight(
            @PathVariable String id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return animalService.getWeeklyWeight(id, from, to);
    }
}
