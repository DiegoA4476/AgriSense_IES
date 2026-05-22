package ua.ies.api.dto;

import java.util.List;

public record NotifyVetDTO(
        String animalName,
        String temperature,
        String heartRate,
        String stress,
        String notes,
        List<ChartPoint> movementData,
        List<ChartPoint> weightData) {

    public record ChartPoint(String bucket, double value) {}
}
