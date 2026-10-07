// Child-Pugh Score 계산기
class ChildPughCalculator {
    constructor() {
        this.form = document.getElementById('childPughForm');
        this.resultSection = document.getElementById('result');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.addInputValidation();
    }

    addInputValidation() {
        const inputs = this.form.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateInput(input));
        });

        // 응고 지표 종류(INR/PT)가 바뀌면 허용 범위도 달라지므로 다시 검사
        const coagType = document.getElementById('inrType');
        if (coagType) {
            coagType.addEventListener('change', () => {
                this.validateInput(document.getElementById('inr'));
            });
        }
    }

    getCoagulationType() {
        const coagType = document.getElementById('inrType');
        return coagType ? coagType.value : 'inr';
    }

    // 값을 임의로 잘라내지 않고, 범위를 벗어나면 단위 확인을 요구한다
    getRangeError(id, value) {
        if (Number.isNaN(value)) return '';
        if (value < 0) return '0 이상의 값을 입력하세요.';

        if (id === 'bilirubin' && value > 50) {
            return '빌리루빈은 mg/dL 단위로 입력하세요 (0–50). µmol/L 값은 17.1로 나누어 입력하세요.';
        }
        if (id === 'albumin' && value > 7) {
            return '알부민은 g/dL 단위로 입력하세요 (0–7). g/L 값은 10으로 나누어 입력하세요.';
        }
        if (id === 'inr') {
            if (this.getCoagulationType() === 'pt') {
                if (value > 60) {
                    return 'PT는 정상 대조군 대비 연장된 시간(초)을 입력하세요 (0–60). 측정된 PT 값 자체가 아닙니다.';
                }
            } else if (value > 10) {
                return 'INR은 0–10 범위로 입력하세요.';
            }
        }
        return '';
    }

    validateInput(input) {
        input.setCustomValidity(this.getRangeError(input.id, parseFloat(input.value)));
    }

    handleSubmit(event) {
        event.preventDefault();

        // 단축키(dispatchEvent)로 제출되면 브라우저 기본 검증이 생략되므로 직접 검사
        this.form.querySelectorAll('input[type="number"]').forEach(input => this.validateInput(input));
        if (!this.form.reportValidity()) return;

        const formData = this.getFormData();
        if (!showErrors(validateFormData(formData))) return;

        const scores = this.calculateScores(formData);
        const totalScore = this.calculateTotalScore(scores);
        const classification = this.getClassification(totalScore);

        this.displayResults(scores, totalScore, classification, formData.coagulationType);
        this.scrollToResults();
    }

    // select(id) 또는 radio(name) 어느 쪽으로 구성된 화면이든 값을 읽는다
    getChoiceValue(name) {
        const select = document.getElementById(name);
        if (select) return parseInt(select.value, 10);
        const checked = this.form.querySelector(`input[name="${name}"]:checked`);
        return checked ? parseInt(checked.value, 10) : NaN;
    }

    getFormData() {
        return {
            bilirubin: parseFloat(document.getElementById('bilirubin').value),
            albumin: parseFloat(document.getElementById('albumin').value),
            inr: parseFloat(document.getElementById('inr').value),
            coagulationType: this.getCoagulationType(),
            ascites: this.getChoiceValue('ascites'),
            encephalopathy: this.getChoiceValue('encephalopathy')
        };
    }

    calculateScores(data) {
        return {
            bilirubin: this.calculateBilirubinScore(data.bilirubin),
            albumin: this.calculateAlbuminScore(data.albumin),
            inr: data.coagulationType === 'pt'
                ? this.calculatePtScore(data.inr)
                : this.calculateInrScore(data.inr),
            ascites: data.ascites,
            encephalopathy: data.encephalopathy
        };
    }

    calculateBilirubinScore(value) {
        // < 2 (1점), 2-3 (2점), > 3 (3점)
        if (value < 2) return 1;
        if (value <= 3) return 2;
        return 3;
    }

    calculateAlbuminScore(value) {
        // > 3.5 (1점), 2.8-3.5 (2점), < 2.8 (3점)
        if (value > 3.5) return 1;
        if (value >= 2.8) return 2;
        return 3;
    }

    calculateInrScore(value) {
        // < 1.7 (1점), 1.7-2.3 (2점), > 2.3 (3점) — 2.3은 2점, 2.3 초과부터 3점
        if (value < 1.7) return 1;
        if (value <= 2.3) return 2;
        return 3;
    }

    calculatePtScore(prolongationSeconds) {
        // 정상 대조군 대비 PT 연장: < 4초 (1점), 4-6초 (2점), > 6초 (3점)
        if (prolongationSeconds < 4) return 1;
        if (prolongationSeconds <= 6) return 2;
        return 3;
    }

    calculateTotalScore(scores) {
        return scores.bilirubin + scores.albumin + scores.inr + scores.ascites + scores.encephalopathy;
    }

    getClassification(totalScore) {
        if (totalScore <= 6) {
            return {
                class: 'A',
                name: 'Child-Pugh Class A',
                description: '간 기능 양호',
                cssClass: 'class-a',
                prognosis: {
                    lifeExpectancy: '15-20년',
                    surgicalMortality: '약 10%',
                    oneYearMortality: '0%',
                    recommendation: '선택적 수술 가능',
                    details: 'Class A 환자는 일반적으로 안전한 수술 후보자로 간주됩니다. 정기적인 추적 관찰과 함께 대부분의 치료가 가능합니다.'
                }
            };
        } else if (totalScore <= 9) {
            return {
                class: 'B',
                name: 'Child-Pugh Class B',
                description: '중등도 간 기능 장애',
                cssClass: 'class-b',
                prognosis: {
                    lifeExpectancy: '가변적',
                    surgicalMortality: '약 30%',
                    oneYearMortality: '20%',
                    recommendation: '간이식 평가 대상',
                    details: 'Class B 환자는 의학적 최적화 후 수술이 가능하지만 위험도가 증가합니다. 간이식 평가를 고려해야 합니다.'
                }
            };
        } else {
            return {
                class: 'C',
                name: 'Child-Pugh Class C',
                description: '심한 간 기능 장애',
                cssClass: 'class-c',
                prognosis: {
                    lifeExpectancy: '1-3년',
                    surgicalMortality: '70-80%',
                    oneYearMortality: '55%',
                    recommendation: '선택적 수술 금기',
                    details: 'Class C 환자는 선택적 수술이 금기입니다. 즉시 간이식 평가와 집중적인 의학적 관리가 필요합니다.'
                }
            };
        }
    }

    getPrognosisHtml(prognosis) {
        return `
            <div class="prognosis-item">
                <strong>기대 수명:</strong> ${prognosis.lifeExpectancy}
            </div>
            <div class="prognosis-item">
                <strong>복부 수술 사망률:</strong> ${prognosis.surgicalMortality}
            </div>
            <div class="prognosis-item">
                <strong>1년 사망률:</strong> ${prognosis.oneYearMortality}
            </div>
            <div class="prognosis-item">
                <strong>권고사항:</strong> ${prognosis.recommendation}
            </div>
            <div class="prognosis-details">
                <p>${prognosis.details}</p>
            </div>
        `;
    }

    displayResults(scores, totalScore, classification, coagulationType) {
        if (document.getElementById('bilirubinScore')) {
            // 항목별 결과 칸이 미리 있는 화면 (index.html, standalone)
            document.getElementById('bilirubinScore').textContent = `${scores.bilirubin}점`;
            document.getElementById('albuminScore').textContent = `${scores.albumin}점`;
            document.getElementById('inrScore').textContent = `${scores.inr}점`;
            document.getElementById('ascitesScore').textContent = `${scores.ascites}점`;
            document.getElementById('encephalopathyScore').textContent = `${scores.encephalopathy}점`;

            document.getElementById('totalScore').textContent = `${totalScore}점`;

            const classificationDiv = document.getElementById('classification');
            classificationDiv.className = `classification ${classification.cssClass}`;

            document.getElementById('className').textContent = classification.name;
            document.getElementById('classDescription').textContent = classification.description;

            document.getElementById('prognosisInfo').innerHTML = this.getPrognosisHtml(classification.prognosis);
        } else {
            // 결과 컨테이너만 있는 화면 (android-webview-app.html)
            const coagLabel = coagulationType === 'pt' ? 'PT 연장' : 'INR';
            const items = [
                ['빌리루빈', scores.bilirubin],
                ['알부민', scores.albumin],
                [coagLabel, scores.inr],
                ['복수', scores.ascites],
                ['간성뇌증', scores.encephalopathy]
            ];
            document.getElementById('scoreDisplay').innerHTML = `
                <div class="score-breakdown">
                    ${items.map(([label, score]) => `
                        <div class="breakdown-item">
                            <span class="label">${label}:</span>
                            <span class="score">${score}점</span>
                        </div>`).join('')}
                </div>
                <div class="total-score">
                    <span class="total-label">총 점수:</span>
                    <span class="total-value">${totalScore}점</span>
                </div>
            `;
            document.getElementById('classDisplay').innerHTML = `
                <div class="classification ${classification.cssClass}">
                    <div class="class-info">
                        <div class="class-name">${classification.name}</div>
                        <div class="class-description">${classification.description}</div>
                    </div>
                </div>
            `;
            document.getElementById('prognosisDisplay').innerHTML = `
                <div class="prognosis">
                    <h3>예후 정보</h3>
                    <div class="prognosis-content">${this.getPrognosisHtml(classification.prognosis)}</div>
                </div>
            `;
        }

        // 결과 섹션 표시
        this.resultSection.style.display = 'block';

        // 애니메이션 효과
        this.resultSection.classList.remove('slideIn');
        setTimeout(() => {
            this.resultSection.classList.add('slideIn');
        }, 10);
    }

    scrollToResults() {
        setTimeout(() => {
            this.resultSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    }

    // 결과 초기화
    resetResults() {
        this.resultSection.style.display = 'none';
        this.form.reset();
        this.form.querySelectorAll('input[type="number"]').forEach(input => input.setCustomValidity(''));
    }
}

// 데이터 유효성 검사 (최종 방어선: NaN이 계산에 들어가면 조용히 3점이 되므로 차단)
function validateFormData(data) {
    const errors = [];

    if (Number.isNaN(data.bilirubin) || data.bilirubin < 0) {
        errors.push('빌리루빈 값이 유효하지 않습니다.');
    }

    if (Number.isNaN(data.albumin) || data.albumin < 0) {
        errors.push('알부민 값이 유효하지 않습니다.');
    }

    if (Number.isNaN(data.inr) || data.inr < 0) {
        errors.push(data.coagulationType === 'pt' ? 'PT 연장 값이 유효하지 않습니다.' : 'INR 값이 유효하지 않습니다.');
    }

    if (![1, 2, 3].includes(data.ascites)) {
        errors.push('복수 상태를 선택해주세요.');
    }

    if (![1, 2, 3].includes(data.encephalopathy)) {
        errors.push('간성뇌증 상태를 선택해주세요.');
    }

    return errors;
}

// 에러 표시 함수
function showErrors(errors) {
    if (errors.length > 0) {
        alert('입력 오류:\n' + errors.join('\n'));
        return false;
    }
    return true;
}

// PWA 설치 관리자
class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.installPrompt = document.getElementById('installPrompt');
        this.installBtn = document.getElementById('installBtn');
        this.dismissBtn = document.getElementById('dismissBtn');
        // 설치 프롬프트가 없는 화면(android-webview-app.html 등)에서는 건너뜀
        if (!this.installPrompt || !this.installBtn || !this.dismissBtn) return;
        this.init();
    }

    init() {
        // beforeinstallprompt 이벤트 리스너
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });

        // 앱 설치 완료 이벤트
        window.addEventListener('appinstalled', () => {
            console.log('PWA가 설치되었습니다');
            this.hideInstallPrompt();
            this.deferredPrompt = null;
        });

        // 설치 버튼 이벤트
        this.installBtn.addEventListener('click', () => {
            this.installApp();
        });

        // 나중에 버튼 이벤트
        this.dismissBtn.addEventListener('click', () => {
            this.hideInstallPrompt();
            this.setInstallPromptDismissed();
        });

        // 이미 설치된 상태인지 확인
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.hideInstallPrompt();
        }

        // 이전에 사용자가 설치를 거부했는지 확인
        if (localStorage.getItem('installPromptDismissed')) {
            const dismissedTime = parseInt(localStorage.getItem('installPromptDismissed'));
            const now = Date.now();
            const oneWeek = 7 * 24 * 60 * 60 * 1000; // 1주일

            if (now - dismissedTime < oneWeek) {
                return; // 1주일 동안 프롬프트 표시 안함
            }
        }
    }

    showInstallPrompt() {
        this.installPrompt.style.display = 'block';
    }

    hideInstallPrompt() {
        this.installPrompt.style.display = 'none';
    }

    async installApp() {
        if (!this.deferredPrompt) {
            return;
        }

        // 설치 프롬프트 표시
        this.deferredPrompt.prompt();

        // 사용자의 응답 대기
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log(`사용자 응답: ${outcome}`);

        if (outcome === 'accepted') {
            console.log('사용자가 PWA 설치를 수락했습니다');
        } else {
            console.log('사용자가 PWA 설치를 거부했습니다');
            this.setInstallPromptDismissed();
        }

        this.deferredPrompt = null;
        this.hideInstallPrompt();
    }

    setInstallPromptDismissed() {
        localStorage.setItem('installPromptDismissed', Date.now().toString());
    }
}

