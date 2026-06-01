package com.scheduler.college.security;

import com.scheduler.college.entity.Institute;
import com.scheduler.college.repository.InstituteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final InstituteRepository instituteRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Institute institute = instituteRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Institute not found: " + email));

        return User.builder()
                .username(institute.getEmail())
                .password(institute.getPassword())
                .roles("INSTITUTE")
                .build();
    }
}
