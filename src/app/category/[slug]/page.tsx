import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { getCategoryBySlug, getPostsByCategory, getCategories } from '@/lib/supabase';
import { PostCard } from '@/components/PostCard';
import { Post, Category } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

export async function generateMetadata(
  { params }: PageProps,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const category = await getCategoryBySlug(params.slug);

    return {
      title: category.name,
      description: category.description,
      keywords: [category.name],
      openGraph: {
        title: category.name,
        description: category.description,
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: '카테고리를 찾을 수 없습니다',
      description: '요청한 카테고리가 없습니다.',
    };
  }
}

async function CategoryContent({ params, searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1', 10);
  const postsPerPage = 12;
  const offset = (page - 1) * postsPerPage;

  let category;
  let posts: Post[] = [];
  let categories: Category[] = [];

  try {
    category = await getCategoryBySlug(params.slug);
    posts = await getPostsByCategory(params.slug, postsPerPage, offset);
    categories = await getCategories();
  } catch (error) {
    notFound();
  }

  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <>
      {/* Header */}
      <section
        className="py-12 sm:py-16 text-white"
        style={{
          backgroundColor: category.color || '#6366F1',
        }}
      >
        <div className="container-main">
          <Link
            href="/blog"
            className="text-white opacity-80 hover:opacity-100 transition-opacity mb-4 inline-block"
          >
            ← 블로그로 돌아가기
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {category.name}
          </h1>
          <p className="text-lg opacity-90 max-w-2xl">
            {category.description}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-main section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Other Categories */}
          <aside className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
                다른 카테고리
              </h3>
              <nav className="space-y-2">
                {categories
                  .filter((c) => c.id !== category.id)
                  .map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                <Link
                  href="/blog"
                  className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-t border-gray-200 dark:border-gray-800 mt-4 pt-4"
                >
                  모든 글 보기
                </Link>
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
                        href={`/category/${params.slug}?page=${page - 1}`}
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
                            href={`/category/${params.slug}?page=${p}`}
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
                        href={`/category/${params.slug}?page=${page + 1}`}
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
                  이 카테고리에 글이 없습니다.
                </p>
                <Link href="/blog" className="btn-primary mt-4 inline-block">
                  다른 글 보기
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((category) => ({
      slug: category.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

export default function CategoryPage({ params, searchParams }: PageProps) {
  return (
    <Suspense fallback={<div className="container-main section-padding text-center">로딩 중...</div>}>
      <CategoryContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
