package com.pl.premier_zone.services;

import com.pl.premier_zone.repo.UserRepo;
import com.pl.premier_zone.user.Role;
import com.pl.premier_zone.user.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class JuzerService {

    @Autowired
    private UserRepo userRepository;

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<Users> getUserById(int id) {
        return userRepository.findById(id);
    }

    public Users createUser(Users user) {
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public Users updateUser(int id, Users updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setUsername(updatedUser.getUsername());
                    user.setEmail(updatedUser.getEmail());
                    user.setPassword(updatedUser.getPassword());
                    user.setRole(updatedUser.getRole());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public void deleteUser(int id) {
        userRepository.deleteById(id);
    }

    public Users updateUserRole(int id, Role newRole) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setRole(newRole.name());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


}
