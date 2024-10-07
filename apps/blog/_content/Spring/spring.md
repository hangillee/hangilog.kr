---
title: 'Spring이란?'
subtitle: 'Spring 기초 정리'
date: 2023-01-15 00:00:00
category: 'Spring'
---

**본 문서는 인프런에서 수강할 수 있는 [스프링 핵심 원리 - 기본편](https://inflearn.com/course/스프링-핵심-원리-기본편)을 수강한 후, 공부한 내용을 정리한 문서입니다. 본 문서의 모든 저작권은 해당 강의의 저자이신 [김영한](https://inflearn.com/users/@yh) 우아한형제들 기술이사님께 있습니다.**

## Spring?

흔히 Spring은 웹 애플리케이션을 쉽게 만들 수 있게 도와주는 프레임워크 정도로만 알려져있습니다. 그러나 Spring이 탄생하게된 계기를 알게된다면 Spring의 본질, 핵심 개념을 다음과 같이 말할 수 있습니다.

> "Spring은 **좋은 객체 지향** 애플리케이션을 개발할 수 있게 도와주는 프레임워크이다."

물론 Spring은 웹 애플리케이션을 만드는데 정말 많은 도움을 주는 프레임워크가 맞습니다. 그러나 Spring이 탄생하게된 계기는 "좋은 객체 지향" 개발을 위해서였습니다. 그렇다면, 도대체 왜, 어떻게 만들어졌길래 Spring이 좋은 객체 지향 애플리케이션을 개발하는데 도움이 되는지 알아보겠습니다.

## Spring의 탄생

Spring은 2002년 **로드 존슨**(Rod Johnson)이라는 개발자가 써낸 **Expert One-on-One J2EE Design and Development**이라는 책에 나온 코드를 기반으로 발전한 프레임워크입니다. 2000년대 초반, 당시 기업들은 시스템을 구현하기 위한 서버 애플리케이션으로 Java의 가장 거대한 기술 표준이었던 J2EE의 API 중 하나인 **Enterprise Java Beans**(EJB)를 사용했습니다. 서버와 관련된 고급 기술들을 제공하던 종합 선물 세트 같은 느낌의 API였지만 큰 문제가 있었습니다. **EJB는 느리고 어려웠습니다.**

EJB에서 지원하는 기술들은 원리를 파악하기도 힘들고 테스트를 통한 개발(추후에 정리할 테스트 주도 개발)도 매우 힘들었습니다. 또한 EJB를 이용해 개발할 때는 전적으로 EJB에 의존해서 개발을 해야했기에 Java의 가장 강력한 장점이자 정체성인 **객체 지향 프로그래밍이 전혀 지켜지지 못할 정도**로 코드가 난해하고 확장성이 떨어졌습니다. 이런 쉽지 않은 개발 환경 때문에 **POJO**(Plain Old Java Object)라는 용어까지 등장하며 **순수한 Java로 돌아가자!**라는 생각이 Java 개발자들 사이에서 많아졌습니다.

이때 등장한 것이 앞서 언급한 로드 존슨의 저서입니다. 로드 존슨은 해당 책에서 EJB의 문제점을 지적하며 EJB 없이 순수한 Java 코드로만 더 나은 프로그램을 만들 수 있다는 것을 보여줬습니다. 또한 이 코드들을 본 유겐 휠러(Juergen Hoeller)와 얀 카로프(Yann Caroff)가 로드 존슨에게 이 소스들을 오픈 소스 프로젝트로 발전시키자는 제안을 했고 마침내 **Spring**이 탄생하게 되었습니다. 현재도 유겐 휠러가 Spring Framework의 리드 개발자로서 Spring을 발전시키고 있습니다. 여담으로 Spring이라는 이름은 혹독한 겨울 같았던 Java 개발 생태계를 봄처럼 따뜻하게 만들었다는 의미로 지어졌습니다.

2003년 6월에 처음 공개된 XML 기반의 Spring Framework 1.0을 시작으로 2023년 1월 현재 최신 버전인 Spring Framework 6.0.4와 Spring의 치명적인 단점이었던 개발 사전 설정을 도와주는 Spring Boot 3.0.1까지 약 20년의 시간 동안 Spring은 꾸준히 발전해왔습니다.

## Spring 생태계

Spring 생태계에는 사용자에게 다양한 기능을 제공해주는 많은 프로젝트들이 있습니다. Spring 생태계를 이루는 대표적인 프로젝트들은 다음과 같습니다.

- Spring Framework
- Spring Boot
- Spring Data
- Spring Session
- Spring Security
- Spring Batch
- Spring Cloud
- Spring REST Docs

이외에도 많은 프로젝트들을 Spring 공식 페이지에서 확인할 수 있습니다. [Spring Projects](https://spring.io/projects)

이렇게 많은 Spring 프로젝트 중에서 필수적인 두 가지는 Spring 그 자체라고 할 수 있는 **Spring Framework**와 모든 Spring 기술들을 편리하게 사용할 수 있도록 도와주는 **Spring Boot**입니다. Spring Framework 없이는 위에 적어둔 다른 기술들을 사용할 수 없습니다. 또한 본격적인 개발을 시작하기 전에 프로젝트 설정하기가 Spring의 절반이라고 할 수 있을 정도로 Spring Boot는 요즘 Spring Framework를 사용할 때 항상 함께 사용합니다.

가장 중요한 두 프로젝트의 특징들을 살펴보겠습니다.

- **Spring Framework**
  - Spring의 뿌리
  - 핵심 기술 - Spring DI Container, AOP, Event, etc...
  - 웹 기술 - Spring MVC, Spring WebFlux
  - 데이터 접근 기술 - Transaction, JDBC, ORM, XML
- **Spring Boot**
  - 단독으로 실행할 수 있는 Spring Application을 쉽게 생성
  - Tomcat과 같은 웹 서버를 내장해 별도의 웹 서버 설치 필요 없음
  - 손쉬운 빌드 구성을 위한 starter 종속성 제공 (starter만 가져오면 자동으로 관련 의존관계 모두 설정)
  - 스프링과 서드 파티(외부) 라이브러리 자동 구성 (주요 라이브러리의 호환성을 자동으로 검사하고 호환이 잘되는 버전을 탑재)
  - 메트릭, 상태 확인, 외부 구성 같은 프로덕션 준비 기능 제공 (운영 환경에서의 모니터링 등)
  - 관례에 의한 간결한 설정

위에서 살펴본대로 Spring Framework는 웹 기술 뿐만 아니라 다른 많은 기술들도 제공합니다. 또한 Spring Boot가 제공하는 많은 편의 기능들은 만약 Spring Boot가 없었다면 사용자가 직접 해야하는 작업이 얼마나 많은지 알 수 있게 해줍니다.

## Spring의 핵심 개념

지금까지 Spring에 관해서 대략적으로 살펴봤습니다. 처음으로 돌아가, Spring의 본질이자 핵심 개념은 웹 애플리케이션을 쉽게 만들 수 있게 도와주는 프레임워크가 아니라고 말했습니다.

Spring이 탄생하게된 계기였던 로드 존슨의 저서도 Java의 EJB를 개선하고자 써내려갔고, 개발자들이 "순수한 Java"(POJO)로 더 나은 서버 프로그래밍을 위해 발전시켜온 것이 Spring이기에 웹 애플리케이션 제작에 큰 도움이 되는 것은 사실입니다. 그러나 Spring은 웹 애플리케이션에 국한되지 않고 **더 빠르고, 더 쉽고, 더 안전한 Java 프로그래밍**을 도와준다고 설명해왔습니다. [Why Spring?](https://spring.io/why-spring)

즉, **Spring의 정수는 더 나은 Java 프로그래밍, "좋은 객체 지향" 프로그래밍**인 것입니다. 따라서 Spring을 완벽하게 이해하고, 활용하기 위해서는 Java의 핵심인 "객체 지향 프로그래밍"에 대한 이해가 필요합니다. Spring이 제공하는 API만 따라치기 급급한 개발자가 아닌 Spring을 통해 더 나은 애플리케이션을 만들어낼 수 있는 개발자가 되어야합니다.

Spring이 EJB의 과도한 의존관계를 비판하며 탄생했던 것처럼, 우리 역시 Spring이 주는 편의성에 의존하지 않아야합니다. 부가적인 기술이 아닌, 더 좋은 객체 지향 프로그래밍을 위해 Spring을 활용해야하는 것입니다.
