package ua.ies.api.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import ua.ies.api.dto.*;
import ua.ies.api.entity.Animal;
import ua.ies.api.entity.AnimalMetric;
import ua.ies.api.entity.AnimalWeight;
import ua.ies.api.entity.Barn;
import ua.ies.api.repository.AnimalMetricRepository;
import ua.ies.api.repository.AnimalRepository;
import ua.ies.api.repository.AnimalWeightRepository;
import ua.ies.api.repository.BarnRepository;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AnimalService {

    private final AnimalMetricRepository metricRepo;
    private final AnimalWeightRepository weightRepo;
    private final AnimalRepository animalRepository;
    private final BarnRepository barnRepository;

    public List<AnimalDTO> getAllAnimals() {
        return animalRepository.findAll().stream().map(this::toDTO).toList();
    }

    public List<AnimalDTO> getAnimalsByBarn(Long barnId) {
        return animalRepository.findByBarnId(barnId).stream().map(this::toDTO).toList();
    }

    public AnimalDTO createAnimal(AnimalDTO dto) {
        Barn barn = barnRepository.findById(dto.barnId())
                .orElseThrow(() -> new NoSuchElementException("Barn not found: " + dto.barnId()));
        Animal animal = Animal.builder()
                .name(dto.name()).type(dto.type().toLowerCase())
                .weight(dto.weight()).height(dto.height()).barn(barn).build();
        Animal saved = animalRepository.save(animal);
        seedHistoricalData(saved);
        return toDTO(saved);
    }

    private void seedHistoricalData(Animal animal) {
        String simulatorId = animal.getType().toLowerCase() + "-" + animal.getId();
        double baseWeight = animal.getWeight() != null ? animal.getWeight() : 100.0;
        Random rng = new Random();

        // seed last 10 minutes with one movement point every 3 seconds = 200 points
        Instant start = Instant.now().minus(10, ChronoUnit.MINUTES);
        int totalPoints = 10 * 60 / 3; // 200 points

        List<AnimalMetric> metrics = new ArrayList<>(totalPoints);
        for (int i = 0; i < totalPoints; i++) {
            Instant t = start.plus(i * 3L, ChronoUnit.SECONDS);
            AnimalMetric m = new AnimalMetric();
            m.setTime(t);
            m.setAnimalId(simulatorId);
            m.setMovement(rng.nextInt(21));
            metrics.add(m);
        }

        // seed last 10 minutes with one weight point per minute = 10 points
        List<AnimalWeight> weights = new ArrayList<>(10);
        for (int i = 0; i < 10; i++) {
            Instant t = start.plus(i, ChronoUnit.MINUTES);
            AnimalWeight w = new AnimalWeight();
            w.setTime(t);
            w.setAnimalId(simulatorId);
            w.setWeight(BigDecimal
                    .valueOf(Math.max(0.1, Math.round((baseWeight + rng.nextDouble() * 4 - 2) * 10.0) / 10.0)));
            weights.add(w);
        }

        metricRepo.saveAll(metrics);
        weightRepo.saveAll(weights);
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

    public List<DailyMovementDTO> getDailyMovement(String animalId, Instant from, Instant to) {
        return metricRepo.findDailyMovement(animalId, from, to).stream()
                .map(row -> new DailyMovementDTO(row[0].toString(), new BigDecimal(row[1].toString())))
                .toList();
    }

    public List<WeeklyWeightDTO> getWeeklyWeight(String animalId, Instant from, Instant to) {
        return weightRepo.findWeeklyWeight(animalId, from, to).stream()
                .map(row -> new WeeklyWeightDTO(row[0].toString(), new BigDecimal(row[1].toString())))
                .toList();
    }

    public void delete(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Animal not found: " + id));
        animalRepository.delete(animal);
    }

    private AnimalDTO toDTO(Animal a) {
        String simulatorId = a.getType().toLowerCase() + "-" + a.getId();
        return new AnimalDTO(a.getId(), a.getName(), a.getType(), a.getWeight(), a.getHeight(), a.getBarn().getId(),
                simulatorId);
    }
}
