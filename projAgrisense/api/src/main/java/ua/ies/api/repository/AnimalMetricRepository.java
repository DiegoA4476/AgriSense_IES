package ua.ies.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.ies.api.entity.AnimalMetric;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface AnimalMetricRepository extends JpaRepository<AnimalMetric, AnimalMetric.PK> {

    Optional<AnimalMetric> findTopByAnimalIdOrderByTimeDesc(String animalId);

    @Query(value = """
        SELECT time_bucket('1 day', time) AS bucket,
               SUM(movement)             AS total
        FROM animal_metric
        WHERE animal_id = :animalId
          AND time >= :from
          AND time <  :to
        GROUP BY bucket
        ORDER BY bucket
        """, nativeQuery = true)
    List<Object[]> findDailyMovement(
            @Param("animalId") String animalId,
            @Param("from") Instant from,
            @Param("to") Instant to);
}
