package com.wegroup423.smart_campus.features.auth.service;

import com.wegroup423.smart_campus.features.auth.dto.AuthResponse;
import com.wegroup423.smart_campus.features.auth.dto.LoginRequest;
import com.wegroup423.smart_campus.features.auth.dto.RegisterRequest;
import com.wegroup423.smart_campus.features.auth.dto.UpdateProfileRequest;
import com.wegroup423.smart_campus.features.auth.dto.UserDto;

import java.util.Map;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
    UserDto getCurrentUser(Object principal);
    UserDto updateCurrentUser(Object principal, UpdateProfileRequest request);
    void deleteCurrentUser(Object principal);
    Map<String, Object> validateToken(Object principal);
}
