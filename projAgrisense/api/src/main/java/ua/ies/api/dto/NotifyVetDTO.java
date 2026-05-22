package ua.ies.api.dto;

public record NotifyVetDTO(
        String animalName,
        String temperature,
        String heartRate,
        String stress,
        String notes) {}
