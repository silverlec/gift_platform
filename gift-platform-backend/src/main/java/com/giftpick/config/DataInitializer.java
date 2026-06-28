package com.giftpick.config;

import com.giftpick.domain.user.entity.User;
import com.giftpick.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Giver 데모 계정 생성
        if (!userRepository.existsByEmail("giver@example.com")) {
            User giver = User.builder()
                    .username("한지민")
                    .email("giver@example.com")
                    .password(passwordEncoder.encode("password"))
                    .role(User.UserRole.GIVER)
                    .build();
            userRepository.save(giver);
            log.info("데모 GIVER 계정이 생성되었습니다. (giver@example.com / password)");
        }

        // Recipient 데모 계정 생성
        if (!userRepository.existsByEmail("minsu@example.com")) {
            User recipient1 = User.builder()
                    .username("김민수")
                    .email("minsu@example.com")
                    .password(passwordEncoder.encode("password"))
                    .role(User.UserRole.RECIPIENT)
                    .build();
            userRepository.save(recipient1);
            log.info("데모 RECIPIENT 계정이 생성되었습니다. (minsu@example.com / password)");
        }

        if (!userRepository.existsByEmail("recipient@example.com")) {
            User recipient2 = User.builder()
                    .username("박영희")
                    .email("recipient@example.com")
                    .password(passwordEncoder.encode("password"))
                    .role(User.UserRole.RECIPIENT)
                    .build();
            userRepository.save(recipient2);
            log.info("데모 RECIPIENT 계정이 생성되었습니다. (recipient@example.com / password)");
        }
    }
}
