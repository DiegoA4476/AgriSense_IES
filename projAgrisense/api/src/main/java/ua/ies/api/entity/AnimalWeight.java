package ua.ies.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "animal_weight")
@IdClass(AnimalWeight.PK.class)
@Data
@NoArgsConstructor
public class AnimalWeight {

    @Id
    private Instant time;

    @Id
    @Column(name = "animal_id")
    private String animalId;

    private BigDecimal weight;

    @Data
    @NoArgsConstructor
    public static class PK implements Serializable {
        private Instant time;
        private String animalId;
    }
}
