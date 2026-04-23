package ua.ies.api.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record AnimalMetricDTO(
        Instant time,
        String animalId,
        Integer heartRate,
        BigDecimal temperature,
        BigDecimal stress,
        Integer movement
) {}
