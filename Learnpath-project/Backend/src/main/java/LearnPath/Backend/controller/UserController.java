package LearnPath.Backend.controller;

import LearnPath.Backend.domain.User;
import LearnPath.Backend.exception.ResourceNotFoundException;
import LearnPath.Backend.payload.ApiResponse;
import LearnPath.Backend.payload.UserProfileRequest;
import LearnPath.Backend.payload.UserResponse;
import LearnPath.Backend.payload.RecommendationRequest;
import LearnPath.Backend.repository.UserRepository;
import LearnPath.Backend.security.CurrentUser;
import LearnPath.Backend.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Value("${app.ml.url:http://127.0.0.1:5000}")
    private String mlServiceUrl;

    // ─── GET /api/user/me ──────────────────────────────────────────────────────
    @GetMapping("/user/me")
    @PreAuthorize("hasRole('USER')")
    public UserResponse getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
        boolean profileCompleted = user.getBranch() != null && user.getGoal() != null;
        return new UserResponse(
                user.getId(), user.getName(), user.getEmail(),
                user.getPicture(), user.getProvider(),
                user.getYear(), user.getBranch(), user.getGoal(),
                profileCompleted
        );
    }

    // ─── POST /api/user/profile ────────────────────────────────────────────────
    @PostMapping("/user/profile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> saveUserProfile(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestBody UserProfileRequest request) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
        if (request.getYear() != null) {
            user.setYear(request.getYear());
        }
        if (request.getBranch() != null) {
            user.setBranch(request.getBranch());
        }
        if (request.getGoal() != null) {
            user.setGoal(request.getGoal());
        }
        userRepository.save(user);
        return ResponseEntity.ok(new ApiResponse(true, "Profile saved successfully."));
    }

    // ─── GET /api/recommend ────────────────────────────────────────────────────
    @GetMapping("/recommend")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getRecommendation(@CurrentUser UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        if (user.getBranch() == null || user.getGoal() == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Profile not complete. Please set branch and goal first."));
        }

        RecommendationRequest reqBody = new RecommendationRequest();
        reqBody.setBranch(user.getBranch());
        reqBody.setGoal(user.getGoal());
        reqBody.setTarget_exam("");

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<RecommendationRequest> entity = new HttpEntity<>(reqBody, headers);

        try {
            ResponseEntity<Object> mlResponse = restTemplate.postForEntity(
                    mlServiceUrl + "/recommend", entity, Object.class);
            return ResponseEntity.ok(mlResponse.getBody());
        } catch (ResourceAccessException ex) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(new ApiResponse(false,
                            "Recommendation service is currently unavailable. Please try again later."));
        }
    }

    // ─── POST /api/recommend/custom ────────────────────────────────────────────
    @PostMapping("/recommend/custom")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getCustomRecommendation(@RequestBody RecommendationRequest request) {
        if (request.getBranch() == null || request.getGoal() == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Branch and goal are required."));
        }
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<RecommendationRequest> entity = new HttpEntity<>(request, headers);
        try {
            ResponseEntity<Object> mlResponse = restTemplate.postForEntity(
                    mlServiceUrl + "/recommend", entity, Object.class);
            return ResponseEntity.ok(mlResponse.getBody());
        } catch (ResourceAccessException ex) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(new ApiResponse(false, "Recommendation service is currently unavailable."));
        }
    }
}
