---
title: '고급 매핑'
subtitle: '상속관계 매핑과 @MappedSuperClass'
date: '2023-07-08'
category: 'JPA'
---

<!-- 06 -->

## 상속관계 매핑

객체와 관계형 데이터베이스의 차이가 또 하나 있습니다. 바로, **데이터베이스에는 상속관계가 존재하지 않는다**는 것입니다. 상속이 객체지향 프로그래밍에서 아주 중요한 개념임을 생각하면 데이터베이스에서도 테이블 간의 상속관계를 표현할 방법이 있어야 합니다. 다행히도 상속관계와 유사한 데이터베이스 모델링 기법이 있습니다. **슈퍼타입 서브타입 관계**라는 모델링 기법으로, 상속관계 매핑은 객체의 상속과 구조를 DB의 슈퍼타입 서브타입 관계를 매핑하는 것을 말합니다.

<img width="1160" alt="supersubtype" src="https://github.com/GDSC-SKHU/moida-backend/assets/14046092/b80d8291-ac2f-4260-9991-dd520c565e09">

<div align="center"><I>DB의 슈퍼타입 서브타입 관계와 객체의 상속관계 </I></div>
<br>

슈퍼타입 서브타입 논리 모델을 물리 모델로 구현하는 방법에는 여러 전략들이 있습니다. 전략들을 살펴보기 전, 상속관계 매핑을 위해 꼭 알아둬야 하는 어노테이션이 있습니다.

- `@Inheritance(strategy = InheritanceType.타입)`
  - `JOINED` : 조인 전략
  - `SINGLE_TABLE` : 단일 테이블 전략
  - `TABLE_PER_CLASS` : 구현 클래스별 테이블 전략
- `@DiscriminatorColumn(name = "DTYPE")`
- `@DiscriminatorValue("구분자 이름")`

첫 번째 어노테이션 `@Inheritance`는 `JOINED`, `SINGLE_TABLE`과 같은 상속 전략 타입과 함께 **부모 클래스에 입력**해 상속관계 매핑 시, 원하는 전략을 사용할 수 있도록 해줍니다. `@Inheritance` 어노테이션의 기본 전략은 `SINGLE_TABLE`입니다.

다음은 각 자식 클래스를 데이터베이스 상에서 구분하기 위해 **부모 클래스에 사용**되는 **구분자 컬럼 설정**을 위한 `@DiscriminatorColumn` 어노테이션입니다. 컬럼명을 직접 정할 수도 있으며 기본 이름은 `DTYPE`입니다.

마지막 어노테이션인 `@DiscriminatorValue`는 `@DiscriminatorColumn`에 저장될 값을 지정하는 자식 클래스용 어노테이션입니다. 해당 어노테이션에 적어둔 값이 부모 테이블의 구분자 컬럼에 저장됩니다. 기본값은 자식 엔티티의 이름입니다.

```java
// 부모 클래스(엔티티)
@Entity
@Inheritance(strategy = InheritanceType.JOINED) // 조인 전략으로 상속관계 매핑
@DiscriminatorColumn // 구분자 컬럼 DTYPE
public class Item {

    @Id @GeneratedValue
    private Long id;

    private String name;

    private int price;
    ...
}
```

```java
// 자식 클래스(엔티티)
@Entity
@DiscriminatorValue("MOVIE") // DTYPE MOVIE
public class Movie extends Item {

    private String director;

    private String actor;
    ...
}
```

위 코드가 상속관계 매핑을 완료한 코드입니다. 이렇게 JPA를 활용하면 간단하게 데이터베이스에서 상속관계를 표현할 수 있습니다. `Item` 엔티티의 테이블에는 `DTYPE`이라는 컬럼이 추가될 것이고, **조인 전략**이라는 것과, 구분자 값 `MOVIE`가 `Item`의 `DTYPE` 컬럼에 입력될 것이라는 것도 알 수 있습니다.

## 조인 전략

위의 예제를 통해 잠깐 알아본 **조인 전략**에 대해서 더 자세히 알아보겠습니다. 조인 전략은 말 그대로 SQL `JOIN` 연산을 활용하는 전략으로, 슈퍼타입과 서브타입 테이블을 각각 만들고, 자식 테이블이 부모 테이블의 기본 키를 받아서 자신의 기본 키이자 외래 키로 사용합니다. 데이터 조회 시에는 `JOIN` 연산을 통해 두 테이블을 함께 조회합니다.

