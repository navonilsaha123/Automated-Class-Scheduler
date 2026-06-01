package com.scheduler.college.service;

import com.scheduler.college.dto.request.LoginRequest;
import com.scheduler.college.dto.request.RegisterRequest;
import com.scheduler.college.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
