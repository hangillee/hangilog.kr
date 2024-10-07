---
title: '빈 스코프'
subtitle: 'Spring 빈의 스코프'
date: 2023-01-24 00:00:00
category: 'Spring'
---

**본 문서는 인프런에서 수강할 수 있는 [스프링 핵심 원리 - 기본편](https://inflearn.com/course/스프링-핵심-원리-기본편)을 수강한 후, 공부한 내용을 정리한 문서입니다. 본 문서의 모든 저작권은 해당 강의의 저자이신 [김영한](https://inflearn.com/users/@yh) 우아한형제들 기술이사님께 있습니다.**

문서 공사중입니다.

## Spring 빈 스코프?

Spring 빈은 Spring 컨테이너가 시작될 때 함께 생성되고, 컨테이너가 종료될 때 같이 소멸됩니다. 이렇게 **빈이 존재할 수 있는 범위**를 **스코프**라고 합니다. Spring은 다양한 스코프를 지원합니다.

- **싱글톤** : 기본 스코프로 컨테이너의 생성과 소멸까지 유지되는 가장 넓은 스코프
- **프로토타입** : 컨테이너가 빈의 생성과 의존관계 주입까지만 관여하는 매우 짧은 스코프
- **웹 관련 스코프**
  - **request** : 웹 요청이 들어오고 나갈 때까지 유지되는 스코프
  - **session** : 웹 세션이 생성되고 소멸될 때까지 유지되는 스코프
  - **application** : 웹의 Servlet 컨텍스트와 같은 범위로 유지되는 스코프

기본적으로 Spring 빈은 싱글톤 패턴으로 생성됩니다. 프로토타입이나 웹 관련 스코프를 적용하려면 `@Scope` 어노테이션을 활용해서 적용하면 됩니다.

```java
//이 빈은 프로토타입 스코프입니다.
//빈 생성과 의존관계 주입 후에는 컨테이너가 관리하지 않습니다.
@Scope("prototype")
@Bean
PrototypeBean ExampleBean() {
    private int count = 0;
    public void addCount() {
        count++;
    }
    public int getCount() {
        return count;
    }
}
```

## 프로토타입 스코프

싱글톤 스코프 빈, 즉, 일반적인 빈은 컨테이너에서 조회하면 항상 같은 인스턴스의 빈을 반환해줍니다. Spring 컨테이너가 생성된 빈을 컨테이너 소멸 시까지 관리하기 때문입니다. 반대로, 프로토타입 스코프 빈은 컨테이너가 항상 새로운 인스턴스를 생성해서 반환해주는데, **컨테이너가 빈을 생성하고 의존관계를 주입해주면 더 이상 관리하지 않아** 반환해줄 빈이 없기 때문입니다. 따라서, **클라이언트가 빈을 요청하면 항상 새로 생성해서 반환**합니다.

프로토타입 빈은 초기화 콜백 메소드인 `@PostConstruct`는 실행되지만, `@PreDestroy`와 같은 소멸 콜백 메소드는 실행되지 않습니다. 때문에, 프로토타입 빈은 빈을 조회한 클라이언트가 직접 관리해줘야합니다. 당연히 소멸 콜백 메소드에 대한 호출도 클라이언트가 직접 해야합니다.

### 프로토타입 스코프의 문제점

프로토타입 스코프 빈에는 큰 문제가 하나 존재합니다. **싱글톤 빈과 함께 사용할 때**, 프로토타입 스코프 빈이 **의도한대로 동작하지 않을 가능성이 있습니다**. 바로, 프로토타입 스코프 빈을 싱글톤 스코프 객체 안의 필드에 저장하게 되면 프로토타입의 특징을 잃어버리는 문제입니다.

우리가 프로토타입 빈을 사용할 때는 빈을 생성할 때마다 매번 새로운 인스턴스가 들어오는 것을 기대합니다. 그러나 막상 싱글톤 빈의 필드에 프로토타입 빈을 주입 받아 사용해보면 **기존에 저장된 인스턴스가 호출**됩니다. 이렇게 의도치 않게 프로토타입 빈이 싱글톤 빈과 함께 유지되는 이유는 프로토 타입 빈이 엄밀히 말하면 **의존관계가 주입 될 때** 새로 생성되는 것이지 **이미 주입된 빈을 사용할 때는 새로 생성되지 않기 때문** 입니다.

```java
@Scope("prototype")
public class PrototypeBean() {
    ...
}

//싱글톤 빈의 필드에 프로토타입 빈을 대입하는 예시입니다.
public class SingletonBean() {
    private final PrototypeBean prototypeBean;

    @Autowired
    public SingletonBean(PrototypeBean prototypeBean) {
        //의존관계를 주입할 때만 새로운 PrototypeBean 인스턴스가 생성되고,
        //이 필드를 활용할 때는 새로 생성하는 것이 아니라 저장된 인스턴스가 호출됩니다.
        this.prototypeBean = prototypeBean;
    }
}
```

### 스코프와 Provider

이렇게 싱글톤 빈과 프로토타입 빈을 같이 쓸 때 발생하는 문제를 해결하기 위해선 **싱글톤 빈이 프로토타입 빈을 사용할 때 마다 Spring 컨테이너에 새로운 인스턴스를 요청**해야합니다. 이를 **의존관계 탐색**(Dependency Lookup)이라고 하는데, 의존관계 주입과 다르게 스스로 필요한 의존관계를 위한 인스턴스를 컨테이너에서 찾아 반환받는 것입니다. DL를 활용하는 가장 간단하고 익숙한 방법은 Spring 컨테이너, 즉,`AnnotationConfigApplicationContext`의 `getBean()` 메소드를 통해 항상 새로운 프로토타입 빈을 생성해 반환받는 방법입니다.

```java
@Autowired
private ApplicationContext ac;

public int mainLogic() {
    //로직을 실행할 때마다 컨테이너로부터 항상 새로운 프로토타입 빈을 반환받습니다.
    PrototypeBean prototypeBean = ac.getBean(PrototypeBean.class);
    prototypeBean.addCount();
    int count = prototypeBean.getCount();
    return count;
}
```

우리가 지금까지 자주 다뤘던 메소드를 통해 해결하는 방법이지만 이 방법에도 문제가 있습니다. 바로 TDD(테스트 주도 개발)을 위한 단위 테스트 작성이 어렵다는 점입니다. 이 방법은 `ApplicationContext` 객체가 없이는 사용할 수 없기 때문에 테스트를 작성할 때마다 `ApplicationContext`를 주입받아야 합니다. `ApplicationContext`는 편리하기도 하지만 그만큼 많은 기능을 제공하고 이 말은 **불필요한 기능도 많다**는 것입니다. 또한, `ApplicationContext`가 꼭 필요하기 때문에 Spring에 종속적인 코드가 됩니다. 우리가 Spring을 공부하면서 계속 피해왔던 것이 특정 기술에 종속적인 코드를 작성하는 것이었던 걸 생각하면 이 방법보다 더 나은 방법을 찾아야 합니다.

다행히도 Spring에는 불필요한 기능들을 제외하고 **DL** 기능만 제공하는 **`ObjectProvider`**라는 객체가 있습니다. `ObjectProvider`는 `ObjectFactory`에 편의 기능을 추가한 객체로 DL 외에도 `ObjectFactory` 상속, 옵션, 스트림 처리 기능을 제공합니다. 별도의 라이브러리 없이 간단하게 사용할 수 있고 테스트 작성도 수월합니다. 그러나 여전히 Spring에 의존적이라는 문제는 해결하지 못합니다.

```java
@Autowired
private ObjectProvider<PrototypeBean> prototypeBeanProvider;

public int mainLogic() {
    //ObjectProvider를 통해 매번 새로운 프로토타입 빈을 반환받습니다.
    PrototypeBean prototypeBean = prototypeBeanProvider.getObject();
    prototypeBean.addCount();
    int count = prototypeBean.getCount();
    return count;
}
```

마지막 문제인 Spring에 의존적인 코드를 벗어나기 위해선 `javax.inject.Provider`라는 **JSR-330** Java 표준 Provider를 사용하는 방법입니다. 참고로 **Spring Boot 3.0**에서는 `jakarta.inject.Provider` ㅖ라이브러리를 사용합니다. 사용법은 다음과 같습니다.

```java
@Autowired
private Provider<PrototypeBean> provider;

public int mainLogic() {
    //jakarta.inject.Provider 라이브러리의 Provider를 사용합니다.
    PrototypeBean prototypeBean = provider.get();
    prototypeBean.addCount();
    int count = prototypeBean.getCount();
    return count;
}
```

`Provider`는 `get()` 메소드로 Spring의 `ObjectProvider`와 동일하게 DL을 통해 Spring 컨테이너로부터 새로운 인스턴스를 반환받습니다. 이 방법은 Java 표준이고 단순하기 때문에 Spring에 의존적이지 않고 단위 테스트를 작성하기 좋습니다.

지금까지 열심히 프로토타입 빈에 대해 알아봤습니다. 프로토타입 빈은 **'사용할 때마다 의존관계 주입이 완료된 새로운 객체가 필요할 때'** 사용하면 됩니다. 사실, 실무에서 웹 애플리케이션을 개발할 때, 싱글톤 빈으로 대부분의 문제를 해결할 수 있기 때문에 프로토타입 빈을 직접 사용하는 일은 매우 드물다고 합니다.

## 웹 스코프

마지막으로 알아볼 스코프는 **웹 스코프**입니다. 싱글톤 스코프는 Spring 컨테이너의 시작과 끝을 함께하고, 프로토타입 스코프는 빈 생성과 의존관계 주입, 초기화까지만 담당하는 특수한 스코프였습니다. 그렇다면 웹 스코프는 어떤 스코프일까요? 굳이 다르게 구분한 이유는 무엇일까요?

웹 스코프의 가장 큰 특징은 **'웹 환경'에서만 동작**한다는 것입니다. 또한 싱글톤 스코프와 마찬가지로 웹 스코프의 종료 시점까지 Spring에서 관리해 소멸 콜백 메소드를 호출할 수 있습니다. 웹 스코프의 종류는 다음과 같습니다.

- **request** : HTTP 요청이 들어오고 나갈 때까지 유지되는 스코프로 각각의 HTTP 요청마다 별도의 인스턴스를 생성 및 관리
- **session** : HTTP의 Session과 동일한 생명주기를 가지는 스코프
- **application** : **서블릿 컨텍스트(ServletContext)**와 동일한 생명주기를 가지는 스코프
- **websocket** : 웹 소켓과 동일한 생명주기를 가지는 스코프

웹 스코프도 프로토타입 스코프와 마찬가지로 인스턴스와 관련된 문제가 발생할 수 있습니다. 바로, 실제 사용자의 웹 요청이 있기 전까지는 웹 스코프 빈의 인스턴스가 생성되지 않아 필요한 인스턴스가 제대로 할당되지 않은 채 로직이 실행되는 문제입니다. 이 문제도 앞서 정리해본 **Provider**를 통해 해결할 수 있습니다. `ObjectProvider`는 `getObject()`와 같은 DL 메소드를 호출하는 시점까지 **웹 스코프 빈의 생성을 지연할 수 있습니다.**

다시 말해서, HTTP 요청이 진행 중인 순간에 `getObject()`를 호출하면 빈이 정상적으로 생성되고 로직이 문제 없이 작동하는 것을 알 수 있습니다. 그러나 아직도 근본적인 문제가 남아있습니다. 이 코드는 **너무 비효율적이고 복잡합니다.** 이런 일련의 문제 해결 과정을 직접 구현하는 것은 본 문제보다 부가적인 문제에 너무 집중하게 됩니다. 흔히 말하는 배보다 배꼽이 더 큰 상황입니다.

## 스코프와 프록시

웹 스코프의 인스턴스 문제를 해결해주기 위해 **프록시**라는 기술을 활용하면 좋습니다. Spring 빈의 스코프를 지정해주는 `@Scope` 어노테이션의 속성인 `proxyMode`를 활용해 프록시 방식을 활용할 수 있습니다.

```java
@Component
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class MyWebScopeBean {
}
```

`proxyMode`의 속성에는 `TARGET_CLASS`와 `INTERFACES` 두 가지가 있습니다. 스코프를 적용하려는 객체가 클래스일 경우 `TARGET_CLASS`를, 인터페이스일 경우 `INTERFACES`를 `ScopedProxyMode`에 붙여주면 됩니다. 이렇게 속성을 부여한 객체는 HTTP 요청 여부에 상관 없이 **가짜 프록시 인스턴스**를 빈에 미리 주입해 둘 수 있습니다. Provider를 사용하기 전에 인스턴스가 없어서 발생했던 문제를 가짜 프록시 인스턴스를 통해 해결한 것입니다. 즉, 복잡하고 거추장스러운 Provider를 사용하지 않고도 문제를 해결할 수 있게 된 것입니다!

이것이 가능한 이유는 바이트코드를 조작하는 **CGLIB 라이브러리를 활용해** 내가 직접 작성한 클래스(예를 들어 예제 코드의 `MyWebScopeBean`)를 상속 받은 **가짜 프록시 객체**를 만들어서 대신 주입하고, HTTP 요청이 왔을 때 **가짜 프록시 객체**가 내부의 위임 로직을 통해 진짜 객체의 로직을 실행하기 때문입니다. 쉽게 설명하자면, **가짜 프록시 객체는 자리만 지키고 있다**가 실제 사용자 요청이 들어오면 **자신이 상속 받은 진짜 빈을 호출**하고 그때서야 나타난 진짜 빈이 사용자가 요청한 로직을 수행하는 것입니다.

프록시 객체 덕분에 클라이언트는 싱글톤 빈을 사용하는 것처럼 편리하게 웹 스코프를 사용할 수 있습니다. 이는 다형성의 장점이기도 한데, 클라이언트는 내부 코드가 어떻게 동작하는지, 실제로 내가 어떤 객체를 사용하는지는 전혀 알 필요가 없습니다. 다시 말해서, 다형성 덕분에 **클라이언트의 변경 없이 유연하게 객체를 바꿔가며 문제를 해결**한 것입니다.

사실, Provider를 통한 해결법이든, 프록시 객체를 통한 해결법이든, 중요한 것은 진짜 객체, 진짜 빈을 컨테이너에서 조회하는 시점을 꼭 필요할 때까지(실제 요청이 들어오거나, 사용할 때 마다) 지연 처리 한다는 점입니다. 추가로, 꼭 웹 스코프가 아니더라도 프록시 기능을 사용할 수 있습니다.
