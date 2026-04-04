package ua.ies.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.ies.api.entity.Barn;

public interface BarnRepository extends JpaRepository<Barn, Long> {
}
