package ua.ies.api.dto;

import java.time.Instant;

public record HeartRateDTO(Instant time, String animalId, Integer heartRate) {}
