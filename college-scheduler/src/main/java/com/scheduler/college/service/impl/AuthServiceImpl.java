package com.scheduler.college.service.impl;

import com.scheduler.college.dto.request.LoginRequest;
import com.scheduler.college.dto.request.RegisterRequest;
import com.scheduler.college.dto.response.AuthResponse;
import com.scheduler.college.entity.Institute;
import com.scheduler.college.repository.InstituteRepository;
import com.scheduler.college.security.JwtUtil;
import com.scheduler.college.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final InstituteRepository instituteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public AuthResponse register(RegisterRequest req) {
        if (instituteRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email is already registered");

        Institute institute = Institute.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .contactNumber(req.getContactNumber())
                .address(req.getAddress())
                .build();

        instituteRepository.save(institute);

        String token = jwtUtil.generateToken(institute.getEmail());
        return AuthResponse.builder()
                .token(token)
                .instituteId(institute.getId())
                .name(institute.getName())
                .email(institute.getEmail())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest req) {
        Institute institute = instituteRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), institute.getPassword()))
            throw new RuntimeException("Invalid email or password");

        String token = jwtUtil.generateToken(institute.getEmail());
        return AuthResponse.builder()
                .token(token)
                .instituteId(institute.getId())
                .name(institute.getName())
                .email(institute.getEmail())
                .build();
    }
}
