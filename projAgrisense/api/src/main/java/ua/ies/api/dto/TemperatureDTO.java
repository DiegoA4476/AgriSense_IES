package ua.ies.api.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record TemperatureDTO(Instant time, String animalId, BigDecimal temperature) {}
