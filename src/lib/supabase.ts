import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Post, Category, Tag } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase 환경변수가 없으면 null (빌드 시 graceful 처리)
const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

function getClient(): SupabaseClient {
  if (!supabase) {
    throw new Error('Supabase 환경변수가 설정되지 않았습니다.');
  }
  return supabase;
}

// Posts
export async function getPosts(limit: number = 10, offset: number = 0): Promise<Post[]> {
  if (!supabase) return [];
  const { data, error } = await getClient()
    .from('posts')
    .select(`*, category:categories(*), post_tags(tags(*))`)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return (data as Post[]) || [];
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const { data, error } = await getClient()
    .from('posts')
    .select(`*, category:categories(*), post_tags(tags(*))`)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) throw error;
  return data as Post;
}

export async function getPostsByCategory(categorySlug: string, limit: number = 10, offset: number = 0): Promise<Post[]> {
  if (!supabase) return [];
  const { data, error } = await getClient()
    .from('posts')
    .select(`*, category:categories(*)`)
    .eq('categories.slug', categorySlug)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return (data as Post[]) || [];
}

export async function searchPosts(query: string, limit: number = 10): Promise<Post[]> {
  if (!supabase) return [];
  const { data, error } = await getClient()
    .from('posts')
    .select(`*, category:categories(*)`)
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as Post[]) || [];
}

export async function getPostCount(): Promise<number> {
  if (!supabase) return 0;
  const { count, error } = await getClient()
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  if (error) throw error;
  return count || 0;
}

export async function incrementViewCount(postId: string): Promise<void> {
  if (!supabase) return;
  const { error } = await getClient().rpc('increment_view_count', { post_id: postId });
  if (error) console.error('Error incrementing view count:', error);
}

// Categories
export async function getCategories(): Promise<Category[]> {
  if (!supabase) return [];
  const { data, error } = await getClient()
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return (data as Category[]) || [];
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const { data, error } = await getClient()
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as Category;
}

export async function getPostCountByCategory(categorySlug: string): Promise<number> {
  if (!supabase) return 0;
  const { count, error } = await getClient()
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')
    .eq('categories.slug', categorySlug);

  if (error) throw error;
  return count || 0;
}

// Tags
export async function getTags(): Promise<Tag[]> {
  if (!supabase) return [];
  const { data, error } = await getClient()
    .from('tags')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return (data as Tag[]) || [];
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  const { data, error } = await getClient()
    .from('tags')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as Tag;
}

// Blog Settings
export async function getBlogSetting(key: string): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await getClient()
    .from('blog_settings')
    .select('*')
    .eq('key', key)
    .single();

  if (error) return null;
  return data?.value || null;
}
