package com.blog.example.employeemanagement.exception;

import com.blog.example.employeemanagement.payload.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse> resourceNotFound(ResourceNotFoundException e) {
        String message =  e.getMessage();
        ApiResponse apiResponse = new ApiResponse(message,false);
        return new ResponseEntity<>(apiResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,String>> methodArgumentNotValid(MethodArgumentNotValidException e) {

        Map<String,String> map = new HashMap<>();
        e.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldname=((FieldError)error).getField();
            String message=error.getDefaultMessage();
            map.put(fieldname,message);
        });
        return new ResponseEntity<>(map,HttpStatus.BAD_REQUEST);

    }
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(NoHandlerFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of("message", "API endpoint not found")
        );
    }

}
