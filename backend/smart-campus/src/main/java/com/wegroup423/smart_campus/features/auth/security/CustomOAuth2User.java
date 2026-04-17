package com.wegroup423.smart_campus.features.auth.security;

import com.wegroup423.smart_campus.features.auth.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public class CustomOAuth2User implements OAuth2User {

    private final OAuth2User delegate;
    private final User appUser;

    public CustomOAuth2User(OAuth2User delegate, User appUser) {
        this.delegate = delegate;
        this.appUser = appUser;
    }

    public User getAppUser() {
        return appUser;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return delegate.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + appUser.getRole().name()));
    }

    @Override
    public String getName() {
        return appUser.getId();
    }
}
