package ua.ies.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.ies.api.entity.AnimalMetric;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface AnimalMetricRepository extends JpaRepository<AnimalMetric, AnimalMetric.PK> {

    @Query("SELECT m FROM AnimalMetric m WHERE m.animalId = :id AND m.heartRate IS NOT NULL ORDER BY m.time DESC LIMIT 1")
    Optional<AnimalMetric> findLatestHeartRate(@Param("id") String animalId);

    @Query("SELECT m FROM AnimalMetric m WHERE m.animalId = :id AND m.temperature IS NOT NULL ORDER BY m.time DESC LIMIT 1")
    Optional<AnimalMetric> findLatestTemperature(@Param("id") String animalId);

    @Query("SELECT m FROM AnimalMetric m WHERE m.animalId = :id AND m.stress IS NOT NULL ORDER BY m.time DESC LIMIT 1")
    Optional<AnimalMetric> findLatestStress(@Param("id") String animalId);

    @Query("SELECT m FROM AnimalMetric m WHERE m.animalId = :id AND m.movement IS NOT NULL ORDER BY m.time DESC LIMIT 1")
    Optional<AnimalMetric> findLatestMovement(@Param("id") String animalId);

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
