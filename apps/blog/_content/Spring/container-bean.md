---
title: 'Spring 컨테이너와 빈'
subtitle: '컨테이너와 빈의 개념 정리'
date: 2023-01-19 00:00:00
category: 'Spring'
---

**본 문서는 인프런에서 수강할 수 있는 [스프링 핵심 원리 - 기본편](https://inflearn.com/course/스프링-핵심-원리-기본편)을 수강한 후, 공부한 내용을 정리한 문서입니다. 본 문서의 모든 저작권은 해당 강의의 저자이신 [김영한](https://inflearn.com/users/@yh) 우아한형제들 기술이사님께 있습니다.**

## Spring 컨테이너

Spring은 **[IoC(제어의 역전)](https://blog.coderoad.kr/ioc-di)** 개념을 통해 탄생한 구성자, **컨테이너**로 프로그램의 흐름을 제어합니다. Spring에서의 컨테이너를 **Spring 컨테이너**라고 부릅니다. Spring 컨테이너는 `ApplicationContext` 인터페이스를 통해 생성하는데, 이 `ApplicationContext` 자체를 Spring 컨테이너라고 하기도 합니다. 본격적으로 Spring을 활용하기 위해선 이 Spring 컨테이너를 생성해야합니다. 방법은 매우 간단합니다.

```java
//'AppConfig.class'는 프로그래머가 작성한 구성 정보를 담은 Java 설정 클래스입니다.
ApplicationContext applicationContext = new AnnotationConfigApplicationContext(AppConfig.class);
```

위 코드가 바로 Spring 컨테이너를 생성하는 코드입니다. `AnnotationConfigApplicationContext`는 `ApplicationContext` 인터페이스의 구현체로, `AppConfig`와 같이 구성 정보를 담은 **'어노테이션'** 기반의 **'Java 설정 클래스'**(구성자)를 통해 Spring 컨테이너를 생성합니다. Spring 컨테이너를 생성하는 방식은 다양합니다. 그 중, 대표적인 두 가지가 위의 코드와 같이 어노테이션 기반의 Java 설정 클래스를 통한 생성법과 XML을 기반으로한 생성법입니다. 최근에는 주로 Java 설정 클래스를 통해 Spring 컨테이너를 생성합니다.

우리는 Spring 컨테이너를 생성할 때 Java 설정 클래스(이제 설정 클래스라 작성하겠습니다.)를 활용한다는 것을 알았습니다. 그런데 Spring이 프로그램의 수많은 클래스들 중에 설정 클래스가 무엇인지 어떻게 알 수 있을까요? 또, 어노테이션을 기반으로 한다는데, 어노테이션은 무엇일까요? 당연히 모든 클래스가 설정 클래스가 되는 것은 아닙니다. 프로그램의 구성 정보(DI 정보)를 담고 있다고 해서 자동으로 설정 클래스가 되는 것도 아닙니다. 프로그래머가 설정 클래스로 사용하고자 하는 클래스를 **어노테이션**을 통해 직접 명시해줘야 Spring이 이를 확인하고 컨테이너를 생성하는데 설정 클래스로 등록된 클래스를 활용합니다.

어노테이션은 Java의 문법으로 메타데이터의 일종입니다. 쉽게 설명하자면 해당 코드가 무엇인지 설명해주는 역할을 가집니다. Spring은 여러가지 자체적인 어노테이션들을 가지고 있고, 프로그래머가 이를 사용해 Spring의 기술을 활용할 수 있도록 합니다. 그 중 가장 기초가 되는 것이 바로 순수한 클래스를 설정 클래스로 만들어주는 `@Configuration` 어노테이션입니다. 클래스 선언문 앞에 해당 어노테이션을 붙혀주면 Spring은 해당 클래스를 자동으로 설정 클래스로 인식하고 그에 맞는 동작들을 수행합니다.

```java
//이제 AppConfig 클래스는 Spring에 의해 설정 클래스로 관리됩니다.
@Configuration
public class AppConfig {
    ...
}
```

이렇게 `@Configuration` 어노테이션을 통해 설정 클래스로 등록된 `AppConfig` 클래스는 Spring 컨테이너 생성 시 프로그램의 구성 정보로 활용됩니다. Spring은 `AppConfig`에 적혀진 대로 객체를 생성하고, 관리하며, 의존관계를 주입합니다. 다시 말해, `@Configuration` 어노테이션에 의해 설정 클래스로 등록된 `AppConfig` 클래스는, IoC를 통해 프로그램의 제어권을 가지게 된 Spring 컨테이너에게 해당 프로그램의 설명서 역할을 하는 것입니다. `AnnotationConfigApplicationContext` 클래스를 기반으로 Spring 컨테이너를 생성하기 위해선 `AppConfig`와 같은 설정 클래스가 필수입니다.

## Spring 빈

Spring 컨테이너는 생성될 때, 구성 정보로 등록한 설정 클래스(`@Configuration`이 붙은 클래스)에 작성되어 있는 객체들을 모두 생성해서 자기 자신에 등록합니다. 이때, 컨테이너에 등록된 객체들을 **빈(Bean)**이라고 합니다.

> @Configuration 어노테이션 뿐만 아니라 @Component, @Controller 같은 어노테이션으로도 컨테이너에 빈 등록이 가능합니다! 각각 어노테이션들은 다른 포스트에서 설명하도록 하겠습니다.

물론 이 방식을 사용할 때, 설정 클래스에 있는 모든 요소들이 빈으로 등록되는 것은 아닙니다. `@Bean` 어노테이션을 붙힌 메소드가 반환하는 객체들이 등록되는 것입니다. 빈은 정확히는 컨테이너 내부의 빈 저장소에 등록되는데, 빈을 불러올 수 있는 키(key) 역할을 하는 **'빈 이름'**과 실제 객체인 **'빈 객체'**가 같이 등록됩니다. 빈 이름은 따로 지정해주지 않으면 `@Bean`을 붙혀 Spring 빈으로 지정한 메소드 이름으로 자동 저장됩니다. Spring 빈으로 등록하는 법은 다음과 같습니다.

```java
//컨테이너 생성에 활용할 구성 정보를 가진 설정 클래스입니다.
@Configuration
public class AppConfig {
    //Spring 빈으로 등록되었습니다.
    //빈 이름 : memberRepository
    //빈 객체 : MemoryMemberRepository 클래스의 인스턴스
    @Bean
    public MemberRepository memberRepository() {
        //IoC에 의해 해당 객체는 이 곳에서만 생성되고 의존관계가 주입됩니다.
        return new MemoryMemberRepository();
    }

    //빈 이름을 직접 등록할 수도 있습니다.
    @Bean(name="memberServiceBean")
    public MemberService memberService() {
        return new MemberServiceImpl(memberRepository());
    }
}
```

빈 이름을 직접 등록할 때 꼭 주의해야할 점은 이름이 중복되면 안된다는 것입니다. 서로 다른 두 빈이 같은 이름을 가지게 될 경우, 컨테이너에서 다른 하나의 빈은 무시되거나 아예 덮어씌워질 수도 있고 설정에 따라 오류가 발생할 수도 있습니다.

컨테이너의 역할인 생성과 관리(빈을 생성하고 컨테이너에 등록)까지 알아봤습니다. 다음은 가장 중요하다고 할 수 있는 컨테이너의 DI, 의존관계 주입 방식에 대해 알아보겠습니다. Spring은 빈을 생성하고 의존관계를 주입하는 단계가 나뉘어져 있습니다. 위의 코드로 설명하면, `@Bean` 어노테이션을 확인한 Spring은 그 아래에 있는 메소드들의 이름을 빈 이름으로, 그 메소드가 반환하는 객체들을 빈 객체로 Spring 컨테이너에 등록합니다. 이후, 메소드 안에 작성되어 있는 의존관계 정보(MemberServiceImpl 클래스는 memberRepository 빈에 의존합니다.)를 확인하고 그 의존관계를 주입해줍니다. 그런데, 위 코드와 같이 Java 설정 클래스를 통해 빈을 등록하면 생성자를 호출함과 동시에 의존관계도 주입됩니다. 즉, 단계가 나누어지지 않는다는 말입니다. 자세한 내용은 의존관계 자동 주입 파트에서 설명하겠습니다. 지금 가지고 가야할 정보는 설정 클래스를 활용해서 만들어진 Spring 빈은 생성될 때 의존관계가 자동으로 주입된다는 것입니다.

## 컨테이너의 빈 조회하기

이제 Spring 컨테이너를 생성하고 Spring 빈을 등록하는 방법까지 알아봤습니다. 이제 빈이 잘 등록되어 있는지 확인하는(혹은 빈을 활용하고자 객체를 불러오는) 방법에 대해 알아보겠습니다.

## 모두 조회하기

먼저 Spring에 등록된 모든 빈 정보를 확인할 수 있는 방법입니다.

```java
//설정 클래스 AppConfig를 구성 정보로 하는 어노테이션 기반 Spring 컨테이너 생성
AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);

void findAllBean() {
    //빈 이름들을 모두 받아온 후
    String[] beanDefinitionNames = ac.getBeanDefinitionNames();
    //해당 빈 이름을 가진 빈 객체를 받아와서
    for(String beanDefinitionName : beanDefinitionNames) {
        Object bean = ac.getBean(beanDefinitionName);
        //출력
        System.out.println("name = " + beanDefinitionName + " object = " + bean);
    }
}
```

현재 Spring에서 관리하고 있는 모든 Spring 빈을 출력하는 방법입니다. `ac.getBeanDefinitionNames()`을 통해 Spring에 등록된 모든 빈 이름을 조회하고, `ac.getBean()`으로 조회한 빈 이름을 가진 빈 객체(인스턴스)를 조회합니다. 여기서 `ac`는 Spring 컨테이너 인스턴스를 담은 변수입니다. 당연히 이 이름은 바뀔 수 있습니다.

그러나 조금 아쉬운 점이 있습니다. 위의 방식을 사용하면 내가 등록한 Spring 빈 뿐만 아니라 Spring 자체적으로 등록한 Spring 빈들도 모두 조회됩니다. 내가 직접 등록한 빈들만 확인하려면 어떻게 해야할까요? 방법은 다음과 같습니다.

```java
//설정 클래스 AppConfig를 구성 정보로 하는 어노테이션 기반 Spring 컨테이너 생성
AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);

void findApplicationBean() {
    //빈 이름들을 모두 받아온 후
    String[] beanDefinitionNames = ac.getBeanDefinitionNames();
    //해당 빈 이름을 가진 빈 객체를 받아와서
    for(String beanDefinitionName : beanDefinitionNames) {
        BeanDefinition beanDefinition = ac.getBean(beanDefinitionName);
        //해당 빈 이름을 가진 빈 객체의 속성을 확인한 후
        //직접 등록한 애플리케이션 빈일 경우
        if (beanDefinition.getRole() == BeanDefinition.ROLE_APPLICATION) {
            Object bean = ac.getBean(beanDefinitionName);
            //출력
            System.out.println("name = " + beanDefinitionName + " object = " + bean);
        }
        //Role ROLE_APPLICATION: 직접 등록한 애플리케이션 빈
        //Role ROLE_INFRASTRUCTURE: 스프링이 내부에서 사용하는 빈
    }
}
```

내가 직접 등록한 빈을 **'애플리케이션 빈'**이라고 합니다. Spring 내부의 빈과 애플리케이션 빈은 `getRole()` 메소드의 결과값으로 구분할 수 있습니다. `beanDefinition.getRole()`의 결과값은 `beanDefinition`에 저장해두었던 빈 이름을 가진 빈의 역할입니다. 만약 프로그래머가 직접 등록한 빈이라면 `ROLE_APPLICATION`이라는 결과값이 나옵니다. 이를 통해 내가 등록한 빈만 확인할 수 있습니다.

### 기본 방식

간단하게 정리하자면 Spring 컨테이너에서 빈을 찾는 가장 기본적인 방법은 `ac.getBean(빈 이름, 타입)`이나 `ac.getBean(타입)`입니다. 만약 이 방법으로 조회했는데 찾고자하는 Spring 빈이 존재하지 않는다면 다음과 같은 예외가 발생합니다. `NoSuchBeanDefinitionException: No bean named '' available`

기본 방식을 사용할 때 주의해야할 점은 조회 코드의 `타입` 인자에 구현체 타입을 대입해서 조회하면 유연성이 떨어진다는 것입니다. 프로그래머는 추상화에 의존해야하지 구현체에 의존해서는 안 된다는 **DIP**를 항상 기억합시다!

### 동일한 타입 존재 시

만약 동일한 타입의 빈이 여러개 저장되어 있다면 `타입` 인자만 넣어서 조회할 시 오류가 발생합니다. 이때는 `ac.getBean(빈 이름, 타입)` 메소드를 사용해서 찾고자하는 빈의 이름을 정확하게 지정해줘야합니다.

혹은, `ac.getBeansOfType(타입)`을 사용해 인자로 넘겨준 타입의 모든 빈을 조회할 수도 있습니다. 기본적으로 Spring 빈의 이름은 어노테이션을 통해 직접 지정하거나 메소드의 이름으로 자동 지정되기 때문에 여러 빈을 한 번에 조회해도 내가 찾고자하는 빈을 쉽게 찾을 수 있습니다.

### 상속 관계

Spring 빈은 Spring 컨테이너가 관리하는 Java 객체이기 때문에 당연히 **상속 관계도 가지고 있습니다.** 부모 타입으로 빈을 조회하면 자식 타입을 가지는 빈들도 모두 조회됩니다. 이러한 특징을 이용해 `Object` 타입으로 빈을 조회하면 모든 Spring 빈을 조회할 수 있습니다.

## BeanFactory와 ApplicationContext

우리는 지금까지 `ApplicationContext`만으로 Spring 컨테이너를 구현했습니다. 그런데 이 `ApplicationContext`의 상위 인터페이스가 존재합니다. 바로 `BeanFactory` 인터페이스입니다. `BeanFactory`는 Spring 컨테이너의 최상위 인터페이스로 Spring 빈을 관리하고 조회하는 역할을 담당합니다. 바로 이 인터페이스에서 `getBean()`을 제공합니다. 지금까지 우리가 알아본 대부분의 기능들을 이 `BeanFactory`가 제공합니다.

`ApplicationContext`은 `BeanFactory`를 상속받아 모든 기능들을 제공합니다. 그렇다면 `ApplicationContext`를 사용하는 이유는 무엇일까요? 당연한 말이지만 애플리케이션을 개발할 때는 빈의 관리와 조회 뿐만 아니라 다른 부가 기능들도 필요합니다.

`ApplicationContext`는 `BeanFactory`를 비롯해 애플리케이션 국제화를 위한 `MessageSource` 인터페이스, 로컬, 개발, 운영을 구분해서 처리하기 위해 지정하는 환경 변수를 다루는 `EnvironmentCapable` 인터페이스 등을 추가로 상속받아 더 풍부한 편의 기능들을 제공합니다. 덕분에 우리가 `BeanFactory`를 직접 사용할 일은 거의 없습니다. 대부분의 경우에 `ApplicationContext`를 사용합니다.

물론 `BeanFactory`, `ApplicationContext` 두 인터페이스 모두 Spring 빈을 관리하고 조회하기 때문에 Spring 컨테이너입니다.

## BeanDefinition

우리는 지금까지 Spring 컨테이너가 **어노테이션**과 **Java 설정 클래스**(AppConfig 클래스)를 통해 설정 정보를 읽어와 Spring 빈을 생성하고 DI(의존관계 주입)를 진행한다는 것도 알아봤습니다. 그런데 앞서 Java 설정 클래스 방식뿐만 아니라 XML을 통한 설정법도 있다고 언급했습니다. 물론 지금은 잘 사용하지 않는 오래된 방식이지만 여전히 사용 중인 레거시 프로젝트들이 있기에 정상적으로 지원되고 있습니다. Spring은 어떻게 다양한 설정 방식을 지원하는 것일까요? 그 비밀은 바로 `BeanDefinition` 인터페이스에 있습니다.

`BeanDefinition`은 XML 방식을 사용하든 Java 설정 클래스를 사용하든 개발자가 작성한 설정 정보를 기반으로 빈 설정 메타데이터를 가지게 됩니다. 그렇기에 Spring 컨테이너는 개발자가 어떤 방식을 사용(구현)했는지 알 필요 없이 `BeanDefintion`만 알고 있다면 적절하게 빈들을 생성하고, 관리하고 각종 기능들을 제공할 수 있습니다. 즉, 세상을 **역할**과 **구현**으로 나누는 **다형성**을 통해 실제 구현체(Java 설정 클래스나 XML 파일)가 무엇이든 `BeanDefinition`이라는 역할(추상화)에만 의존하는 것입니다. 덕분에 컨테이너는 유연하게 다양한 설정 지정 방식을 지원할 수 있게 된 것입니다.

사실 실무에서 이 `BeanDefinition`을 직접 다룰 일은 거의 없다고 합니다. 이 `BeanDefinition`을 깊이 있게 알기보다 어떤 방식으로 Spring이 다양한 형태의 설정 정보를 다루는지를 알기 위해 공부하는 것이 좋을 것 같습니다. 중요한 점은 Spring이 설정 정보를 다루는 과정에서 **다형성**을 활용한다는 것입니다. 그만큼 OOP에 대해 제대로 공부해야만 Spring을 온전히 내 기술로 다룰 수 있을 것 같습니다.
