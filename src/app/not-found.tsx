import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center px-4">
        <div className="mb-6">
          <span className="text-6xl font-bold gradient-text">404</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg">
          요청하신 페이지가 존재하지 않거나 이동했을 수 있습니다.
          아래의 링크를 통해 블로그로 돌아가세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">
            홈으로 이동
          </Link>
          <Link href="/blog" className="btn-secondary">
            블로그로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
