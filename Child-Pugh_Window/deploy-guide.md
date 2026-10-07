# Child-Pugh PWA 배포 가이드

## 📋 배포 전 체크리스트

### 1. 필수 파일 확인
- [ ] `index.html` - 메인 PWA 파일
- [ ] `manifest.json` - PWA 매니페스트
- [ ] `sw.js` - 서비스 워커
- [ ] `netlify.toml` - Netlify 설정
- [ ] `icons/` 폴더 및 아이콘 파일들

### 2. 아이콘 생성
1. `create-icons.html` 파일을 브라우저에서 열기
2. "모든 아이콘 생성 및 다운로드" 버튼 클릭
3. 다운로드된 아이콘들을 `icons/` 폴더에 저장

## 🚀 Netlify 배포 단계별 가이드

### Step 1: GitHub 저장소 생성

```bash
# 1. Git 초기화
git init

# 2. 모든 파일 추가
git add .

# 3. 첫 번째 커밋
git commit -m "Initial commit: Child-Pugh PWA Calculator"

# 4. GitHub 저장소 생성 후 연결
git remote add origin https://github.com/[username]/child-pugh-pwa.git

# 5. 푸시
git push -u origin main
```

### Step 2: Netlify 계정 설정

1. [Netlify.com](https://netlify.com) 접속
2. GitHub 계정으로 로그인
3. "New site from Git" 클릭

### Step 3: 배포 설정

1. **Git provider 선택**: GitHub
2. **Repository 선택**: child-pugh-pwa (방금 생성한 저장소)
3. **Build settings**:
   - **Owner**: [your-username]
   - **Branch to deploy**: main
   - **Build command**: (비워둠)
   - **Publish directory**: `.` (점 하나)
4. **Deploy site** 클릭

### Step 4: 도메인 설정

#### 기본 도메인 사용
- Netlify가 자동으로 `[random-name].netlify.app` 도메인 제공
- Site settings에서 사이트 이름 변경 가능

#### 커스텀 도메인 설정 (선택사항)
1. Site settings > Domain management
2. "Add custom domain" 클릭
3. 도메인 입력 (예: childpugh.yourdomain.com)
4. DNS 설정 (A 레코드 또는 CNAME)

### Step 5: HTTPS 설정
- Netlify가 자동으로 Let's Encrypt SSL 인증서 발급
- 보통 배포 후 몇 분 내에 완료

## 📱 PWA 테스트 방법

### 안드로이드에서 테스트
1. Chrome 브라우저에서 사이트 접속
2. 메뉴 → "홈 화면에 추가"
3. 앱 이름 확인 후 "추가"
4. 홈 화면에서 아이콘 확인

### iOS에서 테스트
1. Safari 브라우저에서 사이트 접속
2. 공유 버튼 (↗️) 클릭
3. "홈 화면에 추가" 선택
4. 앱 이름 확인 후 "추가"

### 데스크톱에서 테스트
1. Chrome/Edge에서 사이트 접속
2. 주소창 우측의 설치 아이콘 클릭
3. "설치" 버튼 클릭

## 🔧 배포 후 설정

### 1. 사이트 설정 최적화

#### Environment Variables (선택사항)
```
Site settings > Environment variables
```

#### Headers 설정
`netlify.toml` 파일에 이미 포함됨:
- Security headers
- PWA 관련 headers
- Cache control

### 2. Performance 최적화

#### Build & Deploy 설정
- Auto publishing: 활성화
- Branch deploys: main 브랜치만
- Deploy previews: Pull request용

#### 폼 처리 (향후 확장)
```html
<!-- 폼에 netlify 속성 추가 -->
<form netlify>
  <!-- 폼 내용 -->
</form>
```

### 3. 모니터링 설정

#### Analytics 추가 (선택사항)
1. Site settings > Analytics
2. Google Analytics 연동

#### Error tracking
- Netlify Functions 사용시 로그 모니터링

## 🐛 문제 해결

### 일반적인 문제들

#### 1. PWA가 설치되지 않는 경우
```javascript
// 브라우저 콘솔에서 확인
console.log('Service worker supported:', 'serviceWorker' in navigator);
console.log('Manifest:', document.querySelector('link[rel="manifest"]'));
```

**해결 방법:**
- HTTPS 확인
- manifest.json 경로 확인
- Service Worker 등록 확인

#### 2. 아이콘이 표시되지 않는 경우
- `icons/` 폴더 경로 확인
- 아이콘 파일 크기 확인
- manifest.json의 icons 배열 확인

#### 3. 오프라인 동작하지 않는 경우
```javascript
// Service Worker 상태 확인
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  console.log('Registered service workers:', registrations);
});
```

### 배포 문제

#### Build 실패
- `netlify.toml` 설정 확인
- 파일 경로 대소문자 확인

#### 404 오류
- `netlify.toml`의 redirects 설정 확인
- 파일명 정확성 확인

## 📊 성능 측정

### Lighthouse 테스트
1. Chrome DevTools > Lighthouse
2. PWA 카테고리 체크
3. 점수 100점 목표

### 필수 체크 항목
- [ ] PWA 설치 가능
- [ ] 오프라인 동작
- [ ] 반응형 디자인
- [ ] HTTPS 사용
- [ ] 빠른 로딩 속도

## 🔄 업데이트 방법

### 코드 업데이트
```bash
# 1. 변경사항 커밋
git add .
git commit -m "Update: 변경 내용 설명"

# 2. 푸시 (자동 배포됨)
git push origin main
```

### Service Worker 버전 관리
```javascript
// sw.js에서 캐시 이름 업데이트
const CACHE_NAME = 'child-pugh-calculator-v2'; // 버전 증가
```

## 📱 스토어 배포 (선택사항)

### TWA (Trusted Web Activity) - Android
1. [PWABuilder](https://www.pwabuilder.com/) 사용
2. Play Store 업로드

### App Store - iOS
- 현재 PWA는 App Store 직접 업로드 불가
- 네이티브 래퍼 앱 필요

## 🎯 마케팅 및 공유

### QR 코드 생성
- 배포된 URL로 QR 코드 생성
- 포스터나 문서에 삽입

### 소셜 미디어 메타 태그
`index.html`에 이미 포함됨:
```html
<meta property="og:title" content="Child-Pugh Score 계산기">
<meta property="og:description" content="간경화 환자의 간 기능 평가 도구">
```

---

## 🆘 지원

### 도움이 필요한 경우
1. [Netlify 문서](https://docs.netlify.com/)
2. [PWA 가이드](https://web.dev/progressive-web-apps/)
3. GitHub Issues 생성

### 추가 기능 요청
- 데이터 백업/복원
- 계산 히스토리
- 다국어 지원
- 프린트 기능 