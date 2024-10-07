---
title: '프록시'
subtitle: '진짜 객체와 가짜 객체, 그리고 성능'
date: '2023-07-09'
category: 'JPA'
---

<!-- 07 -->

**본 문서는 인프런에서 수강할 수 있는 [자바 ORM 표준 JPA 프로그래밍 - 기본편](https://www.inflearn.com/course/ORM-JPA-Basic)을 수강한 후, 공부한 내용을 정리한 문서입니다. 본 문서에 포함된 코드, 이미지 등의 모든 저작권은 해당 강의의 저자이신 [김영한](https://inflearn.com/users/@yh) 강사님께 있습니다.**

## 조회를 했는데 쿼리가 하나 더

우리는 JPA를 통해 연관관계와 상속관계 같은 객체만의 구조를 데이터베이스의 테이블로도 표현할 수 있게 되었습니다. JPA 덕분에 객체와 데이터베이스가 정말 가까워졌지만, 여전히 고민거리가 하나 있습니다. 만약, 어떤 한 객체를 통해 테이블을 조회할 때, 그와 연관된 다른 객체의 테이블도 함께 조회해야 할까요?

<img width="1111" alt="스크린샷 2023-07-13 오전 1 17 58" src="https://github.com/hangillee/coderoad.kr/assets/14046092/75311934-a3b9-4d80-88ea-28d9ec1f8302">

<div align="center"><I>Member를 조회할 때, Team까지 함께 조회할 필요가 있을까?</I></div>
<br>

예를 들어, `Member` 엔티티에는 외래 키와 매핑된 `Team`이라는 참조 필드가 있습니다. 이는 곧, `Member` 테이블이 `Team` 테이블과 연관되어 있다는 뜻입니다. 따라서, `Member` 엔티티를 통해 테이블을 조회할 때, `Team` 테이블도 함께 조회해서 `Member`의 `Team`에 대한 여러 데이터를 가져올 수도 있고, `Member` 자체의 데이터만 필요해서 가져오지 않을 수도 있습니다.

```java
// 회원의 이름만 필요한 로직에서도 굳이 Team 테이블을 조회해야 할까?
public void printUser(String memberId) {
    Member member = em.find(Member.class, memberId);
    Team team = member.getTeam();
    System.out.println("회원 이름 : " + member.getUsername());
}
```

데이터베이스에 조회 쿼리가 하나 더 날아가는 것은 그렇지 않은 경우보다 당연히 성능 측면에서 손해가 발생할 수 밖에 없습니다. 간단한 예제 코드의 경우에는 성능 저하가 크게 체감될 정도는 아니지만, 이렇게 부수적인 쿼리가 발생하는 문제는 **N+1 문제**라고 하는 JPA를 통한 개발에서 꼭 피해야하는 중대한 성능 저하 문제입니다.

즉, 엔티티를 조회할 때, 그와 연관된 엔티티를 모두 조회하는 것은 N+1 문제를 야기하기 때문에 결코 좋은 방법이 아닙니다. 프로그래머는 결국 문제를 해결하는 사람이고, 서비스의 성능을 저하시키는 N+1 문제를 해결해야만 합니다. 놀랍게도 이런 문제들을 해결하는 방법은 간단합니다. 연관된 DB 테이블의 조회를 **뒤로 미루면 간단하게 해결**됩니다.

뒤로 미루는 방법을 공부하기 위해선 먼저, **프록시**를 알아야 합니다. 뒤로 미루는 방법에 대한 자세한 설명은 [지연 로딩과 즉시 로딩](https://blog.coderoad.kr/loading)에 정리해뒀습니다.

## 프록시란?

**프록시**(Proxy)는 우리가 직접 다루는 실제 엔티티 클래스를 상속 받아서 생성되는 일종의 "**가짜 객체**"입니다. JPA의 구현체인 Hibernate의 내부 라이브러리가 자동으로 생성하며, 실제 엔티티 클래스를 상속받아서 만들어지기 때문에 당연하게도 실제 엔티티 클래스와 겉 모양이 같습니다. 이론상, 해당 엔티티를 사용하는 입장에서는 사용하는 객체가 진짜 객체인지 프록시 객체인지는 구분하지 않고 사용하면 됩니다.

프록시 객체는 실제 객체를 대신해서 호출됩니다. 이런 특징 덕분에 **DB 테이블 조회를 뒤로 미룰 수 있는 것**입니다. 그렇다면 프록시는 어떻게 실제 객체를 대체할 수 있는 것일까요? 바로, **프록시 객체가 실제 객체의 참조를 보관**하고 있기 때문입니다.

프록시 객체는 [프록시 초기화](#프록시-초기화) 과정에서 실제 객체를 가리키는 참조를 가지게되고 이를 통해 실제 객체의 필드나 메소드를 호출합니다. 이 과정을 **위임(Delegate)**이라고 하며, 프록시 객체는 자신이 가리키는 객체의 구성 요소들을 호출할 때만 해당 객체의 DB 테이블을 조회하거나 메소드 바디 내용을 읽어옵니다.

객체지향 프로그래밍의 특징 중 하나인 "**객체는 객체 그래프를 자유롭게 탐색할 수 있어야 한다.**"를 생각해보면, 하나의 엔티티를 조회할 때, 이와 연관된 엔티티를 모두 함께 조회해 객체 그래프를 생성해야 한다는 것을 알 수 있습니다. 그런데, 실제 엔티티들로 이루어진 객체 그래프를 생성하려면 엔티티들의 DB 테이블을 모두 조회해야합니다. 이렇게 되면 위에서 설명한 **N+1 문제**가 발생하는 것입니다.

> 객체 그래프를 완성하기 위해 연관관계를 가지는 모든 엔티티를 조회하면 **1개의 DB 테이블 조회 쿼리에 부가적인 N개의 조회 쿼리가 발생**합니다. 즉, N+1 문제입니다.

그래서 프록시 객체를 실제 엔티티 객체 대신 객체 그래프에 넣어두어 마치 객체 그래프가 완성된 것처럼 생각하는 것입니다. **즉, 객체 그래프에서 실제 값이나 메소드를 알고 있는 것은 처음 조회한 엔티티 뿐이며, 나머지는 모두 프록시로 대체**해서 1개의 엔티티 조회 시에 부가적인 쿼리가 DB로 날아가지 않게 해 N+1 문제를 해결하는 것입니다.

> 프록시로 객체 그래프가 대신 완성되었으니 어떤 한 엔티티를 조회할 때, 당장 데이터가 필요하지 않습니다. 즉, DB 테이블을 조회할 필요도 없는 것입니다.

## 프록시 초기화

## 프록시의 여러 특징들

## 프록시 확인법

## 프록시의 진가