// 계산기 인스턴스 (Esc 초기화 등에서 재사용 — 매번 새로 만들면 submit 리스너가 중복 등록됨)
let calculator = null;

// 결과와 입력 초기화 (android-webview-app.html의 초기화 버튼에서도 사용)
function resetForm() {
    if (calculator) calculator.resetResults();
}

// DOM이 로드되면 계산기 초기화
document.addEventListener('DOMContentLoaded', function() {
    calculator = new ChildPughCalculator();
    new PWAInstaller();
    
    // PWA 지원을 위한 서비스 워커 등록
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registered successfully');
                
                // 새로운 서비스 워커가 있는지 확인
                registration.addEventListener('updatefound', () => {
                    console.log('New service worker found, reloading...');
                    window.location.reload();
                });
            })
            .catch(error => {
                console.log('Service Worker registration failed');
            });
    }
});

// 입력 필드 애니메이션 효과
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // 초기 상태 설정
        if (input.value !== '') {
            input.parentElement.classList.add('focused');
        }
    });
});

// 키보드 단축키 지원
document.addEventListener('keydown', function(event) {
    // Ctrl + Enter로 계산 실행
    if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        const submitBtn = document.querySelector('.calculate-btn');
        submitBtn.click();
    }
    
    // Escape로 결과 초기화
    if (event.key === 'Escape') {
        resetForm();
    }
});

// 터치 이벤트 지원 (모바일)
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // 터치 피드백 효과
    const buttons = document.querySelectorAll('button, .info-card');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 150);
        });
    });
}

// 오프라인 감지
window.addEventListener('online', function() {
    console.log('온라인 상태입니다');
    // 온라인 상태 알림 (선택사항)
});

window.addEventListener('offline', function() {
    console.log('오프라인 상태입니다');
    // 오프라인 상태 알림 (선택사항)
});

// 앱 업데이트 감지
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', function() {
        // 새 서비스 워커가 활성화되면 페이지 새로고침
        window.location.reload();
    });
} 