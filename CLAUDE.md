# CLAUDE.md - miru-frontend

## 🚀 Context

- **Description:** 일본 취업을 준비하는 한국인을 위한 자기분석 서비스 (프론트엔드 전담 개발)
- **Role:** 백엔드 API가 분리되어 있으며, 프론트엔드 아키텍처 및 UI/UX 구현에 집중

## 🏗️ Architecture & Conventions (FSD)

- **Structure:** `src/` 내 `app`, `widgets`, `features`, `entities`, `shared` 계층 엄격 준수
- **Shared UI:** 모든 재사용 컴포넌트는 `src/shared/ui`에 위치
- **Data Fetching:** TanStack Query를 사용하여 백엔드 API와 통신

## 🛠️ Critical Commands

- **Dev:** `npm run dev`
- **Build/Lint:** `npm run build` / `npm run lint`

## 📚 Progressive Disclosure

- `agent_docs/api_spec.md`: 백엔드 API 엔드포인트 및 데이터 구조 가이드
