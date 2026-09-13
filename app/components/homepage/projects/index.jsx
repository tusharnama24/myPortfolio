"use client";

// @flow strict

import { useEffect, useState } from "react";
import Image from "next/image";

import ProjectCard from "./project-card";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch projects");
        }

        setProjects(data.projects || []);
      } catch (error) {
        console.error("Projects fetch error:", error);
        setError("Unable to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div
      id="projects"
      className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]"
    >
      {/* Section Background Effect */}
      <Image
        src="/section.svg"
        alt="Hero"
        width={1572}
        height={795}
        className="absolute top-0 -z-10"
      />

      {/* Section Separator */}
      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full" />
        </div>
      </div>

      {/* Section Heading */}
      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>

          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md">
            Projects
          </span>

          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      {/* Projects Content */}
      <div className="py-8">
        {loading && (
          <div className="flex justify-center py-10">
            <p className="text-gray-500">Loading projects...</p>
          </div>
        )}

        {error && (
          <div className="flex justify-center py-10">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="flex flex-col gap-6">
            {projects.slice(0, 4).map((project, index) => {
              const projectForCard = {
                ...project,

                // MongoDB fields → existing ProjectCard fields
                id: project._id,
                name: project.title,
                tools: project.technologies,
                code: project.githubUrl,
                demo: project.liveUrl,
              };

              return (
                <div
                  id={`sticky-card-${index + 1}`}
                  key={project._id}
                  className="sticky-card w-full mx-auto max-w-2xl sticky"
                >
                  <div className="box-border flex items-center justify-center rounded shadow-[0_0_30px_0_rgba(0,0,0,0.3)] transition-all duration-[0.5s]">
                    <ProjectCard project={projectForCard} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="flex justify-center py-10">
            <p className="text-gray-500">No projects available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;