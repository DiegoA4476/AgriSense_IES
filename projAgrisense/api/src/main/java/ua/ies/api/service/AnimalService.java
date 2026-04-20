package ua.ies.api.service;

import org.springframework.stereotype.Service;

import ua.ies.api.dto.AnimalDTO;
import ua.ies.api.dto.AnimalMetricDTO;
import ua.ies.api.dto.DailyMovementDTO;
import ua.ies.api.dto.WeeklyWeightDTO;
import ua.ies.api.entity.Animal;
import ua.ies.api.entity.AnimalMetric;
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
public class AnimalService {

    private final AnimalMetricRepository metricRepo;
    private final AnimalWeightRepository weightRepo;
    private final AnimalRepository animalRepository;
    private final BarnRepository barnRepository;

    public AnimalService(AnimalMetricRepository metricRepo, AnimalWeightRepository weightRepo, AnimalRepository animalRepository, BarnRepository barnRepository) {
        this.metricRepo = metricRepo;
        this.weightRepo = weightRepo;
        this.animalRepository = animalRepository;
        this.barnRepository = barnRepository;
    }

    public List<AnimalDTO> getAnimalsByBarn(Long barnId) {
        return animalRepository.findByBarnId(barnId).stream()
                .map(this::ToDTO)
                .toList();
    }
    public AnimalDTO createAnimal(AnimalDTO dto) {
        Barn barn = barnRepository.findById(dto.barnId())
                .orElseThrow(() -> new NoSuchElementException("Barn not found with id: " + dto.barnId()));

        Animal animal = Animal.builder()
                .name(dto.name())
                .type(dto.type().toLowerCase())
                .weight(dto.weight())
                .height(dto.height())
                .barn(barn)
                .build();

        return ToDTO(animalRepository.save(animal));
    }
    public Optional<AnimalMetricDTO> getLatestMetric(String animalId) {
        return metricRepo.findTopByAnimalIdOrderByTimeDesc(animalId).map(this::toDTO);
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

    private AnimalMetricDTO toDTO(AnimalMetric m) {
        return new AnimalMetricDTO(m.getTime(), m.getAnimalId(), m.getHeartRate(),
                m.getTemperature(), m.getStress(), m.getMovement());
    }

    private AnimalDTO ToDTO(Animal animal) {
        return new AnimalDTO(
                animal.getId(),
                animal.getName(),
                animal.getType(),
                animal.getWeight(),
                animal.getHeight(),
                animal.getBarn().getId()
        );
    }
}
