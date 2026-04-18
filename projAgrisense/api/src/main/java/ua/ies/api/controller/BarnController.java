package ua.ies.api.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ua.ies.api.dto.BarnDTO;
import ua.ies.api.service.BarnService;

import java.util.List;

@RestController
@RequestMapping("/api/barns")
@RequiredArgsConstructor
@PreAuthorize("hasRole('farmer')")
@Tag(name = "Barns", description = "CRUD operations for barns")
public class BarnController {

    private final BarnService barnService;

    @Operation(summary = "Get all barns")
    @GetMapping
    public List<BarnDTO> getAll() {
        return barnService.findAll();
    }

    @Operation(summary = "Get barn by ID")
    @GetMapping("/{id}")
    public BarnDTO getById(@PathVariable Long id) {
        return barnService.findById(id);
    }

    @Operation(summary = "Create a barn")
    @PostMapping
    public BarnDTO create(@RequestBody BarnDTO dto) {
        return barnService.create(dto);
    }

    @Operation(summary = "Delete a barn")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        barnService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
