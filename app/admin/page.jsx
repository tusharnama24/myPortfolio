import Link from "next/link";

import connectDB from "@/lib/mongodb";

import Project from "@/models/Project";
import Skill from "@/models/Skill";
import Experience from "@/models/Experience";
import Education from "@/models/Education";
import Blog from "@/models/Blog";
import ContactMessage from "@/models/ContactMessage";

import DashboardCard from "@/app/components/admin/DashboardCard";

import {
  FaFolderOpen,
  FaCode,
  FaBriefcase,
  FaGraduationCap,
  FaBook,
  FaEnvelope,
  FaPlus,
  FaArrowRight,
} from "react-icons/fa";

async function getDashboardData() {
  await connectDB();

  const [
    projects,
    skills,
    experiences,
    educations,
    blogs,
    messages,
    recentMessages,
  ] = await Promise.all([
    Project.countDocuments(),
    Skill.countDocuments(),
    Experience.countDocuments(),
    Education.countDocuments(),
    Blog.countDocuments(),
    ContactMessage.countDocuments(),

    ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  return {
    stats: {
      projects,
      skills,
      experiences,
      educations,
      blogs,
      messages,
    },

    recentMessages: recentMessages.map((message) => ({
      id: message._id.toString(),
      name: message.name,
      email: message.email,
      subject: message.subject || "No subject",
      status: message.status,
      createdAt: message.createdAt
        ? message.createdAt.toISOString()
        : null,
    })),
  };
}

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusClass(status) {
  switch (status) {
    case "new":
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";

    case "read":
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";

    case "replied":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

    case "archived":
      return "border-gray-500/20 bg-gray-500/10 text-gray-400";

    default:
      return "border-gray-500/20 bg-gray-500/10 text-gray-400";
  }
}

export default async function Dashboard() {
  const { stats, recentMessages } = await getDashboardData();

  return (
    <div className="space-y-8 pb-10">
      {/* Page Heading */}
      <div>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Dashboard Overview
        </h1>

        <p className="mt-2 text-gray-400">
          Manage every section of your portfolio from one place.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          title="Projects"
          value={stats.projects}
          color="bg-pink-500/10 text-pink-400"
          icon={<FaFolderOpen size={24} />}
        />

        <DashboardCard
          title="Skills"
          value={stats.skills}
          color="bg-cyan-500/10 text-cyan-400"
          icon={<FaCode size={24} />}
        />

        <DashboardCard
          title="Experience"
          value={stats.experiences}
          color="bg-violet-500/10 text-violet-400"
          icon={<FaBriefcase size={24} />}
        />

        <DashboardCard
          title="Education"
          value={stats.educations}
          color="bg-emerald-500/10 text-emerald-400"
          icon={<FaGraduationCap size={24} />}
        />

        <DashboardCard
          title="Blogs"
          value={stats.blogs}
          color="bg-orange-500/10 text-orange-400"
          icon={<FaBook size={24} />}
        />

        <DashboardCard
          title="Messages"
          value={stats.messages}
          color="bg-yellow-500/10 text-yellow-400"
          icon={<FaEnvelope size={24} />}
        />
      </div>

      {/* Recent Messages */}
      <section className="overflow-hidden rounded-2xl border border-[#1f2937] bg-[#111827]">
        <div className="flex flex-col justify-between gap-3 border-b border-[#1f2937] p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Recent Messages
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Latest messages received through your portfolio.
            </p>
          </div>

          <Link
            href="/admin/messages"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#16f2b3] transition hover:text-white"
          >
            View All
            <FaArrowRight size={13} />
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <div className="p-8 text-center">
            <FaEnvelope className="mx-auto mb-3 text-3xl text-gray-600" />

            <p className="text-gray-400">
              No messages received yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#1f2937]">
            {recentMessages.map((message) => (
              <div
                key={message.id}
                className="flex flex-col gap-3 p-5 transition hover:bg-[#0f172a] sm:flex-row sm:items-center sm:justify-between sm:p-6"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-semibold text-white">
                      {message.name}
                    </h3>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getStatusClass(
                        message.status
                      )}`}
                    >
                      {message.status}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-sm text-[#16f2b3]">
                    {message.email}
                  </p>

                  <p className="mt-2 truncate text-sm text-gray-400">
                    {message.subject}
                  </p>
                </div>

                <div className="shrink-0 text-left sm:text-right">
                  <p className="text-xs text-gray-500">
                    {formatDate(message.createdAt)}
                  </p>

                  <Link
                    href="/admin/messages"
                    className="mt-2 inline-block text-sm text-violet-400 transition hover:text-violet-300"
                  >
                    View message
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-white">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Quickly jump to the section you want to manage.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <Link
            href="/admin/projects"
            className="group rounded-xl border border-[#1f2937] bg-[#111827] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/50"
          >
            <FaFolderOpen className="mb-4 text-xl text-pink-400" />

            <p className="font-semibold text-white">
              Manage Projects
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Add or edit projects
            </p>
          </Link>

          <Link
            href="/admin/skills"
            className="group rounded-xl border border-[#1f2937] bg-[#111827] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50"
          >
            <FaCode className="mb-4 text-xl text-cyan-400" />

            <p className="font-semibold text-white">
              Manage Skills
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Update your skills
            </p>
          </Link>

          <Link
            href="/admin/experiences"
            className="group rounded-xl border border-[#1f2937] bg-[#111827] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50"
          >
            <FaBriefcase className="mb-4 text-xl text-violet-400" />

            <p className="font-semibold text-white">
              Manage Experience
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Update work history
            </p>
          </Link>

          <Link
            href="/admin/educations"
            className="group rounded-xl border border-[#1f2937] bg-[#111827] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50"
          >
            <FaGraduationCap className="mb-4 text-xl text-emerald-400" />

            <p className="font-semibold text-white">
              Manage Education
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Update education
            </p>
          </Link>

          <Link
            href="/admin/blogs"
            className="group rounded-xl border border-[#1f2937] bg-[#111827] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/50"
          >
            <FaBook className="mb-4 text-xl text-orange-400" />

            <p className="font-semibold text-white">
              Manage Blogs
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Write and publish blogs
            </p>
          </Link>
        </div>

        <Link
          href="/admin/messages"
          className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-[#1f2937] bg-[#111827] px-5 py-4 text-sm font-semibold text-gray-300 transition-all duration-300 hover:border-[#16f2b3]/50 hover:text-[#16f2b3]"
        >
          <FaEnvelope />
          View All Messages
          <FaArrowRight size={13} />
        </Link>
      </section>
    </div>
  );
}