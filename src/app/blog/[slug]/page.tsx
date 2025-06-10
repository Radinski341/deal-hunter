// src/app/blog/[slug]/page.tsx
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Post, Product } from '@/shared/schema';
import { ProductCard } from '@/components/ProductCard';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';

export async function generateStaticParams() {
  const postsPath = path.join(process.cwd(), 'src/data/posts.json');
  const posts: Post[] = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const postsPath = path.join(process.cwd(), 'src/data/posts.json');
  const posts: Post[] = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Post Not Found - Tech Deals',
      description: 'The blog post you are looking for does not exist.',
    };
  }

  const featuredImage = post.relatedProducts[0]?.['img-url'] || 'https://via.placeholder.com/1200x630';

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    openGraph: {
      title: post.ogTitle,
      description: post.ogDescription,
      images: [featuredImage],
      url: `https://deal-hunter-omega.vercel.app/blog/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.ogTitle,
      description: post.ogDescription,
      images: [featuredImage],
    },
    keywords: post.keywords,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const postsPath = path.join(process.cwd(), 'src/data/posts.json');
  const posts: Post[] = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const featuredImage = post.relatedProducts[0]?.['img-url'] || 'https://via.placeholder.com/400';
  const category = post.categories[0] || 'Blog';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-slate-700">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/blog" className="text-slate-700">
                Blog
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/products/${category.toLowerCase()}`} className="text-slate-700">
                {category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 text-slate-700">{post.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Button */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-6 text-slate-700">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        {/* Post Content */}
        <article className="mb-12">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">{post.title}</h1>
          <div className="text-sm text-neutral-500 mb-4">
            By {post.author} on {post.date}
          </div>
          <img
            src={featuredImage}
            alt={post.relatedProducts[0]?.['img-alt'] || post.title}
            className="rounded-lg mb-8"
          />
          <div
            className="prose max-w-none text-neutral-800"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Related Products */}
        <section className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border-2 border-orange-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {post.relatedProducts.map((product: Product, index: number) => (
              <ProductCard key={product['product-url'] || index} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}