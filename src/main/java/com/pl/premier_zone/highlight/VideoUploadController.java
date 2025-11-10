package com.pl.premier_zone.highlight;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VideoUploadController {

    @Value("${video.upload.dir:uploads/videos}")
    private String uploadDir;

    private static final long MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    private static final String[] ALLOWED_EXTENSIONS = {".mp4", ".avi", ".mov", ".wmv"};

    @PostMapping("/upload")
    public ResponseEntity<?> uploadVideo(@RequestParam("file") MultipartFile file) {
        try {
            // Validacija file-a
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Fajl je prazan"));
            }

            // Provera veličine
            if (file.getSize() > MAX_FILE_SIZE) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Fajl je prevelik. Max 100MB"));
            }

            // Provera ekstenzije
            String originalFilename = file.getOriginalFilename();
            String extension = getFileExtension(originalFilename);

            if (!isValidExtension(extension)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Nepodržan format. Koristite: mp4, avi, mov, wmv"));
            }

            // Kreiraj uploads folder ako ne postoji
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generiši jedinstveno ime fajla
            String uniqueFileName = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(uniqueFileName);

            // Snimi fajl
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Vrati URL ka videu
            String videoUrl = "/videos/" + uniqueFileName;

            Map<String, String> response = new HashMap<>();
            response.put("videoUrl", videoUrl);
            response.put("fileName", uniqueFileName);
            response.put("originalName", originalFilename);
            response.put("size", String.valueOf(file.getSize()));

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Greška pri upload-u: " + e.getMessage()));
        }
    }

    @PostMapping("/upload-thumbnail")
    public ResponseEntity<?> uploadThumbnail(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Fajl je prazan"));
            }

            // Provera da li je slika
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Fajl mora biti slika"));
            }

            // Kreiraj folder
            Path uploadPath = Paths.get(uploadDir + "/thumbnails");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String extension = getFileExtension(file.getOriginalFilename());
            String uniqueFileName = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(uniqueFileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String thumbnailUrl = "/videos/thumbnails/" + uniqueFileName;

            Map<String, String> response = new HashMap<>();
            response.put("thumbnailUrl", thumbnailUrl);
            response.put("fileName", uniqueFileName);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Greška pri upload-u: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{fileName}")
    public ResponseEntity<?> deleteVideo(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(fileName);

            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            Files.delete(filePath);
            return ResponseEntity.ok(Map.of("message", "Video uspešno obrisan"));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Greška pri brisanju: " + e.getMessage()));
        }
    }

    // Helper methods
    private String getFileExtension(String filename) {
        if (filename == null) return "";
        int lastDot = filename.lastIndexOf('.');
        return lastDot > 0 ? filename.substring(lastDot).toLowerCase() : "";
    }

    private boolean isValidExtension(String extension) {
        for (String allowed : ALLOWED_EXTENSIONS) {
            if (allowed.equalsIgnoreCase(extension)) {
                return true;
            }
        }
        return false;
    }
}