<img width="1240" alt="joinstrategy" src="https://github.com/GDSC-SKHU/moida-backend/assets/14046092/e0508c38-9cd5-445c-9078-8cdff7b03627">

<div align="center"><I>객체의 상속처럼 부모 테이블에 공통 속성을 두고 자식 클래스에 구체적인 속성을 둔다.</I></div>
<br>

한 눈에 보기에도 객체와 테이블의 구조가 유사해보입니다. 실제로 조인 전략은 가장 정석적인 전략이라고 합니다.

이제 데이터베이스 테이블 구성도 완료했습니다. 조인 전략을 통해 모든 엔티티의 테이블들을 각각 생성했고, 자식 테이블들이 부모 테이블의 기본 키를 가져와 자신의 기본 키와 외래 키로 설정했습니다. 만약, 테이블에 엔티티를 저장할 때, 엔티티가 어떻게 저장되는지도 알아보겠습니다.

```java
Movie movie = new Movie();
movie.setName("JPA는 아름다워");
movie.setPrice(202307);
movie.setDirector("Hibernate");
movie.setActor("CodeRoad");
em.persist(movie);
```

위와 같이 `Movie` 엔티티를 영속화하면 JPA는 다음과 같은 SQL 쿼리를 작성합니다.

```java
Hibernate:
    /* insert hellojpa.Movie
        */ insert
        into
            Item
            (name, price, DTYPE, id)
        values
            (?, ?, 'MOVIE', ?)
Hibernate:
    /* insert hellojpa.Movie
        */ insert
        into
            Movie
            (actor, director, id)
        values
            (?, ?, ?)
```

분명히 우리는 `Movie` 엔티티 하나만 저장했는데 `INSERT` 쿼리가 2개 작성되어 데이터베이스로 향했습니다. 부모 테이블 `Item`과 자식 테이블 `Movie`에 하나씩 전송된 쿼리는 각각 테이블 컬럼에 맞게 데이터를 저장했습니다. 사실, 이 쿼리는 정확하게 잘 작성된 쿼리입니다. 그 이유는, 객체 입장에서는 `Item`을 상속한 `Movie`가 `Item`의 필드와 메소드들을 알고 있고 활용할 수 있지만, 데이터베이스 테이블 입장에서는 두 클래스의 속성들은 완전히 별개이기 때문입니다.

데이터베이스에서는 우리가 아무리 상속관계 매핑을 해준다고 하더라도 객체와 같이 자식인 `Movie` 테이블이 부모 테이블 `Item`의 컬럼을 상속 받아 자유자재로 다룰 수 있는 것은 아닙니다. 부모 테이블에는 다른 자식 테이블들과 공유되는 공통 속성만 있고, 각 자식 테이블은 자신 고유의 속성들만 가지고 있습니다. 이후, 자식 엔티티 `Movie`를 조회할 때, 부모와 자식 테이블을 `JOIN` 연산을 통해 합친 후, 온전한 `Movie`의 데이터를 반환하는 것입니다.

`Movie` 엔티티를 조회할 때 `Item` 테이블과 `Movie` 테이블을 `JOIN`한 후, `Item` 테이블의 `id`, `name`, `price`와 `Movie` 테이블의 `actor`, `director` 속성들을 하나로 모아 `Movie` 엔티티에 대한 정보로 반환하는 것을 볼 수 있습니다.

```java
Hibernate:
    select
        movie0_.id as id2_5_0_,
        movie0_1_.name as name3_5_0_,
        movie0_1_.price as price4_5_0_,
        movie0_.actor as actor1_7_0_,
        movie0_.director as director2_7_0_
    from
        Movie movie0_
    inner join
        Item movie0_1_
            on movie0_.id=movie0_1_.id
    where
        movie0_.id=?
```

즉, **부모 클래스의 속성은 부모 테이블에만, 자식 클래스의 속성은 자식 테이블에만 저장**하고 **조회할 때 `JOIN` 연산으로 합쳐 하나로** 보이게 하는 것이 이 조인 전략의 동작 방법입니다.

조인 전략의 장점은 각 테이블에 중복되는 컬럼이 없기 때문에(공통 속성을 부모 테이블이 가지고 있기 때문에), 잘 **정규화**되어 있고 **외래 키 무결성 제약 조건을 활용**할 수 있습니다. 또한, 각 테이블의 모든 행이 **저장 공간을 효율적으로 사용**할 수 있습니다.

