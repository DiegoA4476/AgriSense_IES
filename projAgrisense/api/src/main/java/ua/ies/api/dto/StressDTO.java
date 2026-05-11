package ua.ies.api.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record StressDTO(Instant time, String animalId, BigDecimal stress) {}
