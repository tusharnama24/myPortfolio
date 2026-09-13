// @flow strict

import connectDB from "@/lib/mongodb";
import About from "@/models/About";
import Link from "next/link";

import { BiLogoLinkedin } from "react-icons/bi";
import { CiLocationOn } from "react-icons/ci";
import { FaFacebook, FaStackOverflow } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoGithub, IoMdCall } from "react-icons/io";
import { MdAlternateEmail } from "react-icons/md";

import ContactWithCaptcha from "./contact-with-captcha";
import ContactWithoutCaptcha from "./contact-without-captcha";

async function getAboutData() {
  try {
    await connectDB();

    const about = await About.findOne().lean();

    if (!about) {
      return null;
    }

    return {
      email: about.email || "",
      phone: about.phone || "",
      location: about.location || "",

      socialLinks: {
        github: about.socialLinks?.github || "",
        linkedin: about.socialLinks?.linkedin || "",
        twitter: about.socialLinks?.twitter || "",
        facebook: about.socialLinks?.facebook || "",
        stackOverflow: about.socialLinks?.stackOverflow || "",
      },
    };
  } catch (error) {
    console.error("Error fetching contact data:", error);
    return null;
  }
}

async function ContactSection() {
  const about = await getAboutData();

  if (!about) {
    return null;
  }

  return (
    <div
      id="contact"
      className="my-12 lg:my-16 relative mt-24 text-white"
    >
      <div className="hidden lg:flex flex-col items-center absolute top-24 -right-8">
        <span className="bg-[#1a1443] w-fit text-white rotate-90 p-2 px-5 text-xl rounded-md">
          CONTACT
        </span>

        <span className="h-36 w-[2px] bg-[#1a1443]"></span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

        {(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY &&
          process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY
        ) ? (
          <ContactWithCaptcha />
        ) : (
          <ContactWithoutCaptcha />
        )}

        <div className="lg:w-3/4">
          <div className="flex flex-col gap-5 lg:gap-9">

            {/* Email */}
            <p className="text-sm md:text-xl flex items-center gap-3">
              <MdAlternateEmail
                className="bg-[#8b98a5] p-2 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                size={36}
              />

              <span>{about.email}</span>
            </p>

            {/* Phone */}
            <p className="text-sm md:text-xl flex items-center gap-3">
              <IoMdCall
                className="bg-[#8b98a5] p-2 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                size={36}
              />

              <span>{about.phone}</span>
            </p>

            {/* Location */}
            <p className="text-sm md:text-xl flex items-center gap-3">
              <CiLocationOn
                className="bg-[#8b98a5] p-2 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                size={36}
              />

              <span>{about.location}</span>
            </p>

          </div>

          {/* Social Links */}
          <div className="mt-8 lg:mt-16 flex items-center gap-5 lg:gap-10">

            {/* GitHub */}
            {about.socialLinks.github && (
              <Link
                target="_blank"
                href={about.socialLinks.github}
              >
                <IoLogoGithub
                  className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                  size={48}
                />
              </Link>
            )}

            {/* LinkedIn */}
            {about.socialLinks.linkedin && (
              <Link
                target="_blank"
                href={about.socialLinks.linkedin}
              >
                <BiLogoLinkedin
                  className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                  size={48}
                />
              </Link>
            )}

            {/* Twitter / X */}
            {about.socialLinks.twitter && (
              <Link
                target="_blank"
                href={about.socialLinks.twitter}
              >
                <FaXTwitter
                  className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                  size={48}
                />
              </Link>
            )}

            {/* Stack Overflow */}
            {about.socialLinks.stackOverflow && (
              <Link
                target="_blank"
                href={about.socialLinks.stackOverflow}
              >
                <FaStackOverflow
                  className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                  size={48}
                />
              </Link>
            )}

            {/* Facebook */}
            {about.socialLinks.facebook && (
              <Link
                target="_blank"
                href={about.socialLinks.facebook}
              >
                <FaFacebook
                  className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                  size={48}
                />
              </Link>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactSection;