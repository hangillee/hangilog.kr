---
title: 'SOLID'
subtitle: 'Spring과 SOLID'
date: 2023-01-17 00:00:00
category: 'Spring'
---

**본 문서는 인프런에서 수강할 수 있는 [스프링 핵심 원리 - 기본편](https://inflearn.com/course/스프링-핵심-원리-기본편)을 수강한 후, 공부한 내용을 정리한 문서입니다. 본 문서의 모든 저작권은 해당 강의의 저자이신 [김영한](https://inflearn.com/users/@yh) 우아한형제들 기술이사님께 있습니다.**

## SOLID?

SOLID, 단단하다는 뜻을 가진 영단어입니다. Spring과 SOLID는 도대체 무슨 연관이 있을까요? 사실 Spring을 넘어 프로그래밍에서 **SOLID는 객체 지향 프로그래밍 및 설계의 가장 기초적인 원칙 5가지**의 앞 글자를 딴 단어입니다. 2000년대 초반, 미국의 소프트웨어 엔지니어인 로버트 마틴이 "[The Principles of OOD](http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod)"라는 제목의 블로그 게시글에서 5개의 원칙을 명명했습니다.

그 원칙들은 다음과 같습니다.

<table style="border: 1px solid gray;">
    <tr>
        <th colspan="2">SOLID</th>
    </tr>
    <tr>
        <th>이름</th>
        <th>설명</th>
    </tr>
    <tr>
        <td>단일 책임 원칙</td>
        <td>SRP (Single Responsibility Principle)<br>한 클래스는 하나의 책임만 가져야 한다.</td>
    </tr>
    <tr>
        <td>개방-폐쇄 원칙</td>
        <td>OCP (Open/Closed Principle)<br>소프트웨어 요소는 확장에는 열려 있으나 변경에는 닫혀 있어야 한다.</td>
    </tr>
    <tr>
        <td>리스코프 치환 원칙</td>
        <td>LSP (Liskov Substitution Principle)<br>프로그램의 객체는 프로그램의 정확성을 깨뜨리지 않으면서 하위 타입의 인스턴스를 바꿀 수 있어야 한다.</td>
    </tr>
    <tr>
        <td>인터페이스 분리 원칙</td>
        <td>ISP (Interface Segregation Principle)<br>특정 클라이언트를 위한 인터페이스 여러 개가 범용 인터페이스 하나 보다 낫다.</td>
    </tr>
    <tr>
        <td>의존관계 역전 원칙</td>
        <td>DIP (Dependency Inversion Principle)<br>프로그래머는 추상화에 의존해야하지 구체화에 의존하면 안된다. 의존관계 주입은 이 원칙을 따르는 방법 중 하나.</td>
    </tr>
</table>

## 단일 책임 원칙 (SRP)

**단일 책임 원칙**(Single Responsibility Principle)은 "한 클래스는 하나의 책임만 가져야 한다."라는 원칙입니다. 여기서 '하나의 책임'이라는 말이 모호할 수 있습니다. 책임은 클 수도 있고, 작을 수도 있으며, 문맥과 상황에 따라 다릅니다. 하지만 가장 중요한 것은 **변경**입니다. 즉, 우리는 "변경"을 기준으로 잡아 단일 책임 원칙이 준수되었는지 확인해야합니다.

예를 들어, 웹 애플리케이션에서 특정 기능을 수정하게 된 상황을 가정해보겠습니다. 기능의 수정이 생겼기 때문에 당연히 내부 코드에도 변경이 필요합니다. 이 때, 단 하나의 클래스만 수정되어야 SRP를 잘 준수한 프로그램이 되는 것입니다. 즉, 하나의 클래스가 하나의 기능(책임)을 가지기 때문에 다른 클래스(코드)에 영향을 주지 않고도 변경이 가능합니다.

## 개방-폐쇄 원칙 (OCP)

**개방-폐쇄 원칙**(Open/Closed Principle)은 "소프트웨어 요소는 확장에는 열려 있으나 변경에는 닫혀 있어야 한다."라는 원칙입니다. 그런데 이름부터 모순되는 말입니다. 어떻게 개방과 폐쇄가 동시에 지켜질 수 있다는 말일까요? 애플리케이션을 확장하려면, 즉 기능을 추가하거나 수정하려면 당연히 기존의 코드를 변경해야하는 것 아닐까요? 이 질문의 답은 객체 지향 프로그래밍에서 가장 중요한 **다형성**에 있습니다.

우리가 앞서 살펴봤던 다형성을 활용하려면, **역할**과 **구현**으로 철저하게 구분지어서 설계해야한다고 했습니다. 잘 설계된 역할이 있다면 그 구현체를 새로 만드는 것은 기존 코드에 전혀 영향을 주지 않습니다. 다형성의 목적이 유연하고 변경이 용이하게 하는 것임을 기억한다면, 미리 적어둔 코드의 수정 없이도 완전히 새로운 기능을 추가(확장)하는 것이 가능합니다. 즉, 새로운 클래스를 작성하고 애플리케이션에 적용(확장)할 때 다른 클래스를 수정(변경)한다면 확장에도 열려있고 변경에도 열려있어 OCP를 위반하는 것입니다.

그럼 OCP를 준수하려면 어떻게 해야할까요? 지금까지 우리는 새로 만든 구현체를 적용시키려면 그 구현체를 사용하는 다른 구현체의 코드를 수정해야했습니다. 이제 우리는 새로운 구현체를 외부에서 생성, 조립, 설정까지 모두 해주는 설정자가 필요해졌습니다. 이 설정자를 통해 기존 코드의 수정이 없이 설정자만 변경했을 때 의도한대로 동작한다면 그 프로그램은 OCP를 준수한 것입니다. 이 "설정자"는 나중에 설명하겠지만 "Spring 컨테이너"라는 Spring에서 아주 중요한 역할을 맡게 됩니다.

## 리스코프 치환 원칙 (LSP)

**리스코프 치환 원칙**(Liskov Substitution Principle)은 "프로그램의 객체는 프로그램의 정확성을 깨뜨리지 않으면서 하위 타입의 인스턴스를 바꿀 수 있어야 한다."는 원칙입니다. 쉽게 설명해서 자식 클래스는 부모 클래스를 언제든 완전히 대체할 수 있어야 한다는 원칙입니다. 즉, 부모 클래스의 기능이 자식 클래스에서 정반대가 되어버린다면 LSP가 지켜지지 않은 것입니다. 오류는 나지 않겠지만 다형성이 완전히 무너지게 됩니다.

예를 들어, 자동차 인터페이스의 악셀 메소드는 가속을 합니다. 모든 자동차는 악셀은 가속, 브레이크는 감속이라는 기능을 가지는데, 만약 어느 한 구현체(자동차)만 이 인터페이스와는 정반대로 악셀은 감속, 브레이크는 가속이라는 기능을 가지면 대참사가 발생할 가능성이 있습니다. 물론 만들 수는 있고 실제로 운전도 어렵겠지만 가능은 합니다. 그러나 이 예시에선 구현체(자식 클래스)가 인터페이스(부모 클래스)를 완전히 대체하지 못하고 있기 때문에 LSP를 위반하고 있습니다.

가장 지키기 쉬운 원칙 중에 하나입니다. 인터페이스를 설계한 목적 그대로 구현하면 됩니다.

## 인터페이스 분리 원칙 (ISP)

**인터페이스 분리 원칙**(Interface Segregation Principle)은 "특정 클라이언트를 위한 인터페이스 여러 개가 범용 인터페이스 하나보다 낫다."는 원칙입니다. 쉽게 설명하면 인터페이스를 더 세세하게 분리하는 것이 좋다는 것입니다. 즉, 하나의 인터페이스가 가지는 책임(기능)이 과다할 때, 분리할 수 있는 책임(기능)이 있다면 따로 분리해두어야 합니다.

예를 들어, 자동차 인터페이스는 "운전"이라는 큰 관점으로 묶이는 기능들과 "정비"라는 큰 관점으로 묶이는 기능들로 분리할 수 있습니다. 또한 사용자 인터페이스도 "운전자"와 "정비사"로 나눌 수 있습니다. 그럼 정비 인터페이스가 변해도 운전자 구현체에는 전혀 영향을 주지 않게 됩니다. 만약 자동차 인터페이스를 ISP 원칙을 지키지 않았다면 정비 부분 기능들을 수정할 때 운전자 구현체에도 영향을 미칠 것입니다. 따라서 ISP를 준수하면 인터페이스가 좀 더 명확해지고 대체 가능성이 높아집니다.

## 의존관계 역전 원칙 (DIP)

**의존관계 역전 원칙**(Dependency Inversion Principle)은 "프로그래머는 추상화에 의존해야지, 구체화에 의존하면 안 된다."는 원칙입니다. 의존관계 주입(Dependency Injection)은 이 원칙을 따르는 방법 중 하나입니다. 쉽게 이야기해서 DIP는 구현 클래스에 의존하지 말고, 역할인 인터페이스에 의존하라는 뜻입니다. 여기서 "의존한다."는 "알고 있다."와 같습니다. 즉, 클라이언트가 인터페이스**만** 의존해야(알고 있어야) DIP를 준수하는 것입니다. 만약 인터페이스 뿐만 아니라 구현 객체도 의존한다(알고 있다)면, 구현체를 변경해야할 때 해당 구현체를 의존하는(알고 있는) 코드를 모두 변경해야합니다.

DIP에 대해 더 자세히 알아보기 위해 다형성을 설명하면서 작성했던 코드를 다시 살펴보겠습니다.

```java
//이 코드는 DIP를 위반합니다!
//Car라는 인터페이스를 의존합니다. 그러나 NormalCar라는 구현체도 알고 있습니다.
Car myCar = new NormalCar();

int currentSpeed;
currentSpeed = myCar.accelPedal(0);
currentSpeed = myCar.breakPedal(currentSpeed);
```

한 눈에봐도 추상화(인터페이스)와 구체화(구현 클래스)를 동시에 의존하고(알고) 있어 DIP를 위반했다는 것을 알 수 있습니다. DIP를 준수하려면 추상화에만 의존해야합니다. 그런데 만약 추상화만 의존하기 위해 위의 코드를 아래와 같이 고치면 예외가 발생할 것입니다.

```java
//추상화만 의존하긴 하지만...
//myCar에는 아무것도 들어가지 않았습니다.
Car myCar;

int currentSpeed;
currentSpeed = myCar.accelPedal(0);
currentSpeed = myCar.breakPedal(currentSpeed);
```

DIP를 지키려고 했더니 동작조차 하지 않는 망가진 코드가 완성되어버렸습니다. 분명 유연하게 변경할 수는 있지만 SOLID를 준수하자니 무언가 부족합니다. 객체 지향의 핵심이라는 다형성만으로는 쉽게 부품을 갈아 끼우듯이 개발할 수 없다는 것을 깨달았습니다. 또한 구현 객체를 변경할 때 클라이언트의 코드도 변경되어버린다는 것도 알았습니다. 즉, 다형성만으로는 DIP와 OCP를 완벽하게 지킬 수 없다는 것을 알아버렸습니다! 그럼 어떻게 해야 SOLID를 준수하면서 객체 지향 프로그래밍을 할 수 있을까요? 정답은 바로 **Spring**에 있습니다.

## 갑자기 Spring?

Spring이 제공하는 **의존관계 주입(Dependency Injection, DI) 기술**과 **DI 컨테이너**를 통해 다형성과 OCP, DIP를 지킬 수 있게 도와줍니다. 이러한 Spring의 기술들 덕분에 클라이언트의 코드의 변경 없이도 기능 확장이 가능해졌습니다. 그렇다고 Spring이 없던 시절에는 OCP, DIP를 준수하는게 불가능하진 않았습니다. 순수한 Java로 OCP, DIP를 준수하기 위해 작성한 코드들이 너무 많아지다보니 한 곳에 모아 프레임워크로 만든 것이 바로 **Spring**입니다. 우리가 OCP와 DIP를 준수하면서 개발을 해보면 결국엔 Spring의 핵심인 DI 컨테이너를 만들게 됩니다.

[Spring](https://blog.coderoad.kr/spring) 포스트에서 Spring의 역사에 대해 알아보면서 Spring은 "좋은 객체 지향"을 위해 탄생한 프레임워크라고 설명했습니다. 좋은 객체 지향 프로그래밍을 위해서는 기초 중의 기초인 SOLID를 준수해야하고 Spring은 이를 쉽게 준수할 수 있도록 돕습니다. 따라서 Spring을 100% 활용하기 위해선 객체 지향 5원칙, SOLID를 반드시 공부해야합니다. 그렇지 않으면 Spring의 동작 원리부터 이해할 수 없기 때문입니다.