export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50/50 pt-20">
      <div className="section-padding py-8">
        {/* Title skeleton */}
        <div className="space-y-3 mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-4 w-96 bg-gray-100 rounded-lg animate-pulse" />
        </div>

        {/* Tabs skeleton */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-10 w-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl animate-pulse" />
                <div className="w-8 h-4 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="h-7 w-20 bg-gray-200 rounded-lg animate-pulse mb-1" />
              <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-3 w-72 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
