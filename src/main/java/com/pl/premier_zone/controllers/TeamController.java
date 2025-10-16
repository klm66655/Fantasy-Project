package com.pl.premier_zone.controllers;

import com.pl.premier_zone.services.TeamService;
import com.pl.premier_zone.team.Team;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/teams")
@CrossOrigin(origins = "*") // 👈 dozvoljava pristup sa frontenda
public class TeamController {

    @Autowired
    private TeamService service;

    // ✅ 1. Dohvati sve timove
    @GetMapping
    public List<Team> getAllTeams() {
        return service.getAllTeams();
    }

    // ✅ 2. Dohvati jedan tim po ID-u
    @GetMapping("/{id}")
    @Transactional
    public ResponseEntity<Team> getTeamById(@PathVariable Integer id) {
        Team team = service.getTeamById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        // 👇 Ako želiš da osiguraš da se učitaju svi igrači
        team.getPlayers().size();

        return ResponseEntity.ok(team);
    }


    // ✅ 3. Dodaj novi tim
    @PostMapping
    public Team addTeam(@RequestBody Team team) {
        return service.addTeam(team);
    }

    // ✅ 4. Ažuriraj postojeći tim
    @PutMapping("/{id}")
    public Team updateTeam(@PathVariable Integer id, @RequestBody Team updatedTeam) {
        return service.updateTeam(id, updatedTeam);
    }

    // ✅ 5. Obriši tim po ID-u
    @DeleteMapping("/{id}")
    public String deleteTeam(@PathVariable Integer id) {
        boolean deleted = service.deleteTeam(id);
        return deleted ? "Team deleted successfully" : "Team not found";
    }

    // ✅ 6. Pronađi tim po imenu
    @GetMapping("/name/{name}")
    public Team getTeamByName(@PathVariable String name) {
        return service.getTeamByName(name);
    }
}