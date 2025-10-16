package com.pl.premier_zone.player;

import com.pl.premier_zone.team.Team;
import com.pl.premier_zone.repo.TeamRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;



import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final TeamRepo teamRepo;

    @Autowired
    public PlayerService(PlayerRepository playerRepository, TeamRepo teamRepo){
        this.playerRepository = playerRepository;
        this.teamRepo = teamRepo;
    }


    public List<Player> getPlayers(){
        return playerRepository.findAll();
    }

    public List<Player> getPlayersFromTeam(String teamName){
        if (teamName == null || teamName.isEmpty()) {
            return List.of();
        }

        String normalized = teamName.toLowerCase().replace("-", " ");
        System.out.println("Looking for team: " + normalized);

        List<Player> allPlayers = playerRepository.findAll();
        allPlayers.forEach(p -> {
            String team = p.getTeam() != null ? p.getTeam().getName() : "null";
            System.out.println(p.getPlayer() + " -> " + team);
        });

        return allPlayers.stream()
                .filter(player -> player.getTeam() != null && player.getTeam().getName() != null)
                .filter(player -> player.getTeam().getName().toLowerCase().replace("-", " ").equals(normalized))
                .collect(Collectors.toList());
    }

    public Optional<Player> getPlayerById(Integer id) {
        return playerRepository.findById(id);
    }






    public List<Player> getPlayersByName(String searchText){
        return playerRepository.findAll().stream()
                .filter(player -> player.getPlayer().toLowerCase()
                .contains(searchText.toLowerCase())).collect(Collectors.toList());

    }

    public List<Player> getPlayerByPos(String searchText){
        return playerRepository.findAll().stream()
                .filter(player -> player.getPos() != null &&
                        player.getPos().toLowerCase().contains(searchText.toLowerCase()))
                .collect(Collectors.toList());
    }


    public List<Player> getPlayerByNation(String searchText){
        return playerRepository.findAll().stream()
                .filter(player -> player.getNation() != null &&
                player.getNation().toLowerCase().contains(searchText.toLowerCase())).toList();
    }

    public List<Player> getPlayersByTeamAndPos(String team, String pos){
        return playerRepository.findAll().stream()
                .filter(player -> player.getTeam()
                .equals(team) && player.getPos().equals(pos))
                .collect(Collectors.toList());
    }

    public Player addPlayer(Player player){
        playerRepository.save(player);
        return player;
    }

    public Player updatePlayer(Player updatedPlayer){
        Optional<Player> existingPlayer = playerRepository.findByPlayer(updatedPlayer.getPlayer());
        if (existingPlayer.isPresent()) {
            Player playerToUpdate = existingPlayer.get();
            playerToUpdate.setPlayer(updatedPlayer.getPlayer());
            playerToUpdate.setPos(updatedPlayer.getPos());
            playerToUpdate.setNation(updatedPlayer.getNation());
            // 🟢 Nađi tim po imenu iz updatedPlayer.getTeam().getName()
            if (updatedPlayer.getTeam() != null && updatedPlayer.getTeam().getName() != null) {
                Team team = teamRepo.findByName(updatedPlayer.getTeam().getName());
                playerToUpdate.setTeam(team);
            }
            playerRepository.save(playerToUpdate);
            return playerToUpdate;
        }
        return null;

    }
    @Transactional
    public void deletePlayer(String playerName) {
        playerRepository.deleteByPlayer(playerName);
    }
}
