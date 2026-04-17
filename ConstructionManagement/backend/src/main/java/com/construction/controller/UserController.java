package com.construction.controller;

import com.construction.entity.User;
import com.construction.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;

    private User currentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<List<User>> getAll() {
        User user = currentUser();
        if (user.getRole() == User.Role.ADMIN) return ResponseEntity.ok(userRepository.findAll());
        return ResponseEntity.ok(List.of(user));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMe() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userRepository.findByUsername(username).orElseThrow());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userRepository.findById(id).orElseThrow());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        User user = userRepository.findById(id).orElseThrow();
        if (body.containsKey("fullName")) user.setFullName(body.get("fullName"));
        if (body.containsKey("email"))    user.setEmail(body.get("email"));
        if (body.containsKey("phone"))    user.setPhone(body.get("phone"));
        return ResponseEntity.ok(userRepository.save(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
