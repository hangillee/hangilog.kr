---
title: '다양한 연관관계 매핑'
subtitle: '연관관계 매핑의 종류와 방향'
date: '2023-07-07'
category: 'JPA'
---

<!-- 05 -->

## 연관관계 매핑 시 고려해야할 사항

JPA에서 연관관계를 매핑할 때, 고려할 사항은 3가지가 있습니다.

1. 다중성
2. 방향성
3. 연관관계의 주인

이 중, 방향성과 연관관계의 주인에 대해서는 [연관관계 매핑이란?](https://blog.coderoad.kr/relational-mapping-basic)에서 **연관관계 매핑에는 단방향과 양방향 연관관계 매핑**이 있으며, 양방향 연관관계에서는 **연관관계의 주인은 외래 키가 있는 곳으로 정해야 한다**는 것을 알게 됐습니다. 고려해야하는 3가지 요소들 중 2가지는 이미 잘 알고 있으니 남은 하나인 다중성에 대해 공부하려고 합니다.

다중성 모델에는 총 4가지의 모델이 있습니다. 그리고 각 모델은 어노테이션을 통해 설정할 수 있습니다.

- 다대일(N:1) - `@ManyToOne`
- 일대다(1:N) - `@OneToMany`
- 일대일(1:1) - `@OneToOne`
- 다대다(N:M) - `@ManyToMany`

## 다대일 (N:1)

첫 번째 다중성은 가장 많이 사용되는 **다대일**(N:1)이며, N쪽에 외래 키(연관관계의 주인)가 있어야 합니다. 다대일의 반대는 일대다(1:N)입니다. 자세하게는 방향성까지 포함한 **다대일 단방향**과 **다대일 양방향** 연관관계 매핑이 있습니다. 먼저, 다대일 단방향에 대해 알아보겠습니다.

<img width="921" alt="monon1" src="https://github.com/GDSC-SKHU/moida-backend/assets/14046092/49d0d991-db67-48b1-86f7-ea2d1eab4320">

<div align="center"><I>다대일 단방향 연관관계 매핑</I></div>
<br>

다대일 단방향 연관관계는 엔티티의 참조 필드에 `@ManyToOne` 어노테이션을 이용해 설정할 수 있습니다. 또한, `@JoinColumn`을 이용해 테이블에 있는 외래키와 연관관계 매핑을 하면 비로소 다대일 단방향 연관관계 매핑이 완료됩니다.

```java
@Entity
public class Member {
    @Id @GeneratedValue
    private Long id;

    @Column(name = "USERNAME")
    private String name;

    @ManyToOne // 다대일 연관관계 매핑
    @JoinColumn(name = "TEAM_ID") // Member 테이블의 외래 키인 TEAM_ID 컬럼과 매핑
    private Team team; // 참조 필드
}
```

반대편 엔티티인 `Team`에서는 양방향 연관관계가 아니기 때문에 별도로 설정할 것은 없습니다.

```java
@Entity
public class Team {
    @Id @GeneratedValue
    private Long id;
    private String name;
}
```

이때, `Team` 엔티티 코드에 연관관계의 주인인 '다'쪽, 그러니까 `Member` 엔티티 쪽을 향한 참조 필드(보통 List)를 만들고 `@OneToMany` 어노테이션과 `mappedBy` 속성에 자신을 가리키고 있는 `Member` 엔티티의 `team` 필드를 적어주면 **다대일 양방향 연관관계 매핑**이 됩니다.

```java
@Entity
public class Team {
    @Id @GeneratedValue
    private Long id;
    private String name;

    @OneToMany(mappedBy = "team") // 양방향 연관관계
    private List<Member> members = new ArrayList<>();
}
```

[연관관계 매핑이란?](https://blog.coderoad.kr/relational-mapping-basic) 포스트에서도 정리했지만 양방향 연관관계 매핑에서 연관관계의 주인이 아닌 엔티티는 데이터베이스 테이블에 아무런 영향을 주지 못합니다.

즉, 주인이 아닌 엔티티의 주인을 향한 참조 필드는 단순하게 Java 코드에서 역방향 조회를 편하게 하기 위해 만드는 조회용 필드일 뿐입니다. 조회용 필드를 수정해도 해당 데이터는 데이터베이스에 저장되지 않기 때문에 꼭 주의해야합니다.

## 일대다 (1:N)

다음은 다대일의 반대인 **일대다**(1:N) 다중성입니다. 이 다중성은 실무에서는 거의 사용하지 않는다고 합니다. 그 이유는 일대다 다중성을 통해 연관관계 매핑을 하면 객체와 테이블 사이의 차이를 줄이지 못하고 오히려 혼란을 일으킬 수 있기 때문입니다.

일대다 다중성에서는 연관관계의 주인이 '일'쪽이 되는데, 지금까지 작성한 예제 코드로는 `Team` 엔티티가 연관관계의 주인이 되는 것입니다. 문제는, 데이터베이스에서는 외래 키를 가지고 있는 테이블이 `Team`이 아니라 `Member`라는 것입니다.

<img width="935" alt="onetomany_diagram" src="https://github.com/GDSC-SKHU/moida-backend/assets/14046092/a5eecee8-73d7-4d33-86e1-2c3e432825ac">

<div align="center"><I>연관관계의 주인 엔티티와 외래 키가 있는 테이블이 서로 다르다</I></div>
<br>

연관관계의 주인은 외래 키를 관리해야 되는데, 외래 키가 반대편 테이블에 있기 때문에 연관관계 관리를 위해 추가적인 `UPDATE` 쿼리가 발생합니다. `Team` 엔티티를 추가로 생성하거나 수정하면 어쩔 수 없이 `Member` 테이블도 수정이 필요한 것입니다.

테이블의 수가 적으면 큰 문제가 없을 수도 있지만, 규모가 큰 데이터베이스, 여러 테이블이 서로 맞물려 있는 상황에서는 예기치 못한 오류가 발생할 가능성이 높습니다. 그러나, 객체 입장에서는 충분히 `Team`만 `Member`를 참조할 수 있도록 설계할 수도 있기 때문에, JPA가 공식적으로 해당 다중성 모델을 지원하는 것입니다.

따라서, 우리는 객체지향 관점에서 조금 손해 보더라도 다대일 단방향 연관관계를 기준으로 매핑을 설계하고 필요한 경우에만 다대일 양방향 연관관계를 추가하는 방식으로 역방향 조회 기능을 추가하는 것이 좋습니다.

그래도 일대다 역시 JPA가 공식 지원하는 모델이기 때문에 방법을 알아보겠습니다. 일대다 단방향 연관관계 매핑은 다음과 같이 설정할 수 있습니다.

```java
@Entity
public class Team {
    @Id @GeneratedValue
    private Long id;
    private String name;

    @OneToMany // 일대다 연관관계 매핑
    @JoinColumn(name = "TEAM_ID") // 외래 키와 연관관계의 주인 매핑
    private List<Member> members = new ArrayList<>();
}
```

이미 눈치채신 분들도 계시겠지만 연관관계의 주인 쪽에 작성하게 되는 다중성 모델 어노테이션(여기서는 `@OneToMany`)에는 `mappedBy` 속성을 작성하지 않습니다. `mappedBy`가 연관관계의 주인의 반대편에서 주인 쪽을 가리키는 속성인 것을 생각하면 당연한 일입니다.

`mappedBy`에 한가지 숨겨진 비밀이 더 있습니다. 바로, `@ManyToOne`에는 `mappedBy` 속성이 존재하지 않는다는 것입니다. 즉, `@ManyToOne`은 `mappedBy` 속성 자체를 지원하지 않으며, 이는 곧, **`@ManyToOne`이 연관관계의 주인에서만 사용된다**는 것을 말합니다.

<img width="840" alt="ManyToOne" src="https://github.com/GDSC-SKHU/moida-backend/assets/14046092/2342b297-e753-451e-b9db-028c7d6fbf80">
<div align="center"><I>@ManyToOne 어노테이션</I></div>
<br>

<img width="840" alt="OneToMany" src="https://github.com/GDSC-SKHU/moida-backend/assets/14046092/51142e30-a374-4a73-a55a-ca26487ace35">

<div align="center"><I>@OneToMany 어노테이션</I></div>
<br>

두 어노테이션의 공식 문서를 확인해보면 실제로 `@ManyToOne`에는 `@OneToMany`에는 있는 `mappedBy` 속성이 없다는 것을 확인할 수 있습니다.

> **연관관계의 주인은 외래 키와 매핑된다**는 것을 생각하면 `@ManyToOne`에 `mappedBy` 속성이 없는 것과 실무에서 자주 사용되는 것이 어쩌면 당연한 결과인 것 같습니다. 데이터베이스 테이블은 '다'쪽에 항상 외래 키가 있고, 해당 테이블과 매핑한 엔티티 쪽이 연관관계의 주인이 되는 것이 가장 자연스럽고 이해하기 쉬운 설계이니 `@ManyToOne`을 기본으로 설계하는 것이라고 생각합니다.

추가로 일대다 연관관계 매핑 시, `@JoinColumn`을 꼭 같이 작성해줘야 합니다. 만약, `@JoinColumn`을 사용하지 않으면 외래 키가 있는 테이블과 그 반대 테이블 간의 중간 테이블이 생성됩니다.

일대다 양방향 연관관계 매핑도 가능은 하지만 공식적으로 존재하는 매핑 모델도 아니며, 연관관계의 주인 반대편에 있는 참조 필드를 읽기 전용을 바꾸는 추가 작업이 필요합니다.

```java
@Entity
public class Member {
    @Id @GeneratedValue
    private Long id;

    @Column(name = "USERNAME")
    private String name;

    @ManyToOne // 양방향 연관관계
    @JoinColumn(name = "TEAM_ID", insertable = false, updatable = false) // 읽기 전용이 된다
    private Team team; // 원래는 연관관계의 주인이 되어야 하지만...
}
```

## 일대일 (1:1)

**일대일**(1:1) 모델은 반대도 일대일입니다. 일대일 모델에서는 주 테이블(`Member`)과 대상 테이블(`Locker`), 둘 중 외래 키를 둘 곳을 결정해야 합니다. 또한, 외래 키에 `UNIQUE` 제약 조건을 걸어야 합니다.

먼저, 주 테이블에 외래 키를 두고 단방향 연관관계 매핑 하는 방법입니다. `@OneToOne` 어노테이션을 활용합니다.

<img width="870" alt="onetoone" src="https://github.com/GDSC-SKHU/moida-backend/assets/14046092/d203a0e6-0c4c-4528-8e6d-016d566dba14">

<div align="center"><I>일대일 단방향 연관관계 매핑</I></div>
<br>

```java
// 주 테이블 엔티티
@Entity
public class Member {
    @Id @GeneratedValue
    private Long id;

    @Column(name = "USERNAME")
    private String name;

    @OneToOne // 일대일 연관관계 매핑
    @JoinColumn(name = "LOCKER_ID") // 외래 키 매핑
    private Locker locker;
}
```

```java
// 대상 테이블 엔티티
@Entity
public class Locker {
    @Id @GeneratedValue
    private Long id;

    @Column(name = "NAME")
    private String name;
}
```

구현 방법 자체는 다대일 단방향 연관관계와 별반 다를게 없습니다. 만약 일대일 양방향으로 만들고 싶다면 다음과 같이 **대상 테이블 엔티티를 수정**해주면 됩니다.

<img width="868" alt="onetoone_bidirect" src="https://github.com/GDSC-SKHU/moida-backend/assets/14046092/6468744f-99cb-4939-a358-b6341fc528a9">

<div align="center"><I>일대일 양방향 연관관계 매핑</I></div>
<br>

```java
// 대상 테이블 엔티티
@Entity
public class Locker {
    @Id @GeneratedValue
    private Long id;

    @Column(name = "NAME")
    private String name;

    @OneToOne(mappedBy = "locker")
    private Member member;
}
```

일대일 양방향 역시 다대일 양방향 연관관계 매핑과 어노테이션을 제외하면 매우 유사합니다. 다음은 대상 테이블에 연관관계를 두고 연관관계 매핑하는 방법입니다.

대상 테이블에 외래 키를 두는 방식에는 단방향 연관관계 자체가 존재하지 않습니다.

<img width="875" alt="onetoone_no" src="https://github.com/GDSC-SKHU/moida-backend/assets/14046092/7a349be5-f464-4e2d-9008-6b83ca4a880b">

<div align="center"><I>대상 테이블에 외래 키를 둔 단방향 연관관계 매핑 모델은 존재하지 않는다.</I></div>
<br>

양방향 연관관계 매핑은 가능한데, 연관관계의 주인이 외래 키를 가진 테이블이 됩니다. 사실, 주 테이블에 외래 키를 둔 연관관계 매핑과 구현 방법 자체는 전혀 다를게 없습니다.

<img width="875" alt="onetoone_bidirect_target" src="https://github.com/GDSC-SKHU/moida-backend/assets/14046092/a3f17de8-bbe3-4f6d-a8d3-ed7023a42780">

<div align="center"><I>주 테이블에 외래 키를 둔 양방향 연관관계 매핑과 연관관계의 주인 위치만 다르다.</I></div>
<br>

```java
// 주 테이블 엔티티
@Entity
public class Member {
    @Id @GeneratedValue
    private Long id;

    @Column(name = "USERNAME")
    private String name;

    // 연관관계의 주인을 가리킨다
    @OneToOne(mappedBy = "member")
    private Locker locker;
}
```

```java
// 대상 테이블 엔티티
@Entity
public class Locker {
    @Id @GeneratedValue
    private Long id;

    @Column(name = "NAME")
    private String name;

    @OneToOne // 일대일 양방향 연관관계
    @JoinColumn(name = "MEMBER_ID") // 외래 키와 매핑
    private Member member;
}
```

일대일 연관관계 매핑을 정리하자면 다음과 같습니다.

**주 테이블 외래 키 방식**

- 주 테이블에 외래 키를 두고 대상 테이블 탐색
- 객체지향 개발자가 선호
- JPA 매핑 관리
- 주 테이블만 조회해도 대상 테이블에 데이터가 존재하는지 확인 가능
- 값이 없으면 외래키에 `NULL` 허용

**대상 테이블 외래 키**

- 전통적인 데이터베이스 개발자가 선호
- 주 테이블과 대상 테이블을 일대일에서 일대다 관계로 변경할 때 테이블 구조 유지
- **프록시** 기능의 한계로 **지연 로딩**으로 설정해도 항상 즉시 로딩됨

여기서 프록시와 지연 로딩은 좀 더 공부하고 추후에 정리하려고 합니다. 결국 객체지향 개발자인 우리는 주 테이블에 외래 키를 두는 방식을 사용하는 것이 더 편리할 수 있습니다. 물론, 연관관계 매핑 방식을 결정하기 전에 함께 작업하는 팀의 DBA와의 적절한 합의가 이뤄져야 합니다.

## 다대다 (N:M)

다음은 다대다 다중성 모델입니다. 결론부터 말하자면, **관계형 데이터베이스는 정규화 된 테이블 2개를 다대다 관계로 표현할 수 없습니다**. 이 모델이 JPA가 지원은 하지만 애초에 RDB에서 표현할 수 없기 때문에 당연히 실무에서도 사용하지 않는다고 합니다.

<img width="920" alt="manytomany" src="https://github.com/GDSC-SKHU/moida-backend/assets/14046092/7d291384-ca4c-4ac6-956a-14517662f66b">

<div align="center"><I>관계형 데이터베이스에서는 다대다가 존재할 수 없다.<br>중간 테이블을 통해 연결해야만 한다.</I></div>
<br>

그러나, 객체는 다대다 관계가 성립할 수 있기 때문에 객체와 관계형 데이터베이스를 매핑하기 위해선 JPA가 다대다 관계를 어떻게든 표현해야합니다. 방법은, 두 테이블의 다대다 연관관계를 일대다, 다대일 관계로 풀어서 표현하는 것입니다.

자세하게는 연관관계를 가져야 하는 두 테이블 사이에 중간 `JOIN` 테이블을 만들고, 중간 테이블과 1:N, N:1 관계로 각각 설정해 N:M처럼 동작하게 하면 됩니다. 코드로는 앞서 살펴본 여러 예제 코드들처럼 `@ManyToMany` 어노테이션을 활용해 다대다 연관관계를 설정하고, `@JoinTable`을 통해 중간 테이블을 만들면 구현할 수 있습니다.

그런데 이 방식을 사용하지 않는 이유가 또 있습니다. 두 테이블의 가교 역할을 하는 중간 테이블이 둘을 연결해주는 역할 뿐만 아니라 값을 가져야 하는 상황이 발생하면 이를 테이블에 추가할 방법이 없다는 것입니다.

<img width="1140" alt="jointable_value" src="https://github.com/GDSC-SKHU/moida-backend/assets/14046092/5b791115-45f4-43da-825d-fe6e6999dd9f">

<div align="center"><I>중간 테이블이 값을 가져야 한다면...</I></div>
<br>

따라서, 다대다 관계를 사용하기 위해서는 중간 테이블을 엔티티로 승격시켜야 합니다. 이렇게 되면, 엔티티로 승격된 중간 테이블은 원래의 양쪽 엔티티와 `@OneToMany`를 통한 일대다, `@ManyToOne`을 통한 다대일 관계가 만들어지는 것이고 다대다라고 할 수 없게 됩니다.

<img width="1018" alt="jointabletoentity" src="https://github.com/GDSC-SKHU/moida-backend/assets/14046092/03354169-1917-4bd6-8daf-eaa1cda21d2e">

<div align="center"><I>중간 테이블을 Order 엔티티로 승격</I></div>
<br>

즉, `@ManyToMany`를 사용해 다대다 관계를 만들려고 해도 결국에는 일대다, 다대일 관계로 변화하게 되고 억지로 사용하더라도 여러 문제를 발생시키며, 데이터베이스에는 애초에 존재하지 않는 모델이기 때문에 사용하지 않는 것이 좋다고 생각합니다.

## 요약

- 연관관계 매핑에서는 다중성도 고려해야 한다.
- 다중성 모델로는 다대일, 일대다, 일대일, 다대다가 있다.
- 가장 많이 사용하는 방식은 다대일 단방향 연관관계 매핑이다.
- 일대다와 다대다가 실무에서 잘 사용되지 않는 이유는 불필요한 작업이 필요하기 때문이다.
