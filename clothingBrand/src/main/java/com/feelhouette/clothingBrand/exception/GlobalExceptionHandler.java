package com.feelhouette.clothingBrand.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.Serializable;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<?> handleResponseStatus(ResponseStatusException ex) {
        return buildResponse((HttpStatus) ex.getStatusCode(), ex.getReason());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneric(Exception ex) {
        ex.printStackTrace();
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }

//    private ResponseEntity<Map<String, Serializable>> buildResponse(HttpStatus status, String message) {
//        var body = Map.of(
//                "timestamp", Instant.now().toString(),
//                "status", status.value(),
//                "error", status.getReasonPhrase(),
//                "message", message
//        );
//        return ResponseEntity.status(status).body((Map<String, Serializable>) body);
//    }

    private ResponseEntity<Map<String, Serializable>> buildResponse(HttpStatus status, String message) {
        Map<String, Serializable> body = new HashMap<>();
        body.put("timestamp", Instant.now().toString()); // String is Serializable
        body.put("status", status.value()); // Integer is Serializable
        body.put("error", status.getReasonPhrase()); // String is Serializable
        body.put("message", message); // String is Serializable
        return ResponseEntity.status(status).body(body);
    }
}