단점은 아무래도 매 조회마다 `JOIN` 연산을 사용하기 때문에 성능 저하가 있을 수 있다는 것과 조회 쿼리가 단순히 `SELECT` 연산만 사용하는 것이 아니기 때문에 복잡하다는 것입니다. 거기다, 한 엔티티를 저장할 때, 부모와 자식 테이블에 각각 데이터를 나눠서 저장해야하기 때문에 `INSERT` 쿼리가 두 번 나간다는 것도 단점입니다.

## 단일 테이블 전략

다음은 단일 테이블 전략으로, 이름 그대로 상속관계를 하나의 테이블만 가지고 표현하는 전략입니다. 부모와 자식 엔티티의 속성들을 한 테이블에 모두 포함한 후, `DTYPE` 컬럼을 통해 각 데이터가 어떤 엔티티의 데이터인지 구분합니다.

<img width="1050" alt="singletable" src="https://github.com/hangillee/coderoad.kr/assets/14046092/d107c246-42d7-48b8-8909-2b2d9c5a7945">

<div align="center"><I>부모와 자식 엔티티의 속성을 모두 모아 단 하나의 테이블만 생성한다.</I></div>
<br>

단일 테이블 전략을 설정할 때는 `@Inhertance` 어노테이션의 속성으로 `SINGLE_TABLE`을 입력하면 됩니다. 또한, `DTYPE` 컬럼이 필수이기 때문에 `@DiscriminatorColumn`을 작성하지 않아도 자동으로 생성됩니다. 물론, 직접 어노테이션을 통해서 명시해주는 편이 코드를 좀 더 직관적으로 만들어주기 때문에 빼놓지 않는 것이 좋습니다. 다음은 단일 테이블 전략을 사용한 예제 코드입니다.

```java
// 부모 엔티티
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE) // 단일 테이블 전략
@DiscriminatorColumn
public class Item {

    @Id @GeneratedValue
    private Long id;

    private String name;

    private int price;
    ...
}
```

```java
// 자식 엔티티
@Entity
public class Book extends Item {

    private String author;

    private String isbn;
    ...
}
```

단일 테이블 전략으로 변경하기 위해 수정한 어노테이션을 제외하면 조인 전략에서 작성했던 예제 코드와 크게 다른 점은 없습니다. 이것이 JPA의 큰 장점 중 하나인데, 기존에 작성한 코드를 거의 수정하지 않고 어노테이션만 바꿔도 데이터베이스의 구조가 완전히 바뀌었습니다. 만약, JPA를 사용하지 않았다면 쿼리를 비롯한 수많은 코드를 직접 수정했어야 합니다.

코드는 수정한 것이 거의 없지만, 데이터를 조회할 때는 조인 전략을 사용할 때와 전혀 다른 형태의 쿼리가 데이터베이스로 향한다는 것을 확인할 수 있습니다.

```java
// em.find(Book.class, book.getId()); 수행 시 작성되는 쿼리
Hibernate:
    select
        book0_.ITEM_ID as ITEM_ID2_3_0_,
        book0_.name as name3_3_0_,
        book0_.price as price4_3_0_,
        book0_.stockQuantity as stockQua5_3_0_,
        book0_.author as author8_3_0_,
        book0_.isbn as isbn9_3_0_
    from
        Item book0_
    where
        book0_.ITEM_ID=?
        and book0_.DTYPE='Book'
```

위의 쿼리에서 볼 수 있듯, 단일 테이블 전략은 `JOIN` 연산이 사용되지 않아 **조인 전략에 비해 훨씬 쿼리가 간단해지는 장점**이 있습니다. 당연히 `JOIN` 연산이 필요하지 않으니 **조회 성능이 일반적으로 빠릅니다**. 그러나, 훨씬 간단하고 효율적인 것처럼 보이는 단일 테이블 전략에는 정말 큰 단점이 있습니다.

바로, **자식 엔티티들이 매핑한 컬럼들은 모두 `NULL`을 허용**해야 한다는 것입니다. 모든 자식 엔티티들의 속성들이 한 테이블에 있다보니 어떤 자식 엔티티는 사용하지 않는 컬럼도 같은 테이블에 있게 되고, 해당 컬럼은 아무런 값도 가지지 않게 됩니다. 이는 저장 공간의 낭비이며, 데이터 무결성 측면에서 `NULL`로 인해 예기치 못한 버그가 터질 수도 있습니다.

또한, 한 테이블에 모든 속성들을 저장해야 하는 특성 때문에 테이블이 지나치게 비대해져서 오히려 조회 성능이 낮아질 수도 있습니다. 따라서, 단일 테이블 전략은 정말 단순한 상속관계이며, 저장하는 데이터도 얼마 없는 간단한 엔티티인 경우에 선택하는 것이 좋습니다.

