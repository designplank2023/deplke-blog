-- DEPLKE Blog Database Schema
-- Supabase SQL Editor에서 이 전체 코드를 복사하여 실행하세요.

-- ============================================
-- 1. 카테고리 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#6366F1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 카테고리 인덱스
CREATE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug);

-- ============================================
-- 2. 태그 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 태그 인덱스
CREATE INDEX IF NOT EXISTS tags_slug_idx ON tags(slug);

-- ============================================
-- 3. 글 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt VARCHAR(500) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  meta_description VARCHAR(160),
  og_image_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 글 인덱스
CREATE INDEX IF NOT EXISTS posts_slug_idx ON posts(slug);
CREATE INDEX IF NOT EXISTS posts_category_id_idx ON posts(category_id);
CREATE INDEX IF NOT EXISTS posts_status_idx ON posts(status);
CREATE INDEX IF NOT EXISTS posts_published_at_idx ON posts(published_at);

-- ============================================
-- 4. 글-태그 관계 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (post_id, tag_id)
);

-- 글-태그 인덱스
CREATE INDEX IF NOT EXISTS post_tags_tag_id_idx ON post_tags(tag_id);

-- ============================================
-- 5. 블로그 설정 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS blog_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- 6. 트리거 - posts 업데이트 시간 자동 갱신
-- ============================================
CREATE OR REPLACE FUNCTION update_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_posts_updated_at_trigger ON posts;
CREATE TRIGGER update_posts_updated_at_trigger
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_posts_updated_at();

-- ============================================
-- 7. 함수 - 조회수 증가
-- ============================================
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. 초기 데이터 - 카테고리
-- ============================================
INSERT INTO categories (name, slug, description, color) VALUES
('AI', 'ai', '인공지능과 머신러닝, 자연어 처리, 컴퓨터 비전 등 AI 기술에 대한 글', '#6366F1'),
('개발', 'development', '웹 개발, 모바일 개발, 백엔드 개발, DevOps 등 개발 기술', '#EC4899'),
('교육', 'education', '기술 학습, 자기계발, 프로그래밍 강좌, 커리어 발전 가이드', '#F59E0B'),
('광고', 'advertising', '디지털 광고 전략, 광고 최적화, 마케팅 자동화 등', '#10B981'),
('마케팅', 'marketing', '마케팅 전략, SEO, 소셜 미디어 마케팅, 브랜딩 등', '#3B82F6'),
('커리어', 'career', '커리어 개발, 취업 정보, 면접 준비, 업계 정보 등', '#8B5CF6')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 9. 초기 데이터 - 태그
-- ============================================
INSERT INTO tags (name, slug) VALUES
('Next.js', 'nextjs'),
('React', 'react'),
('TypeScript', 'typescript'),
('Supabase', 'supabase'),
('SEO', 'seo'),
('성능최적화', 'performance'),
('데이터베이스', 'database'),
('API', 'api'),
('클라우드', 'cloud'),
('보안', 'security')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 10. Row Level Security (RLS) 설정
-- ============================================

-- posts 테이블 RLS 활성화
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 published 글을 볼 수 있음
CREATE POLICY "allow_published_posts_select" ON posts
  FOR SELECT USING (status = 'published' OR now() >= published_at);

-- categories 테이블 RLS 활성화
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 카테고리를 볼 수 있음
CREATE POLICY "allow_categories_select" ON categories
  FOR SELECT USING (true);

-- tags 테이블 RLS 활성화
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 태그를 볼 수 있음
CREATE POLICY "allow_tags_select" ON tags
  FOR SELECT USING (true);

-- post_tags 테이블 RLS 활성화
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 post_tags를 볼 수 있음
CREATE POLICY "allow_post_tags_select" ON post_tags
  FOR SELECT USING (true);

-- ============================================
-- 11. 뷰 - 게시된 글의 전체 정보
-- ============================================
CREATE OR REPLACE VIEW published_posts_view AS
SELECT
  p.id,
  p.title,
  p.slug,
  p.content,
  p.excerpt,
  p.category_id,
  c.name AS category_name,
  c.slug AS category_slug,
  c.color AS category_color,
  p.meta_description,
  p.og_image_url,
  p.published_at,
  p.view_count,
  p.created_at,
  p.updated_at,
  (
    SELECT json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
    FROM post_tags pt
    JOIN tags t ON pt.tag_id = t.id
    WHERE pt.post_id = p.id
  ) AS tags
FROM posts p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.status = 'published' AND p.published_at <= now()
ORDER BY p.published_at DESC;

-- ============================================
-- 완료!
-- ============================================
-- 이제 블로그를 사용할 준비가 되었습니다.
-- Supabase Table Editor에서 데이터를 확인할 수 있습니다.
--
-- 다음 단계:
-- 1. categories 테이블에서 기본 카테고리 확인
-- 2. tags 테이블에서 기본 태그 확인
-- 3. posts 테이블에 글 추가
-- 4. .env.local에서 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY 설정
-- 5. npm run dev로 블로그 실행
