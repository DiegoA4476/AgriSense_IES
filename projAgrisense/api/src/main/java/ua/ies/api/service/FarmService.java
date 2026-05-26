package ua.ies.api.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ua.ies.api.dto.CreateFarmRequest;
import ua.ies.api.dto.FarmDTO;
import ua.ies.api.entity.Farm;
import ua.ies.api.repository.FarmRepository;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class FarmService {

    private static final Logger log = LoggerFactory.getLogger(FarmService.class);

    private final FarmRepository farmRepository;

    public FarmDTO createFarm(CreateFarmRequest request) {
        Farm farm = new Farm();
        farm.setName(request.name());
        farm.setLocation(request.location());
        farm.setZipcode(request.zipcode());
        farm.setFarmerId(request.farmerId());
        FarmDTO saved = toDTO(farmRepository.save(farm));
        log.info("Farm created: id={}, name={}, farmerId={}", saved.id(), saved.name(), saved.farmerId());
        return saved;
    }

    public List<FarmDTO> getFarmsByFarmer(String farmerId) {
        return farmRepository.findByFarmerId(farmerId).stream().map(this::toDTO).toList();
    }

    public FarmDTO updateFarm(Long id, CreateFarmRequest request) {
        Farm farm = farmRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Farm not found: " + id));
        farm.setName(request.name());
        farm.setLocation(request.location());
        farm.setZipcode(request.zipcode());
        FarmDTO saved = toDTO(farmRepository.save(farm));
        log.info("Farm updated: id={}, name={}", id, saved.name());
        return saved;
    }

    private FarmDTO toDTO(Farm farm) {
        return new FarmDTO(farm.getId(), farm.getName(), farm.getLocation(), farm.getZipcode(), farm.getFarmerId());
    }
}