## 구현 클래스별 테이블 전략

다음은 구현 클래스별 테이블 전략입니다. 결론부터 말하자면 해당 전략은 사용하지 않는 것이 좋습니다. 이 전략은 ORM 전문가와 데이터베이스 설계자 모두가 추천하지 않는 전략이라고 합니다. 간단하게 설명하자면, 상속관계에서 부모 클래스를 제외한 모든 구현 클래스의 테이블을 각각 만드는 전략입니다.

<img width="1245" alt="tableperclass" src="https://github.com/hangillee/coderoad.kr/assets/14046092/489f628e-536b-427f-8e60-b2ed1d89451e">

<div align="center"><I>부모 클래스를 제외한 모든 구현 클래스들이 각자 자신의 테이블을 가진다.</I></div>
<br>

그림과 같이 자식 엔티티, 즉, 서브 타입을 명확하게 구분해서 사용할 때는 효율적이며, `NOT NULL` 제약 조건을 사용할 수 있어 `NULL`로 부터 자유롭다는 장점이 있지만, 단점이 이 모든 장점을 상쇄합니다.

바로, 데이터베이스에서 **여러 자식 테이블을 함께 조회**할 때, `UNION` 연산을 사용하기 때문에 **조회 성능이 느리다**는 것입니다. 코드 상에서 부모 클래스(슈퍼 타입)로 어떤 엔티티를 데이터베이스에서 조회하면 `UNION ALL`로 **모든 자식 테이블**을 합친 후 조회합니다.

조회 성능도 느린데, 자식 테이블을 통합해서 쿼리하기도 어렵습니다. 성능이 좋지도 않고 쿼리하기도 어렵다면 이 상속관계 매핑 전략은 굳이 활용할 이유가 없습니다.

> 문제 해결을 위한 더 좋은 방법들이 있는데 굳이 어려운 방법을 사용해야 할까?

해당 전략을 적용하기 위해서는 부모 클래스를 **추상 클래스**로 만들어 부모 클래스를 단독으로 사용할 수 없게 해야 합니다.

```java
// 부모 클래스가 무조건 추상 클래스여야 한다.
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@DiscriminatorColumn
public abstract class Item {

    @Id @GeneratedValue
    @Column(name = "ITEM_ID")
    private Long id;

    private String name;

    private int price;

    private int stockQuantity;
    ...
}
```

위와 같이 코드를 작성하면 구현 클래스별 테이블 전략을 적용할 수 있습니다. 코드 수정은 정말 간단하지만 조회 쿼리는 알아보기 힘들 정도로 복잡합니다. 아래의 쿼리는 부모 클래스인 `Item`을 기준으로 자식 클래스 `Movie`를 조회하는 코드인 `em.find(Item.class, movie.getId());`를 수행한 결과입니다.

> 만약, 모든 자식 엔티티들의 남은 재고를 조사한다거나 판매한 상품에 대한 정산 등, 부모 엔티티에 있는 공통 속성을 활용하는 로직이 필요한 경우, 부모 엔티티인 `Item`을 기준으로 조회하면 JPA의 상속관계 매핑 덕분에 자식 테이블들을 한번에 모두 조회할 수 있습니다.

```java
// em.find(Item.class, movie.getId());의 결과
Hibernate:
    select
        item0_.ITEM_ID as ITEM_ID1_5_0_,
        item0_.name as name2_5_0_,
        item0_.price as price3_5_0_,
        item0_.stockQuantity as stockQua4_5_0_,
        item0_.actor as actor1_7_0_,
        item0_.director as director2_7_0_,
        item0_.author as author1_1_0_,
        item0_.isbn as isbn2_1_0_,
        item0_.artist as artist1_0_0_,
        item0_.etc as etc2_0_0_,
        item0_.clazz_ as clazz_0_
    from
        ( select
            ITEM_ID,
            name,
            price,
            stockQuantity,
            actor,
            director,
            null as author,
            null as isbn,
            null as artist,
            null as etc,
            1 as clazz_
        from
            Movie
        union
        all select
            ITEM_ID,
            name,
            price,
            stockQuantity,
            null as actor,
            null as director,
            author,
            isbn,
            null as artist,
            null as etc,
            2 as clazz_
        from
            Book
        union
        all select
            ITEM_ID,
            name,
            price,
            stockQuantity,
            null as actor,
            null as director,
            null as author,
            null as isbn,
            artist,
            etc,
            3 as clazz_
        from
            Album
    ) item0_
where
    item0_.ITEM_ID=?
```

