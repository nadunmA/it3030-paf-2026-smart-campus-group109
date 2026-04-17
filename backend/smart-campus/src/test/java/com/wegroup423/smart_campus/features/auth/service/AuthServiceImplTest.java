package com.wegroup423.smart_campus.features.auth.service;


import com.wegroup423.smart_campus.features.auth.dto.AuthResponse;
import com.wegroup423.smart_campus.features.auth.dto.LoginRequest;
import com.wegroup423.smart_campus.features.auth.dto.RegisterRequest;
import com.wegroup423.smart_campus.features.auth.dto.UpdateProfileRequest;
import com.wegroup423.smart_campus.features.auth.dto.UserDto;
import com.wegroup423.smart_campus.features.auth.exception.InvalidCredentialsException;
import com.wegroup423.smart_campus.features.auth.exception.UserNotFoundException;
import com.wegroup423.smart_campus.features.auth.model.User;
import com.wegroup423.smart_campus.features.auth.repository.UserRepository;
import com.wegroup423.smart_campus.features.auth.security.JwtUtil;
import com.wegroup423.smart_campus.features.auth.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private AuthServiceImpl authService;

    private User activeUser;
    private User inactiveUser;

    @BeforeEach
    void setUp() {
        activeUser = User.builder()
                .id("user-123")
                .name("Nadun")
                .email("nadun@gmail.com")
                .password("hashed-password")
                .picture("pic-url")
                .role(User.Role.USER)
                .active(true)
                .createdAt(LocalDateTime.now().minusDays(5))
                .lastLoginAt(LocalDateTime.now().minusDays(1))
                .build();

        inactiveUser = User.builder()
                .id("user-999")
                .name("Blocked User")
                .email("blocked@gmail.com")
                .password("hashed-password")
                .role(User.Role.USER)
                .active(false)
                .createdAt(LocalDateTime.now().minusDays(10))
                .build();
    }

    @Test
    void login_shouldReturnAuthResponse_whenCredentialsAreValid() {
        LoginRequest request = new LoginRequest("nadun@gmail.com", "123456");

        when(userRepository.findByEmail("nadun@gmail.com")).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches("123456", "hashed-password")).thenReturn(true);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtUtil.generateToken("user-123", "nadun@gmail.com", "USER")).thenReturn("mock-jwt-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.token());
        assertEquals("Bearer", response.tokenType());
        assertNotNull(response.user());
        assertEquals("nadun@gmail.com", response.user().email());

        verify(userRepository).findByEmail("nadun@gmail.com");
        verify(passwordEncoder).matches("123456", "hashed-password");
        verify(userRepository).save(any(User.class));
        verify(jwtUtil).generateToken("user-123", "nadun@gmail.com", "USER");
    }

    @Test
    void login_shouldThrowUserNotFoundException_whenUserDoesNotExist() {
        LoginRequest request = new LoginRequest("missing@gmail.com", "123456");

        when(userRepository.findByEmail("missing@gmail.com")).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> authService.login(request));

        verify(userRepository).findByEmail("missing@gmail.com");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtUtil, never()).generateToken(anyString(), anyString(), anyString());
    }

    @Test
    void login_shouldThrowInvalidCredentialsException_whenUserIsInactive() {
        LoginRequest request = new LoginRequest("blocked@gmail.com", "123456");

        when(userRepository.findByEmail("blocked@gmail.com")).thenReturn(Optional.of(inactiveUser));

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request));

        verify(userRepository).findByEmail("blocked@gmail.com");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void login_shouldThrowInvalidCredentialsException_whenPasswordIsWrong() {
        LoginRequest request = new LoginRequest("nadun@gmail.com", "wrong-password");

        when(userRepository.findByEmail("nadun@gmail.com")).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches("wrong-password", "hashed-password")).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request));

        verify(userRepository).findByEmail("nadun@gmail.com");
        verify(passwordEncoder).matches("wrong-password", "hashed-password");
        verify(jwtUtil, never()).generateToken(anyString(), anyString(), anyString());
    }

    @Test
    void register_shouldCreateUserAndReturnAuthResponse_whenRequestIsValid() {
        RegisterRequest request = new RegisterRequest(
                "Nadun",
                "nadun@gmail.com",
                "123456",
                "pic-url"
        );

        when(userRepository.findByEmail("nadun@gmail.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("123456")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User saved = invocation.getArgument(0);
            saved.setId("new-user-1");
            return saved;
        });
        when(jwtUtil.generateToken("new-user-1", "nadun@gmail.com", "USER")).thenReturn("new-token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("new-token", response.token());
        assertEquals("Bearer", response.tokenType());
        assertEquals("nadun@gmail.com", response.user().email());
        assertEquals("Nadun", response.user().name());

        verify(userRepository).findByEmail("nadun@gmail.com");
        verify(passwordEncoder).encode("123456");
        verify(userRepository).save(any(User.class));
        verify(jwtUtil).generateToken("new-user-1", "nadun@gmail.com", "USER");
    }

    @Test
    void register_shouldThrowInvalidCredentialsException_whenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest(
                "Nadun",
                "nadun@gmail.com",
                "123456",
                "pic-url"
        );

        when(userRepository.findByEmail("nadun@gmail.com")).thenReturn(Optional.of(activeUser));

        assertThrows(InvalidCredentialsException.class, () -> authService.register(request));

        verify(userRepository).findByEmail("nadun@gmail.com");
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void getCurrentUser_shouldReturnUserDto_whenPrincipalIsUserObject() {
        UserDto response = authService.getCurrentUser(activeUser);

        assertNotNull(response);
        assertEquals(activeUser.getId(), response.id());
        assertEquals(activeUser.getEmail(), response.email());
    }

    @Test
    void getCurrentUser_shouldReturnUserDto_whenPrincipalIsUserDetails() {
        when(userDetails.getUsername()).thenReturn("user-123");
        when(userRepository.findById("user-123")).thenReturn(Optional.of(activeUser));

        UserDto response = authService.getCurrentUser(userDetails);

        assertNotNull(response);
        assertEquals("user-123", response.id());
        assertEquals("nadun@gmail.com", response.email());

        verify(userRepository).findById("user-123");
    }

    @Test
    void getCurrentUser_shouldThrowUserNotFoundException_whenPrincipalIsNull() {
        assertThrows(UserNotFoundException.class, () -> authService.getCurrentUser(null));
    }

    @Test
    void getCurrentUser_shouldThrowInvalidCredentialsException_whenUserIsInactive() {
        assertThrows(InvalidCredentialsException.class, () -> authService.getCurrentUser(inactiveUser));
    }

    @Test
    void updateCurrentUser_shouldUpdateNameAndPicture_whenRequestHasValues() {
        UpdateProfileRequest request = new UpdateProfileRequest("  New Name  ", "  new-pic-url  ");

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserDto response = authService.updateCurrentUser(activeUser, request);

        assertNotNull(response);
        assertEquals("New Name", response.name());
        assertEquals("new-pic-url", response.picture());

        verify(userRepository).save(activeUser);
    }

    @Test
    void updateCurrentUser_shouldThrowUserNotFoundException_whenPrincipalIsNull() {
        UpdateProfileRequest request = new UpdateProfileRequest("New Name", "new-pic-url");

        assertThrows(UserNotFoundException.class, () -> authService.updateCurrentUser(null, request));
    }

    @Test
    void updateCurrentUser_shouldThrowInvalidCredentialsException_whenUserIsInactive() {
        UpdateProfileRequest request = new UpdateProfileRequest("New Name", "new-pic-url");

        assertThrows(InvalidCredentialsException.class, () -> authService.updateCurrentUser(inactiveUser, request));
    }

    @Test
    void deleteCurrentUser_shouldDeactivateUser_whenPrincipalIsValid() {
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        authService.deleteCurrentUser(activeUser);

        assertFalse(activeUser.isActive());
        verify(userRepository).save(activeUser);
    }

    @Test
    void deleteCurrentUser_shouldThrowUserNotFoundException_whenPrincipalIsNull() {
        assertThrows(UserNotFoundException.class, () -> authService.deleteCurrentUser(null));
    }

    @Test
    void validateToken_shouldReturnValidTrue_whenPrincipalExists() {
        when(userDetails.getUsername()).thenReturn("user-123");

        Map<String, Object> result = authService.validateToken(userDetails);

        assertEquals(true, result.get("valid"));
        assertEquals("user-123", result.get("userId"));
    }

    @Test
    void validateToken_shouldReturnValidFalse_whenPrincipalIsNull() {
        Map<String, Object> result = authService.validateToken(null);

        assertEquals(false, result.get("valid"));
        assertEquals("unknown", result.get("userId"));
    }
}
