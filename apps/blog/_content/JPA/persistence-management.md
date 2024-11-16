---
title: '영속성 관리'
subtitle: '객체를 관계형 DB에 저장하는 기법'
date: '2023-07-04'
category: 'JPA'
---

<!-- 02 -->

## 영속성

JPA에서 가장 중요한 두 가지를 꼽자면 객체와 관계형 데이터베이스를 매핑하는 **Object Relational Mapping**(ORM), 그리고 **영속성 컨텍스트**(Persistence Context)입니다. JPA가 Java 진영의 ORM 기술이기 때문에 ORM이 중요한 것은 당연하겠지만, 영속성 컨텍스트는 도대체 무엇이길래 중요하다고 하는 것일까요? 우선, 영속성 컨텍스트가 무엇인지 알기 위해서는 **영속성**(Persistence)이라는 개념을 알아야 합니다.

위키백과에서 찾은 [영속성](<https://en.wikipedia.org/wiki/Persistence_(computer_science)>)에 대한 문서의 내용과 해당 문서의 참고문헌에 따르면 제가 이해한 영속성의 정의는 다음과 같습니다.

> 어떤 객체나 상태가 그것을 생성한 프로그램(프로세스)의 종료 후에도 생존(오래 지속)하는 것. 쉽게 말해서, 데이터를 저장소에 영구히 저장하는 것을 의미함.

즉, 우리가 다루는 JPA에서 영속성은 **데이터베이스에 Java 객체를 영구히 저장하는 것, 영속 상태로 만드는 것**을 의미합니다.

## EntityManager와 영속성 컨텍스트

그렇다면 영속성 컨텍스트는 무엇일까요? JPA의 영속성 컨텍스트는 이름에서부터 알 수 있듯, **Java 객체들을 영구 저장하는 환경**, 또는 **영속 상태가 된 객체를 관리하는 환경**이라고 생각하면 됩니다.

> 다만, 한가지 오해하면 안되는 것은 **영속성 컨텍스트는 논리적인 개념이지, 물리적 실체가 있는 저장소 같은 것이 아닙니다**. DB처럼 개발자가 내부를 직접 확인하며 작업하는 것은 불가능합니다.

Server가 Entity를 생성하고 저장(영속화)하면 **영속성 컨텍스트에 먼저 보관**되고, DB에 저장된 Entity를 조회해도 일단 **영속성 컨텍스트를 확인하게**됩니다. 다시 말해서 JPA를 사용하면, Server와 DB 사이의 대부분의 작업은 영속성 컨텍스트를 거쳐야 합니다!

> Entity는 '개체'라는 뜻을 가진 영단어로, 데이터베이스 엔티티라고 불리기도 합니다. [Oracle](https://docs.oracle.com/html/E79061_01/Content/Data%20model/Define_an_entity.htm)에 따르면 Entity는 '공통된 규칙이나 데이터를 가진 항목을 그룹화한 것'입니다. 쉽게 설명하자면 DB 테이블을 모델링하는 객체라고 봐도 무방합니다.

그럼, 눈에 보이지 않는 논리적인 개념이머, 개발자가 내부를 확인할 수도 없는 영속성 컨텍스트는 어떻게 접근하고 활용할까요? JPA를 사용하면 영속성 컨텍스트를 거쳐야 한다는데 방법이 있어야 하지 않을까요? 당연하게도 JPA는 영속성 컨텍스트를 다루는 객체를 제공합니다.

바로, `EntityManager`입니다. `EntityManager`는 `EntityManagerFactory`를 통해 생성되며, 영속성 컨텍스트와 1:1 혹은 N:1의 관계를 가질 수 있습니다. Spring Framework에서는 여러 `EntityManager`가 하나의 영속성 컨텍스트를 공유하는 N:1 관계를 가집니다.

<img width="542" alt="entitymanager" src="https://github.com/hangillee/coderoad.kr/assets/14046092/bf565160-42ff-41f0-bdd6-3df485414689">

<div align="center"><I>EntityManagerFactory에서 사용자 요청에 따라 생성되는 EntityManager들</I></div>
<br>

`EntityManagerFactory`를 생성하는 비용은 상당히 큽니다. 반면에, `EntityManager`를 생성하는 비용은 거의 없다시피 합니다. 이런 이유로 `EntityManagerFactory`는 하나만 만들어서 애플리케이션 전체가 공유하도록 설계되어 있습니다.

즉, `EntityManagerFactory`는 여러 스레드가 동시에 접근해도 안전합니다. 그러나 `EntityManager`는 여러 스레드가 동시에 접근하면 **동시성 문제**가 발생하므로 절대 스레드 간 공유가 일어나서는 안됩니다!

<img width="758" alt="emrelation" src="https://github.com/hangillee/coderoad.kr/assets/14046092/b773900d-ebd5-4985-97de-04ceb4c69949">

<div align="center"><I>EntityManager와 영속성 컨텍스트의 관계</I></div>
<br>

영속성 컨텍스트가 무엇이고, `EntityManager`를 통해 접근할 수 있다는 것도 알아봤습니다. 여기까지 공부하면서 들었던 생각은, '**영속성 컨텍스트가 꼭 있어야 하는 이유가 있는가?**'였습니다. 객체를 테이블로 매핑만 잘 해주면 되지 왜 Entity를 보관하고 관리하는 부가적인 계층이 필요했을까라는 생각이 들던 차에 영속성 컨텍스트의 장점을 공부하고 그 생각이 완전히 바뀌었습니다.

## Entity의 생명주기

영속성 컨텍스트의 장점들을 살펴보기 전에, 정말 중요한 개념인 Entity의 생명주기에 대해서 먼저 알아보겠습니다. 여느 객체들과 마찬가지로 Entity 역시 생명주기가 있습니다. JPA에서의 Entity 생명주기는 다음과 같습니다.

<img width="740" alt="entitylifecycle" src="https://github.com/hangillee/coderoad.kr/assets/14046092/c5f40fdf-a9bc-4c90-aad3-9e8b4d2562aa">

<div align="center"><I>Entity의 생명주기</I></div>
<br>

생명주기에는 New, Managed, Detached, Removed의 총 4가지 상태가 있습니다. 각각 한국어로 **비영속, 영속, 준영속, 삭제**입니다. 생명주기의 상태들을 하나씩 자세하게 알아보겠습니다.

### 비영속 (New / Transient)

가장 처음 만나게되는 Entity의 상태는 **비영속**(New)입니다. 객체를 단순히 생성만 한 상태로, DB나 영속성 컨텍스트와는 어떤 관련도 없는 순수한 Java 객체일 때를 말합니다.

```java
// 비영속 (New)
// 객체를 생성한 상태로 DB 관련 작업은 어떤 것도 하지 않았음.
Member member = new Member();
member.setId("member1");
member.setUsername("회원1");
```

### 영속 (Managed)

비영속 상태에서 `EntityManager`를 통해 **영속성 컨텍스트에 Entity(객체)를 저장**하면 Entity는 **영속 상태**가 됩니다. 객체를 영속성 컨텍스트에 저장할 때는 `EntityManager`의 `persist()` 메소드를 사용합니다.

```java
// em은 EntityManager 인스턴스
em.persist(member); // 객체를 저장한 상태, 영속화.
```

### 준영속 (Detached)

영속 상태인 Entity를 `detach()` 메소드를 통해 영속성 컨텍스트로부터 분리하면 **준영속** 상태가 됩니다. 준영속 상태가 된 Entity는 더 이상 영속성 컨텍스트에 존재하지도 않고 `EntityManager`가 관리하지도 않습니다.

```java
em.detach(member); // 영속성 컨텍스트로부터 member 분리
```

영속성 컨텍스트에 있는 Entity들이 준영속 상태가 되는 경우가 2가지 더 있습니다. `clear()`를 통해 영속성 컨텍스트를 완전히 비우거나, `close()`를 통해 `EntityManager` 자체를 종료해 영속성 컨텍스트를 제거하는 경우입니다.

```java
em.clear(); // 영속성 컨텍스트를 완전히 초기화
em.close(); // 영속성 컨텍스트 종료
```

위의 두 메소드를 사용하면 영속성 컨텍스트에 있던 영속 상태 Entity들은 모두 자동으로 준영속 상태가 됩니다. 준영속 상태는 당연히 **영속성 컨텍스트로부터 분리된 상태이기 때문에 영속성 컨텍스트가 제공하는 기능을 사용하지 못합니다.** (영속성 컨텍스트의 여러 기능은 아래에서 설명합니다.)

### 삭제 (Remove)

마지막은 `remove()` 메소드를 통해 영속성 컨텍스트와 DB에서 Entity를 제거한 상태인 **삭제**입니다.

```java
em.remove(member);
```

Entity는 위의 4개 상태를 가지며 `EntityManager`의 여러 메소드를 통해 상태가 변경됩니다.

## 영속성 컨텍스트를 사용해야 하는 이유

드디어, Entity와 `EntityManager`, 영속성 컨텍스트의 여러 특징을 끝으로 영속성 컨텍스트를 왜 사용해야 하는지 그 이유를 설명하고자 합니다. 영속성 컨텍스트의 여러 기능을 살펴보기에 앞서, 영속성 컨텍스트가 자신이 관리하는 영속 상태 Entity를 어떻게 다루는지 알아보겠습니다.

영속성 컨텍스트는 기본적으로 `@Id` 어노테이션으로 지정한 **식별자**를 통해 Entity를 구분합니다. 따라서, 영속 상태로 만들 객체(Entity)는 식별자 값을 지정해주지 없으면 에러가 발생합니다. 그럼, 영속성 컨텍스트는 왜 식별자를 사용해서 Entity를 구분하는 걸까요?

> 사실 Entity를 식별자로 구분하는 것은 당연한 일입니다. DB는 고유한 Primary Key(기본키)를 통해 각 튜플을 구분합니다. 즉, 객체를 DB의 테이블과 매핑하는 기술인 JPA는 DB의 PK와 매핑될 값을 객체가 갖도록 강제해야 합니다. 이때, PK와 매핑되는 값이 바로 `@Id`를 통해 지정한 **식별자**인 것입니다.

바로, 아래서 설명할 **1차 캐시**가 `Map` 자료구조와 같이 영속 상태가 된 Entity를 **Key-Value** 형태로 저장하기 때문입니다. 1차 캐시는 영속성 컨텍스트의 알파이자 오메가라 할 수 있는데, 1차 캐시의 존재 덕분에 우리가 아래의 여러 장점들을 누릴 수 있습니다. 만약, 1차 캐시라는 개념 자체가 없었다면 JPA를 사용할 이유가 없었을지도 모릅니다.

### 1차 캐시

영속성 컨텍스트가 Entity를 구분하기 위해 식별자를 사용하고, 1차 캐시가 Entity를 다루는 방식 때문에 꼭 식별자가 필요하다는 것도 알았습니다. 이제 1차 캐시가 정확히 무슨 역할을 담당하는지 알아보겠습니다.

작성 중.
