package com.github.castlewu9.secureweb.controller;

import com.github.castlewu9.secureweb.model.CommonResponse;
import java.io.FileOutputStream;
import java.io.InputStream;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@CrossOrigin("*")
@RestController
@RequestMapping("/upload")
public class UploadController {

  @PostMapping(value = "/file/{filename}")
  public CommonResponse uploadFile(@PathVariable String filename,
      @RequestBody InputStream inputStream) {
    log.info("Uploading file {}}", filename);
    try (FileOutputStream outputStream = new FileOutputStream("./" + filename)) {
      IOUtils.copy(inputStream, outputStream);
    } catch (Exception e) {
      log.error(e.getMessage());
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
//    return CommonResponse.builder().success(true).message(filename).build();
  }

  @PostMapping("/file")
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
