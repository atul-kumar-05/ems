package com.blog.example.employeemanagement.exception;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class ResourceNotFoundException extends RuntimeException {
    private String message;
    private String code;
    private Integer id;
    public ResourceNotFoundException(String message, String code, Integer id) {
        super(String.format("Resource %s not %s found :%d", message,code,id));
        this.message = message;
        this.code = code;
        this.id = id;
    }
}
