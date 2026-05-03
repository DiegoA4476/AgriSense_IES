package ua.ies.api.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "barns")
public class Barn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "farm_id")
    private Long farmId;

    @OneToMany(mappedBy = "barn", cascade = CascadeType.ALL)
    private List<Animal> animals;
}
