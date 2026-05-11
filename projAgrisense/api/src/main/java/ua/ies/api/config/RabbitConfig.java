package ua.ies.api.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    @Bean public Queue heartRateQueue()   { return new Queue("animal.heart_rate", true); }
    @Bean public Queue temperatureQueue() { return new Queue("animal.temperature", true); }
    @Bean public Queue stressQueue()      { return new Queue("animal.stress", true); }
    @Bean public Queue movementQueue()    { return new Queue("animal.movement", true); }
    @Bean public Queue weightQueue()      { return new Queue("animal.weight", true); }
}
