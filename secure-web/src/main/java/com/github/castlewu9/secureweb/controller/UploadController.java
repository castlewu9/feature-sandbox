package com.github.castlewu9.secureweb.controller;

import com.github.castlewu9.secureweb.model.CommonResponse;
import java.nio.file.Files;
import java.nio.file.Paths;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@CrossOrigin(origins = "*") // Allow all origins for this controller
@RequestMapping("/upload")
public class UploadController {

  @PostMapping("/file/{filename}")
  public CommonResponse uploadFile(@PathVariable String filename, @RequestBody byte[] data) {
    log.info("Uploading file {}}", filename);
    try {
      Files.write(Paths.get("./" + filename), data);
    }catch (Exception e) {
      log.error("Error while uploading file {}", filename, e);
    }
    return CommonResponse.builder().success(true).message(filename).build();
  }

  @PostMapping("/file")
  public String uploadFileByForm(@RequestParam("file") MultipartFile file) {
    if (!file.isEmpty()) {
      try {
        byte[] bytes = file.getBytes();
        // Process the binary data (e.g., save to disk, process content)
        System.out.println("Received file: " + file.getOriginalFilename() + ", size: " + bytes.length + " bytes");
        return "File uploaded successfully!";
      } catch (Exception e) {
        return "Failed to upload file: " + e.getMessage();
      }
    } else {
      return "No file received.";
    }
  }

}
