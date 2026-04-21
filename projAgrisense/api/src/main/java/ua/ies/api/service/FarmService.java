package ua.ies.api.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ua.ies.api.dto.CreateFarmRequest;
import ua.ies.api.entity.Farm;
import ua.ies.api.repository.FarmRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FarmService {

    private final FarmRepository farmRepository;

    public Farm createFarm(CreateFarmRequest request) {
        Farm farm = new Farm();
        farm.setName(request.name());
        farm.setLocation(request.location());
        farm.setZipcode(request.zipcode());
        farm.setFarmerId(request.farmerId());
        return farmRepository.save(farm);
    }

    public List<Farm> getFarmsByFarmer(String farmerId) {
        return farmRepository.findByFarmerId(farmerId);
    }

    public Farm updateFarm(Long id, CreateFarmRequest request) {
        Farm farm = farmRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Farm not found"));
        farm.setName(request.name());
        farm.setLocation(request.location());
        farm.setZipcode(request.zipcode());
        return farmRepository.save(farm);
    }
}
