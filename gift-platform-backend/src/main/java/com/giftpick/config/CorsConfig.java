package com.giftpick.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

/**
 * CORS 설정.
 * React 개발 서버(http://localhost:5173)와 프로덕션 도메인에서의 요청을 허용합니다.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // 허용할 오리진 (React 개발 서버 + 실제 배포 도메인)
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",   // Vite 개발 서버
                "http://localhost:3000",
                "https://your-production-domain.com"  // 배포 시 실제 도메인으로 변경
        ));

        // 허용할 HTTP 메서드
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // 허용할 헤더
        config.setAllowedHeaders(List.of("*"));

        // 자격증명(쿠키, Authorization 헤더) 포함 허용
        config.setAllowCredentials(true);

        // 클라이언트에서 읽을 수 있는 응답 헤더
        config.setExposedHeaders(List.of("Authorization"));

        // preflight 응답 캐시 시간 (초)
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }
}
