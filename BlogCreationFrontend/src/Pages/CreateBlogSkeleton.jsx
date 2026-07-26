const CreateBlogSkeleton = () => {
  const skeleton = "animate-pulse rounded-lg bg-slate-200";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10 pt-40 sm:px-6 lg:px-8">
        {/* Page Header Skeleton */}
        <div className="mb-8">
          <div className={`${skeleton} h-4 w-28`} />
          <div className={`${skeleton} mt-4 h-9 w-72 max-w-full`} />
          <div className={`${skeleton} mt-4 h-4 w-[420px] max-w-full`} />
        </div>

        {/* Form Card Skeleton */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          <div className="space-y-8 p-5 sm:p-8">
            {/* Post Information */}
            <div>
              <div className={`${skeleton} h-6 w-40`} />
              <div className={`${skeleton} mt-3 h-4 w-72 max-w-full`} />

              <div className="mt-6 space-y-6">
                <div>
                  <div className={`${skeleton} mb-2 h-4 w-24`} />
                  <div className={`${skeleton} h-12 w-full rounded-xl`} />
                </div>

                <div>
                  <div className={`${skeleton} mb-2 h-4 w-20`} />
                  <div className={`${skeleton} h-24 w-full rounded-xl`} />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* Featured Image */}
            <div>
              <div className={`${skeleton} h-6 w-36`} />
              <div className={`${skeleton} mt-3 h-4 w-64 max-w-full`} />

              <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_280px]">
                <div>
                  <div className={`${skeleton} mb-2 h-4 w-24`} />
                  <div className={`${skeleton} h-12 w-full rounded-xl`} />
                </div>

                <div className={`${skeleton} h-44 w-full rounded-2xl`} />
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* Content */}
            <div>
              <div className={`${skeleton} h-6 w-36`} />
              <div className={`${skeleton} mt-3 h-4 w-72 max-w-full`} />

              <div className="mt-6">
                <div className={`${skeleton} mb-2 h-4 w-20`} />
                <div className={`${skeleton} min-h-72 w-full rounded-xl`} />
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* Organization */}
            <div>
              <div className={`${skeleton} h-6 w-60 max-w-full`} />
              <div className={`${skeleton} mt-3 h-4 w-80 max-w-full`} />

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <div className={`${skeleton} mb-2 h-4 w-20`} />
                  <div className={`${skeleton} h-12 w-full rounded-xl`} />
                </div>

                <div>
                  <div className={`${skeleton} mb-2 h-4 w-16`} />
                  <div className={`${skeleton} h-12 w-full rounded-xl`} />
                </div>

                <div className="md:col-span-2">
                  <div className={`${skeleton} mb-2 h-4 w-14`} />
                  <div className={`${skeleton} h-12 w-full rounded-xl`} />
                  <div className={`${skeleton} mt-3 h-3 w-56 max-w-full`} />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Skeleton */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className={`${skeleton} h-3 w-64 max-w-full`} />

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className={`${skeleton} h-10 w-full rounded-xl sm:w-24`} />
              <div className={`${skeleton} h-10 w-full rounded-xl sm:w-32`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogSkeleton;