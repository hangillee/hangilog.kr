---
title: '정적 팩토리 메소드'
subtitle: 'Effective Java 3/E 정리 01'
date: 2023-07-04 00:00:00
category: 'Java'
---

> 생성자 대신 정적 팩토리 메소드를 고려하라 - Joshua Bloch (Effective Java 3/E, 8p)

## 생성자와 정적 팩토리 메소드

Java에서 클래스의 인스턴스를 생성하는 방법 중 가장 기초적이고 자연스러운 방법은 `public 생성자`를 이용하는 방법입니다. Java를 공부하는 모두가 `new` 키워드를 통해 무의식적으로 사용하고 있거나 사용해봤던 public 생성자는 매우 편리하고 직관적입니다. 심지어 생성자는 [의존관계 주입](https://blog.coderoad.kr/ioc-di#의존관계-주입-di)에서도 사용할 수 있습니다. 즉, public 생성자만 사용해도 Java 개발에 있어서는 큰 문제가 없다는 말입니다.

그러나, 모든 Java 프로그래머라면 클래스의 인스턴스를 얻을 수 있는 방법을 하나 더 알아야 합니다. 바로, `정적 팩토리 메소드(static factory method)`입니다. 그럼, 왜 정적 팩토리 메소드 방법을 알아야 할까요? 정적 팩토리 메소드의 장단점을 살펴보며 생성자 대신 정적 팩토리 메소드를 고려해봐야 하는 이유와 주의해야할 점을 알아보겠습니다.

> 정적 팩토리 메소드는 디자인 패턴의 팩토리 메소드(Factory Method)와는 다릅니다!

## 정적 팩토리 메소드의 장점

**첫 번째**, 정적 팩토리 메소드는 **고유의 이름을 가질 수 있습니다**. 이름을 가진다는게 왜 장점인지 와닿지 않을 수 있습니다. 예제 코드를 통해 알아보겠습니다.

```java
public class User {
    private final String username;
    private final String password;
    private final boolean isAdmin;

    public User(String username, String password, boolean isAdmin) {
        this.username = username;
        this.password = password;
        this.isAdmin = isAdmin;
    }
}
```

위 코드의 `User` 클래스는 생성자를 통해서 다음과 같이 인스턴스를 생성할 수 있습니다.

```java
public class Main {
    public static void main(String[] args) {
        User user = new User("normaluser", "good1234", false);
        User admin = new User("coderoad", "hello1234", true);
    }
}
```

`username`과 `password`, 관리자 여부를 생성자로 넘겨 일반 사용자와 관리자 인스턴스를 생성했습니다. Java로 개발 하는 프로그래머에겐 너무나 쉽고 익숙한 방식이며, 오류가 발생하는 잘못된 코드도 아닙니다. 하지만, 다음과 같이 정적 팩토리 메소드를 작성하고 사용하면, 생성자를 사용할 때보다 **반환될 인스턴스의 특징을 쉽게 파악**할 수 있습니다.

```java
public class User {
    private final String username;
    private final String password;
    private final boolean isAdmin;

    public User(String username, String password, boolean isAdmin) {
        this.username = username;
        this.password = password;
        this.isAdmin = isAdmin;
    }

    // 정적 팩토리 메소드
    public static User createUser(String username, String password) {
        return new User(username, password, false);
    }

    // 정적 팩토리 메소드
    public static User createAdmin(String username, String password) {
        return new User(username, password, true);
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        // 생성자를 사용할 때와 다르게 어떤 인스턴스가 반환될지 직관적으로 알 수 있다!
        User user = User.createUser("normaluser", "good1234");
        User admin = User.createAdmin("coderoad", "hello1234");
    }
}
```

코드에서 볼 수 있듯, 생성자와 다르게 정적 팩토리 메소드는 `createUser`, `createAdmin`이라는 고유의 이름을 가질 수 있습니다. 이 정적 팩토리 메소드들을 이용해 인스턴스를 생성하면 어떤 인스턴스가 반환될지 직관적으로 알 수 있습니다. (프로그래머가 제대로 작성했다는 가정하에.) 물론, 생성자도 입력 매개변수의 순서나 종류를 달리해 상황에 따른 여러 생성자를 추가할 수 있지만 결코 좋은 방법이 아닙니다.

왜냐하면, 여러 생성자가 있을 때, 해당 생성자의 내부 구조를 잘 알지 못하는 개발자가 엉뚱한 생성자를 호출할 위험이 있기 때문입니다. 또한, 도대체 어떤 인스턴스가 반환되는지 해당 클래스의 내부 구현을 직접 읽지 않으면 알 수 없습니다. 결국, 여러 생성자를 통한 인스턴스 생성은 실수를 방지하기 위해선 직접 코드를 살펴봐야 하는 번거로움이 발생하기 때문에, **한 클래스에 여러 생성자가 필요할 것 같다**면 **정적 팩토리 메소드 작성을 적극 고려**해봐야 합니다.

**두 번째**, 정적 팩토리 메소드는 호출될 때마다 **인스턴스를 새로 생성하지 않아도 됩니다**.

생성자를 사용하면 매번 새로운 인스턴스가 생성됩니다. 그런데, 같은 값이나 상태를 가진 인스턴스를 매번 새로 만들어야 할 필요는 없습니다. 이미 만들어진 인스턴스를 활용하는 편이 메모리 측면에서도 더 나을 것입니다.

정적 팩토리 메소드는 이런 문제를 해결하기 위해 **인스턴스를 미리 만들어 두거나 새로 생성한 인스턴스를 캐싱하는 방식**으로 **불필요한 중복 인스턴스를 생성하지 않습니다**.

```java
// Boolean 클래스의 일부
...

public static final Boolean TRUE = new Boolean(true);
public static final Boolean FALSE = new Boolean(false);

...

// 정적 팩토리 메소드 valueOf()
public static Boolean valueOf(boolean b) {
    return b ? TRUE : FALSE;
}
```

실제로 Java의 `Boolean`과 같이 한 번 생성된 인스턴스의 값이나 상태가 절대 변하지 않는 **불변 클래스(immutable class)는** 특정 값을 가진(`true`와 `false`) 인스턴스를 **미리 만들어**두고 이를 **정적 팩토리 메소드를 통해 반환**하는 방식으로 같은 값을 가지는 중복 인스턴스 생성을 방지합니다. 이 장점은 생산 비용이 큰 객체가 자주 요청되는 상황에 성능 향상에 도움이 됩니다.

## 정적 팩토리 메소드의 단점

## 정리
