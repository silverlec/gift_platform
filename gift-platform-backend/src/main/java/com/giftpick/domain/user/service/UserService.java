package com.giftpick.domain.user.service;

import com.giftpick.common.exception.CustomException;
import com.giftpick.common.exception.ErrorCode;
import com.giftpick.common.security.JwtTokenProvider;
import com.giftpick.domain.user.dto.AuthResponse;
import com.giftpick.domain.user.dto.LoginRequest;
import com.giftpick.domain.user.dto.RegisterRequest;
import com.giftpick.domain.user.entity.User;
import com.giftpick.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 회원가입
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 이메일 중복 검사
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException(ErrorCode.EMAIL_DUPLICATED);
        }

        // 비밀번호 암호화 후 사용자 생성
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        User savedUser = userRepository.save(user);
        log.info("신규 회원 가입: email={}, role={}", savedUser.getEmail(), savedUser.getRole());

        String token = jwtTokenProvider.generateToken(
                savedUser.getEmail(), savedUser.getRole().name()
        );

        return AuthResponse.builder()
                .token(token)
                .user(AuthResponse.UserInfo.from(savedUser))
                .build();
    }

    /**
     * 로그인 (이메일 + 비밀번호 검증 후 JWT 발급)
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_PASSWORD));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD);
        }

        log.info("로그인 성공: email={}", user.getEmail());

        String token = jwtTokenProvider.generateToken(
                user.getEmail(), user.getRole().name()
        );

        return AuthResponse.builder()
                .token(token)
                .user(AuthResponse.UserInfo.from(user))
                .build();
    }

    /**
     * 현재 로그인한 사용자 정보 조회
     */
    @Transactional(readOnly = true)
    public AuthResponse.UserInfo getMe(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        return AuthResponse.UserInfo.from(user);
    }
}
