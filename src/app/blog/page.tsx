// src/app/blog/page.tsx
import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import Link from 'next/link';
import { Post } from '@/shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tech Deals Blog - Tips, Guides, and Deals',
  description: 'Read the latest tips, guides, and deals on electronics, gadgets, and more at Tech Deals.',
  openGraph: {
    title: 'Tech Deals Blog',
    description: 'Discover tips, guides, and the best deals on tech products.',
    images: ['/images/blog-og.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Deals Blog',
    description: 'Discover tips, guides, and the best deals on tech products.',
    images: ['/images/blog-og.jpg'],
  },
};

export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
    const sParams = await searchParams;
  const postsPath = path.join(process.cwd(), 'src/data/posts.json');
  const posts: Post[] = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));
  const postsPerPage = 10;
  const page = parseInt(sParams.page || '1', 10);
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const start = (page - 1) * postsPerPage;
  const paginatedPosts = posts.slice(start, start + postsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Tech Deals Blog</h1>
        <div className="grid gap-6">
          {paginatedPosts.map((post) => (
            <Card key={post.slug} className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-neutral-600 mb-4">{post.metaDescription}</p>
                <div className="text-sm text-neutral-500">
                  By {post.author} on {post.date}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <Link href={`/blog?page=${Math.max(page - 1, 1)}`}>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </Button>
            {[...Array(Math.min(totalPages, 5))].map((_, i) => (
              <Button
                key={i + 1}
                variant={page === i + 1 ? 'default' : 'outline'}
                size="sm"
                className={page === i + 1 ? 'bg-blue-600 text-white' : 'text-blue-600 border-blue-600 hover:bg-blue-50'}
              >
                <Link href={`/blog?page=${i + 1}`}>{i + 1}</Link>
              </Button>
            ))}
            {totalPages > 5 && <span className="px-2 text-gray-700">...</span>}
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <Link href={`/blog?page=${Math.min(page + 1, totalPages)}`}>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}