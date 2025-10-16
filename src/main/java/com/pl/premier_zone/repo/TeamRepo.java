package com.pl.premier_zone.repo;

import com.pl.premier_zone.team.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamRepo extends JpaRepository<Team, Integer> {

    // ✅ Dodatni upit po imenu (nije obavezan, ali koristan)
    Team findByName(String name);
}
