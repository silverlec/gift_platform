package com.giftpick.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * 애플리케이션 전반에서 사용하는 에러 코드 열거형.
 * 각 코드는 HTTP 상태 코드와 메시지를 포함합니다.
 */
@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // 인증/인가
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "AUTH_001", "인증이 필요합니다."),
    FORBIDDEN(HttpStatus.FORBIDDEN, "AUTH_002", "접근 권한이 없습니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH_003", "유효하지 않은 토큰입니다."),
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "AUTH_004", "만료된 토큰입니다."),

    // 사용자
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "USER_001", "사용자를 찾을 수 없습니다."),
    EMAIL_DUPLICATED(HttpStatus.CONFLICT, "USER_002", "이미 사용 중인 이메일입니다."),
    INVALID_PASSWORD(HttpStatus.UNAUTHORIZED, "USER_003", "이메일 또는 비밀번호가 일치하지 않습니다."),

    // 선물 이벤트
    EVENT_NOT_FOUND(HttpStatus.NOT_FOUND, "EVENT_001", "선물 이벤트를 찾을 수 없습니다."),
    EVENT_ACCESS_DENIED(HttpStatus.FORBIDDEN, "EVENT_002", "해당 이벤트에 접근 권한이 없습니다."),
    EVENT_ALREADY_SELECTED(HttpStatus.CONFLICT, "EVENT_003", "이미 선물 선택이 완료된 이벤트입니다."),
    EVENT_EXPIRED(HttpStatus.BAD_REQUEST, "EVENT_004", "종료된 이벤트입니다."),

    // 선물 옵션
    OPTION_NOT_FOUND(HttpStatus.NOT_FOUND, "OPTION_001", "선물 옵션을 찾을 수 없습니다."),
    OPTION_NOT_BELONG_TO_EVENT(HttpStatus.BAD_REQUEST, "OPTION_002", "해당 이벤트에 속하지 않는 옵션입니다."),

    // 공통
    INVALID_REQUEST(HttpStatus.BAD_REQUEST, "COMMON_001", "잘못된 요청입니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON_999", "서버 내부 오류가 발생했습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}
