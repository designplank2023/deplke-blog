'use client';

import { useEffect, useState } from 'react';
import { TableOfContentsItem } from '@/lib/markdown';

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const headings = items.map((item) => ({
        id: item.id,
        element: document.getElementById(item.id),
      }));

      let current = '';
      for (const { id, element } of headings) {
        if (element && element.getBoundingClientRect().top < 100) {
          current = id;
        }
      }

      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-8">
      <h3 className="font-bold text-sm mb-4 text-gray-900 dark:text-gray-100">목차</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
          >
            <a
              href={`#${item.id}`}
              className={`text-sm transition-colors ${
                activeId === item.id
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
