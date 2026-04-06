import { Metadata } from 'next';
import Link from 'next/link';
import { getPosts, getCategories } from '@/lib/supabase';
import { PostCard } from '@/components/PostCard';
import { Post, Category } from '@/lib/types';

export const revalidate = 60; // ISR - revalidate every 60 seconds

export const metadata: Metadata = {
  title: '홈',
  description: '디자인플랜케이 블로그 - AI, 개발, 교육, 광고, 마케팅, 커리어에 대한 최신 정보',
  openGraph: {
    title: '디자인플랜케이 블로그',
    description: 'AI, 개발, 교육, 광고, 마케팅, 커리어에 대한 최신 정보를 공유합니다',
    type: 'website',
  },
};

async function HomePage() {
  let posts: Post[] = [];
  let categories: Category[] = [];

  try {
    posts = await getPosts(6);
    categories = await getCategories();
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 6);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-20 sm:py-28">
        <div className="container-main">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              디자인플랜케이<br />
              <span className="gradient-text">블로그</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              AI, 개발, 교육, 광고, 마케팅, 커리어에 대한 최신 트렌드와 인사이트를 공유하는 공간입니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/blog" className="btn-primary">
                블로그 둘러보기
              </Link>
              <Link href="/about" className="btn-secondary">
                우리에 대해 알아보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="container-main section-padding">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              최신 글
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              가장 최근에 작성된 글을 확인해보세요.
            </p>
          </div>
          <PostCard post={featuredPost} featured={true} />
        </section>
      )}

      {/* Recent Posts Grid */}
      {recentPosts.length > 0 && (
        <section className="container-main section-padding">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              최근 글들
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              더 많은 이야기를 발견해보세요.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <Link href="/blog" className="btn-primary">
              모든 글 보기
            </Link>
          </div>
        </section>
      )}

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-900 section-padding">
          <div className="container-main">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                카테고리
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                관심 있는 주제를 선택하여 관련 글을 읽어보세요.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="card p-6 hover:shadow-lg cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {category.name}
                    </h3>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color || '#6366F1' }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {category.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-700 dark:to-blue-700 text-white section-padding">
        <div className="container-main text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            최신 글을 구독하세요
          </h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            새로운 글이 발행되면 바로 알림을 받아보세요.
          </p>
          <form className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="이메일을 입력하세요"
              className="flex-1 px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-indigo-200 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
            >
              구독
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default HomePage;
