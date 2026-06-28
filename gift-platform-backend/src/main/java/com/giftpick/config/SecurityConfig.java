package com.giftpick.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.giftpick.common.dto.ApiResponse;
import com.giftpick.common.exception.ErrorCode;
import com.giftpick.common.security.JwtAuthenticationFilter;
import com.giftpick.common.security.JwtTokenProvider;
import com.giftpick.common.security.UserDetailsServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security 설정.
 * JWT 기반 무상태(Stateless) 인증 방식을 사용합니다.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsServiceImpl userDetailsService;
    private final ObjectMapper objectMapper;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CSRF 비활성화 (REST API에서는 불필요)
            .csrf(AbstractHttpConfigurer::disable)
            // 세션 비활성화 (JWT 사용)
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // 요청별 권한 설정
            .authorizeHttpRequests(auth -> auth
                    // 공개 접근 허용 경로
                    .requestMatchers(
                            "/api/auth/**",
                            "/api/invite/**",    // 초대 링크 접근 (비로그인 허용)
                            "/swagger-ui/**",
                            "/swagger-ui.html",
                            "/api-docs/**"
                    ).permitAll()
                    // 나머지 모든 요청은 인증 필요
                    .anyRequest().authenticated()
            )
            // 인증 실패 처리 (401)
            .exceptionHandling(exception -> exception
                    .authenticationEntryPoint((request, response, authException) -> {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setContentType(MediaType.APPLICATION_JSON_VALUE + ";charset=UTF-8");
                        response.getWriter().write(
                                objectMapper.writeValueAsString(
                                        ApiResponse.fail(ErrorCode.UNAUTHORIZED.getCode(),
                                                ErrorCode.UNAUTHORIZED.getMessage())
                                )
                        );
                    })
                    // 인가 실패 처리 (403)
                    .accessDeniedHandler((request, response, accessDeniedException) -> {
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.setContentType(MediaType.APPLICATION_JSON_VALUE + ";charset=UTF-8");
                        response.getWriter().write(
                                objectMapper.writeValueAsString(
                                        ApiResponse.fail(ErrorCode.FORBIDDEN.getCode(),
                                                ErrorCode.FORBIDDEN.getMessage())
                                )
                        );
                    })
            )
            // JWT 필터를 UsernamePasswordAuthenticationFilter 앞에 삽입
            .addFilterBefore(
                    new JwtAuthenticationFilter(jwtTokenProvider, userDetailsService),
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }
}
