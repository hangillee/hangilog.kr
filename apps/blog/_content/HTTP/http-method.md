---
title: 'HTTP 메소드'
subtitle: 'HTTP는 어떻게 동작할까?'
date: 2023-01-18 16:06:00
category: 'HTTP'
---

**본 문서는 인프런에서 수강할 수 있는 [모든 개발자를 위한 HTTP 웹 기본 지식](https://www.inflearn.com/course/http-웹-네트워크)을 수강한 후, 공부한 내용을 정리한 문서입니다. 본 문서의 모든 저작권은 해당 강의의 저자이신 [김영한](https://inflearn.com/users/@yh) 우아한형제들 기술이사님께 있습니다.**

## HTTP API 만들기

URI는 리소스만 고려해야한다. 행동(등록, 조회, 수정, 삭제)는 URI에 포함시키지 않는다.

## GET

리소스 조회

## POST

클라이언트에서 서버로 데이터를 전송해 서버가 처리하도록 전달하는 메소드. 메시지 바디를 통해 전달하며 주로 전달된 데이터로 신규 리소스 등록, 프로세스 처리 등에 사용한다.

## PUT

리소스 데이터 등록. 기존 데이터가 있다면 완전히 지우고 요청한 데이터 등록. (덮어쓰기)

## PATCH

리소스 데이터 수정. 기존 데이터를 수정한다.

## DELETE

리소스 데이터 삭제.

## HTTP 메소드의 속성들

안전, 멱등, 캐시 가능

## 클라이언트에서 서버로

크게 두가지 방식. 쿼리 파라미터를 통한 전송 (GET, 주로 정렬 필터(검색어)), 메시지 바디를 통한 데이터 전송 (POST, PUT, PATCH 회원 가입, 상품 주문, 리소스 등록, 리소스 변경). 4가지 상황 (정적 데이터 조회(GET, 리소스 경로), 동적 데이터 조회(GET, 쿼리 파라미터), HTML Form (GET(조회)/POST(저장), multipart/form-data), HTTP API (Server to server, App, Web, POST/PUT/PATCH, GET, Content-Type:application/json))

## HTTP API 설계 예시

HTTP API - 컬렉션 (POST 기반 리소스 등록) : 서버가 리소스의 URI를 관리 POST /members -> 서버가 /members/{id} 생성 후 저장
HTTP API - 스토어 (PUT 기반 리소스 등록) : 클라이언트가 리소스의 URI를 관리 PUT /filse/{filename} -> 서버는 저장
HTML FORM 사용 (GET/POST) : DELETE 같은 HTTP 메소드 사용 불가, 컨트롤러(컨트롤 URI, 동사 형태의 API)를 사용해야함. POST /members/{id}/delete
