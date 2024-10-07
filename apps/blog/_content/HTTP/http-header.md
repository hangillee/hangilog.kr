---
title: 'HTTP 헤더'
subtitle: 'HTTP의 필수 정보들이 담기는 곳'
date: 2023-01-18 16:10:00
category: 'HTTP'
---

**본 문서는 인프런에서 수강할 수 있는 [모든 개발자를 위한 HTTP 웹 기본 지식](https://www.inflearn.com/course/http-웹-네트워크)을 수강한 후, 공부한 내용을 정리한 문서입니다. 본 문서의 모든 저작권은 해당 강의의 저자이신 [김영한](https://inflearn.com/users/@yh) 우아한형제들 기술이사님께 있습니다.**

## HTTP 헤더

header-field = field-name":" OWS field-value OWS (OWS : 띄어쓰기 허용)
field-name은 대소문자 구분 없음. (ex. Host: www.google.com )
HTTP 전송에 필요한 모든 부가 정보. 표준 헤더가 너무 많다... 필요할 땐 임의 헤더 추가 가능.

HTTP Body
RFC723X 시리즈에 와서 엔티티는 표현(Representation). Representation = representation metadata + representation data. 즉, 표현 = 표현 메타데이터 + 표현 데이터.

메시지 본문을 통해 표현 데이터 전달. 메시지 본문 = 페이로드(payload). 표현은 요청이나 응답에서 전달할 실제 데이터. 표현 헤더는 표현 데이터를 해석할 수 있는 정보 제공.

## 표현

Content-Type : 표현 데이터의 형식
Content-Encoding : 표현 데이터의 압축 방식
Content-Language : 표현 데이터의 자연 언어
Content-Length : 표현 데이터의 길이

표현 헤더는 전송, 응답 둘다 사용

## 협상(콘텐츠 네고시에이션)

Accept : 클라이언트가 선호하는 미디어 타입 전달
Accept-Charset : 클라이언트가 선호하는 문자 인코딩
Accept-Encoding : 클라이언트가 선호하는 압축 인코딩
Accept-Language : 클라이언트가 선호하는 자연 언어

협상 헤더는 요청 시에만 사용

협상과 우선순위
0 ~ 1 클수록 높은 우선순위, 생략하면 1, 구체적인 것이 우선한다. 구체적인 것을 기준으로 미디어 타입을 맞춘다.

## 전송 방식

단순 전송(Content-Length), 압축 전송(Content-Encoding), 분할 전송(Transfer-Encoding), 범위 전송(Range, Content-Range)

## 일반 정보

From : 유저 에이전트의 이메일 정보
Referer : 이전 웹 페이지 주소
User-Agent : 유저 에이전트 애플리케이션 정보
Server : 요청을 처리하는 오리진 서버의 소프트웨어 정보
Date : 메시지가 생성된 날짜

## 특별한 정보

Host : 요청한 호스트 정보 (도메인)
Location : 페이지 리다이렉션
Allow : 허용 가능한 HTTP 메소드
Retry-After : 유저 에이전트가 다음 요청을 하기까지 기다려야 하는 시간

## 인증

Authorization : 클라이언트 인증 정보를 서버에 전달
WWW-Authenticate : 리소스 접근시 필요한 인증 방법 정의

## 쿠키

Set-Cookie : 서버에서 클라이언트로 쿠키 전달(응답)
Cookie : 클라이언트가 서버에서 받은 쿠키를 저장하고, HTTP 요청 시 서버로 전달

생명주기 Expires, max-age
도메인 명시: 명시한 문서 기준 도메인 + 서브 도메인 포함. 생략: 현재 문서 기준 도메인만 적용
경로 : 이 경로를 포함한 하위 경로 페이지만 쿠키 접근
보안 : Secure(https에서만 전송), HttpOnly(자바스크립트의 쿠키 접근 불가.) SameSite(요청 도메인과 쿠키에 설정된 도메인이 같은 경우에만 쿠키 전송)
