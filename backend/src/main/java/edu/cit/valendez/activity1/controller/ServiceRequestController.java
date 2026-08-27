package edu.cit.valendez.activity1.controller;

import edu.cit.valendez.activity1.dto.ServiceRequestDto;
import edu.cit.valendez.activity1.dto.ServiceRequestResponse;
import edu.cit.valendez.activity1.service.ServiceRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;

    public ServiceRequestController(ServiceRequestService serviceRequestService) {
        this.serviceRequestService = serviceRequestService;
    }

    // POST /api/requests
    @PostMapping
    public ResponseEntity<ServiceRequestResponse> createRequest(
            @Valid @RequestBody ServiceRequestDto dto,
            Principal principal) {
        ServiceRequestResponse response = serviceRequestService.createRequest(dto, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/requests
    @GetMapping
    public ResponseEntity<List<ServiceRequestResponse>> getMyRequests(Principal principal) {
        List<ServiceRequestResponse> requests = serviceRequestService.getUserRequests(principal.getName());
        return ResponseEntity.ok(requests);
    }

    // GET /api/requests/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ServiceRequestResponse> getRequestById(
            @PathVariable Long id,
            Principal principal) {
        ServiceRequestResponse response = serviceRequestService.getRequestById(id, principal.getName());
        return ResponseEntity.ok(response);
    }

    // PUT /api/requests/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ServiceRequestResponse> updateRequest(
            @PathVariable Long id,
            @Valid @RequestBody ServiceRequestDto dto,
            Principal principal) {
        ServiceRequestResponse response = serviceRequestService.updateRequest(id, dto, principal.getName());
        return ResponseEntity.ok(response);
    }

    // DELETE /api/requests/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(
            @PathVariable Long id,
            Principal principal) {
        serviceRequestService.deleteRequest(id, principal.getName());
        return ResponseEntity.ok(Map.of("message", "Service request deleted successfully"));
    }
}

