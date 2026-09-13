"use client";

// @flow strict

import { useEffect, useState } from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";

import { skillsImage } from "@/utils/skill-image";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("/api/skills", {
          cache: "no-store",
        });

        const data = await response.json();

        if (data.success) {
          setSkills(data.skills || []);
        }
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const activeSkills = skills
    .filter((skill) => skill.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div
      id="skills"
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
            Skills
          </span>

          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      {/* Skills Marquee */}
      <div className="w-full py-8">
        {!isLoading && activeSkills.length > 0 && (
          <Marquee
            key={activeSkills.map((skill) => skill._id).join("-")}
            gradient={false}
            speed={80}
            pauseOnHover={true}
            pauseOnClick={true}
            delay={0}
            play={true}
            direction="left"
            autoFill={true}
          >
            {activeSkills.map((skill) => {
              const skillIcon = skillsImage(skill.name);

              return (
                <div
                  key={skill._id}
                  className="w-36 min-w-fit h-fit flex flex-col items-center justify-center transition-all duration-500 m-3 sm:m-5 rounded-lg group relative hover:scale-[1.15] cursor-pointer"
                >
                  <div className="rounded-lg border border-[#1f223c] bg-[#11152c] py-3 sm:py-5 px-4 sm:px-8 flex flex-col items-center justify-center gap-3 group-hover:border-violet-500">
                    {skillIcon ? (
                      <Image
                        src={skillIcon.src}
                        alt={skill.name}
                        width={50}
                        height={50}
                        className="h-10 sm:h-12 w-auto"
                      />
                    ) : (
                      <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-[#1f223c] flex items-center justify-center text-white text-lg font-bold">
                        {skill.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <p className="text-white text-sm sm:text-lg">
                      {skill.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </Marquee>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-10">
            <p className="text-gray-500">Loading skills...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && activeSkills.length === 0 && (
          <div className="flex justify-center py-10">
            <p className="text-gray-500">No skills available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills;