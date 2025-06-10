// src/components/Pagination.tsx
import Link from 'next/link';

export function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  return (
    <div className="flex justify-center space-x-2 mt-8">
      {Array.from({ length: totalPages }, (_, i) => (
        <Link
          key={i}
          href={`/blog?page=${i + 1}`}
          className={`px-4 py-2 rounded-md ${
            currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {i + 1}
        </Link>
      ))}
    </div>
  );
}