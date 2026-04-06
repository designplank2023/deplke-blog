# 빠른 시작 가이드

5분 만에 블로그를 시작하세요!

## 체크리스트

### 1단계: Supabase 설정 (2분)

- [ ] [Supabase](https://supabase.com)에 가입
- [ ] 새 프로젝트 생성
- [ ] Settings → API에서 URL과 API 키 복사

### 2단계: 데이터베이스 설정 (1분)

- [ ] SQL Editor에서 데이터베이스 테이블 생성 (README.md의 스키마 참고)
- [ ] 테스트 카테고리 몇 개 추가
- [ ] 테스트 글 1-2개 추가

### 3단계: 로컬 설정 (2분)

```bash
# .env.local 생성
cp .env.example .env.local

# .env.local 편집 - Supabase 정보 입력
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

### 4단계: 확인

- [ ] http://localhost:3000 열기
- [ ] 홈페이지에 글이 표시되는지 확인
- [ ] `/blog` 페이지 확인
- [ ] 글 상세 페이지 확인

## 주요 페이지

| URL | 설명 |
|-----|-----|
| `/` | 홈 - 최신 글 소개 |
| `/blog` | 모든 글 목록 |
| `/blog/[slug]` | 글 상세 보기 |
| `/category/[slug]` | 카테고리별 글 |
| `/about` | 소개 페이지 |

## 주요 파일 위치

```
src/
├── app/
│   ├── page.tsx          ← 홈페이지
│   ├── layout.tsx        ← 전체 레이아웃
│   ├── blog/page.tsx     ← 블로그 목록
│   └── about/page.tsx    ← 소개 페이지
├── components/
│   ├── Header.tsx        ← 헤더
│   ├── PostCard.tsx      ← 글 카드
│   └── ThemeToggle.tsx   ← 다크모드 토글
└── lib/
    └── supabase.ts       ← Supabase 쿼리
```

## 글 추가 방법

### 방법 1: Supabase 대시보드 (가장 간단)

1. [Supabase 대시보드](https://app.supabase.com) 열기
2. Table Editor → posts 테이블
3. Insert 버튼 클릭
4. 다음 필드 입력:
   - `title`: 글 제목
   - `slug`: 고유한 URL (예: "my-first-post")
   - `content`: 마크다운 본문
   - `excerpt`: 한 문단 요약
   - `category_id`: 카테고리 선택
   - `meta_description`: SEO 설명
   - `status`: "published"
   - `published_at`: 현재 시간

### 방법 2: SQL

```sql
INSERT INTO posts (title, slug, content, excerpt, category_id, meta_description, status, published_at)
VALUES (
  '내 첫 글',
  'my-first-post',
  '# 제목\n\n본문...',
  '이것은 요약입니다.',
  (SELECT id FROM categories WHERE slug = 'development'),
  '글 설명',
  'published',
  now()
);
```

## 자주 하는 실수

❌ **글이 안 보임**
- `status`가 "published"인지 확인
- `published_at`이 미래 날짜로 설정되어 있지 않은지 확인
- 브라우저 캐시 삭제

❌ **API 키 오류**
- `.env.local` 파일이 존재하는지 확인
- 개발 서버를 재시작했는지 확인
- API 키가 올바르게 복사되었는지 확인

❌ **스타일이 이상함**
```bash
rm -rf .next
npm run dev
```

## 배포 준비

### Vercel 배포 (5분)

1. GitHub에 푸시
2. [Vercel](https://vercel.com)에 로그인
3. GitHub 저장소 임포트
4. 환경 변수 설정:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   NEXT_PUBLIC_SITE_URL
   ```
5. Deploy!

## 다음 단계

배포 후:

- [ ] 커스텀 도메인 연결
- [ ] SEO 최적화
- [ ] Google Analytics 추가
- [ ] 구독 기능 구현
- [ ] 검색 기능 추가

## 유용한 링크

- 🔗 [전체 설정 가이드](./SETUP_GUIDE.md)
- 📖 [README.md](./README.md)
- 🚀 [Next.js 문서](https://nextjs.org)
- 🗄️ [Supabase 문서](https://supabase.com/docs)
- 🎨 [Tailwind CSS](https://tailwindcss.com)

## 문제 해결

### "Cannot find module" 오류

```bash
npm install
```

### Supabase 연결 실패

```bash
# .env.local 확인
cat .env.local

# 개발 서버 재시작
npm run dev
```

### 포트 3000이 이미 사용 중

```bash
npm run dev -- -p 3001
```

---

**준비됐나요?** 이제 블로그를 만들어보세요! 🎉

문제가 있으면 [SETUP_GUIDE.md](./SETUP_GUIDE.md)를 참고하세요.
