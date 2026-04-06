import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { getCategories } from '@/lib/supabase';
import { Category } from '@/lib/types';

async function HeaderContent() {
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
      <nav className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center text-white">
              D
            </div>
            <span className="hidden sm:inline gradient-text">디자인플랜케이</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/blog"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              블로그
            </Link>

            {categories.slice(0, 3).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
              >
                {category.name}
              </Link>
            ))}

            <Link
              href="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              소개
            </Link>
          </div>

          {/* Right side - Theme toggle */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4 space-y-2">
          <Link
            href="/blog"
            className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 font-medium"
          >
            블로그
          </Link>
          {categories.slice(0, 2).map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 font-medium"
            >
              {category.name}
            </Link>
          ))}
          <Link
            href="/about"
            className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 font-medium"
          >
            소개
          </Link>
        </div>
      </nav>
    </header>
  );
}

export function Header() {
  return <HeaderContent />;
}
