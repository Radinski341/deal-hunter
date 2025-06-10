// src/components/PostCard.tsx
import Link from 'next/link';
import { Post } from '@/shared/schema';

export function PostCard({ post }: { post: Post }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-2">
        <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
          {post.title}
        </Link>
      </h2>
      <p className="text-gray-600">{post.metaDescription}</p>
      <div className="mt-4 text-sm text-gray-500">
        By {post.author} on {post.date}
      </div>
    </div>
  );
}