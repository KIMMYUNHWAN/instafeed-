# ⬡ CLAY CLUB – Card Generator

> 9:16 비율의 제품 카드를 실시간으로 편집하고 PNG로 저장할 수 있는 대시보드 웹앱

---

## 🚀 주요 기능

| 기능 | 설명 |
|---|---|
| **실시간 미리보기** | 입력값이 바뀌는 즉시 카드 미리보기에 반영 |
| **상품명 편집** | 카드 제목을 자유롭게 입력 |
| **이미지 업로드** | 클릭 또는 드래그&드롭으로 이미지 교체 |
| **컬러 칩** | HEX 코드 입력 + 컬러 피커로 최대 6개 컬러칩 표시 |
| **링크 주소** | URL 입력 시 카드 하단 링크박스에 표시 |
| **하단 텍스트** | 크레딧/브랜드명 자유 입력 |
| **PNG 다운로드** | html2canvas로 카드를 고해상도 PNG로 저장 |
| **모바일 반응형** | 480px 이하 모바일 레이아웃 지원 |

---

## 📁 파일 구조

```
index.html       ← 메인 페이지 (카드 미리보기 + 대시보드)
css/
  style.css      ← 전체 스타일 (반응형 포함)
js/
  main.js        ← 실시간 바인딩, 이미지 업로드, 컬러칩, 다운로드 로직
README.md
```

---

## 🎨 카드 레이아웃 (9:16)

```
┌──────────────────────┐
│  [번호] FILE NAME     │  ← 상단: 파일 번호 레이블
│  상품명               │  ← 상단: 타이틀
│                      │
│  ┌──────────────┐    │
│  │   이미지      │    │  ← 중간: 이미지 (클릭/드롭)
│  └──────────────┘    │
│                      │
│  출처 레이블           │  ← 하단: source
│  ● ● ● 컬러칩        │  ← 하단: 컬러칩 (HEX)
│  [ 링크 주소 ]        │  ← 하단: URL 박스
│  FOOTER TEXT         │  ← 하단: 크레딧 텍스트
└──────────────────────┘
```

---

## 🛠 사용 방법

1. **오른쪽 대시보드**에서 각 항목 입력
2. **왼쪽 카드 미리보기**에서 실시간으로 확인
3. 이미지 영역 클릭 또는 파일 드래그&드롭으로 이미지 교체
4. 컬러칩: HEX 코드 직접 입력하거나 원형 버튼 클릭해 색상 피커 사용
5. **"카드 이미지 저장"** 버튼으로 PNG 다운로드

---

## 💻 GitHub 배포

```bash
git init
git add .
git commit -m "feat: CLAY CLUB Card Generator init"
git remote add origin https://github.com/YOUR_ID/clay-club-card.git
git push -u origin main
```

GitHub Pages 활성화: **Settings → Pages → Branch: main / root**

---

## 📦 사용 라이브러리

- [Google Fonts – Inter + Space Grotesk](https://fonts.google.com/)
- [Font Awesome 6](https://fontawesome.com/)
- [html2canvas 1.4.1](https://html2canvas.hertzen.com/) – 카드 PNG 저장

---

*CLAY CLUB Card Generator · 2026*
