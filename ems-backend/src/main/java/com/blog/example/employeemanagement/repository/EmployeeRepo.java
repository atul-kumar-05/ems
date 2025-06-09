package com.blog.example.employeemanagement.repository;

import com.blog.example.employeemanagement.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeRepo extends JpaRepository<Employee, Integer> {
}
