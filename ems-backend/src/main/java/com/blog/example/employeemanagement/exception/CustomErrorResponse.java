package com.blog.example.employeemanagement.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CustomErrorResponse {
    private String message;
    private int status;
    private String path;
}