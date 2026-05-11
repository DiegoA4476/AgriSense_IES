package ua.ies.api.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import ua.ies.api.dto.*;
import ua.ies.api.entity.Animal;
import ua.ies.api.entity.Barn;
import ua.ies.api.repository.AnimalMetricRepository;
import ua.ies.api.repository.AnimalRepository;
import ua.ies.api.repository.AnimalWeightRepository;
import ua.ies.api.repository.BarnRepository;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AnimalService {

    private final AnimalMetricRepository metricRepo;
    private final AnimalWeightRepository weightRepo;
    private final AnimalRepository animalRepository;
    private final BarnRepository barnRepository;

    public List<AnimalDTO> getAnimalsByBarn(Long barnId) {
        return animalRepository.findByBarnId(barnId).stream().map(this::toDTO).toList();
    }

    public AnimalDTO createAnimal(AnimalDTO dto) {
        Barn barn = barnRepository.findById(dto.barnId())
                .orElseThrow(() -> new NoSuchElementException("Barn not found: " + dto.barnId()));
        Animal animal = Animal.builder()
                .name(dto.name()).type(dto.type().toLowerCase())
                .weight(dto.weight()).height(dto.height()).barn(barn).build();
        return toDTO(animalRepository.save(animal));
    }

    public Optional<HeartRateDTO> getLatestHeartRate(String id) {
        return metricRepo.findLatestHeartRate(id)
                .map(m -> new HeartRateDTO(m.getTime(), m.getAnimalId(), m.getHeartRate()));
    }

    public Optional<TemperatureDTO> getLatestTemperature(String id) {
        return metricRepo.findLatestTemperature(id)
                .map(m -> new TemperatureDTO(m.getTime(), m.getAnimalId(), m.getTemperature()));
    }

    public Optional<StressDTO> getLatestStress(String id) {
        return metricRepo.findLatestStress(id)
                .map(m -> new StressDTO(m.getTime(), m.getAnimalId(), m.getStress()));
    }

    public Optional<MovementDTO> getLatestMovement(String id) {
        return metricRepo.findLatestMovement(id)
                .map(m -> new MovementDTO(m.getTime(), m.getAnimalId(), m.getMovement()));
    }

    public List<DailyMovementDTO> getDailyMovement(String animalId, LocalDate from, LocalDate to) {
        Instant fromI = from.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant toI   = to.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
        return metricRepo.findDailyMovement(animalId, fromI, toI).stream()
                .map(row -> new DailyMovementDTO(row[0].toString(), new BigDecimal(row[1].toString())))
                .toList();
    }

    public List<WeeklyWeightDTO> getWeeklyWeight(String animalId, LocalDate from, LocalDate to) {
        Instant fromI = from.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant toI   = to.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
        return weightRepo.findWeeklyWeight(animalId, fromI, toI).stream()
                .map(row -> new WeeklyWeightDTO(row[0].toString(), new BigDecimal(row[1].toString())))
                .toList();
    }

    public void delete(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Animal not found: " + id));
        animalRepository.delete(animal);
    }

    private AnimalDTO toDTO(Animal a) {
        return new AnimalDTO(a.getId(), a.getName(), a.getType(), a.getWeight(), a.getHeight(), a.getBarn().getId());
    }
}
