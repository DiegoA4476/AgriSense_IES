package ua.ies.api.service;

import org.springframework.stereotype.Service;
import ua.ies.api.entity.AnimalMetric;
import ua.ies.api.repository.AnimalMetricRepository;
import ua.ies.api.repository.AnimalWeightRepository;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AnimalService {

    private final AnimalMetricRepository metricRepo;
    private final AnimalWeightRepository weightRepo;

    public AnimalService(AnimalMetricRepository metricRepo, AnimalWeightRepository weightRepo) {
        this.metricRepo = metricRepo;
        this.weightRepo = weightRepo;
    }

    public Optional<AnimalMetric> getLatestMetric(String animalId) {
        return metricRepo.findTopByAnimalIdOrderByTimeDesc(animalId);
    }

    public List<Map<String, Object>> getDailyMovement(String animalId, LocalDate from, LocalDate to) {
        Instant fromI = from.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant toI   = to.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
        return metricRepo.findDailyMovement(animalId, fromI, toI).stream().map(row -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("bucket", row[0].toString());
            map.put("total", row[1]);
            return map;
        }).toList();
    }

    public List<Map<String, Object>> getWeeklyWeight(String animalId, LocalDate from, LocalDate to) {
        Instant fromI = from.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant toI   = to.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
        return weightRepo.findWeeklyWeight(animalId, fromI, toI).stream().map(row -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("bucket", row[0].toString());
            map.put("avg_weight", row[1]);
            return map;
        }).toList();
    }
}
