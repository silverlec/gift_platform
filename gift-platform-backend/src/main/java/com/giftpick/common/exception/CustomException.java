package com.giftpick.common.exception;

import lombok.Getter;

/**
 * 비즈니스 로직 예외 클래스.
 * ErrorCode를 기반으로 throw 하면 GlobalExceptionHandler에서 자동 처리됩니다.
 */
@Getter
public class CustomException extends RuntimeException {

    private final ErrorCode errorCode;

    public CustomException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public CustomException(ErrorCode errorCode, String detailMessage) {
        super(detailMessage);
        this.errorCode = errorCode;
    }
}
