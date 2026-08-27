package edu.cit.valendez.activity1.service;

import edu.cit.valendez.activity1.ServiceRequest;
import edu.cit.valendez.activity1.ServiceRequestRepository;
import edu.cit.valendez.activity1.User;
import edu.cit.valendez.activity1.UserRepository;
import edu.cit.valendez.activity1.dto.ServiceRequestDto;
import edu.cit.valendez.activity1.dto.ServiceRequestResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceRequestService {

    private final ServiceRequestRepository serviceRequestRepository;
    private final UserRepository userRepository;

    public ServiceRequestService(ServiceRequestRepository serviceRequestRepository, UserRepository userRepository) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.userRepository = userRepository;
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    public ServiceRequestResponse createRequest(ServiceRequestDto dto, String username) {
        User user = getUserByUsername(username);

        ServiceRequest request = new ServiceRequest(
                dto.getTitle(),
                dto.getDescription(),
                dto.getCategory(),
                user
        );

        ServiceRequest saved = serviceRequestRepository.save(request);
        return ServiceRequestResponse.fromEntity(saved);
    }

    public List<ServiceRequestResponse> getUserRequests(String username) {
        User user = getUserByUsername(username);
        return serviceRequestRepository.findByUserOrderByDateCreatedDesc(user)
                .stream()
                .map(ServiceRequestResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public ServiceRequestResponse getRequestById(Long id, String username) {
        ServiceRequest request = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service request not found"));

        if (!request.getUser().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: You do not own this service request");
        }

        return ServiceRequestResponse.fromEntity(request);
    }

    public ServiceRequestResponse updateRequest(Long id, ServiceRequestDto dto, String username) {
        ServiceRequest request = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service request not found"));

        if (!request.getUser().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: You do not own this service request");
        }

        request.setTitle(dto.getTitle());
        request.setDescription(dto.getDescription());
        request.setCategory(dto.getCategory());

        ServiceRequest updated = serviceRequestRepository.save(request);
        return ServiceRequestResponse.fromEntity(updated);
    }

    public void deleteRequest(Long id, String username) {
        ServiceRequest request = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service request not found"));

        if (!request.getUser().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: You do not own this service request");
        }

        serviceRequestRepository.delete(request);
    }
}

