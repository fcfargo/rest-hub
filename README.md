# Rest-Hub

> 쉬는 사람들을 위한 회복 소셜 플랫폼

**Rest-Hub**는 무기력하거나 쉬고 있는 사람들을 위한 SNS 프로젝트입니다. 사용자가 글, 이미지, 감정을 공유하며 서로를 응원하고 회복할 수 있도록 돕는 공간을 만들고자 했습니다.

---

## 🛠️ 기술 스택

### 프론트엔드

- **Next.js 15 (App Router)**
- **React 19**, **Tailwind CSS**
- **NextAuth.js** – 소셜 로그인 및 세션 관리
- **PWA** – 서비스 워커 및 앱 설치 가능
- **TypeScript**, **React Hook Form**

### 백엔드

- **NestJS** – 구조화된 백엔드 설계
- **PostgreSQL + TypeORM** – 관계형 데이터 모델링
- **Bull** – 이메일 전송용 백그라운드 큐 처리
- **JWT 인증**, **API 모듈화**, **로깅 및 예외 처리**

### 인프라 & 기타

- **Railway (서버 호스팅)** / **Vercel (프론트 배포)**
- **GitHub Actions** – CI/CD 자동화
- **Figma** – UI/UX 디자인
- **PWA 구성** – manifest.json, service-worker.js 포함

---

## 🌟 주요 기능

- **회원가입 / 로그인** (소셜 로그인 포함)
- **게시글 작성, 이미지 업로드**
- **댓글 / 대댓글 (1단계) 시스템**
- **팔로우 기반 피드 우선순위**
- **알림(Notification) 시스템**
  - 생성 / 읽음 처리 / 삭제
- **무한 스크롤 피드**
- **PWA 앱 설치 지원**
- **반응형 모바일 UI**

---

## ⚙️ 시스템 아키텍처

```
[Client: Next.js] ⇄ [API: NestJS] ⇄ [PostgreSQL]
                                ⇓
                          [Bull Queue]
                                ⇓
                            [Redis]
```

- 게시물/댓글/팔로우/알림은 각기 모듈화된 구조
- 소셜 로그인은 next-auth, 일반 로그인은 JWT 커스텀 API로 처리
- 이메일 전송은 큐에 적재 → 백그라운드 소비자에서 처리
- 프론트와 백엔드는 분리 배포

---

## 🧪 개발 및 배포

- GitHub Actions를 이용한 CI/CD 자동화 구성
- Vercel, Railway를 이용해 배포
- PostgreSQL DB schema 설계 및 마이그레이션 진행

---

## 🎨 디자인

- 전체 UI 흐름은 **Figma**로 설계
- 모바일 중심 사용성 고려

---

## 📌 회고 및 느낀 점

- 실서비스 수준의 아키텍처를 스스로 구성하고 배포하면서, API 설계와 모듈 구조에 대한 감각이 크게 향상됨
- 특히 Bull을 통한 큐 처리 구조와 무한 스크롤 페이지네이션 등은 퍼포먼스 개선 측면에서도 큰 배움이 있었음

---

## 🔗 관련 링크

- GitHub: [https://github.com/fcfargo/rest-hub-develop](https://github.com/fcfargo/rest-hub-develop)
- 기술 블로그: [https://velog.io/@fcfargo](https://velog.io/@fcfargo)
- Figma 디자인: [링크](https://www.figma.com/design/t52d0bTzn2jBms9QAOzsQl/Rest-Hub?m=auto&t=3UTlw42mH6dv18wb-6)

---
