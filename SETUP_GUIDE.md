# 디자인플랜케이 블로그 설정 가이드

이 문서는 Next.js 14+ 블로그 프로젝트를 설정하고 실행하는 단계별 가이드입니다.

## 사전 요구사항

- Node.js 18+ 설치
- npm, yarn, 또는 pnpm 패키지 매니저
- Supabase 계정 (무료 가능)
- 선택: GitHub 계정 (배포용)

## 1단계: Supabase 프로젝트 설정

### 1.1 Supabase 프로젝트 생성

1. [Supabase 웹사이트](https://supabase.com)에 접속
2. "Start your project" 클릭
3. GitHub 또는 이메일로 회원가입
4. 새 프로젝트 생성
   - Project name: "deplke-blog"
   - Database password: 강력한 비밀번호 설정
   - Region: Asia-Pacific (Singapore)
5. 프로젝트 대시보드로 이동

### 1.2 프로젝트 URL과 API 키 복사

1. Settings → API 클릭
2. 아래 정보를 복사합니다:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` (Public API Key) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 1.3 데이터베이스 테이블 생성

Supabase 대시보드의 SQL Editor에서 다음 SQL을 실행합니다:

```sql
-- 카테고리 테이블
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description VARCHAR,
  color VARCHAR DEFAULT '#6366F1',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 태그 테이블
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 글 테이블
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt VARCHAR NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  meta_description VARCHAR,
  og_image_url VARCHAR,
  status VARCHAR DEFAULT 'draft',
  published_at TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 글-태그 관계 테이블
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- 블로그 설정 테이블
CREATE TABLE blog_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 조회수 증가 함수 (선택사항)
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts SET view_count = view_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 1.4 테스트 데이터 삽입 (선택사항)

```sql
-- 카테고리 추가
INSERT INTO categories (name, slug, description, color) VALUES
('AI', 'ai', '인공지능과 머신러닝 관련 글', '#6366F1'),
('개발', 'development', '웹, 모바일, 백엔드 개발', '#EC4899'),
('교육', 'education', '기술 학습과 자기계발', '#F59E0B'),
('광고', 'advertising', '디지털 광고 전략과 운영', '#10B981'),
('마케팅', 'marketing', '마케팅 전략과 인사이트', '#3B82F6'),
('커리어', 'career', '커리어 개발과 취업 정보', '#8B5CF6');

-- 태그 추가
INSERT INTO tags (name, slug) VALUES
('Next.js', 'nextjs'),
('React', 'react'),
('TypeScript', 'typescript'),
('Supabase', 'supabase'),
('SEO', 'seo'),
('성능최적화', 'performance');

-- 테스트 글 추가
INSERT INTO posts (title, slug, content, excerpt, category_id, meta_description, status, published_at) VALUES
(
  'Next.js 14 블로그 만들기',
  'nextjs-14-blog-tutorial',
  '# Next.js 14 블로그 만들기\n\nNext.js 14+를 사용하여 전문가급 블로그를 만드는 방법을 배워보세요...',
  'Next.js 14+와 Supabase를 사용한 전문가급 블로그 구축 가이드',
  (SELECT id FROM categories WHERE slug = 'development' LIMIT 1),
  'Next.js 14를 사용한 블로그 구축 완벽 가이드',
  'published',
  now()
);
```

## 2단계: 로컬 프로젝트 설정

### 2.1 환경 변수 설정

프로젝트 디렉토리에서:

```bash
# .env.local 파일 생성
cp .env.example .env.local
```

`.env.local` 파일을 열고 Supabase 정보를 입력합니다:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Blog Configuration
NEXT_PUBLIC_BLOG_TITLE=디자인플랜케이 블로그
NEXT_PUBLIC_BLOG_DESCRIPTION=AI, 개발, 교육, 광고, 마케팅, 커리어에 대한 최신 정보를 공유합니다
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2.2 의존성 설치

```bash
npm install
```

또는 yarn/pnpm 사용:

```bash
yarn install
# 또는
pnpm install
```

### 2.3 개발 서버 시작

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 열어서 확인합니다.

## 3단계: 블로그 콘텐츠 관리

### 3.1 Supabase 대시보드에서 글 관리

1. Supabase 대시보드 → Table Editor
2. "posts" 테이블 선택
3. "Insert" 버튼으로 새 글 추가

### 필수 필드

| 필드 | 설명 | 예시 |
|-----|-----|------|
| title | 글 제목 | "Next.js 14 블로그 만들기" |
| slug | URL 슬래그 (고유) | "nextjs-14-blog" |
| content | 글 본문 (마크다운) | "# 제목\n\n본문..." |
| excerpt | 요약 | "Next.js 14를..." |
| category_id | 카테고리 ID | (드롭다운에서 선택) |
| meta_description | SEO 설명 | "Next.js 14 블로그..." |
| status | 상태 | "published" 또는 "draft" |
| published_at | 발행일 | 2024-04-06 |

### 3.2 마크다운 포맷

글은 마크다운 형식을 지원합니다:

```markdown
# 제목 1
## 제목 2
### 제목 3

**굵은 텍스트**
*이탤릭*

- 목록 항목
- 또 다른 항목

1. 번호 목록
2. 또 다른 항목

[링크 텍스트](https://example.com)

> 인용구

\`\`\`javascript
const code = "여기에 코드를 입력하세요";
\`\`\`
```

## 4단계: 커스터마이징

### 4.1 사이트 제목 및 설명 변경

`.env.local` 파일에서:

```env
NEXT_PUBLIC_BLOG_TITLE=새로운 제목
NEXT_PUBLIC_BLOG_DESCRIPTION=새로운 설명
```

### 4.2 색상 테마 변경

`tailwind.config.ts`에서:

```typescript
colors: {
  brand: {
    primary: '#your-color',
    secondary: '#your-color',
    // ...
  },
}
```

### 4.3 로고 변경

`src/components/Header.tsx`의 로고 부분을 수정합니다.

### 4.4 카테고리 색상 설정

Supabase 대시보드 → categories 테이블 → color 필드에 16진수 색상 입력:

```
#6366F1 - 보라색
#EC4899 - 핑크색
#F59E0B - 노란색
#10B981 - 초록색
#3B82F6 - 파란색
#8B5CF6 - 보라색
```

## 5단계: 프로덕션 배포

### 5.1 Vercel 배포 (권장)

1. GitHub에 프로젝트 푸시:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/deplke-blog.git
git push -u origin main
```

2. [Vercel](https://vercel.com)에 접속 및 로그인
3. "New Project" → GitHub 저장소 선택
4. 환경 변수 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (배포된 도메인)
5. Deploy 클릭

### 5.2 커스텀 도메인 연결

Vercel 대시보드:
1. Project Settings → Domains
2. "Add Domain" 클릭
3. 도메인 입력 및 DNS 설정

### 5.3 환경 변수 최종 확인

프로덕션 배포 전:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_key
NEXT_PUBLIC_SITE_URL=https://blog.deplke.com
```

## 문제 해결

### 글이 표시되지 않음

1. Supabase 연결 확인:
   - `.env.local`에 올바른 URL과 API 키 입력
   - 네트워크 탭에서 Supabase 요청 확인

2. 데이터 확인:
   - Supabase 대시보드에서 "posts" 테이블 확인
   - `status = 'published'` 확인

### 스타일이 적용되지 않음

```bash
# Tailwind CSS 재빌드
npm run dev
```

캐시 삭제:
```bash
rm -rf .next
npm run dev
```

### 환경 변수 오류

1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 개발 서버 재시작:
```bash
# Ctrl+C로 서버 중지 후
npm run dev
```

## 개발 명령어

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm run start

# TypeScript 검사
npm run type-check

# 린트 체크
npm run lint
```

## 보안 체크리스트

- [ ] `.env.local` 파일은 `.gitignore`에 포함됨
- [ ] Supabase Row Level Security (RLS) 정책 설정
- [ ] API 키는 공개 저장소에 커밋되지 않음
- [ ] HTTPS 사용 (배포 시)
- [ ] CORS 정책 확인

## 추가 리소스

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Supabase 문서](https://supabase.com/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [TypeScript 문서](https://www.typescriptlang.org/docs/)

## 지원

문제가 발생하면:
1. 이 가이드의 문제 해결 섹션 확인
2. [Supabase Discord](https://discord.supabase.com)에서 도움 요청
3. info@deplke.com으로 문의

---

**성공적인 설정을 축하합니다!** 이제 전문가급 블로그를 운영할 준비가 되었습니다. 🎉
