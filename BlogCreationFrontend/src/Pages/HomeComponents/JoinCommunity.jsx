import React, { useState } from "react";
import { Link } from "react-router-dom";
const JoinCommunity = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      <section className="w-full bg-blue-600 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#A5CFFF]">
                Join Our Community
              </p>

              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Newest Blogs
              </h2>

              <p className="mt-2 text-base text-white sm:text-lg">
                Become part of a growing community of readers, writers, and creators.
              </p>
            </div>

          </div>

          {/* Blog cards can be placed here */}
          <div className="mt-2 flex">
            <Link to="/blogs" className="mr-5 inline-flex w-fit items-center justify-center rounded-xl bg-[#A5CFFF] px-6 py-3 text-base font-semibold text-gray-700 shadow-md transition duration-300 hover:bg-white hover:shadow-lg" >
              View All Blogs
            </Link>
            <Link to="/create-blog" className="inline-flex w-fit items-center justify-center rounded-xl bg-[#A5CFFF] px-6 py-3 text-base font-semibold text-gray-700 shadow-md transition duration-300 hover:bg-white hover:shadow-lg" >
              Write your Blog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default JoinCommunity;