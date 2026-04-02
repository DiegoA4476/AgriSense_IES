package ua.ies.api.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.ies.api.dto.BarnDTO;
import ua.ies.api.service.BarnService;

import java.util.List;

@RestController
@RequestMapping("/api/barns")
@RequiredArgsConstructor
public class BarnController {

    private final BarnService barnService;

    @GetMapping
    public List<BarnDTO> getAll() {
        return barnService.findAll();
    }

    @GetMapping("/{id}")
    public BarnDTO getById(@PathVariable Long id) {
        return barnService.findById(id);
    }

    @PostMapping
    public BarnDTO create(@RequestBody BarnDTO dto) {
        return barnService.create(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        barnService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
