package ua.ies.api.service;

import lombok.RequiredArgsConstructor;
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

    private final FarmRepository farmRepository;

    public FarmDTO createFarm(CreateFarmRequest request) {
        Farm farm = new Farm();
        farm.setName(request.name());
        farm.setLocation(request.location());
        farm.setZipcode(request.zipcode());
        farm.setFarmerId(request.farmerId());
        return toDTO(farmRepository.save(farm));
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
        return toDTO(farmRepository.save(farm));
    }

    private FarmDTO toDTO(Farm farm) {
        return new FarmDTO(farm.getId(), farm.getName(), farm.getLocation(), farm.getZipcode(), farm.getFarmerId());
    }
}
