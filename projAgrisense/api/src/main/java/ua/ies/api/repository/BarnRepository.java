package ua.ies.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.ies.api.entity.Barn;
import java.util.List;

public interface BarnRepository extends JpaRepository<Barn, Long> {
    List<Barn> findByFarmId(Long farmId);
}
