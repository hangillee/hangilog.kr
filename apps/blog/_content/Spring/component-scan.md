---
title: '컴포넌트 스캔'
subtitle: 'Spring 빈을 더 현명하게 관리하기'
date: 2023-01-21 00:00:00
category: 'Spring'
---

**본 문서는 인프런에서 수강할 수 있는 [스프링 핵심 원리 - 기본편](https://inflearn.com/course/스프링-핵심-원리-기본편)을 수강한 후, 공부한 내용을 정리한 문서입니다. 본 문서의 모든 저작권은 해당 강의의 저자이신 [김영한](https://inflearn.com/users/@yh) 우아한형제들 기술이사님께 있습니다.**

## 컴포넌트 스캔?

우리는 지금까지 Spring 빈을 Spring 컨테이너에 등록할 때, 구성자(Java 설정 클래스)에서 `@Bean` 어노테이션이나 XML 파일을 통해 등록했습니다. (자세한 설명은 [IoC와 DI](https://blog.coderoad.kr/ioc-di)와 [Spring 컨테이너와 Bean](https://blog.coderoad.kr/container-bean) 문서 참고!) 아주 간단한 Spring 애플리케이션이라면 이 방식도 괜찮지만, 규모가 큰 서비스에서 하나하나 직접 빈을 등록하는 것은 여러 문제점이 있습니다. 개발자가 직접 설정 정보를 작성해야하기 때문에 설정 클래스의 코드가 지나치게 길어지고, 등록해야할 빈을 실수로 빼먹기도 하는 문제가 발생합니다. 더군다나 이런 단순 반복 작업을 개발자가 하게 되는 것 자체가 너무 비효율적입니다.

다행히 Spring이 개발자가 사소한 일에 너무 많은 시간을 쏟지 않도록 자동으로 Spring 빈을 등록해주는 **컴포넌트 스캔**이라는 기능을 제공합니다. 기존에 `@Configuration` 어노테이션을 붙여 설정 클래스로 지정한 클래스의 빈 등록 코드를 모두 지우고 `@ComponentScan`이라는 어노테이션을 붙여주면 빈 생성과 등록을 모두 자동으로 합니다!

```java
//설정 클래스가 이제 스스로 빈을 생성하고 등록합니다!
@Configuration
@ComponentScan
public class AppConfig {
    //@ComponentScan이 없던 코드와 다르게 클래스 내부가 비어도 괜찮습니다.
}
```

이렇게 어노테이션 하나만 추가하고 간단하게 자동 등록 기능이 동작하면 정말 좋겠지만, 그렇지 않습니다. 이 방식을 사용하려면 2가지 선행 조건을 충족해야합니다. **Spring 빈으로 등록하고자 하는 Java 클래스에 `@Component` 어노테이션**을 붙여줘야 하며, 의존관계를 명시한 코드가 설정 클래스에서 없어졌으니 **`@Component` 어노테이션을 붙인 클래스에서 직접 의존관계 주입**을 해줘야합니다. 그래도 크게 걱정할 필요 없습니다. Spring은 `@AutoWired` 어노테이션을 통해 의존관계 자동 주입 기능도 제공합니다.

```java
@Component //이제 이 Java 클래스는 Spring 빈입니다.
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;

    @Autowired //Spring이 MemberRepository에 대한 의존관계를 자동으로 주입해줍니다.
    public MemberServiceImpl(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }
}
```

이 기능들의 원리는 의외로 간단한데, `@ComponentScan`은 `@Component` 어노테이션이 붙은 모든 클래스를 Spring 빈으로 등록합니다. 이때 빈 이름은 `@Bean` 방식과 유사하게 클래스명을 사용하되 맨 앞글자만 소문자로 등록합니다. (`@Bean` 방식은 메소드 명을 이름으로 사용했습니다.) 또한, `@Component("이름")`과 같이 빈 이름을 직접 지어줄 수도 있습니다.

이렇게 등록된 빈들은 `@Autowired` 어노테이션이 붙어 있는 생성자나 필드를 만나면 Spring 컨테이너에 의해 조회되고 주입됩니다. 이때, 컨테이너가 사용하는 기본 조회 방식은 타입으로 찾는 방식입니다. `getBean(타입.class)`와 동일하다고 보면 됩니다.

## 컴포넌트 스캔 범위 설정

`@ComponentScan`을 사용해 빈을 등록하는 방식은 `@ComponentScan` 어노테이션이 붙은 클래스가 위치한 패키지와 하위 패키지의 모든 Java 클래스를 하나씩 검사하는 방식입니다. 따라서 명확하게 Spring 빈이 아닌 클래스들은 스캔 범위에서 제외해주면 성능 향상에 도움이 됩니다.

```java
@ComponentScan(
    //컴포넌트 스캔을 시작할 위치를 지정합니다.
    //code.road를 포함해 모든 하위 패키지를 스캔합니다.
    //시작 위치를 여러개 설정할 수도 있습니다.
    basePackages = "code.road",
)
```

물론 이렇게 직접 지정할 수도 있지만, 이 글을 작성하게된 강의의 저자이신 김영한님께서 가장 권장하시는 방법은 **시작 위치를 따로 지정하지 않고 Java 설정 클래스(`@ComponentScan`이 붙은 클래스)를 프로젝트의 최상단에 두는 방법**이었습니다. Spring Boot도 기본적으로 이 방식을 사용하고, 설정 클래스는 프로젝트를 대표하는 정보이기 때문에 최상단에 두는 것이 좋다라고 하셨기 때문에, 저도 프로젝트를 진행하면서 따로 스캔 시작 위치를 지정하지는 않고 있습니다.

추가로 컴포넌트 스캔 기본 대상은 `@Component` 어노테이션 뿐만 아니라 `@Controller`, `@Service`, `@Repository`, `@Configuration`도 컴포넌트 스캔 기능의 스캔 대상입니다. 우리가 Spring Web MVC를 공부하고 애플리케이션을 만들면서 자주 사용하게 될 어노테이션입니다. 위 어노테이션을 사용하면 우리가 크게 신경쓰지 않아도 Spring 빈으로 자동 등록됩니다.

## 필터를 사용해보자

필터를 통해 컴포넌트 스캔 대상에 추가하거나 제외할 수 있습니다. 예시 코드를 통해 간단하게 필터 사용법을 알아보겠습니다.

```java
@ComponentScan(
    //BeanA는 스캔 대상에 추가되고
    includeFilters = @Filter(type = FilterType.ASSIGNABLE_TYPE, classes = BeanA.class),
    //BeanB는 스캔 대상에서 제외됩니다.
    excludeFilters = @Filter(type = FilterType.ASSIGNABLE_TYPE, classes = BeanB.class)
)
```

`FilterType`에 올 수 있는 옵션에는 5가지가 있습니다.

- ANNOTATION : 기본값으로 어노테이션을 인식해 필터링합니다.
- ASSIGNABLE_TYPE : 지정한 타입과 자식 타입을 필터링합니다.
- ASPECTJ : AspectJ 패턴을 통해 필터링합니다.
- REGEX : 정규 표현식을 통해 필터링합니다.
- CUSTOM : `TypeFilter`라는 인터페이스를 구현해서 필터링합니다.

그러나, 스캔 대상에 추가하는 기능은 `@Component`나 `@Service` 같은 스캔 대상 어노테이션을 붙여주는 것으로 충분해 거의 사용하지 않습니다. 거기다 스캔 대상에서 제외하는 기능도 사용할 일이 많지 않으며, Spring Boot가 기본적으로 컴포넌트 스캔 기능을 제공하기 때문에, 필터를 사용하지 않는 편이 낫습니다. 그래서 컴포넌트 스캔에 필터라는 기능도 존재한다고 알고 넘어가면 될 것 같습니다.

## 중복과 충돌

컴포넌트 스캔을 이용해 Spring 빈을 **자동** 등록하다보면 빈 이름이 중복되는 문제가 발생할 수 있습니다. 이때, **자동으로 등록된 빈들은** 개발자가 **수동으로 등록한 빈보다 우선 순위가 떨어집니다.** 기존의 Spring 프레임워크는 수동 등록한 빈이 자동으로 등록된 빈을 덮어씌워버리기 때문에 의도하지 않았다면 정말 잡아내기 힘든 버그가 탄생하게 됩니다.

그래서인지 최근 Spring Boot에서는 수동 등록 빈과 자동 등록 빈의 이름 중복으로 등록 과정에서 충돌이 발생하면 덮어씌우지 않고 오류를 발생시킵니다.

```java
Consider renaming one of the beans or enabling overriding by setting spring.main.allow-bean-definition-overriding=true
```

물론 자동 등록 빈 사이에서도 빈 이름 중복이 발생하면 오류가 발생합니다.

```java
Caused by: org.springframework.context.annotation.ConflictingBeanDefinitionException: ...
```

사실 클래스 이름을 중복해서 작성하지 않는 한, 자주 볼 일 없는 오류지만 주의해야합니다.
