---
title: '캐시와 조건부 요청 헤더'
subtitle: 'HTTP 캐시와 조건부 요청 헤더란?'
date: 2023-01-18 16:12:00
category: 'HTTP'
---

**본 문서는 인프런에서 수강할 수 있는 [모든 개발자를 위한 HTTP 웹 기본 지식](https://www.inflearn.com/course/http-웹-네트워크)을 수강한 후, 공부한 내용을 정리한 문서입니다. 본 문서의 모든 저작권은 해당 강의의 저자이신 [김영한](https://inflearn.com/users/@yh) 우아한형제들 기술이사님께 있습니다.**

## 캐시란?

캐시가 없다면... 같은 리소스를 매번 다운로드. 인터넷 네트워크는 매우 느리고 비싸다. 브라우저 속도도 당연히 느려지고, 사용자도 느린 속도에 불편함을 경험한다.
"cache-control: max-age=시간(초)" 헤더를 통해 캐시를 적용할 수 있다. 처음 요청을 제외하곤 항상 브라우저 캐시 저장소를 먼저 방문해서 캐시 유무를 확인한다.
그러나 max-age 속성에 정해둔 시간이 지나면 캐시는 자동으로 삭제된다.(캐시 시간 초과) 그러면 서버에서 다시 다운로드 해야한다. 이를 해결하기 위해 검증 헤더와 조건부 요청을 사용한다.

## 검증 헤더와 조건부 요청

검증 헤더 "Last-Modified: (날짜)"를 추가해 데이터가 마지막으로 수정된 시간을 기준으로 시간 초과된 캐시 데이터와 서버의 데이터가 아직 일치하다면 기존 캐시 데이터 계속 이용 가능. (서버는 304 Not Modified 상태 코드를 보내 캐시를 재사용해도 좋다고 알린다. Not Modified는 HTTP Body가 없다. 데이터를 바꿀 필요도 없고 용량을 절약해야하기 때문.)

검증 헤더
캐시 데이터와 서버 데이터가 같은지 검증하는 데이터
Last-Modified, ETag

조건부 요청 헤더
검증 헤더로 조건에 따른 분기
If-Modified-Since: Last-Modified 사용
If-None-Match: ETag 사용
조건이 만족하면 200 OK
조건이 만족하지 않으면 304 Not Modified

Last-Modified, If-Modified-Since 단점
1초 미만의 캐시 조정 불가. 날짜 기반의 로직 사용해야함. 데이터를 수정해서 날짜는 다른데 정작 데이터 내용은 같으면 캐시 유지 불가. 서버에서 별도의 캐시 로직을 다루지 못함.

ETag(Entitiy Tag)
캐시용 데이터에 임의의 고유한 버전 이름을 달아둠.
데이터가 변경되면 이 이름을 바꿈. ETag가 같으면 캐시 유지, 다르면 갱신.
캐시 제어 로직을 서버에서 완전히 관리. (ETag 부여를 서버에서 한다.)

## 캐시와 조건부 요청 헤더

캐시 제어 헤더
Cache-Control : 캐시 제어
Pragma : 캐시 제어(하위 호환, HTTP 구 버전을 위함)
Expires : 캐시 유효 기간(하위 호환, HTTP 구 버전을 위함)

Cache-Control: max-age : 유효 시간
Cache-Control: no-cache : 데이터는 캐시 가능. 그러나 항상 원 서버에 검증 요청.
Cache-Control: no-store : 데이터에 민감한 정보 있음. 캐시 불가.

검증 헤더
ETag
Last-Modified

조건부 요청 헤더
If-Match, If-None-Match : ETag 사용
If-Modified-Since, If-Unmodified-Since : Last-Modified 사용

## 프록시 캐시

서버와 서버 사이의 거리는 매우 멀다. 한국의 클라이언트와 미국의 서버(오리진 서버)가 직통으로 통신하면 응답이 느리게 도착한다. 그래서 보통 통신 중간에 캐시 데이터를 저장해두는 프록시 캐시 서버를 두어 응답 속도를 높인다. 이때 클라이언트에 있는 캐시를 private 캐시, 프록시 캐시 서버에 있는 캐시를 public 캐시라고 한다.

Cache-Control: public (프록시 캐시 서버에 저장해도 무방함.)
Cache-Control: private (해당 응답이 사용자만을 위한 것. 프록시 캐시 서버에 저장 불가.)
Cache-Control: s-maxage (프록시 캐시에만 적용되는 max-age)
Age: 60 (오리진 서버의 응답 후 프록시 캐시 내에 머문 시간)

## 캐시 무효화

Cache-Control: no-cache, no-store, must-revalidate (원 서버에 데이터 검증을 항상 받고, 캐시로 저장하지 않으며, 원 서버에 검증받아야 하고 만일 서버 접근 실패 시 504 Gateway Timeout이 발생해야함.)
Pragma: no-cache (HTTP/1.0 하위 호환)

no-cache는 만일 원 서버에 접근이 불가하면 오류대신 기존의 데이터를 사용하는 편이 낫다고 판단하고. 시간이 초과된 캐시 데이터를 계속 사용하게 하지만. must-validate는 504 Gateway Timeout 상태 코드를 반환해 캐시를 삭제시킨다.
