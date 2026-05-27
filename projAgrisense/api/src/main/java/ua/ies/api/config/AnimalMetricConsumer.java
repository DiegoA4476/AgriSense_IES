package ua.ies.api.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(AnimalMetricConsumer.class);

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
        try {
            Map<?, ?> m = mapper.readValue(body, Map.class);
            if (m.get("heartRate") == null) {
                log.error("Missing heartRate value in message from simulator: animalId={}", m.get("animalId"));
                return;
            }
            AnimalMetric e = new AnimalMetric();
            e.setTime(toInstant(m));
            e.setAnimalId((String) m.get("animalId"));
            e.setHeartRate(((Number) m.get("heartRate")).intValue());
            metricRepo.save(e);
            log.debug("Saved heart_rate metric for animal={}", e.getAnimalId());
        } catch (Exception ex) {
            log.error("Failed to process heart_rate message: body={}, error={}", body, ex.getMessage(), ex);
        }
    }

    @RabbitListener(queues = "animal.temperature")
    public void onTemperature(String body) throws Exception {
        try {
            Map<?, ?> m = mapper.readValue(body, Map.class);
            if (m.get("temperature") == null) {
                log.error("Missing temperature value in message from simulator: animalId={}", m.get("animalId"));
                return;
            }
            AnimalMetric e = new AnimalMetric();
            e.setTime(toInstant(m));
            e.setAnimalId((String) m.get("animalId"));
            e.setTemperature(BigDecimal.valueOf(((Number) m.get("temperature")).doubleValue()));
            metricRepo.save(e);
            log.debug("Saved temperature metric for animal={}", e.getAnimalId());
        } catch (Exception ex) {
            log.error("Failed to process temperature message: body={}, error={}", body, ex.getMessage(), ex);
        }
    }

    @RabbitListener(queues = "animal.stress")
    public void onStress(String body) throws Exception {
        try {
            Map<?, ?> m = mapper.readValue(body, Map.class);
            if (m.get("stressLevel") == null) {
                log.error("Missing stressLevel value in message from simulator: animalId={}", m.get("animalId"));
                return;
            }
            AnimalMetric e = new AnimalMetric();
            e.setTime(toInstant(m));
            e.setAnimalId((String) m.get("animalId"));
            e.setStress(BigDecimal.valueOf(((Number) m.get("stressLevel")).doubleValue()));
            metricRepo.save(e);
            log.debug("Saved stress metric for animal={}", e.getAnimalId());
        } catch (Exception ex) {
            log.error("Failed to process stress message: body={}, error={}", body, ex.getMessage(), ex);
        }
    }

    @RabbitListener(queues = "animal.movement")
    public void onMovement(String body) throws Exception {
        try {
            Map<?, ?> m = mapper.readValue(body, Map.class);
            if (m.get("movement") == null) {
                log.error("Missing movement value in message from simulator: animalId={}", m.get("animalId"));
                return;
            }
            AnimalMetric e = new AnimalMetric();
            e.setTime(toInstant(m));
            e.setAnimalId((String) m.get("animalId"));
            e.setMovement(((Number) m.get("movement")).intValue());
            metricRepo.save(e);
            log.debug("Saved movement metric for animal={}", e.getAnimalId());
        } catch (Exception ex) {
            log.error("Failed to process movement message: body={}, error={}", body, ex.getMessage(), ex);
        }
    }

    @RabbitListener(queues = "animal.weight")
    public void onWeight(String body) throws Exception {
        try {
            Map<?, ?> m = mapper.readValue(body, Map.class);
            if (m.get("weight") == null) {
                log.error("Missing weight value in message from simulator: animalId={}", m.get("animalId"));
                return;
            }
            AnimalWeight e = new AnimalWeight();
            e.setTime(toInstant(m));
            e.setAnimalId((String) m.get("animalId"));
            e.setWeight(BigDecimal.valueOf(((Number) m.get("weight")).doubleValue()));
            weightRepo.save(e);
            log.debug("Saved weight metric for animal={}", e.getAnimalId());
        } catch (Exception ex) {
            log.error("Failed to process weight message: body={}, error={}", body, ex.getMessage(), ex);
        }
    }
}
