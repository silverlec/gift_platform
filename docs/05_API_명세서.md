# 📡 GiftPick API 명세서

**문서 버전**: v1.0  
**작성일**: 2026-06-29  
**Base URL**: `http://localhost:8080` (개발) / `https://api.giftpick.com` (운영)  
**인증 방식**: JWT Bearer Token  
**데이터 포맷**: JSON (UTF-8)

---

## 1. 공통 사양

### 1.1 공통 응답 포맷

모든 API는 아래의 표준 래퍼(Wrapper) 포맷으로 응답합니다.

**성공 응답:**
```json
{
  "success": true,
  "data": { ... }
}
```

**실패 응답:**
```json
{
  "success": false,
  "error": {
    "code": "ERR_CODE",
    "message": "에러 설명 메시지"
  }
}
```

### 1.2 HTTP 상태 코드

| 코드 | 의미 | 사용 상황 |
|------|------|----------|
| `200 OK` | 성공 | 조회, 수정, 상태 변경 성공 |
| `201 Created` | 리소스 생성 성공 | 회원가입, 이벤트/옵션 생성 |
| `400 Bad Request` | 잘못된 요청 | 유효성 검증 실패, 잘못된 파라미터 |
| `401 Unauthorized` | 인증 실패 | 토큰 없음 또는 만료 |
| `403 Forbidden` | 권한 없음 | 다른 사용자 리소스 접근 시도 |
| `404 Not Found` | 리소스 없음 | 존재하지 않는 이벤트, 옵션 |
| `409 Conflict` | 중복 충돌 | 이미 존재하는 이메일, 중복 선택 |
| `500 Internal Server Error` | 서버 오류 | 예기치 않은 서버 에러 |

### 1.3 인증 헤더

