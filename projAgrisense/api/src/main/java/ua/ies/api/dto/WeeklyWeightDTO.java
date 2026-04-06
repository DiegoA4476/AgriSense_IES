package ua.ies.api.dto;

import java.math.BigDecimal;

public record WeeklyWeightDTO(String bucket, BigDecimal avgWeight) {}
