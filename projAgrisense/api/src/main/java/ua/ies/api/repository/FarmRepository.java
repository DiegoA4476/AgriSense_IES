package ua.ies.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.ies.api.entity.Farm;
import java.util.List;

public interface FarmRepository extends JpaRepository<Farm, Long> {
    List<Farm> findByFarmerId(String farmerId);
}