인증이 필요한 API는 요청 헤더에 아래를 포함해야 합니다:
```
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

### 1.4 에러 코드 정의

| Error Code | HTTP Status | 설명 |
|-----------|-------------|------|
| `AUTH_EMAIL_DUPLICATED` | 409 | 이미 등록된 이메일 |
| `AUTH_INVALID_CREDENTIALS` | 401 | 잘못된 로그인 정보 |
| `AUTH_TOKEN_INVALID` | 401 | 유효하지 않은 JWT |
| `AUTH_TOKEN_EXPIRED` | 401 | 만료된 JWT |
| `ACCESS_DENIED` | 403 | 접근 권한 없음 |
| `EVENT_NOT_FOUND` | 404 | 이벤트를 찾을 수 없음 |
| `EVENT_INVALID_STATUS` | 400 | 현재 상태에서 허용되지 않는 작업 |
| `OPTION_NOT_FOUND` | 404 | 선물 옵션을 찾을 수 없음 |
| `SELECTION_ALREADY_EXISTS` | 409 | 이미 선물 선택 완료 |
| `RECIPIENT_NOT_FOUND` | 404 | 수혜자 이메일을 찾을 수 없음 |
| `VALIDATION_FAILED` | 400 | 요청 바디 유효성 검증 실패 |

---

## 2. 인증 API (Authentication)

### POST /api/auth/register — 회원가입

**설명**: 새 사용자 계정을 생성합니다.  
**인증 권한**: 불필요 (PermitAll)

**Request Body:**
```json
{
  "username": "홍길동",
  "email": "gildong@example.com",
  "password": "password123!",
  "role": "GIVER"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `username` | String | ✅ | 사용자 표시명 (2~100자) |
| `email` | String | ✅ | 이메일 주소 (유효한 형식) |
| `password` | String | ✅ | 비밀번호 (8자 이상) |
| `role` | String | ✅ | `GIVER` 또는 `RECIPIENT` |

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "홍길동",
    "email": "gildong@example.com",
    "role": "GIVER",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Cases:**
```json
// 409 - 이메일 중복
{ "success": false, "error": { "code": "AUTH_EMAIL_DUPLICATED", "message": "이미 사용 중인 이메일입니다." } }
```

---

### POST /api/auth/login — 로그인

**설명**: 이메일/비밀번호로 인증하여 JWT를 발급합니다.  
**인증 권한**: 불필요 (PermitAll)

**Request Body:**
```json
{
  "email": "giver@example.com",
  "password": "password123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "김기버",
      "email": "giver@example.com",
      "role": "GIVER"
    }
  }
}
```

**Error Cases:**
```json
// 401 - 잘못된 자격증명
{ "success": false, "error": { "code": "AUTH_INVALID_CREDENTIALS", "message": "이메일 또는 비밀번호가 올바르지 않습니다." } }
```

---

### GET /api/auth/me — 내 정보 조회

**설명**: 현재 로그인된 사용자 정보를 반환합니다.  
**인증 권한**: Bearer Token 필요

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "김기버",
    "email": "giver@example.com",
    "role": "GIVER",
    "createdAt": "2026-06-01T10:00:00"
  }
}
```

---

## 3. 선물 이벤트 API (Gift Events)

### POST /api/events — 이벤트 생성

**설명**: 새 선물 이벤트를 생성합니다.  
**인증 권한**: `ROLE_GIVER`

**Request Body:**
```json
{
  "name": "민수 생일 선물",
  "description": "민수 생일을 축하해요!",
  "startDate": "2026-07-01",
  "endDate": "2026-07-10",
  "recipientEmail": "minsu@example.com",
  "inviteMessage": "생일 축하해! 원하는 선물 골라봐 🎁"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `name` | String | ✅ | 이벤트 이름 |
| `description` | String | ❌ | 이벤트 설명 |
| `startDate` | String (ISO Date) | ✅ | 시작일 (yyyy-MM-dd) |
| `endDate` | String (ISO Date) | ✅ | 종료일 (시작일 이후) |
| `recipientEmail` | String | ✅ | 수혜자 이메일 (등록된 RECIPIENT) |
| `inviteMessage` | String | ❌ | 수혜자에게 전달할 메시지 |

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 10,
    "name": "민수 생일 선물",
    "description": "민수 생일을 축하해요!",
    "startDate": "2026-07-01",
    "endDate": "2026-07-10",
    "status": "CREATED",
    "giver": { "id": 1, "username": "김기버" },
    "recipient": { "id": 2, "username": "이민수" },
    "options": [],
    "createdAt": "2026-06-29T10:00:00"
  }
}
```

---

### GET /api/events — 이벤트 목록 조회

**설명**: Giver가 생성한 모든 이벤트 목록을 반환합니다.  
**인증 권한**: `ROLE_GIVER`

**Query Parameters:**

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| `status` | String | ❌ | 전체 | 상태 필터 (CREATED/SENT/SELECTED/COMPLETED) |
| `page` | Integer | ❌ | 0 | 페이지 번호 (0부터 시작) |
| `size` | Integer | ❌ | 10 | 페이지당 항목 수 |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 10,
        "name": "민수 생일 선물",
        "status": "SENT",
        "recipient": { "id": 2, "username": "이민수" },
        "endDate": "2026-07-10",
        "createdAt": "2026-06-29T10:00:00"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "currentPage": 0
  }
}
```

---

### GET /api/events/{id} — 이벤트 상세 조회

**설명**: 특정 이벤트의 상세 정보 (선물 옵션, 선택 내역 포함)를 반환합니다.  
**인증 권한**: 해당 이벤트의 Giver 또는 지정된 Recipient

