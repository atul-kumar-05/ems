package com.blog.example.employeemanagement.Controller;

import com.blog.example.employeemanagement.payload.EmployeeDto;
import com.blog.example.employeemanagement.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeController {
    @Autowired
    private EmployeeService userService;

    @PostMapping("/")
    public ResponseEntity< EmployeeDto> createEmployee(@Valid @RequestBody EmployeeDto employeeDto){
        EmployeeDto createdEmployee = userService.createEmployee(employeeDto);
        return new ResponseEntity<>(createdEmployee, HttpStatus.CREATED);
    }
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDto> updateEmployee(@Valid @RequestBody EmployeeDto employeeDto,@PathVariable Integer id){
        EmployeeDto employeeDto1=this.userService.updateEmployee(employeeDto,id);
        return new ResponseEntity<>(employeeDto1, HttpStatus.ACCEPTED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDto> getEmployee(@PathVariable Integer id){
        EmployeeDto employeeDto=this.userService.findEmployeeById(id);
        return new ResponseEntity<>(employeeDto, HttpStatus.OK);
    }
    @GetMapping("/")
    public ResponseEntity<List<EmployeeDto>> getAllEmployees(){
        List<EmployeeDto> employeeDtoList=this.userService.findAllEmployee();
        return new ResponseEntity<>(employeeDtoList, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Integer id){
        this.userService.deleteEmployee(id);
        return new ResponseEntity<>("Employee deleted", HttpStatus.OK);
    }
}
