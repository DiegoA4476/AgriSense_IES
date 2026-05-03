package ua.ies.api.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ua.ies.api.dto.AnimalDTO;
import ua.ies.api.dto.BarnDTO;
import ua.ies.api.service.AnimalService;
import ua.ies.api.service.BarnService;

import java.util.List;

@RestController
@RequestMapping("/api/barns")
@RequiredArgsConstructor
@PreAuthorize("hasRole('farmer')")
@Tag(name = "Barns", description = "CRUD operations for barns")
public class BarnController {

    private final BarnService barnService;
    private final AnimalService animalService;

    @Operation(summary = "Get all barns")
    @GetMapping
    public ResponseEntity<List<BarnDTO>> getAll() {
        return ResponseEntity.ok(barnService.findAll());
    }

    @Operation(summary = "Get barn by ID")
    @GetMapping("/{id}")
    public ResponseEntity<BarnDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(barnService.findById(id));
    }

    @Operation(summary = "Create a barn")
    @PostMapping
    public ResponseEntity<BarnDTO> create(@RequestBody BarnDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(barnService.create(dto));
    }

    @Operation(summary = "Update a barn")
    @PutMapping("/{id}")
    public ResponseEntity<BarnDTO> update(@PathVariable Long id, @RequestBody BarnDTO dto) {
        return ResponseEntity.ok(barnService.update(id, dto));
    }

    @Operation(summary = "Delete a barn")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        barnService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get animals in a barn")
    @GetMapping("/{id}/animals")
    public ResponseEntity<List<AnimalDTO>> getAnimals(@PathVariable Long id) {
        return ResponseEntity.ok(animalService.getAnimalsByBarn(id));
    }
}
