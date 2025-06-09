package com.blog.example.employeemanagement.payload;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;


@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDto {
    private Integer id;
    @NotBlank(message = "please provide first name of Employee")
    private String firstName;
    @NotBlank(message = "please provide last name of Employee")
    private String lastName;
    @Email(message = "provide correct format of email")
    private String email;
    @Size(min = 10,max = 10,message = "please provide 10 digit phone number")
    private String phone;
    private Double salary;
    private String role;
    private String department;

}
