import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/types';
import { formatDate, estimateReadingTime } from '@/lib/markdown';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const readingTime = estimateReadingTime(post.content);

  if (featured) {
    return (
      <article className="card overflow-hidden hover:shadow-lg">
        {post.og_image_url && (
          <div className="relative h-64 w-full">
            <Image
              src={post.og_image_url}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-6">
          {post.category && (
            <div className="flex items-center mb-3">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: post.category.color || '#6366F1' }}
              >
                {post.category.name}
              </span>
            </div>
          )}
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            <Link href={`/blog/${post.slug}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {post.title}
            </Link>
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{formatDate(post.published_at)}</span>
            <span>{readingTime}분 읽기</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="card p-6 hover:shadow-lg">
      <div className="flex flex-col h-full">
        {post.category && (
          <div className="mb-3">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: post.category.color || '#6366F1' }}
            >
              {post.category.name}
            </span>
          </div>
        )}

        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100 flex-grow">
          <Link href={`/blog/${post.slug}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2">
            {post.title}
          </Link>
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
          <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          <span>{readingTime}분</span>
          <span>{post.view_count} 조회</span>
        </div>
      </div>
    </article>
  );
}
