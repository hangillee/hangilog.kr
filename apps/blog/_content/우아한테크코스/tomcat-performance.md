---
title: 'Tomcat과 함께하는 API 성능 개선기'
subtitle: 'maxThreads, maxConnections, acceptCount'
date: 2025-05-07
category: '우아한테크코스'
---

## 모호했던 성능 지표들

우아한테크코스에서 참여했던 [투룻](https://touroot.kr) 프로젝트는 첫 배포 당시만 해도 명확한 성능 지표라 할 만한 것이 없었습니다. 테스트가 모두 끝나는 시간, Gradle 빌드 완료 시간, 쿼리 실행 계획(Query Execution Plan)을 통한 쿼리 수행 속도 등이 전부였습니다.

작은 규모의 프로젝트에서는 이 정도로도 충분하다고 생각할 수 있습니다. 하지만 투룻 팀은 사용자 급증으로 인한 장애 상황을 사전에 방지하고자 더 명확하고 정량적인 지표를 원했습니다. 당연하게도 지표가 제한적이고 모호하니, 성능 개선 방식도 테스트 리팩터링, Gradle 캐싱, 쿼리 튜닝 정도로 국한될 수밖에 없었습니다.

투룻 서비스의 성능 지표를 측정하기에 앞서, 소프트웨어 성능을 나타내는 주요 지표들에 대해 조사했습니다. 대표적으로 **처리량**(Throughput)과 **응답 시간**(Response Time)이 있습니다. 이 두 개념을 간단히 정리하면 다음과 같습니다.

- **처리량(Throughput)**: 단위 시간당 처리되는 작업의 수
- **응답 시간(Response Time)**: 사용자 요청에 대한 시스템의 평균 응답 시간

투룻 팀은 이 중에서도 처리량 지표에 주목했습니다. 응답 시간의 경우, 쿼리 튜닝 과정에서 서비스에 사용되는 쿼리를 [전수 조사](https://shelled-operation-d0b.notion.site/0663024d6b32465ebee659f98bd3a0bf?pvs=74)하고 자주 조회될 가능성이 높은 컬럼에 인덱스를 설정하는 등의 최적화를 이미 진행했기 때문에, 어느 정도 확보되었다고 판단했습니다.

## TPS 분석

가장 먼저 투룻 서비스의 처리량 지표를 파악하기 위해 **TPS**(Transactions Per Second)를 측정하기로 했습니다. TPS는 1초에 처리되는 트랜잭션 수를 의미하며, 공식은 다음과 같습니다.

$$
\text{TPS} = \frac{\text{총 트랜잭션 수}}{\text{단위 시간}}
$$

하지만 당시 투룻 서비스는 사용자 수가 많지 않아, 유의미한 TPS 수치를 얻기 어려운 상황이었습니다. 이에 투룻 팀은 유사 서비스들의 MAU(Monthly Active Users)를 참고하여 적정 TPS를 추정하기로 했습니다.

다음은 그 추정 과정입니다.

> **목표 TPS 추정**
> 비슷한 서비스의 MAU를 분석해서 TPS 추정하자.
> - 유사 서비스의 MAU가 약 47만
>    - 한 달에 약 47만 명의 유저 → 하루에 약 16000명의 유저
>    - 16000명이 하루에 6시간 동안 몇 개의 요청을 보낼까?        
>        → 24시간 동안 균일하게 요청이 오진 않을 것.
>        → 피크 타임 6시간으로 가정
>        → 하루에 1명이 30개 정도의 요청을 보낼 것으로 예상
>        필터링 API + 메인 페이지 API + 상세 조회 API
>
>    ⇒ 16000 * 30 / (6 * 3600) = 22
>    **⇒ 사용자가 1초에 우리 서비스에 보내는 TPS가 22일 것으로 추정한다.**

## Tomcat 설정값 변경과 JMeter를 통한 성능 테스트

목표 TPS가 설정되었으니, 현재 우리 서비스의 TPS가 이 기준에 부합하는지를 측정할 필요가 있었습니다. 즉, **성능 테스트**(Performance Test)를 수행해야 했습니다.

성능 테스트 도구는 다양하지만, 투룻 팀은 학습 비용이 낮고 빠른 결과를 얻을 수 있는 **Apache JMeter**를 선택했습니다. (마감 일정의 압박도 있었습니다.)

테스트 대상은 가장 핵심적인 기능이자 사용량이 많을 것으로 예상되는 다음 4개의 API였습니다.

- 메인 페이지 조회
- 메인 페이지 필터링
- 여행기 상세 조회
- UUID를 통한 공유된 여행기 상세 조회

예상과 달리, 단순한 쿼리 튜닝과 테스트 코드 최적화만으로도 이미 목표 TPS인 22를 훨씬 상회하는 결과가 나왔습니다. 동시에 1,000명의 사용자가 요청을 보내는 시나리오에서도 메인 페이지 API의 처리량은 다음과 같았습니다.

| 1차 측정 | 2차 측정 | 3차 측정 | 4차 측정 | 5차 측정 | 평균   |
|----------|----------|----------|----------|----------|--------|
| 93.9     | 109.9    | 111.9    | 109.1    | 96.3     | **104.22** |

이미 목표 TPS를 초과했기 때문에, 단순히 처리량을 높이는 것보다 **시스템 리소스를 최소로 사용하면서 동일하거나 더 나은 TPS를 유지하는 방향**으로 전환했습니다.

이에 따라 **Tomcat의 설정값을 조정**해보기로 했습니다. 여러 값을 조정해가며 반복적으로 테스트한 끝에 찾은 최적의 설정은 다음과 같습니다.

- `maxThreads`: 20
- `maxConnections`: 100
- `acceptCount`: 50

해당 설정 적용 후 JMeter를 통해 다시 성능 테스트를 진행했습니다. 결과는 다음과 같습니다.

### 메인 페이지 조회 성능 테스트

| 구분       | 1차 측정 | 2차 측정 | 3차 측정 | 4차 측정 | 5차 측정 | 평균     |
|------------|----------|----------|----------|----------|----------|----------|
| 기본 설정   | 93.9     | 109.9    | 111.9    | 109.1    | 96.3     | **104.22** |
| 튜닝 후     | 121.0    | 113.9    | 121.4    | 118.9    | 105.5    | **116.14** |

---

### 메인 페이지 필터링 성능 테스트

| 구분       | 1차 측정 | 2차 측정 | 3차 측정 | 4차 측정 | 5차 측정 | 평균     |
|------------|----------|----------|----------|----------|----------|----------|
| 기본 설정   | 104.1    | 101.7    | 96.7     | 108.0    | 102.1    | **102.52** |
| 튜닝 후     | 125.0    | 130.5    | 125.0    | 136.7    | 131.4    | **129.72** |

---

### 여행기 상세 조회 성능 테스트

| 구분       | 1차 측정 | 2차 측정 | 3차 측정 | 4차 측정 | 5차 측정 | 평균     |
|------------|----------|----------|----------|----------|----------|----------|
| 기본 설정   | 102.5    | 99.8     | 91.2     | 111.6    | 99.0     | **100.82** |
| 튜닝 후     | 115.0    | 118.2    | 122.5    | 115.9    | 100.5    | **114.42** |

---

### UUID를 통한 공유된 여행기 상세 조회 성능 테스트

| 구분       | 1차 측정 | 2차 측정 | 3차 측정 | 4차 측정 | 5차 측정 | 평균     |
|------------|----------|----------|----------|----------|----------|----------|
| 기본 설정   | 105.5    | 139.7    | 118.0    | 137.8    | 124.1    | **125.02** |
| 튜닝 후     | 148.9    | 144.4    | 152.2    | 150.2    | 143.6    | **147.86** |

---

큰 폭은 아니지만, **기존 Tomcat 설정값 대비 적은 리소스로도 확실한 성능 향상**을 이뤄낼 수 있었습니다. 명확한 성능 지표를 기반으로 불필요한 자원 낭비를 줄였다는 점에서 의의가 큰 실험이었습니다.

## 결론

도구를 활용한 성능 테스트는 처음이었기에 시행착오도 많았지만, TPS라는 명확한 성능 지표를 확보한 덕분에 다양한 실험을 시도해볼 수 있었습니다.

물론 이번 테스트는 고정된 사용자 수와 트래픽 조건을 기준으로 이루어졌기 때문에, 급격한 트래픽 증가와 같은 상황에는 다소 대비가 부족할 수 있습니다. 향후에는 **부하 테스트**(Stress Test)도 함께 진행해보는 것이 좋겠다고 생각합니다.
