package ua.ies.api.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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
@Tag(name = "Barn Management", description = "Endpoints for creating, reading, updating, and deleting farm barns")
public class BarnController {

    private final BarnService barnService;

    @Operation(
        summary = "Get all barns",
        description = "Retrieves a complete list of all barns currently registered in the farm system."
    )
    @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of barns")
    @GetMapping
    public List<BarnDTO> getAll() {
        return barnService.findAll();
    }

    @Operation(
        summary = "Get barn by ID",
        description = "Fetches detailed information about a specific barn using its unique database identifier."
    )
    @ApiResponse(responseCode = "200", description = "Successfully retrieved the barn details")
    @ApiResponse(responseCode = "404", description = "Barn not found in the system")
    @GetMapping("/{id}")
    public BarnDTO getById(@PathVariable Long id) {
        return barnService.findById(id);
    }

    @Operation(
        summary = "Create a new barn",
        description = "Registers a new barn in the system. The ID in the request body should be left empty as it will be auto-generated."
    )
    @ApiResponse(responseCode = "200", description = "Barn successfully created")
    @ApiResponse(responseCode = "400", description = "Invalid input data provided in the request body")
    @PostMapping
    public BarnDTO create(@RequestBody BarnDTO dto) {
        return barnService.create(dto);
    }

    @Operation(
        summary = "Delete a barn",
        description = "Permanently removes a barn from the system using its unique identifier."
    )
    @ApiResponse(responseCode = "204", description = "Barn successfully deleted (No Content)")
    @ApiResponse(responseCode = "404", description = "Barn not found in the system")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        barnService.delete(id);
        return ResponseEntity.noContent().build();
    }
}