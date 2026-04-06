package ua.ies.api.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import ua.ies.api.entity.AnimalMetric;
import ua.ies.api.entity.AnimalWeight;
import ua.ies.api.repository.AnimalMetricRepository;
import ua.ies.api.repository.AnimalWeightRepository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;

@Component
public class AnimalMetricConsumer {

    private final AnimalMetricRepository metricRepo;
    private final AnimalWeightRepository weightRepo;
    private final ObjectMapper mapper = new ObjectMapper();

    public AnimalMetricConsumer(AnimalMetricRepository metricRepo, AnimalWeightRepository weightRepo) {
        this.metricRepo = metricRepo;
        this.weightRepo = weightRepo;
    }

    @RabbitListener(queues = "animal.metrics")
    public void onMetric(String body) throws Exception {
        Map<?, ?> m = mapper.readValue(body, Map.class);
        AnimalMetric entity = new AnimalMetric();
        entity.setTime(Instant.ofEpochMilli((long) (((Number) m.get("timestamp")).doubleValue() * 1000)));
        entity.setAnimalId((String) m.get("animalId"));
        entity.setHeartRate(((Number) m.get("heartRate")).intValue());
        entity.setTemperature(BigDecimal.valueOf(((Number) m.get("temperature")).doubleValue()));
        entity.setStress(BigDecimal.valueOf(((Number) m.get("stressLevel")).doubleValue()));
        entity.setMovement(((Number) m.get("movement")).intValue());
        metricRepo.save(entity);
    }

    @RabbitListener(queues = "animal.weight")
    public void onWeight(String body) throws Exception {
        Map<?, ?> m = mapper.readValue(body, Map.class);
        AnimalWeight entity = new AnimalWeight();
        entity.setTime(Instant.ofEpochMilli((long) (((Number) m.get("timestamp")).doubleValue() * 1000)));
        entity.setAnimalId((String) m.get("animalId"));
        entity.setWeight(BigDecimal.valueOf(((Number) m.get("weight")).doubleValue()));
        weightRepo.save(entity);
    }
}
