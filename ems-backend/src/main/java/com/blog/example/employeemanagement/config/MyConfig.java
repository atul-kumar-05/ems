package com.blog.example.employeemanagement.config;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;


@Configuration
 class MyConfig {



    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails userDetails= User.builder().username("Atul").password(passwordEncoder().encode("Atul")).roles("ADMIN").build();
        UserDetails userDetails1=User.builder()
                .username("kumar").password(passwordEncoder().encode("kumar")).roles("EMPLOYEE")
                .build();
        return new InMemoryUserDetailsManager(userDetails,userDetails1);
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

}
