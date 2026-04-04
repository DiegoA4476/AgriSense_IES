package ua.ies.api.service;

import org.springframework.stereotype.Service;
import ua.ies.api.dto.AnimalMetricDTO;
import ua.ies.api.dto.DailyMovementDTO;
import ua.ies.api.dto.WeeklyWeightDTO;
import ua.ies.api.entity.AnimalMetric;
import ua.ies.api.repository.AnimalMetricRepository;
import ua.ies.api.repository.AnimalWeightRepository;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

@Service
public class AnimalService {

    private final AnimalMetricRepository metricRepo;
    private final AnimalWeightRepository weightRepo;

    public AnimalService(AnimalMetricRepository metricRepo, AnimalWeightRepository weightRepo) {
        this.metricRepo = metricRepo;
        this.weightRepo = weightRepo;
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
}
