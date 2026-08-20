package edu.cit.valendez.activity1;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // POST /api/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(savedUser);
    }

    // POST /api/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        return userRepository.findByUsername(user.getUsername())
                .filter(existingUser ->
                        existingUser.getPassword().equals(user.getPassword()))
                .map(existingUser ->
                        ResponseEntity.ok("Login successful"))
                .orElseGet(() ->
                        ResponseEntity.status(401).body("Invalid username or password"));
    }

    // GET /api/user/{i}
    @GetMapping("/user/{i}")
    public ResponseEntity<?> getUser(@PathVariable Long i) {

        return userRepository.findById(i)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build());
    }
}