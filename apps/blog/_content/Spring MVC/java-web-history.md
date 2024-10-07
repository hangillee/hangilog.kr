---
title: 'Java 웹 기술의 역사'
subtitle: 'Servlet의 등장부터 Spring Boot까지'
date: 2023-01-17 11:05:00
category: 'Spring MVC'
---

**본 문서는 인프런에서 수강할 수 있는 [스프링 MVC 1편 - 백엔드 웹 개발 핵심 기술](https://www.inflearn.com/course/스프링-mvc-1/dashboard)을 수강한 후, 공부한 내용을 정리한 문서입니다. 본 문서의 모든 저작권은 해당 강의의 저자이신 [김영한](https://inflearn.com/users/@yh) 우아한형제들 기술이사님께 있습니다.**

## 과거의 기술들

### 서블릿 (Servlet)

Spring, 그리고 Spring의 수많은 프로젝트들이 탄생하기도 전인 1997년, **서블릿**(Servlet)이라는 기술이 Java EE(Java Enterprise Edition)에 정식 제품으로 포함되며 세상에 나왔습니다. 서블릿은 동적으로 웹 페이지를 생성하기 위한 기술로, Java 소스 코드 내부에 HTML을 포함한다는 특징을 가지고 있습니다. 서블릿에 대한 자세한 내용은 [Servlet이란?](https://blog.coderoad.kr/servlet)에 정리했습니다.

### JSP

서블릿의 탄생으로 이전에 서버 개발자가 직접 해야했던 여러 복잡한 작업들(TCP/IP 소켓 통신, HTTP 메시지 파싱 등)을 모두 서블릿이 대신 해주면서 웹 애플리케이션 서버를 구축할 때 들어가는 비용이 크게 줄어 들었지만, 여전히 큰 문제가 하나 남아 있었습니다. 서블릿을 이용해 개발자라면 무조건 피해야하는 '유지보수하기 힘든 코드'가 만들어지곤 했습니다.

아래 코드는 순수하게 서블릿만 사용해서 간단한 회원 정보 입력 폼과 폼을 통해 입력된 데이터를 저장하는 로직을 작성한 코드입니다.

```java
// 회원의 이름과 나이를 입력하는 폼 서블릿
@Override
protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    response.setContentType("text/html");
    response.setCharacterEncoding("utf-8");

    PrintWriter w = response.getWriter();
    w.write("<!DOCTYPE html>\n" +
            "<html>\n" +
            "<head>\n" +
            "    <meta charset=\"UTF-8\">\n" +
            "    <title>Title</title>\n" +
            "</head>\n" +
            "<body>\n" +
            "<form action=\"/servlet/members/save\" method=\"post\">\n" +
            "    username: <input type=\"text\" name=\"username\" />\n" +
            "    age:      <input type=\"text\" name=\"age\" />\n" +
            " <button type=\"submit\">전송</button>\n" + "</form>\n" +
            "</body>\n" +
            "</html>\n");
}
```

```java
// 폼을 통해 입력 받은 데이터를 저장하는 서블릿
@Override
protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    // 요청 데이터 받아옴
    System.out.println("MemberSaveServlet.service");
    String username = request.getParameter("username");
    int age = Integer.parseInt(request.getParameter("age"));

    // 서비스 로직
    Member member = new Member(username, age);
    memberRepository.save(member);

    // 결과 출력
    response.setContentType("text/html");
    response.setCharacterEncoding("utf-8");
    PrintWriter w = response.getWriter();
    w.write("<html>\n" +
            "<head>\n" +
            " <meta charset=\"UTF-8\">\n" + "</head>\n" +
            "<body>\n" +
            "성공\n" +
            "<ul>\n" +
            "    <li>id="+member.getId()+"</li>\n" +
            "    <li>username="+member.getUsername()+"</li>\n" +
            " <li>age="+member.getAge()+"</li>\n" + "</ul>\n" +
            "<a href=\"/index.html\">메인</a>\n" + "</body>\n" +
            "</html>");
}
```

솔직히 저라면 절대 다시 읽기 싫은 코드인 것 같습니다. Java 코드와 HTML의 스타일이 매우 달라 읽는 것만으로도 스트레스 받을 것 같고, 만약 이 코드가 수천, 수만 줄이 넘어간다면 유지보수는 고행이 될 가능성이 높아 보입니다. 더군다나, Java 코드가 데이터도 가공하고 웹 화면도 그리고 있는, 맡고 있는 책임이 여러 개인 상황입니다. 즉, 단일 책임 원칙을 위반하고 있는 객체지향 관점에서도 좋지 못한 코드가 만들어진 것입니다. 이런 서블릿의 문제들을 해결하기 위해 등장한 기술이 1999년에 발표된 **JSP**(Java Server Pages)라는 **템플릿 엔진**(Template Engine)입니다.

```java
@Override
protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    String viewPath = "/WEB-INF/views/new-form.jsp";
    RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
    dispatcher.forward(request, response);
}
```

```java
@Override
protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    // 요청 데이터 받아옴
    System.out.println("MemberSaveServlet.service");
    String username = request.getParameter("username");
    int age = Integer.parseInt(request.getParameter("age"));

    // 서비스 로직
    Member member = new Member(username, age);
    memberRepository.save(member);

    request.setAttribute("member", member);

    String viewPath = "/WEB-INF/views/save-result.jsp";
    RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
    dispatcher.forward(request, response);
}
```

JSP를 활용하게 되니 Java 코드는 HTML과 분리되어 훨씬 깔끔하고 한 눈에 알아볼 수 있게 개선되었습니다. HTML을 작성하고 화면에 그리는 역할은 JSP 파일이 담당합니다. JSP는 컴파일 과정에서 서블릿으로 변환되고 서블릿과 완전 동일한 작업을 수행합니다. 즉, JSP는 서블릿을 좀 더 보기 편하고 개발하기 쉽게 만들어주는 기술입니다.

```jsp
<!-- 회원 정보 입력 폼 JSP -->
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<html>
<head>
    <title>Title</title>
</head>
<body>
<form action="/jsp/members/save.jsp" method="post">
    username: <input type="text" name="username"/>
    age:      <input type="text" name="age"/>
    <button type="submit">전송</button>
</form>
</body>
</html>
```

```jsp
<!-- 회원 정보 저장 로직 JSP -->
<%@ page import="hello.servlet.domain.member.MemberRepository" %>
<%@ page import="hello.servlet.domain.member.Member" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    MemberRepository memberRepository = MemberRepository.getInstance();

    System.out.println("MemberSaveServlet.service");
    String username = request.getParameter("username");
    int age = Integer.parseInt(request.getParameter("age"));

    Member member = new Member(username, age);
    memberRepository.save(member);
%>
<html>
<head>
    <title>Title</title>
</head>
<body>
성공
<ul>
    <li>id=<%=member.getId()%></li>
    <li>username=<%=member.getUsername()%></li>
    <li>age=<%=member.getAge()%></li>
</ul>
<a href="/index.html">메인</a>
</body>
</html>
```

이렇게 JSP는 HTML 안에 Java 코드를 활용할 수 있어 좀 더 HTML 작성이 편리하고 알아보기 쉽지만 여전히 문제점이 남아 있습니다. 먼저, 서버에서 수행되는 핵심 서비스 로직 코드들이 모두 JSP에 노출되어 있습니다. 또한, 웹 페이지만 그리는 것이 아니라 결국 Java 코드를 통해 데이터를 가공하는 역할까지 담당하게 되었습니다. 결국, JSP마저도 HTML을 작성하기 쉬워졌다는 장점 말고는 서블릿과 크게 다르지 않은 문제점들을 갖고 있는 것입니다.

### MVC 패턴

그래도 서블릿과 JSP가 없던 시절보다는 훨씬 편하게 개발할 수 있었기 때문에, 당시 개발자들은 이 서블릿과 JSP의 문제점을 다시 한번 해결하고자 열심히 생각한 끝에, MVC 패턴이라는 개념이 등장했습니다. MVC는 Model, View, Controller의 약자로 Controller를 통해 사용자 요청을 처리하기 위한 비즈니스 로직을 수행하고, Model에 그 결과를 저장한 다음, View는 Model에서 그 결과를 꺼내와 화면을 그리는, 각자 맡은 역할이 확실하게 구분되는 획기적인 개념이 탄생했습니다.

그러나 초기 MVC에도 여전히 한계점은 있었습니다. View로 이동하는 코드가 항상 중복된다는 점, 서블릿의 `HttpServletRequest`, `HttpServletResponse`를 사용할 때도, 사용하지 않을 때도 있지만 항상 작성해야 한다는 점, 다양한 Controller들이 공통으로 처리할 내용도 모두 따로 작성해야 한다는 점 등, 중복되는 코드가 많고 공통 처리가 어려웠습니다. 이를 해결하기 위해 등장한 것이 공통 작업 처리를 위한 Controller 앞에서 요청을 우선 처리하는 Front Controller 패턴이었고, Front Controller 패턴은 Spring MVC에서도 `DispatcherServlet`이라는 이름으로 사용되고 있을 정도로 현재 사용되는 MVC 프레임워크의 기반이 되었습니다.

## 어노테이션 기반 Spring MVC

MVC 패턴이 Java 웹 기술의 대세로 떠오르고 많은 프레임워크들이 등장하며, 길고 긴 Java 웹 기술 시장의 선두 자리를 두고 경쟁했습니다. 스트럿츠, 웹워크, 과거의 Spring MVC 등, 많은 프레임워크들이 있었지만, 결국 Java의 어노테이션을 기반으로 한 새로운 버전의 **Spring MVC**가 다른 프레임워크들을 역사의 뒤편으로 보내버리고 압도적인 점유율을 차지하게 되었습니다. 특히, 수많은 전처리 과정(핸들러 매핑, 핸들러 어댑터 조회, ViewResolver 호출 등)을 모두 자동으로 해결해주는 편의 기능은 엄청난 강점이었습니다. 자세한 내용은 [Spring MVC](https://blog.coderoad.kr/mvc-pattern)에 정리했습니다.

## Spring Boot의 등장

Java 웹 기술의 최강자로 우뚝 선 Spring은 이에 멈추지 않고 Spring마저 손쉽게 사용할 수 있도록 **Spring Boot**를 출시했습니다. Spring Boot는 과거, 개발자가 서버 컴퓨터에 직접 WAS(Web Application Server)를 설치하고, 개발한 소스 코드는 War 파일로 만들어서 WAS에 배포하는 모든 복잡한 과정을 단순화했습니다.

Spring Boot는 자체적으로 서버를 내장하고 있으며, 소스 코드 빌드 결과(Jar)에도 WAS를 포함시켜버렸습니다. 즉, 소스 코드를 작성하고, 빌드하는 것만으로도 WAS 서버를 통해 배포가 가능해진 것입니다. 또한, Spring의 여러 프로젝트들을 간단하게 추가하거나 제거할 수 있어 Spring Boot의 등장은 사전 설정이 어려웠던 Spring의 진입 장벽을 확 낮춘 계기가 되었습니다.

## Java View Template의 역사

Java 진영에서 사용하는 View Template에는 앞서 살펴본 JSP와 Freemarker, Velocity 등의 여러 기술들이 있습니다. 그러나 최근 Java 진영의 표준이라고 할 수 있는 템플릿 엔진은 **Thymeleaf**입니다. Thymeleaf가 최선의 선택 된 이유는 먼저, JSP는 속도도 느리고 편의 기능이 부족했습니다. 그런 와중에 Thymeleaf가 **Natural Template** 기술을 지원하고 Spring MVC와의 연계를 강화하면서 JSP는 요즘 거의 사용하지 않게 되었습니다.

만약, Spring Boot를 통해 개발하면서 View를 그려야할 상황이 생긴다면 Thymeleaf를 공부하고 적극 활용하는게 좋을 것 같습니다. 물론, 성능 자체는 Freemarker와 Velocity가 더 빠르지만 Spring에서도 Thymeleaf를 전폭적으로 지원하고 있다고 합니다.