**Path Parameters:**

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `id` | Long | 이벤트 ID |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 10,
    "name": "민수 생일 선물",
    "description": "민수 생일을 축하해요!",
    "startDate": "2026-07-01",
    "endDate": "2026-07-10",
    "status": "SELECTED",
    "inviteMessage": "생일 축하해! 원하는 선물 골라봐 🎁",
    "giver": { "id": 1, "username": "김기버", "email": "giver@example.com" },
    "recipient": { "id": 2, "username": "이민수", "email": "minsu@example.com" },
    "options": [
      {
        "id": 1,
        "name": "에어팟 프로",
        "description": "애플 에어팟 프로 2세대",
        "imageUrl": "https://example.com/airpods.jpg",
        "points": 350000
      }
    ],
    "selection": {
      "id": 1,
      "selectedOptionId": 1,
      "selectedOptionName": "에어팟 프로",
      "selectionDate": "2026-07-02T14:30:00"
    },
    "createdAt": "2026-06-29T10:00:00"
  }
}
```

---

### PUT /api/events/{id} — 이벤트 수정

**설명**: 이벤트 정보를 수정합니다.  
**인증 권한**: 해당 이벤트의 Giver

**Request Body:**
```json
{
  "name": "민수 생일 선물 (수정)",
  "description": "업데이트된 설명",
  "startDate": "2026-07-01",
  "endDate": "2026-07-15"
}
```

**Response (200):** 수정된 이벤트 상세 정보 반환

---

### DELETE /api/events/{id} — 이벤트 삭제

**설명**: 이벤트와 관련 데이터를 삭제합니다.  
**인증 권한**: 해당 이벤트의 Giver

**Response (200):**
```json
{
  "success": true,
  "data": { "message": "이벤트가 삭제되었습니다." }
}
```

---

### POST /api/events/{id}/send — 수혜자 초대 발송

**설명**: 이벤트 상태를 SENT로 변경하여 수혜자 선택을 허용합니다.  
**인증 권한**: 해당 이벤트의 Giver

**조건**: 이벤트에 선물 옵션이 1개 이상 등록되어 있어야 함

**Response (200):**
```json
{
  "success": true,
  "data": {
    "eventId": 10,
    "status": "SENT",
    "inviteUrl": "http://localhost:5173/invite/10"
  }
}
```

**Error Cases:**
```json
// 400 - 선물 옵션 없음
{ "success": false, "error": { "code": "EVENT_INVALID_STATUS", "message": "선물 옵션을 1개 이상 등록해야 초대를 발송할 수 있습니다." } }
```

---

### PATCH /api/events/{id}/complete — 구매 완료 처리

**설명**: 이벤트 상태를 COMPLETED로 변경합니다.  
**인증 권한**: 해당 이벤트의 Giver

**조건**: 이벤트 상태가 SELECTED여야 함

**Response (200):**
```json
{
  "success": true,
  "data": {
    "eventId": 10,
    "status": "COMPLETED"
  }
}
```

---

### GET /api/invite/{eventId} — 초대장 정보 조회 (비인증)

**설명**: 수혜자가 초대 링크로 접속 시 이벤트 정보를 반환합니다.  
**인증 권한**: 불필요 (PermitAll)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "eventId": 10,
    "eventName": "민수 생일 선물",
    "giverName": "김기버",
    "inviteMessage": "생일 축하해! 원하는 선물 골라봐 🎁",
    "endDate": "2026-07-10",
    "status": "SENT"
  }
}
```

---

## 4. 선물 옵션 API (Gift Options)

### POST /api/events/{eventId}/options — 선물 옵션 추가

**설명**: 이벤트에 선물 후보 옵션을 추가합니다.  
**인증 권한**: 해당 이벤트의 Giver

**Request Body:**
```json
{
  "name": "에어팟 프로",
  "description": "애플 에어팟 프로 2세대 (MagSafe 충전 케이스 포함)",
  "imageUrl": "https://store.apple.com/images/airpods-pro.jpg",
  "points": 350000
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `name` | String | ✅ | 선물 상품명 |
| `description` | String | ❌ | 상품 상세 설명 |
| `imageUrl` | String (URL) | ❌ | 상품 이미지 URL |
| `points` | Integer | ✅ | 가상 포인트 값 (0 이상) |

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "eventId": 10,
    "name": "에어팟 프로",
    "description": "애플 에어팟 프로 2세대",
    "imageUrl": "https://store.apple.com/images/airpods-pro.jpg",
    "points": 350000,
    "createdAt": "2026-06-29T11:00:00"
  }
}
```

---

### DELETE /api/events/{eventId}/options/{optId} — 선물 옵션 삭제

**설명**: 등록된 선물 옵션을 삭제합니다.  
**인증 권한**: 해당 이벤트의 Giver

**조건**: Recipient가 선택 완료한 옵션은 삭제 불가

**Response (200):**
```json
{
  "success": true,
  "data": { "message": "선물 옵션이 삭제되었습니다." }
}
```

---

## 5. 선물 선택 API (Gift Selection)

