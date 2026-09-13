// @flow strict

import connectDB from "@/lib/mongodb";
import BlogModel from "@/models/Blog";
import BlogCard from "../components/homepage/blog/blog-card";

async function getBlogs() {
  try {
    await connectDB();

    const blogs = await BlogModel.find({
      published: true,
      isActive: true,
    })
      .sort({
        displayOrder: 1,
        publishedAt: -1,
      })
      .lean();

    const formattedBlogs = blogs
      .filter((blog) => blog.featuredImage)
      .map((blog) => {
        const contentWords = (blog.content || "")
          .trim()
          .split(/\s+/)
          .filter(Boolean);

        const readingTime = Math.max(
          1,
          Math.ceil(contentWords.length / 200)
        );

        return {
          id: blog._id.toString(),
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          content: blog.content,
          featuredImage: blog.featuredImage,
          tags: blog.tags || [],
          published: blog.published,

          publishedAt: blog.publishedAt
            ? blog.publishedAt.toISOString()
            : null,

          viewCount: blog.viewCount || 0,
          displayOrder: blog.displayOrder || 0,
          isActive: blog.isActive,

          // Fields required by the existing BlogCard
          cover_image: blog.featuredImage,
          published_at: blog.publishedAt
            ? blog.publishedAt.toISOString()
            : null,
          description: blog.excerpt,
          public_reactions_count: 0,
          comments_count: 0,
          reading_time_minutes: readingTime,
          url: `/blog/${blog.slug}`,
        };
      });

    return formattedBlogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

async function page() {
  const blogs = await getBlogs();

  return (
    <div className="py-8">
      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>

          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-2xl rounded-md">
            All Blog
          </span>

          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8 xl:gap-10">
        {blogs.map((blog) => (
          blog?.cover_image && (
            <BlogCard
              blog={blog}
              key={blog.id}
            />
          )
        ))}
      </div>
    </div>
  );
}

export default page;