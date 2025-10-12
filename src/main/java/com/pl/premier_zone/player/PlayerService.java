package com.pl.premier_zone.player;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class PlayerService {

    private final PlayerRepository playerRepository;

    @Autowired
    public PlayerService(PlayerRepository playerRepository){
        this.playerRepository = playerRepository;
    }


    public List<Player> getPlayers(){
        return playerRepository.findAll();
    }

    public List<Player> getPlayersFromTeam(String teamName){
        return playerRepository.findAll().stream()
                .filter(player -> teamName
                .equals(player.getTeam())).collect(Collectors.toList());

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
            playerToUpdate.setTeam(updatedPlayer.getTeam());
            playerToUpdate.setPos(updatedPlayer.getPos());
            playerToUpdate.setNation(updatedPlayer.getNation());
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
