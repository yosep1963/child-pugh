# Child-Pugh Score 계산기 PWA

간경화 환자의 간 기능 평가를 위한 Child-Pugh Score 계산기입니다. PWA(Progressive Web App)로 제작되어 웹브라우저에서 사용하거나 모바일 기기에 앱처럼 설치하여 사용할 수 있습니다.

## 🎯 주요 기능

- **정확한 Child-Pugh Score 계산**: 5가지 임상 지표 기반 점수 계산
- **자동 등급 분류**: Class A, B, C 자동 분류 및 색상 구분
- **상세한 임상 해석**: 각 등급별 예후, 치료 방침 제공
- **PWA 지원**: 오프라인 사용 가능, 앱 설치 가능
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모두 지원

## 📱 지원 플랫폼

- **안드로이드**: Chrome, Samsung Internet, Firefox
- **iOS/iPadOS**: Safari, Chrome
- **Windows**: Chrome, Edge, Firefox
- **macOS**: Safari, Chrome, Firefox

## 🚀 Netlify 배포 방법

### 1. GitHub 저장소 생성
```bash
git init
git add .
git commit -m "Initial commit: Child-Pugh PWA"
git remote add origin [your-github-repo-url]
git push -u origin main
```

### 2. Netlify 배포
1. [Netlify](https://netlify.com)에 로그인
2. "New site from Git" 클릭
3. GitHub 저장소 연결
4. Build settings:
   - **Build command**: (비워둠)
   - **Publish directory**: `.` (루트 디렉토리)
5. "Deploy site" 클릭

### 3. 커스텀 도메인 설정 (선택사항)
- Site settings > Domain management
- Custom domain 추가

## 📦 프로젝트 구조

```
Child-Pugh_Window/
├── index.html              # 메인 PWA 파일
├── Child-Pugh_Calculator.html  # 원본 계산기 파일
├── manifest.json           # PWA 매니페스트
├── sw.js                   # 서비스 워커
├── netlify.toml            # Netlify 설정
├── icons/                  # PWA 아이콘들
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
└── README.md               # 프로젝트 설명
```

## 🛠 PWA 기능

### 오프라인 사용
- 서비스 워커를 통해 캐싱
- 네트워크 없이도 완전 동작

### 앱 설치
- **안드로이드**: "홈 화면에 추가"
- **iOS**: Safari 공유 버튼 → "홈 화면에 추가"
- **데스크톱**: 주소창의 설치 아이콘

### 푸시 알림 (준비됨)
- 서비스 워커에 푸시 알림 기능 구현
- 필요시 백엔드 연동으로 활성화 가능

## 🎨 아이콘 생성 가이드

아이콘이 없는 경우, 다음 크기의 PNG 파일을 생성하여 `icons/` 폴더에 넣어주세요:

- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

추천 도구:
- [PWA Icon Generator](https://tools.crawlink.com/tools/pwa-icon-generator)
- [App Icon Generator](https://appicon.co/)

## 📊 Child-Pugh Score 정보

### 평가 항목
1. **Total Bilirubin** (mg/dL)
2. **Serum Albumin** (g/dL)
3. **PT INR**
4. **복수 (Ascites)**
5. **간성뇌증 (Hepatic Encephalopathy)**

### 분류 기준
- **Class A (5-6점)**: 양호한 간 기능
- **Class B (7-9점)**: 중등도 간 기능 저하
- **Class C (10-15점)**: 심각한 간 기능 저하

## 🔒 보안

- HTTPS 강제 사용
- CSP(Content Security Policy) 적용
- XSS 보호 활성화
- 안전한 헤더 설정

## 📝 라이선스

이 프로젝트는 교육 및 의료 목적으로 사용할 수 있습니다.

## ⚠️ 주의사항

- 이 계산기는 의료진의 임상적 판단을 보조하는 도구입니다
- 최종 진단 및 치료 결정은 반드시 의료진과 상의하시기 바랍니다
- 계산 결과는 참고용으로만 사용하세요

## 📞 문의

개발 관련 문의나 기능 요청은 이슈를 통해 남겨주세요. 