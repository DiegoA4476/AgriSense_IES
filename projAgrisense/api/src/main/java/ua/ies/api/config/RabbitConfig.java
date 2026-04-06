package ua.ies.api.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    @Bean
    public Queue animalMetricsQueue() {
        return new Queue("animal.metrics", true);
    }

    @Bean
    public Queue animalWeightQueue() {
        return new Queue("animal.weight", true);
    }
}
