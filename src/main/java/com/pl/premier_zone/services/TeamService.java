package com.pl.premier_zone.services;

import com.pl.premier_zone.team.Team;
import com.pl.premier_zone.repo.TeamRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeamService {

    @Autowired
    private TeamRepo repo;

    // ✅ 1. Vraća sve timove iz baze
    public List<Team> getAllTeams() {
        return repo.findAll();
    }

    // ✅ 2. Vraća jedan tim po ID-u
    public Optional<Team> getTeamById(Integer id) {
        return repo.findById(id);
    }

    // ✅ 3. Dodaje novi tim
    public Team addTeam(Team team) {
        return repo.save(team);
    }

    // ✅ 4. Ažurira postojeći tim
    public Team updateTeam(Integer id, Team updatedTeam) {
        Optional<Team> existingTeamOpt = repo.findById(id);

        if (existingTeamOpt.isPresent()) {
            Team existingTeam = existingTeamOpt.get();

            existingTeam.setName(updatedTeam.getName());
            existingTeam.setStadium(updatedTeam.getStadium());
            existingTeam.setManager(updatedTeam.getManager());
            existingTeam.setFounded(updatedTeam.getFounded());
            existingTeam.setLogoUrl(updatedTeam.getLogoUrl());

            return repo.save(existingTeam);
        } else {
            return null; // ili možeš baciti custom exception
        }
    }

    // ✅ 5. Briše tim po ID-u
    public boolean deleteTeam(Integer id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }

    // ✅ 6. Traži tim po imenu (nije obavezno, ali korisno)
    public Team getTeamByName(String name) {
        return repo.findByName(name);
    }
}
