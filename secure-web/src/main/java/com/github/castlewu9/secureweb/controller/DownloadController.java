package com.github.castlewu9.secureweb.controller;

import java.io.File;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@RequestMapping("/download")
@RestController
public class DownloadController {

  private final ResourceLoader resourceLoader;

  public DownloadController(ResourceLoader resourceLoader) {
    this.resourceLoader = resourceLoader;
  }

  @GetMapping(value = "/file/{filename}")
  public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
    File localFile = new File("src/main/resources", filename);
    if (!localFile.exists()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Can't find file: " + filename);
    }

    FileSystemResource resource = new FileSystemResource(localFile);
    String digest = DigestUtils.sha256Hex(localFile.getAbsolutePath());

    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
        .header("Content-Digest", "sha-256=:" + digest + ":")
        .contentType(MediaType.APPLICATION_OCTET_STREAM).contentLength(localFile.length())
        .body(resource);
  }

  @GetMapping(value = "/s3/{bucket}/{objectKey}")
  public ResponseEntity<Resource> downloadS3(@PathVariable String bucket,
      @PathVariable String objectKey) {
    String s3Url = "s3://" + bucket + "/" + objectKey;
    Resource resource = resourceLoader.getResource(s3Url);

    if (!resource.exists()) {
      return ResponseEntity.notFound().build();
    }

    try {
      HttpHeaders headers = new HttpHeaders();
      headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + objectKey + "\"");

      return ResponseEntity.ok()
          .headers(headers)
          .contentLength(resource.contentLength())
          .contentType(MediaType.APPLICATION_OCTET_STREAM)
          .body(resource);
    } catch (Exception e) {
      return ResponseEntity.internalServerError().build();
    }
  }

}
