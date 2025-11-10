package com.pl.premier_zone.services;

import com.pl.premier_zone.user.Users;
import com.pl.premier_zone.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private UserRepo repo;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    // Registracija korisnika
    public Users register(Users user) {
        user.setPassword(encoder.encode(user.getPassword()));

        if (user.getRole() == null || user.getRole().isEmpty() || user.getRole().equals("[default]")) {
            user.setRole("USER");
        }

        repo.save(user);
        return user;
    }

    // Login / verifikacija korisnika
    public String verify(Users user) {
        // Pronađi korisnika iz baze
        Users dbUser = repo.findByUsername(user.getUsername());

        if (dbUser == null) {
            throw new UsernameNotFoundException("User not found");
        }

        // Provera lozinke
        if (!encoder.matches(user.getPassword(), dbUser.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        // Dobijanje role i generisanje JWT tokena
        List<String> roles = List.of(dbUser.getRole());
        return jwtService.generateToken(dbUser.getUsername(), roles);
    }

}
