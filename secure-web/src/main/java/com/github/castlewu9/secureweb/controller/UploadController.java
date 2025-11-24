package com.github.castlewu9.secureweb.controller;

import com.github.castlewu9.secureweb.model.CommonResponse;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@RestController
@RequestMapping("/api/upload")
public class UploadController {

  @PostMapping
  public ResponseEntity<CommonResponse> upload(@RequestParam String filename,
      InputStream inputStream) {
    log.info("Uploading file {}", filename);
    try (FileOutputStream fos = new FileOutputStream(new File("./", filename))) {
      inputStream.transferTo(fos);
    } catch (Exception e) {
      log.error("Uploading failure: {}", filename, e);
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Can't upload file");
    }
    return ResponseEntity.ok(CommonResponse.builder().value(filename).build());
  }

  @PostMapping("/file2")
  public String uploadFileByForm(@RequestParam("file") MultipartFile file) {
    if (!file.isEmpty()) {
      try {
        byte[] bytes = file.getBytes();
        // Process the binary data (e.g., save to disk, process content)
        System.out.println(
            "Received file: " + file.getOriginalFilename() + ", size: " + bytes.length + " bytes");
        return "File uploaded successfully!";
      } catch (Exception e) {
        return "Failed to upload file: " + e.getMessage();
      }
    } else {
      return "No file received.";
    }
  }

}
