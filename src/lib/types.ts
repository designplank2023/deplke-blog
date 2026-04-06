export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category_id: string;
  meta_description: string;
  og_image_url: string | null;
  status: 'draft' | 'published' | 'archived';
  published_at: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  tags?: Tag[];
}

export interface BlogSettings {
  id: string;
  key: string;
  value: string;
}

export interface TableOfContentsItem {
  id: string;
  level: number;
  title: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}
