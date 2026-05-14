package ua.ies.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.ies.api.entity.AnimalWeight;

import java.time.Instant;
import java.util.List;

public interface AnimalWeightRepository extends JpaRepository<AnimalWeight, AnimalWeight.PK> {

    @Query(value = """
        SELECT time_bucket('60 seconds', time) AS bucket,
               AVG(weight)                     AS avg_weight
        FROM animal_weight
        WHERE animal_id = :animalId
          AND time >= :from
          AND time <  :to
        GROUP BY bucket
        ORDER BY bucket
        """, nativeQuery = true)
    List<Object[]> findWeeklyWeight(
            @Param("animalId") String animalId,
            @Param("from") Instant from,
            @Param("to") Instant to);
}
