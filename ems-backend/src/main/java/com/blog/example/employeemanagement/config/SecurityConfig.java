package com.blog.example.employeemanagement.config;

import com.blog.example.employeemanagement.security.JwtAuthenticationEntryPoint;
import com.blog.example.employeemanagement.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {
    @Autowired
    private JwtAuthenticationEntryPoint point;
    @Autowired
    private JwtAuthenticationFilter filter;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth->auth.
                requestMatchers("/auth/login").permitAll()
                        //Employee API access
                        .requestMatchers(HttpMethod.DELETE,"/employees/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET,  "/employees/**").hasAnyRole("ADMIN","EMPLOYEE")
                        .requestMatchers(HttpMethod.POST,  "/employees/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,  "/employees/**").hasRole("ADMIN")
                        //Department API access
                        .requestMatchers(HttpMethod.DELETE,  "/departments/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET,"/departments/**").hasAnyRole("ADMIN","EMPLOYEE")
                        .requestMatchers(HttpMethod.POST,  "/departments/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,  "/departments/**").hasRole("ADMIN")
                        .requestMatchers("/**").permitAll()
                .anyRequest().authenticated())
                .exceptionHandling(ex -> ex.authenticationEntryPoint(point))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); // ✅ Your React app origin
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


}
