import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPostBySlug, getPosts, incrementViewCount } from '@/lib/supabase';
import { TableOfContents } from '@/components/TableOfContents';
import { formatDate, estimateReadingTime, generateTableOfContents } from '@/lib/markdown';
import { notFound } from 'next/navigation';

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata(
  { params }: PageProps,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug);

    return {
      title: post.title,
      description: post.meta_description || post.excerpt,
      keywords: [post.category?.name || ''],
      authors: [{ name: '디자인플랜케이' }],
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.published_at,
        tags: post.tags?.map((t) => t.name) || [],
        images: post.og_image_url
          ? [
            {
              url: post.og_image_url,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
          : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: post.og_image_url ? [post.og_image_url] : [],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
      },
    };
  } catch (error) {
    return {
      title: '글을 찾을 수 없습니다',
      description: '요청한 글이 없습니다.',
    };
  }
}

async function BlogPostContent({ params }: PageProps) {
  let post;

  try {
    post = await getPostBySlug(params.slug);
  } catch (error) {
    notFound();
  }

  // Increment view count (fire and forget)
  incrementViewCount(post.id).catch(console.error);

  const toc = generateTableOfContents(post.content);
  const readingTime = estimateReadingTime(post.content);

  // Simple markdown to HTML converter
  const htmlContent = post.content
    .split('\n\n')
    .map((paragraph) => {
      // Headings
      if (paragraph.match(/^#+\s/)) {
        const level = paragraph.match(/^#+/)?.[0].length || 1;
        const text = paragraph.replace(/^#+\s/, '');
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        return `<h${level} id="${id}" className="mt-8 mb-4">${text}</h${level}>`;
      }

      // Bold and italic
      let processedText = paragraph
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

      // Code blocks
      if (paragraph.match(/^```/)) {
        const language = paragraph.split('\n')[0].replace(/^```/, '');
        const code = paragraph.split('\n').slice(1, -1).join('\n');
        return `<pre><code className="language-${language}">${code}</code></pre>`;
      }

      // Lists
      if (paragraph.match(/^[-*]\s/)) {
        const items = paragraph.split('\n').map((line) => {
          if (line.match(/^[-*]\s/)) {
            return `<li>${line.replace(/^[-*]\s/, '')}</li>`;
          }
          return '';
        });
        return `<ul>${items.join('')}</ul>`;
      }

      // Numbered lists
      if (paragraph.match(/^\d+\.\s/)) {
        const items = paragraph.split('\n').map((line) => {
          if (line.match(/^\d+\.\s/)) {
            return `<li>${line.replace(/^\d+\.\s/, '')}</li>`;
          }
          return '';
        });
        return `<ol>${items.join('')}</ol>`;
      }

      // Blockquotes
      if (paragraph.match(/^>\s/)) {
        return `<blockquote>${paragraph.replace(/^>\s/, '')}</blockquote>`;
      }

      // Regular paragraphs
      if (paragraph.trim()) {
        return `<p>${processedText}</p>`;
      }

      return '';
    })
    .join('\n');

  return (
    <>
      {/* Header */}
      <article className="container-main section-padding">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            홈
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            블로그
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100">{post.title}</span>
        </div>

        {/* Title and Meta */}
        <div className="max-w-3xl mx-auto mb-8">
          {post.category && (
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white mb-4"
              style={{ backgroundColor: post.category.color || '#6366F1' }}
            >
              {post.category.name}
            </span>
          )}

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <time dateTime={post.published_at}>
              {formatDate(post.published_at)}
            </time>
            <span>{readingTime}분 읽기</span>
            <span>{post.view_count} 조회</span>
          </div>
        </div>

        {/* Featured Image */}
        {post.og_image_url && (
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <Image
                src={post.og_image_url}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}
      </article>

      {/* Content */}
      <div className="container-main pb-20">
        <div className="max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Table of Contents */}
            {toc.length > 0 && <TableOfContents items={toc} />}

            {/* Article Content */}
            <div
              className="prose dark:prose-invert max-w-none mb-12"
              dangerouslySetInnerHTML={{
                __html: htmlContent,
              }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-8 border-t border-gray-200 dark:border-gray-800">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/blog?tag=${tag.slug}`}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* About Author */}
            <div className="card p-6 mb-6 sticky top-24">
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                글 정보
              </h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 block">
                    작성일
                  </span>
                  {formatDate(post.published_at)}
                </div>
                {post.updated_at !== post.published_at && (
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 block">
                      수정일
                    </span>
                    {formatDate(post.updated_at)}
                  </div>
                )}
                <div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 block">
                    읽기 시간
                  </span>
                  약 {readingTime}분
                </div>
              </div>
            </div>

            {/* Related Posts */}
            <div className="card p-6 sticky top-80">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
                다른 글 보기
              </h3>
              <div className="space-y-3">
                <Link
                  href="/blog"
                  className="block text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  모든 글 →
                </Link>
                {post.category && (
                  <Link
                    href={`/category/${post.category.slug}`}
                    className="block text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {post.category.name} 카테고리 →
                  </Link>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  try {
    const posts = await getPosts(100);
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

export default BlogPostContent;
