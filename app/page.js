import connectDB from "@/lib/mongodb";
import BlogModel from "@/models/Blog";

import AboutSection from "./components/homepage/about";
import BlogSection from "./components/homepage/blog";
import ContactSection from "./components/homepage/contact";
import Education from "./components/homepage/education";
import Experience from "./components/homepage/experience";
import HeroSection from "./components/homepage/hero-section";
import Projects from "./components/homepage/projects";
import Skills from "./components/homepage/skills";

async function getData() {
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

export default async function Home() {
  const blogs = await getData();

  return (
    <>
      <HeroSection />
      <AboutSection />
      <Experience />
      <Skills />
      <Projects />
      <Education />
      <BlogSection blogs={blogs} />
      <ContactSection />
    </>
  );
}