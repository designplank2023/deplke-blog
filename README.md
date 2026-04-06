# 디자인플랜케이 블로그 (DEPLKE Blog)

Next.js 14+ (App Router)로 구축한 전문가급 기술 블로그 플랫폼입니다.
Supabase 데이터베이스와 통합되어 있으며, SEO 최적화와 현대적인 UI/UX를 제공합니다.

## 주요 기능

- **Server-Side Rendering (SSR)** - Next.js 14+ App Router 사용
- **ISR (Incremental Static Regeneration)** - 60초마다 자동 업데이트
- **SEO 최적화**
  - 동적 메타데이터 생성
  - Open Graph 태그
  - JSON-LD 구조화된 데이터
  - Sitemap 자동 생성 (`sitemap.xml`)
  - robots.txt
- **반응형 디자인** - 모바일 우선 설계
- **다크/라이트 모드** - 테마 토글 기능
- **카테고리 시스템** - 주제별 필터링
- **목차(TOC) 생성** - 긴 글의 네비게이션
- **조회수 추적** - 글의 인기도 측정
- **성능 최적화**
  - Next.js Image 최적화
  - Lazy Loading
  - CSS 최소화
  - 정적 생성 활용

## 기술 스택

- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Client Library**: @supabase/supabase-js
- **Fonts**: Inter + Noto Sans KR (Google Fonts)

## 프로젝트 구조

```
deplke-blog/
├── src/
│   ├── app/                          # App Router 디렉토리
│   │   ├── layout.tsx               # Root 레이아웃 (한국어 폰트, 메타데이터)
│   │   ├── page.tsx                 # 홈페이지
│   │   ├── globals.css              # 전역 스타일
│   │   ├── robots.ts                # robots.txt 생성
│   │   ├── sitemap.ts               # sitemap.xml 생성
│   │   ├── blog/
│   │   │   ├── page.tsx             # 블로그 목록 페이지
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # 블로그 글 상세 페이지
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # 카테고리별 글 목록
│   │   ├── about/
│   │   │   └── page.tsx             # 소개 페이지
│   │   └── not-found.tsx            # 404 페이지
│   ├── components/
│   │   ├── Header.tsx               # 헤더 네비게이션
│   │   ├── Footer.tsx               # 푸터
│   │   ├── PostCard.tsx             # 블로그 글 카드 컴포넌트
│   │   ├── ThemeToggle.tsx          # 다크/라이트 모드 토글
│   │   └── TableOfContents.tsx      # 목차 컴포넌트
│   └── lib/
│       ├── supabase.ts              # Supabase 클라이언트 설정 및 쿼리
│       ├── types.ts                 # TypeScript 타입 정의
│       └── markdown.ts              # 마크다운 유틸리티 함수
├── public/
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   └── site.webmanifest
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
├── .env.example
├── .gitignore
└── README.md
```

## 설치 및 실행

### 1. 프로젝트 복제 또는 다운로드

```bash
cd deplke-blog
```

### 2. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env.local` 파일을 생성합니다:

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열고 Supabase 정보를 입력합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

NEXT_PUBLIC_BLOG_TITLE=디자인플랜케이 블로그
NEXT_PUBLIC_BLOG_DESCRIPTION=AI, 개발, 교육, 광고, 마케팅, 커리어에 대한 최신 정보
NEXT_PUBLIC_SITE_URL=https://blog.deplke.com
```

### 3. 의존성 설치

```bash
npm install
# 또는
yarn install
# 또는
pnpm install
```

### 4. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

[http://localhost:3000](http://localhost:3000)에서 블로그를 확인할 수 있습니다.

### 5. 프로덕션 빌드

```bash
npm run build
npm run start
```

## Supabase 데이터베이스 스키마

### posts 테이블
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt VARCHAR NOT NULL,
  category_id UUID REFERENCES categories(id),
  meta_description VARCHAR,
  og_image_url VARCHAR,
  status VARCHAR DEFAULT 'draft', -- 'draft', 'published', 'archived'
  published_at TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### categories 테이블
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description VARCHAR,
  color VARCHAR DEFAULT '#6366F1', -- 16진수 색상 코드
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### tags 테이블
```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### post_tags 테이블
```sql
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
```