### POST /api/events/{eventId}/select — 선물 선택 확정

**설명**: Recipient가 원하는 선물을 최종 선택합니다.  
**인증 권한**: 해당 이벤트의 Recipient (`ROLE_RECIPIENT`)

**Request Body:**
```json
{
  "selectedOptionId": 1
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `selectedOptionId` | Long | ✅ | 선택한 GiftOption의 ID |

**조건:**
- 이벤트 상태가 `SENT`여야 함
- 이벤트 기간(endDate) 내여야 함
- 이미 선택 기록이 없어야 함

**Response (200):**
```json
{
  "success": true,
  "data": {
    "selectionId": 1,
    "eventId": 10,
    "selectedOption": {
      "id": 1,
      "name": "에어팟 프로",
      "imageUrl": "https://store.apple.com/images/airpods-pro.jpg"
    },
    "selectionDate": "2026-07-02T14:30:00"
  }
}
```

**Error Cases:**
```json
// 409 - 이미 선택 완료
{ "success": false, "error": { "code": "SELECTION_ALREADY_EXISTS", "message": "이미 선물 선택이 완료되었습니다." } }

// 400 - 이벤트 기간 만료
{ "success": false, "error": { "code": "EVENT_INVALID_STATUS", "message": "선물 선택 기간이 종료되었습니다." } }
```

---

### GET /api/events/{eventId}/selection — 선물 선택 결과 조회

**설명**: Recipient의 최종 선물 선택 결과를 반환합니다.  
**인증 권한**: 해당 이벤트의 Giver 또는 Recipient

**Response (200):**
```json
{
  "success": true,
  "data": {
    "selectionId": 1,
    "eventId": 10,
    "recipient": { "id": 2, "username": "이민수" },
    "selectedOption": {
      "id": 1,
      "name": "에어팟 프로",
      "description": "애플 에어팟 프로 2세대",
      "imageUrl": "https://store.apple.com/images/airpods-pro.jpg",
      "points": 350000
    },
    "selectionDate": "2026-07-02T14:30:00"
  }
}
```

**Error Cases:**
```json
// 404 - 아직 선택 전
{ "success": false, "error": { "code": "SELECTION_NOT_FOUND", "message": "아직 선물 선택이 완료되지 않았습니다." } }
```

---

## 6. API 엔드포인트 전체 요약

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| `POST` | `/api/auth/register` | 회원가입 | ❌ |
| `POST` | `/api/auth/login` | 로그인 | ❌ |
| `GET` | `/api/auth/me` | 내 정보 조회 | ✅ Bearer |
| `POST` | `/api/events` | 이벤트 생성 | ✅ GIVER |
| `GET` | `/api/events` | 이벤트 목록 | ✅ GIVER |
| `GET` | `/api/events/{id}` | 이벤트 상세 | ✅ Giver or Recipient |
| `PUT` | `/api/events/{id}` | 이벤트 수정 | ✅ GIVER |
| `DELETE` | `/api/events/{id}` | 이벤트 삭제 | ✅ GIVER |
| `POST` | `/api/events/{id}/send` | 초대 발송 | ✅ GIVER |
| `PATCH` | `/api/events/{id}/complete` | 구매 완료 | ✅ GIVER |
| `GET` | `/api/invite/{eventId}` | 초대장 조회 | ❌ |
| `POST` | `/api/events/{eventId}/options` | 옵션 추가 | ✅ GIVER |
| `DELETE` | `/api/events/{eventId}/options/{optId}` | 옵션 삭제 | ✅ GIVER |
| `POST` | `/api/events/{eventId}/select` | 선물 선택 | ✅ RECIPIENT |
| `GET` | `/api/events/{eventId}/selection` | 선택 결과 조회 | ✅ Giver or Recipient |

---

## 7. Swagger UI

개발 환경에서 Swagger UI를 통해 API를 직접 테스트할 수 있습니다.

```
URL: http://localhost:8080/swagger-ui.html
```

JWT 인증 테스트:
1. `POST /api/auth/login` 으로 토큰 발급
2. 우측 상단 [Authorize] 버튼 클릭
3. `Bearer <발급된_토큰>` 입력 후 인증 완료
