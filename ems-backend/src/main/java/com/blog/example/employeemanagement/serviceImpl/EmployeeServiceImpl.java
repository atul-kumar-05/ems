package com.blog.example.employeemanagement.serviceImpl;

import com.blog.example.employeemanagement.exception.ResourceNotFoundException;
import com.blog.example.employeemanagement.payload.EmployeeDto;
import com.blog.example.employeemanagement.model.Employee;
import com.blog.example.employeemanagement.repository.EmployeeRepo;
import com.blog.example.employeemanagement.service.EmployeeService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepo employeeRepo;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public EmployeeDto createEmployee(EmployeeDto employeeDto) {
        Employee employee = this.modelMapper.map(employeeDto, Employee.class);
        Employee savedEmployee = this.employeeRepo.save(employee);
        EmployeeDto response =this.modelMapper.map(savedEmployee,EmployeeDto.class);
        return response;
    }

    @Override
    public EmployeeDto updateEmployee(EmployeeDto employeeDto, Integer employeeId) {
        Employee employee = this.employeeRepo.findById(employeeId).orElseThrow(() -> new ResourceNotFoundException("Employee not found !!", "id", employeeId));
        employee.setFirstName(employeeDto.getFirstName());
        employee.setLastName(employeeDto.getLastName());
        employee.setEmail(employeeDto.getEmail());
        employee.setPhone(employeeDto.getPhone());
        employee.setSalary(employeeDto.getSalary());
        employee.setDepartment(employeeDto.getDepartment());
        Employee updatedEmployee = this.employeeRepo.save(employee);
        return modelMapper.map(updatedEmployee, EmployeeDto.class);
    }

    @Override
    public void deleteEmployee(Integer employeeId) {
        Employee employee = this.employeeRepo.findById(employeeId).orElseThrow(() -> new ResourceNotFoundException("Employee not found !!", "id", employeeId));
        this.employeeRepo.delete(employee);
    }

    @Override
    public EmployeeDto findEmployeeById(Integer employeeId) {
        Employee employee = this.employeeRepo.findById(employeeId).orElseThrow(() -> new ResourceNotFoundException("Employee not found !!", "id", employeeId));
        return modelMapper.map(employee, EmployeeDto.class);

    }

    @Override
    public List<EmployeeDto> findAllEmployee() {
        List<Employee> employees = this.employeeRepo.findAll();
        List<EmployeeDto> employeeDtos = new ArrayList<>();
        employees.forEach(employee -> employeeDtos.add(modelMapper.map(employee, EmployeeDto.class)));
        return employeeDtos;

    }
}

