package ua.ies.api.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "farms")
@Data
public class Farm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String zipcode;

    @Column(name = "farmer_id", nullable = false)
    private String farmerId;
}