다른 전략들에 비해 훨씬 복잡하고 긴 쿼리가 작성된 것을 볼 수 있습니다. 여러 테이블을 조회하는 작업은 꽤 빈번하게 이루어진다는 것을 생각한다면 구현 클래스별 테이블 전략을 다른 전략 대신 선택할 이유가 전혀 없습니다.

## 부록 : @MappedSuperClass

상속관계 매핑과는 전혀 상관 없지만 유사하게 활용할 수 있는 것이 있습니다. 상속관계에서의 부모 엔티티처럼 여러 엔티티들의 공통 매핑 정보(공통 속성)를 한 곳에 모아두는 클래스를 만들고 `@MappedSuperClass` 어노테이션을 추가해주면 해당 클래스를 상속 받는 자식 클래스에 매핑 정보를 제공해줍니다.

<img width="1018" alt="baseentity" src="https://github.com/hangillee/coderoad.kr/assets/14046092/da2f61f0-0c30-4a39-b05f-67d3b8e26fc2">

<div align="center"><I>공통 속성들을 하나의 클래스로 모아두고 상속해서 사용한다.</I></div>
<br>

<img width="778" alt="baseentitydb" src="https://github.com/hangillee/coderoad.kr/assets/14046092/1701a2a5-de51-4d0e-aeb0-7e7f50cda9ef">

<div align="center"><I>그러나 DB에는 공통 속성들이 모든 테이블에 각각 들어가 있다.</I></div>
<br>

`@MappedSuperClass`는 상속관계 매핑이 아니기 때문에 상속해서 사용하더라도 공통 속성 클래스(부모 클래스)의 테이블이 생성되지 않습니다. 테이블이 생성되지도 않을 뿐더러, 엔티티도 아니기 때문에 `EntityManager`를 통해 조회도 불가능합니다. 또한, 공통 속성 클래스를 직접 사용할 일도 없기 때문에 **추상 클래스**로 작성할 것을 권장합니다.

```java
// 공통 속성 클래스
@MappedSuperclass
public abstract class BaseEntity { // 추상 클래스로 작성
    private String createdBy;
    private LocalDateTime createDate;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedDate;
    ...
}
```

이렇게 `@MappedSuperClass`를 활용해 공통 속성 클래스를 작성하고 상속해서 사용하면 이 클래스를 상속 받은 엔티티의 테이블에 자동으로 공통 속성들이 추가됩니다.

```java
Hibernate:
// BaseEntity를 상속 받은 Item 엔티티의 테이블
    create table Item (
       DTYPE varchar(31) not null,
        ITEM_ID bigint not null,
        createDate timestamp,
        createdBy varchar(255),
        lastModifiedBy varchar(255),
        lastModifiedDate timestamp,
        name varchar(255),
        price integer not null,
        stockQuantity integer not null,
        primary key (ITEM_ID)
    )
...
```

즉, `@MappedSuperClass`는 테이블 생성과는 아무런 관련도 없고, 단순히 여러 엔티티가 공통으로 사용하는 매핑 정보를 제공하는 역할을 하는 것입니다. 주로, 엔티티의 등록일, 수정일, 등록자, 수정자 등, 전체 엔티티에서 공통적으로 사용할 데이터를 모을 때 사용합니다.

참고로, `@Entity` 어노테이션을 사용한 클래스(엔티티)는 엔티티나 `@MappedSuperClass` 어노테이션을 사용한 클래스만 상속받을 수 있습니다.

## 요약

- 데이터베이스에는 상속관계가 존재하지 않는다.
- 객체의 상속관계를 데이터베이스에서도 표현하기 위해 사용하는 것이 상속관계 매핑이다.
- 상속관계 매핑 전략에는 3가지가 있다.
  - 조인 전략 : 부모 테이블에는 공통 속성, 자식 테이블에는 각자 고유의 속성.
  - 단일 테이블 전략 : 부모와 자식 모두 한 테이블에.
  - 구현 클래스별 테이블 전략 : 부모 테이블 제외 모든 엔티티의 테이블 각각 생성.
- 핵심 엔티티에는 조인 전략, 정말 단순한 엔티티엔 단일 테이블 전략을 사용한다.
  - 구현 클래스별 테이블 전략은 사용하지 않는다.
- `@MappedSuperClass`는 단순히 공통 속성을 공유하기 위해 사용한다.
  - 엔티티도 아니고 테이블과도 관련 없다.
