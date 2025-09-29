export function ProjectsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
        <div className="h-5 bg-gray-200 rounded animate-pulse w-24"></div>
      </div>
      
      {/* Loading skeleton for priority overview */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="h-5 bg-gray-200 rounded animate-pulse w-40 mb-3"></div>
        <div className="flex gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16 mb-1"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading skeleton for project cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="flex justify-between items-center mt-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
