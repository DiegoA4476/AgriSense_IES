package ua.ies.api.dto;

public record AnimalDTO(
        Long id,
        String name,
        String type,
        Double weight,
        Double height,
        Long barnId,
        String simulatorId) {
}