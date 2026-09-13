// @flow strict

import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

async function getBlog(slug) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/blogs/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return data.blog;
}

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderContent(content) {
  if (!content) return null;

  const lines = content.split("\n");

  const elements = [];
  let paragraph = [];
  let listItems = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      elements.push(
        <p
          key={`paragraph-${elements.length}`}
          className="mb-6 text-base leading-8 text-[#d3d8e8] sm:text-lg"
        >
          {paragraph.join(" ")}
        </p>
      );

      paragraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul
          key={`list-${elements.length}`}
          className="mb-6 list-disc space-y-2 pl-6 text-base leading-7 text-[#d3d8e8] sm:text-lg"
        >
          {listItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );

      listItems = [];
    }
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    // Empty line
    if (!line) {
      flushParagraph();
      flushList();
      return;
    }

    // Bullet point
    if (line.startsWith("- ")) {
      flushParagraph();

      listItems.push(line.substring(2).trim());
      return;
    }

    // Markdown heading
    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();

      elements.push(
        <h2
          key={`heading-${elements.length}`}
          className="mb-4 mt-10 text-2xl font-bold text-white sm:text-3xl"
        >
          {line.substring(3).trim()}
        </h2>
      );

      return;
    }

    // Simple heading detection
    const isHeading =
      line.length <= 60 &&
      !line.endsWith(".") &&
      !line.endsWith(",") &&
      !line.endsWith(":") &&
      !line.includes("—") &&
      paragraph.length === 0;

    if (isHeading) {
      flushParagraph();
      flushList();

      elements.push(
        <h2
          key={`heading-${elements.length}`}
          className="mb-4 mt-10 text-2xl font-bold text-white sm:text-3xl"
        >
          {line}
        </h2>
      );

      return;
    }

    flushList();

    paragraph.push(line);
  });

  flushParagraph();
  flushList();

  return elements;
}

async function BlogDetails({ params }) {
  const slug = params.slug;

  const blog = await getBlog(slug);

  const readingTime = Math.max(
    1,
    Math.ceil(
      (blog.content || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean).length / 200
    )
  );

  return (
    <main className="relative min-h-screen bg-[#0b1120] px-4 pb-16 pt-10 text-white sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl">

        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-[#2a3550] bg-[#111827] px-4 py-2 text-sm text-[#d3d8e8] transition-all duration-300 hover:border-violet-500 hover:text-white"
          >
            <FaArrowLeft size={13} />
            Back to Blogs
          </Link>
        </div>

        {/* Blog Header */}
        <article className="overflow-hidden rounded-2xl border border-[#1d293a] bg-[#111827] shadow-2xl">

          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="relative h-56 w-full overflow-hidden sm:h-72 md:h-96">
              <Image
                src={blog.featuredImage}
                alt={blog.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          <div className="px-5 py-8 sm:px-8 md:px-12 md:py-10">

            {/* Date + Reading Time */}
            <div className="mb-5 flex flex-wrap items-center gap-4 text-sm text-[#16f2b3]">
              {blog.publishedAt && (
                <span>{formatDate(blog.publishedAt)}</span>
              )}

              <span>•</span>

              <span>{readingTime} Min Read</span>

              {typeof blog.viewCount === "number" && (
                <>
                  <span>•</span>
                  <span>{blog.viewCount} Views</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="mb-5 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              {blog.title}
            </h1>

            {/* Excerpt */}
            <p className="mb-7 border-l-4 border-violet-500 pl-4 text-base leading-7 text-[#aab4c8] sm:text-lg sm:leading-8">
              {blog.excerpt}
            </p>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-10 flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-[#34415c] bg-[#0f172a] px-3 py-1.5 text-sm text-[#b7c2d9]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Divider */}
            <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

            {/* Blog Content */}
            <div className="blog-content">
              {renderContent(blog.content)}
            </div>

          </div>
        </article>

        {/* Bottom Back Button */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/blog"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:gap-3"
          >
            <FaArrowLeft size={14} />
            Back to Blogs
          </Link>
        </div>

      </div>
    </main>
  );
}

export default BlogDetails;