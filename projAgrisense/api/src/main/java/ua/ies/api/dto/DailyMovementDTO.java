package ua.ies.api.dto;

import java.math.BigDecimal;

public record DailyMovementDTO(String bucket, BigDecimal total) {}
