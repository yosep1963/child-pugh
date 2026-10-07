#!/bin/bash

echo "🚀 Netlify 배포용 파일 준비 중..."

# 배포 디렉토리 생성
DEPLOY_DIR="netlify-deploy"
if [ -d "$DEPLOY_DIR" ]; then
    rm -rf "$DEPLOY_DIR"
fi
mkdir -p "$DEPLOY_DIR"

echo "📁 배포 디렉토리 생성: $DEPLOY_DIR"

# 필수 파일들 복사
cp index.html "$DEPLOY_DIR/"
cp styles.css "$DEPLOY_DIR/"
cp script.js "$DEPLOY_DIR/"
cp manifest.json "$DEPLOY_DIR/"
cp service-worker.js "$DEPLOY_DIR/"
cp netlify.toml "$DEPLOY_DIR/"
cp _headers "$DEPLOY_DIR/"
cp _redirects "$DEPLOY_DIR/"
cp README.md "$DEPLOY_DIR/"
cp NETLIFY_DEPLOY_GUIDE.md "$DEPLOY_DIR/"

echo "✅ 기본 파일들 복사 완료"

# 아이콘 파일들 복사
cp icon-*.png "$DEPLOY_DIR/"

echo "✅ 아이콘 파일들 복사 완료"

# 배포용 zip 파일 생성
ZIP_NAME="child-pugh-netlify-$(date +%Y%m%d_%H%M%S).zip"
cd "$DEPLOY_DIR"
zip -r "../$ZIP_NAME" ./*
cd ..

echo "📦 배포용 ZIP 파일 생성: $ZIP_NAME"

# 파일 목록 확인
echo ""
echo "📋 배포 파일 목록:"
ls -la "$DEPLOY_DIR"

echo ""
echo "🎉 배포 준비 완료!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 다음 단계:"
echo ""
echo "방법 1 - Git 연결 배포 (추천):"
echo "1. GitHub에서 새 저장소 생성"
echo "2. git init && git add . && git commit -m 'Initial commit'"
echo "3. git remote add origin [저장소URL]"
echo "4. git push -u origin main"
echo "5. Netlify에서 GitHub 저장소 연결"
echo ""
echo "방법 2 - 직접 업로드:"
echo "1. Netlify.com 접속"
echo "2. '$ZIP_NAME' 파일을 드래그앤드롭"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📖 자세한 가이드: NETLIFY_DEPLOY_GUIDE.md 참조" 