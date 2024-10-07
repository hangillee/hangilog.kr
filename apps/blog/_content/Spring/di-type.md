---
title: '의존관계 주입'
subtitle: '다양한 DI 방식들'
date: 2023-01-22 00:00:00
category: 'Spring'
---

**본 문서는 인프런에서 수강할 수 있는 [스프링 핵심 원리 - 기본편](https://inflearn.com/course/스프링-핵심-원리-기본편)을 수강한 후, 공부한 내용을 정리한 문서입니다. 본 문서의 모든 저작권은 해당 강의의 저자이신 [김영한](https://inflearn.com/users/@yh) 우아한형제들 기술이사님께 있습니다.**

## 다양한 의존관계 주입 방법

Spring의 의존관계 주입 방법에는 크게 4가지 방법이 있습니다.

- 생성자 주입
- 수정자 주입
- 필드 주입
- 일반 메소드 주입

### 생성자 주입

생성자 주입 방식은 말 그대로 클래스의 생성자(Constructor)를 통해 의존관계를 주입 받습니다. 생성자를 매개체로 사용하기 때문에 생성자 호출 시점에 **딱 1번만 호출되는 것이 보장**되며, 변하지 않고 필수적인 의존관계에 사용합니다. 즉, 생성자 주입 방식을 사용하면 의존관계 주입된 인스턴스를 중간에 변경할 수 없습니다.

```java
public class MemberServiceImpl implements MemberService {
    //한 번 주입된 의존관계는 외부에서 변경할 수 없습니다!
    private final MemberRepository memberRepository;

    @Autowired //의존관계 자동 주입 기능을 사용했습니다.
    public MemberServiceImpl(MemberRepository memberRepository) {
        //Spring 컨테이너가 memberRepository 이름을 가진 빈을 주입해줍니다.
        this.memberRepository = memberRepository;
    }
}
```

만약, 생성자가 딱 1개만 존재하면 `@Autowired`가 없어도 의존관계가 자동 주입됩니다. 당연히 주입하려는 의존관계가 Spring 빈이어야만 가능합니다.

### 수정자 주입

수정자, 흔히 `Setter`라고 불리는 **필드 값을 변경하는 수정자 메소드를 통해 의존관계를 주입**하는 방법입니다. 생성자 주입 방식과 다르게 외부에서 언제든 접근이 가능하기 때문에 선택적이고 변경 가능성이 있는 의존관계에 사용하는 방식입니다. `Setter`를 사용하여 필드에 접근하는 방식을 **Java 빈 프로퍼티 규약**이라 하는데, 수정자 주입 방식이 해당 규약을 따른다고 생각하면 됩니다.

```java
public class MemberServiceImpl implements MemberService {
    //final로 선언되지 않았기 때문에 수정될 수 있습니다.
    private MemberRepository memberRepository;

    @Autowired //의존관계 자동 주입 기능을 사용했습니다.
    public void setMemberRepository(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }
}
```

만약, 빈의 의존관계를 필수가 아닌 선택적으로 주입되도록 하려면, `@Autowired`를 `@Autowired(required = false)`와 같이 작성해야합니다.

### 필드 주입

필드 주입은 위의 두 방식보다 훨씬 간단합니다.

```java
public class MemberServiceImpl implements MemberService {
    //이 한 줄이면 자동으로 의존관계가 주입됩니다!
    @Autowired
    private MemberRepository memberRepository;
}
```

너무나도 간단해서 많은 개발자들을 현혹시켰고, 실제로 많은 프로젝트에서 필드 주입 방식을 사용했다고 합니다. 그러나 필드 주입 방식에는 치명적인 단점들이 있어 **사용을 지양해야합니다.**

가장 큰 문제는 [SOLID](https://blog.coderoad.kr/solid)의 SRP를 위반할 가능성이 크다는 것입니다. Spring을 관통하는 **좋은 OOP를 포기하면서**까지 필드 주입 방식을 사용할 이유가 없습니다!

또한, 클래스의 코드만 봐서는 의존관계가 한 눈에 보이지 않는 **숨겨진 의존관계**(Hidden dependency) 문제가 발생합니다. 실제로 어떤 인스턴스(Spring 빈)가 의존관계 주입되어야 하고, 어떤 의존관계가 필수인지, 어떤 의존관계가 변하면 안 되는지 코드를 하나하나 뜯어봐야하는 매우 비효율적인 상황이 생기는 것입니다.

더군다나 필드를 `final`로 선언할 수 없어 언제든 변경될 수 있습니다. 이 경우에 변경된 의존관계로 인해 예상치 못한 에러가 발생해도 쉽게 알아차릴 수 없습니다. 바로 전에 설명한 문제점에서 알 수 있듯, 필드 주입 방식은 의존관계가 감춰져 있기 때문입니다!

TDD(Test Driven Development, 테스트 주도 개발)에도 악영향을 끼칩니다. 필드 주입 방식은 의존관계를 주입할 때, `@Autowired` 어노테이션을 보고 Spring 컨테이너가 자동으로 주입 해주는 방식입니다. 이는, 단위 테스트 시 DI 컨테이너, 다시 말해 Spring 컨테이너가 없으면 의존관계를 주입할 방법이 없다는 이야기입니다. `@Autowired`를 보고 의존관계를 주입해줘야 하는데 순수한 Java 테스트 코드는 Spring 컨테이너가 없으니 제대로 동작할리가 없습니다.

Spring이 등장한 이유가 특정 기술(EJB)에 종속적이었던 Java 개발 생태계를 개선하려던 것이었음을 생각하면, Spring에 종속적인 코드는 매우 모순적인 상황이 아닐 수 없습니다. 그러니 우리는 필드 주입 방식을 멀리해야합니다.

### 일반 메소드 주입

일반적인 Java 메소드를 통해 의존관계를 주입 받을 수도 있습니다. 그러나, 일반적으로 잘 사용하지 않습니다.

```java
public class MemberServiceImpl implements MemberService {
    private MemberRepository memberRepository;

    @Autowired
    //사실 수정자 주입 방식과 별반 다를게 없습니다.
    public void dependencyInject(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }
}
```

## 주입 옵션 처리

앞서 살펴본 여러 의존관계 주입 방식 중, 선택적으로 의존관계를 주입할 때 수정자 주입 방식을 사용해야 한다는 것을 알았습니다. 다시 말하자면, 주입할 Spring 빈이 없어도 애플리케이션이 정상 작동해야할 때가 있습니다. 그런데 자동 주입 방식의 `@Autowired` 어노테이션은 주입 대상 빈이 없으면 오류가 발생해, `@Autowired(required = false)`와 같이 옵션 값을 넣어줘야 한다는 것도 잠깐 설명했습니다. 이 방법은 만약 자동 주입 대상이 없다면 수정자 메소드 자체가 실행되지 않습니다.

`@Autowired`에 옵션 값을 지정하는 방법 외에도 주입 옵션을 설정하는 방법은 2가지가 있습니다.

- `@Nullable` : 자동 주입 대상이 없다면 `null`을 입력
- `Optional<>` : 자동 주입 대상이 없다면 `Optional.empty` 입력

두 방법의 예시는 다음과 같습니다.

```java
private Member nullMember;
private Member optionalMember;

@Autowired
public void setBeanNullable(@Nullable Member member) {
    this.nullMember = member;
}

@Autowired
public void setBeanOptional(Optional<Member> member) {
    this.optionalMember = member;
}
```

`Member`가 Spring 빈이 아니라고 가정했을 때, 두 수정자 메소드에 의해 필드에 입력되는 값은 각각 `null`과 `Optional.empty`가 됩니다.

## 생성자 주입을 선택해야하는 이유

지금까지 크게 3가지 의존관계 주입 방식에 대해 정리해봤습니다. 이 방식들 중, **필드 주입 방식은 지양**하는게 좋다는 것과 그 이유에 대해서도 알아봤습니다. 그럼 도대체 어떤 방식을 주로 사용해야하는 걸까요? 이 질문에 대한 답은 **생성자 주입을 적극 권장하며, 선택적인 의존관계(필수가 아닌 의존관계)를 지정할 때만 제한적으로 수정자 주입 방식을 사용한다.**입니다. 이는 생성자 주입이 가지는 강력한 장점과 수정자 주입 방식의 한계 때문입니다.

### 불변

먼저, 생성자 주입 방식을 통해 의존관계를 주입하면, **애플리케이션이 작동 중인 동안에 변경되지 않습니다.** 컴파일 단계에서 주입된 대부분의 의존관계가 애플리케이션 종료 전까지 변할 일이 없어야 한다는 걸 생각하면 이는 훌륭한 장점입니다. 사실, 수정자 주입 방식의 `Setter` 메소드는 의도치 않은 변경에 매우 취약해 좋은 설계 방법이 아닙니다. 따라서, 객체를 생성할 때 딱 1번만 호출되는 **생성자 주입 방식**을 사용하도록 설계하는 것이 훨씬 좋은 방법입니다.

### 누락

수정자 주입 방식의 큰 문제점이 하나 더 있습니다. 만약 연관관계 주입 자체가 누락될 경우, 컴파일 단계에서 오류가 발생하지 않고 실행 도중 `NullPointerException`를 맞닥뜨리게 됩니다. `NPE`는 그 원인을 찾아내기 까다로워 Java 프로그래머들을 가장 많이 괴롭히는 악명 높은 예외입니다. 그에 반해 **생성자 주입 방식**은 연관관계 주입이 누락되었을 경우, **컴파일 오류**가 발생합니다. 생성자에 즉, 생성자 주입 방식을 사용하는 것 만으로도 Java 프로그래머의 골칫거리 `NPE`를 사전에 차단할 수 있는 큰 장점이 있습니다.

### final

더 나아가, `final` 키워드를 사용할 수 있는 것이 생성자 주입을 사용해야하는 이유입니다. `final` 키워드가 붙은 필드는 선언과 동시에 값을 할당해야하고, 그 값은 변경할 수 없습니다. 이 `final` 필드에 값을 할당할 수 있는 방법들 중 한가지가 바로 **생성자**를 활용하는 것입니다. 만약 `final` 필드에 생성자를 통해 아무런 값도 할당하지 않으면, Java는 다음과 같은 컴파일 오류를 발생시킵니다.

```java
java: variable might not have been initialized
```

선언과 동시에 값이 할당(초기화)되어야 하는 `final` 필드에 아무런 값도 할당되지 않았으니, 이대로 실행시켜도 오류가 발생할 수 밖에 없어 Java가 컴파일 단계에서 오류를 발생시켜주는 것입니다. **컴파일 오류는 세상에서 가장 빠르고, 좋은 오류입니다!** 이렇게 `final` 키워드를 붙이는 것만으로도 연관관계 주입이 빠지지 않고 제대로 될 수 있도록 강제하는 장점도 있으니, **생성자 주입 방식** 대신 다른 방식을 선택할 이유가 없습니다!

## Lombok과 함께

자, 이제 우리는 좋은 코드를 작성하기 위해선 **생성자 주입 방식**을 사용해야한다는 것도 알게 되었습니다. 그런데, 대부분의 연관관계는 불변입니다. 덕분에 `final` 키워드를 붙이는 건 이제 습관이 될 정도로 자주 사용하게 되었습니다. 매번 생성자를 작성하는 것도 반복적이고 지루한 작업으로 느껴질 정도가 되어버렸고, 비효율적인 것은 참지 못하는 개발자들은 더 나은 방법을 고안해내기 시작했습니다. 역시 가장 빠르고 효율적인 개발은 불필요한 코드를 지우는 것이었습니다.

```java
@Component
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;
    private final TeamRepository teamRepository;

    //@Autowired 어노테이션은 생성자가 하나일 때 생략되어도 된다!
    public MemberServiceImpl(MemberRepository memberRepository, TeamRepository teamRepository) {
        this.memberRepository = memberRepository;
        this.teamRepository = teamRepository;
    }
}
```

`@Autowired` 어노테이션은 **생성자가 딱 1개 있을 때 생략해도 된다**는 것을 이 포스트의 초반에서 알아봤습니다. `@Autowired`를 생략하고보니 **생성자**도 굳이 개발자가 직접 타이핑 하지 않는 것이 더 효율적이지 않을까라고 생각하게 되었습니다. 이때 등장하는 것이 바로 **`Lombok` 라이브러리**입니다.

```java
@Component
@RequiredArgsConstructor //Lombok 라이브러리의 어노테이션
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;
    private final TeamRepository teamRepository;

    //생성자가 사라져도 문제 없습니다!
    //Lombok 라이브러리의 @RequiredArgsConstructor 어노테이션이
    //연관관계 주입이 필요한 필드를 위해 자동으로 생성자를 만들어줍니다.
}
```

놀랍게도 `Lombok`이라는 라이브러리를 사용했더니 어노테이션 한 줄 붙여줬을 뿐인데 생성자를 작성할 필요가 없어졌습니다! 이는 `Lombok` 라이브러리가 Java의 **어노테이션 프로세서**라는 기능을 통해 애플리케이션의 컴파일 시점에 생성자 코드를 자동으로 생성해줬기 때문입니다. 컴파일의 결과물인 `.class` 파일(Java 바이트 코드 파일)을 열어보면 알맞은 생성자가 작성되어 있는 것을 확인할 수 있습니다.

최근 실무에서는 이렇게 생성자를 1개만 둬 `@Autowired` 어노테이션을 생략하는 방법을 사용한다고 합니다. 거기에 `Lombok` 라이브러리까지 활용해 코드를 최대한 깔끔하게 만들되 기능은 모두 제공하는 방식으로 코드를 작성한다고 합니다.

## 중복 빈이 존재할 때

중복된 Spring 빈, 다시 말해 같은 타입의 빈이 여러개 존재할 경우, `NoUniqueBeanDefinitionException` 오류가 발생할 수 있습니다. 자동으로 의존관계를 주입해주는 `@Autowired` 어노테이션은 타입 기반으로 빈을 조회하는데, [Spring 컨테이너와 빈](https://blog.coderoad.kr/container-bean) 포스트에서 정리했던 것처럼 동일한 타입의 빈이 존재하면 오류가 발생합니다. 이 오류를 해결하는 방법에는 여러가지가 있지만, **의존관계 자동 주입 방식을 유지하면서 해결**하는 방법들에 대해 알아보겠습니다.

### @Autowired 필드 이름과 빈 이름 매칭

가장 먼저, 간단하면서도 코드 변경도 적은 방법입니다. 예시로 간단한 의존관계 주입 코드를 작성해봤습니다.

```java
@Autowired
//DiscountPolicy 타입의 Spring 빈이 하나만 있다면 문제 없지만...
private DiscountPolicy discountPolicy;
```

만약, `DiscountPolicy` 타입의 빈이 여러개 있다면, 오류가 발생할 것입니다. **`@Autowired` 필드 이름 매칭 방식**으로 오류를 해결하려면 다음과 같이 빈 이름을 필드 이름으로 작성해주시면 됩니다.

```java
@Autowired
//DiscountPolicy 타입의 rateDiscountPolicy Spring 빈을 주입합니다.
private DiscountPolicy rateDiscountPolicy;
```

이렇게 빈 이름을 필드 이름으로 작성하면 `DiscountPolicy` 타입의 `rateDiscountPolicy` 빈이 주입됩니다.

### @Qualifier와 @Primary 활용

필드 이름 매칭 방식 외에도 활용할만한 방식이 2가지 더 있습니다. `@Qualifier`와 `@Primary` 어노테이션을 활용하는 방법입니다. 먼저 `@Qualifier` 어노테이션은 빈을 등록할 때, 추가적인 주입 옵션을 부여하는 어노테이션입니다. 사용 방법은 다음과 같습니다.

```java
@Component
@Qualifier("mainDiscountPolicy")
public class RateDiscountPolicy implements DiscountPolicy {}
```

위와 같이 Spring 빈으로 등록할 클래스에 `@Qualifier` 어노테이션으로 의존관계 주입 시에 추가적으로 사용할 옵션을 부여할 수 있습니다. `@Qualifier`를 통해 추가한 옵션은 다음과 같이 의존관계 주입 시 활용할 수 있습니다. 예시로 우리의 주력 의존관계 주입 방식이 되어야 하는 생성자 주입 방식을 사용하겠습니다.

```java
@Autowired
public OrderServiceImpl(MemberRepository memberRepository, @Qualifier("mainDiscountPolicy") DiscountPolicy discountPolicy) {
    this.memberRepository = memberRepository;
    this.discountPolicy = discountPolicy;
}
```

이렇게 `@Qualifier`를 사용하면 `@Qualifier` 어노테이션을 통해 `mainDiscountPolicy`라는 이름을 옵션으로 추가한 빈을 먼저 매칭하고, 없다면 변수 이름과 동일한 빈 이름을 가진 빈을 매칭합니다.

마지막으로 `@Primary`는 여러 동일한 타입의 빈들이 있을 경우, **우선 순위**를 지정해주는 어노테이션입니다. `@Autowired`를 통해 의존관계를 자동 주입할 때, 같은 타입의 빈들이 여러개 매칭되면, `@Primary` 어노테이션이 붙은 빈이 우선권을 가지게 됩니다.

```java
@Component
@Primary //RateDiscountPolicy 빈이 우선 순위가 높습니다.
public class RateDiscountPolicy implements DiscountPolicy {}

@Component
public class FixDiscountPolicy implements DiscountPolicy {}
```

위와 같이 코드를 작성하면 `RateDiscountPolicy` 빈이 같은 타입을 가진 `FixDiscountPolicy` 빈 보다 더 높은 우선 순위를 갖고 있게 됩니다. 따라서 다음 코드 실행 시, `discountPolicy` 필드에는 `RateDiscountPolicy`가 주입됩니다.

```java
@Autowired
public OrderServiceImpl(MemberRepository memberRepository, DiscountPolicy discountPolicy) {
      this.memberRepository = memberRepository;
      this.discountPolicy = discountPolicy; //@Primary가 붙은 RateDiscountPolicy가 주입됩니다.
}
```

지금까지 살펴본 바로는 `@Qualifier`와 `@Primary` 모두 사용하는데 크게 번거로움은 없어보입니다. 둘 중 아무거나 사용해도 꽤 괜찮은 코드가 완성될 것입니다. 그러나 좀 더 세밀하게 두 어노테이션의 용도를 구분하자면 `@Primary`는 코드에서 자주 사용하는 빈을 주입해야할 때, `@Qualifier`는 특별히 지정해줘야하는 빈을 주입해야할 때 사용하는 것이 더 깔끔한 코드를 유지할 수 있습니다.

두 어노테이션 간의 우선 순위는 Spring의 기본적인 우선 순위와도 연관이 있습니다. Spring은 **자동 보다 수동**, **넓은 범위 보다 좁은 범위**가 **우선권을 갖습니다.** 따라서, 더 좁은 범위(특정 빈)를 의존관계 주입 대상으로 지정하는 `@Qualifier`가 우선권을 갖습니다. 이런 정책 덕분에 특별히 원하는 빈을 주입하고 싶은 곳에만 `@Qualifier`로 지정해주는 방식이 유효한 것입니다.

## 조회한 빈이 모두 필요할 때

만약, **의도적으로 타입이 중복된 빈들이 모두 필요**한 경우가 생길 때는 어떻게 해야할까요? 너무나 간단하게도 `List`나 `Map` 같은 자료구조를 활용해 모든 빈을 일단 컨테이너로부터 불러오고, 필요에 따라 의존관계를 주입하는 방식으로 같은 타입의 여러 빈들을 활용할 수도 있습니다.

이를 소위 **전략 패턴**이라고 합니다. 사용자가 건네준 조건에 따라 다르게 작동해야하는 로직이 있을 때, 타입은 같되 로직이 서로 다른 빈들을 미리 **모두** 준비해두고, Spring 빈 주입 시, 조건에 맞춰 필요한 빈을 유연하게 주입합니다.

전략 패턴을 적절하게 활용하면 추가적인 코드 변경 필요 없이 원하는 로직을 적재적소에 구동할 수 있게 할 수 있습니다. 바로, SOLID의 OCP를 잘 지킨 코드가 되는 것입니다.

## 자동과 수동 빈 등록, 올바른 실무 운영법

지금까지 상당히 긴 호흡으로 Spring의 의존관계 주입에 대해 알아봤습니다. 어노테이션을 통한 수동 빈 등록과 [컴포넌트 스캔](https://blog.coderoad.kr/component-scan) 빈 등록, 여러 의존관계 주입 방식들의 장단점 등, Spring이 빈과 의존관계를 다루는 정말 다양한 방식들을 알게 되었는데, 도대체 어떤 방식을 기본으로 사용해야하는 것인지 확신이 서진 않습니다.

천천히 생각해보면 개발자들은 비효율적이고 반복적인 과정을 **직접** 겪어야할 필요가 없습니다. 오히려 그런 과정들을 피할 수 있다면 기존의 방식을 과감하게 포기하고 더 간편하고 효율적인 방식으로 코드를 작성해야합니다. 우리가 사용하는 Spring 생태계는 **자동** 방식들을 선호하고, 더 나아가 자동 방식들을 **기본으로 사용**합니다.

물론, 애플리케이션의 설정 정보를 가지는 **구성자**인 **Java 설정 클래스**나 xml 파일을 통해 애플리케이션의 실제 로직과 구성 정보를 분리해주는 것이 이상적인 코드지만, 개발자는 간편한 컴포넌트 스캔 기능을 포기할 이유가 없습니다. **Spring이 자동 빈 등록 기능을 사용해도 OCP와 DIP를 준수할 수 있도록 돕기 때문에**, Java 설정 클래스를 개발자가 직접 관리하는 것은 오히려 부담스러운 작업이 될 가능성이 높습니다.

기본적으로 자동 빈 등록과 자동 의존관계 주입 방식을 사용하다가, 애플리케이션에 광범위하게 영향을 미치는 **기술 지원 객체나 다형성을 적극 활용해야할 때**, 수동 빈 등록과 주입 방식을 사용하는 것을 추천합니다. 데이터베이스 연결과 같은 애플리케이션 전반에서 필요한 기능을 담당하는 **기술 지원 객체**는 그렇게 많은 수가 필요하지도 않고, 오히려 수동 등록을 통해 어떤 빈인지 명확하게 하는 것이 유지보수에 도움이 된다고 합니다.
