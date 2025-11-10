package com.pl.premier_zone.controllers;

import com.pl.premier_zone.services.JuzerService;
import com.pl.premier_zone.user.Users;
import com.pl.premier_zone.user.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private JuzerService userService;

    // ✅ Prikaz svih korisnika
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Users> getAllUsers() {
        return userService.getAllUsers();
    }

    // ✅ Prikaz jednog korisnika po ID-u
    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Users> getUserById(@PathVariable int id) {
        Optional<Users> user = userService.getUserById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    // ✅ Brisanje korisnika
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    // ✅ Promena role korisnika
    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateRole(@PathVariable int id, @RequestParam Role role) {
        userService.updateUserRole(id, role);
        return ResponseEntity.ok("Role updated successfully");
    }
}
