import { Metadata } from 'next';
import Link from 'next/link';
import { getPosts, getCategories, getPostCount } from '@/lib/supabase';
import { PostCard } from '@/components/PostCard';
import { Post, Category } from '@/lib/types';
import { Suspense } from 'react';

export const revalidate = 60;

export const metadata: Metadata = {
  title: '블로그',
  description: '모든 블로그 글 목록입니다.',
  openGraph: {
    title: '블로그',
    description: '모든 블로그 글을 확인해보세요.',
    type: 'website',
  },
};

interface BlogPageProps {
  searchParams: { category?: string; page?: string };
}

async function BlogContent({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams.page || '1', 10);
  const postsPerPage = 12;
  const offset = (page - 1) * postsPerPage;

  let posts: Post[] = [];
  let totalCount = 0;
  let categories: Category[] = [];

  try {
    posts = await getPosts(postsPerPage, offset);
    totalCount = await getPostCount();
    categories = await getCategories();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }

  const totalPages = Math.ceil(totalCount / postsPerPage);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 sm:py-16">
        <div className="container-main">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            블로그
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            총 {totalCount}개의 글이 있습니다.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-main section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
                카테고리
              </h3>
              <nav className="space-y-2">
                <Link
                  href="/blog"
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    !searchParams.category
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  모든 글
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/blog?category=${category.slug}`}
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                      searchParams.category === category.slug
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Posts Grid */}
          <div className="lg:col-span-3">
            {posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    {hasPrevPage && (
                      <Link
                        href={`/blog?page=${page - 1}`}
                        className="btn-secondary btn-sm"
                      >
                        이전
                      </Link>
                    )}

                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
                        .map((p) => (
                          <Link
                            key={p}
                            href={`/blog?page=${p}`}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-colors ${
                              p === page
                                ? 'bg-indigo-600 dark:bg-indigo-600 text-white'
                                : 'btn-secondary'
                            }`}
                          >
                            {p}
                          </Link>
                        ))}
                    </div>

                    {hasNextPage && (
                      <Link
                        href={`/blog?page=${page + 1}`}
                        className="btn-secondary btn-sm"
                      >
                        다음
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  글이 없습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  return (
    <Suspense fallback={<div className="container-main section-padding text-center">로딩 중...</div>}>
      <BlogContent searchParams={searchParams} />
    </Suspense>
  );
}
