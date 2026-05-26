package ua.ies.api.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ua.ies.api.dto.BarnDTO;
import ua.ies.api.entity.Barn;
import ua.ies.api.repository.BarnRepository;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class BarnService {

        private static final Logger log = LoggerFactory.getLogger(BarnService.class);

        private final BarnRepository barnRepository;

        public List<BarnDTO> findAll() {
                return barnRepository.findAll().stream().map(this::toDTO).toList();
        }

        public List<BarnDTO> findByFarmId(Long farmId) {
                return barnRepository.findByFarmId(farmId).stream().map(this::toDTO).toList();
        }

        public BarnDTO findById(Long id) {
                return barnRepository.findById(id).map(this::toDTO)
                                .orElseThrow(() -> new NoSuchElementException("Barn not found: " + id));
        }

        public BarnDTO create(BarnDTO dto) {
                Barn barn = new Barn();
                barn.setName(dto.name());
                barn.setFarmId(dto.farmId());
                BarnDTO saved = toDTO(barnRepository.save(barn));
                log.info("Barn created: id={}, name={}, farmId={}", saved.id(), saved.name(), saved.farmId());
                return saved;
        }

        public BarnDTO update(Long id, BarnDTO dto) {
                Barn barn = barnRepository.findById(id)
                                .orElseThrow(() -> new NoSuchElementException("Barn not found: " + id));
                barn.setName(dto.name());
                barn.setFarmId(dto.farmId());
                BarnDTO saved = toDTO(barnRepository.save(barn));
                log.info("Barn updated: id={}, name={}", id, saved.name());
                return saved;
        }

        public void delete(Long id) {
                barnRepository.deleteById(id);
                log.info("Barn deleted: id={}", id);
        }

        private BarnDTO toDTO(Barn barn) {
                return new BarnDTO(barn.getId(), barn.getName(), barn.getFarmId());
        }
}
