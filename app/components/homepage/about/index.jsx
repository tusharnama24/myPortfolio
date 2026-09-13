"use client";

// @flow strict

import { useEffect, useState } from "react";
import Image from "next/image";

function AboutSection() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await fetch("/api/about", {
          cache: "no-store",
        });

        const data = await response.json();

        if (data.success) {
          setAbout(data.about);
        }
      } catch (error) {
        console.error("Failed to fetch About information:", error);
      }
    };

    fetchAbout();
  }, []);

  if (!about) {
    return null;
  }

  return (
    <div id="about" className="my-12 lg:my-16 relative">
      <div className="hidden lg:flex flex-col items-center absolute top-16 -right-8">
        <span className="bg-[#1a1443] w-fit text-white rotate-90 p-2 px-5 text-xl rounded-md">
          ABOUT ME
        </span>
        <span className="h-36 w-[2px] bg-[#1a1443]"></span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        <div className="order-2 lg:order-1">
          <p className="font-medium mb-5 text-[#16f2b3] text-xl uppercase">
            Who I am?
          </p>

          <p className="text-gray-200 text-sm lg:text-lg">
            {about.description}
          </p>
        </div>

        <div className="flex justify-center order-1 lg:order-2">
          <Image
            src={about.profileImage || "/profile.jpg"}
            width={280}
            height={280}
            alt={about.name || "Profile"}
            className="rounded-lg transition-all duration-1000 grayscale hover:grayscale-0 hover:scale-110 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export default AboutSection;