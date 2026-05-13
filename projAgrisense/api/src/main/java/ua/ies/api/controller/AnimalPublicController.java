package ua.ies.api.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.ies.api.dto.AnimalDTO;
import ua.ies.api.service.AnimalService;

import java.util.List;

@RestController
@RequestMapping("/api/animals")
@RequiredArgsConstructor
public class AnimalPublicController {

    private final AnimalService animalService;

    @GetMapping("/all")
    public ResponseEntity<List<AnimalDTO>> getAll() {
        return ResponseEntity.ok(animalService.getAllAnimals());
    }
}