### blog_settings 테이블
```sql
CREATE TABLE blog_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

## 페이지 설명

### 홈페이지 (/)
- 최신 글 소개
- 최근 글 그리드
- 카테고리 표시
- 구독 CTA (Call-to-Action)

### 블로그 목록 (/blog)
- 전체 글 목록
- 카테고리별 필터링
- 페이지네이션
- 검색 기능 (확장 가능)

### 블로그 글 상세 (/blog/[slug])
- 전체 글 본문 렌더링
- 목차 (Table of Contents) 자동 생성
- 읽기 시간 표시
- 조회수 카운트
- 메타데이터 및 Open Graph 태그
- 구조화된 데이터 (JSON-LD)
- 관련 글 추천

### 카테고리 페이지 (/category/[slug])
- 특정 카테고리의 모든 글
- 카테고리 정보 표시
- 다른 카테고리 네비게이션
- 페이지네이션

### 소개 페이지 (/about)
- 블로그 소개
- 연락처 정보
- 소셜 미디어 링크
- 구독 CTA

### 404 페이지
- 사용자 친화적 에러 페이지
- 홈 및 블로그로의 빠른 링크

## SEO 최적화 기능

### 1. 동적 메타데이터
모든 페이지에서 `Metadata` API를 사용하여 동적으로 메타데이터를 생성합니다.

```typescript
export const metadata: Metadata = {
  title: '글 제목',
  description: '글 설명',
  openGraph: {
    title: '글 제목',
    description: '글 설명',
    type: 'article',
  },
  // ... 더 많은 메타데이터
};
```

### 2. Open Graph 태그
소셜 미디어 공유 최적화:
- `og:title` - 글 제목
- `og:description` - 글 설명
- `og:image` - 대표 이미지
- `og:type` - 콘텐츠 타입
- `og:url` - 페이지 URL

### 3. JSON-LD 구조화된 데이터
검색 엔진 최적화:
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://blog.deplke.com",
  "name": "디자인플랜케이 블로그"
}
```

### 4. Sitemap (sitemap.xml)
모든 페이지의 자동 생성 사이트맵:
- 정적 페이지 (홈, 블로그, 소개)
- 동적 페이지 (글, 카테고리)
- 마지막 수정일
- 업데이트 빈도
- 우선순위

### 5. robots.txt
검색 엔진 크롤러 가이드:
```
User-agent: *
Allow: /
Disallow: /admin
Sitemap: https://blog.deplke.com/sitemap.xml
```

## 성능 최적화

### 1. 이미지 최적화
Next.js의 `next/image`를 사용하여:
- 자동 포맷 변환 (AVIF, WebP)
- 반응형 이미지 제공
- Lazy Loading

### 2. ISR (Incremental Static Regeneration)
```typescript
export const revalidate = 60; // 60초마다 재생성
```

### 3. 정적 생성 (Static Generation)
- `generateStaticParams()`를 사용한 동적 라우트 미리 생성
- 빌드 시간에 페이지 생성

### 4. CSS 최적화
- Tailwind CSS로 미사용 CSS 제거
- 필요한 스타일만 포함

## 커스터마이징 가이드

### 테마 색상 변경
`tailwind.config.ts`의 `theme.extend.colors` 섹션을 수정합니다:

```typescript
colors: {
  brand: {
    primary: '#your-color',
    secondary: '#your-color',
    // ...
  },
}
```

### 글꼴 변경
`src/app/layout.tsx`에서 Google Fonts를 수정합니다:

```typescript
const customFont = Inter({
  subsets: ['latin'],
  variable: '--font-custom',
  display: 'swap',
});
```

### 블로그 설정
`.env.local` 파일에서 환경 변수를 수정합니다:

```env
NEXT_PUBLIC_BLOG_TITLE=새로운 블로그 제목
NEXT_PUBLIC_BLOG_DESCRIPTION=새로운 설명
```

### 카테고리 색상 커스터마이징
Supabase의 `categories` 테이블에서 `color` 필드를 16진수 색상 코드로 설정합니다.

## 배포

### Vercel (권장)

1. GitHub에 프로젝트를 푸시합니다.
2. [Vercel](https://vercel.com)에 접속하여 로그인합니다.
3. "New Project"를 클릭하고 GitHub 저장소를 선택합니다.
4. 환경 변수를 설정합니다:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. "Deploy"를 클릭합니다.

### 기타 호스팅 서비스

#### Netlify
```bash
npm run build
```
`out` 폴더를 Netlify에 배포합니다.

#### AWS Amplify, Railway, Heroku
각 서비스의 공식 문서를 참조하여 배포합니다.

## 개발 팁

### TypeScript 타입 검사
```bash
npm run type-check
```

### ESLint
```bash
npm run lint
```

### 프로덕션 빌드 테스트
```bash
npm run build
npm run start
```

## 기여 가이드

1. 새 브랜치를 생성합니다: `git checkout -b feature/your-feature`
2. 변경사항을 커밋합니다: `git commit -am 'Add feature'`
3. 브랜치를 푸시합니다: `git push origin feature/your-feature`
4. Pull Request를 생성합니다.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 지원 및 문의

문제가 발생하거나 질문이 있으신 경우:
- 이메일: info@deplke.com
- GitHub Issues: [Issues 페이지]

## 업데이트 로그

### v1.0.0 (2024)
- 초기 버전 출시
- Next.js 14+ App Router 지원
- Supabase 통합
- SEO 최적화
- 다크/라이트 모드
- 반응형 디자인

## 감사의 말

이 프로젝트는 다음의 오픈소스 라이브러리를 사용합니다:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

**마지막 업데이트**: 2024년 4월
