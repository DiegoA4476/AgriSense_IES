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

    private Instant toInstant(Map<?, ?> m) {
        return Instant.ofEpochMilli((long) (((Number) m.get("timestamp")).doubleValue() * 1000));
    }

    @RabbitListener(queues = "animal.heart_rate")
    public void onHeartRate(String body) throws Exception {
        Map<?, ?> m = mapper.readValue(body, Map.class);
        AnimalMetric e = new AnimalMetric();
        e.setTime(toInstant(m));
        e.setAnimalId((String) m.get("animalId"));
        e.setHeartRate(((Number) m.get("heartRate")).intValue());
        metricRepo.save(e);
    }

    @RabbitListener(queues = "animal.temperature")
    public void onTemperature(String body) throws Exception {
        Map<?, ?> m = mapper.readValue(body, Map.class);
        AnimalMetric e = new AnimalMetric();
        e.setTime(toInstant(m));
        e.setAnimalId((String) m.get("animalId"));
        e.setTemperature(BigDecimal.valueOf(((Number) m.get("temperature")).doubleValue()));
        metricRepo.save(e);
    }

    @RabbitListener(queues = "animal.stress")
    public void onStress(String body) throws Exception {
        Map<?, ?> m = mapper.readValue(body, Map.class);
        AnimalMetric e = new AnimalMetric();
        e.setTime(toInstant(m));
        e.setAnimalId((String) m.get("animalId"));
        e.setStress(BigDecimal.valueOf(((Number) m.get("stressLevel")).doubleValue()));
        metricRepo.save(e);
    }

    @RabbitListener(queues = "animal.movement")
    public void onMovement(String body) throws Exception {
        Map<?, ?> m = mapper.readValue(body, Map.class);
        AnimalMetric e = new AnimalMetric();
        e.setTime(toInstant(m));
        e.setAnimalId((String) m.get("animalId"));
        e.setMovement(((Number) m.get("movement")).intValue());
        metricRepo.save(e);
    }

    @RabbitListener(queues = "animal.weight")
    public void onWeight(String body) throws Exception {
        Map<?, ?> m = mapper.readValue(body, Map.class);
        AnimalWeight e = new AnimalWeight();
        e.setTime(toInstant(m));
        e.setAnimalId((String) m.get("animalId"));
        e.setWeight(BigDecimal.valueOf(((Number) m.get("weight")).doubleValue()));
        weightRepo.save(e);
    }
}
