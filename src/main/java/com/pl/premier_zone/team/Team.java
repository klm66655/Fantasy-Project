package com.pl.premier_zone.team;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.pl.premier_zone.player.Player;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "teams")
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;

    private String stadium;
    private String manager;
    private String founded;
    private String logoUrl;

    // 👇 povezano s Player klasom
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Player> players;

    // ✅ Prazan konstruktor (neophodan za JPA)
    public Team() {}

    // ✅ Konstruktor sa svim poljima
    public Team(Integer id, String name, String stadium, String manager, String founded, String logoUrl) {
        this.id = id;
        this.name = name;
        this.stadium = stadium;
        this.manager = manager;
        this.founded = founded;
        this.logoUrl = logoUrl;
    }

    // ✅ Getteri i setteri
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStadium() {
        return stadium;
    }

    public void setStadium(String stadium) {
        this.stadium = stadium;
    }

    public String getManager() {
        return manager;
    }

    public void setManager(String manager) {
        this.manager = manager;
    }

    public String getFounded() {
        return founded;
    }

    public void setFounded(String founded) {
        this.founded = founded;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public void setPlayers(List<Player> players) {
        this.players = players;
    }
}
