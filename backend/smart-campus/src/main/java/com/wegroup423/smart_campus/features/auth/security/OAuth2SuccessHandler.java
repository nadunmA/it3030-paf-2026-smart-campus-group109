package com.wegroup423.smart_campus.features.auth.security;

import com.wegroup423.smart_campus.features.auth.model.User;
import com.wegroup423.smart_campus.features.auth.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        if (email == null || email.isBlank()) {
            log.error("OAuth2 login failed: email not found in OAuth2 provider response");
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Email not available from OAuth2 provider");
            return;
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        if (!user.isActive()) {
            log.warn("Blocked OAuth2 login for suspended user: {}", email);
            String suspendedRedirect = frontendUrl + "/auth/callback"
                + "#error=" + encode("account_suspended")
                + "&message=" + encode("Your account is suspended. Contact an administrator.");
            getRedirectStrategy().sendRedirect(request, response, suspendedRedirect);
            return;
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );


        String provider = resolveProvider(authentication);
        boolean isOAuthUser = true;
        String issuedAt = DateTimeFormatter.ISO_INSTANT
                .withZone(ZoneOffset.UTC)
                .format(Instant.now());




        log.info("OAuth2 login success for: {} | role: {} | provider: {}", email, user.getRole(), provider);

        // Redirect to frontend with hash params to reduce token leakage in server logs
        String redirectUrl = frontendUrl + "/auth/callback"
            + "#token=" + encode(token)
            + "&name=" + encode(nullSafe(user.getName()))
            + "&email=" + encode(nullSafe(user.getEmail()))
            + "&picture=" + encode(nullSafe(user.getPicture()))
            + "&role=" + encode(user.getRole().name())
            + "&provider=" + encode(provider)
            + "&isOAuthUser=" + isOAuthUser
            + "&issuedAt=" + encode(issuedAt);
        log.info("Redirecting OAuth2 user to frontend callback");
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }

    private String resolveProvider(Authentication authentication) {
        try {

            return authentication.getAuthorities().stream()
                    .findFirst()
                    .map(Object::toString)
                    .orElse("oauth2");
        } catch (Exception e) {
            return "oauth2";
        }
    }

    private String nullSafe(String value) {
        return value == null ? "" : value;
    }

    private String encode(String value) {
        return java.net.URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}