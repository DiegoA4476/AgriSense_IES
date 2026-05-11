package ua.ies.api.dto;

import java.time.Instant;

public record MovementDTO(Instant time, String animalId, Integer movement) {}
