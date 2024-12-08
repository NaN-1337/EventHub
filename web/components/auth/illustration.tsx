export function Illustration() {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5] to-[#A78BFA]">
        <div className="relative h-full w-full overflow-hidden">
          {/* Geometric Shapes */}
          <div className="absolute left-1/4 top-1/4 h-16 w-16 rotate-45 bg-gradient-to-tr from-[#8B5CF6] to-[#C084FC] opacity-90 shadow-lg" />
          <div className="absolute right-1/3 top-1/3 h-24 w-24 rounded-full bg-gradient-to-br from-[#60A5FA] to-[#3B82F6] opacity-70 shadow-md" />
          <div className="absolute bottom-1/4 left-1/3 h-20 w-20 transform rounded-lg bg-gradient-to-tl from-[#38BDF8] to-[#22D3EE] opacity-80 shadow-xl" />
          <div className="absolute right-1/4 top-1/2 h-12 w-12 transform text-yellow-400">
            <span className="block text-4xl">★</span>
          </div>
          {/* Additional modern geometric shapes */}
          <div className="absolute left-1/2 top-1/5 h-10 w-10 rounded-full bg-gradient-to-bl from-[#FBBF24] to-[#F59E0B] opacity-80 shadow-sm" />
          <div className="absolute right-1/5 bottom-1/5 h-14 w-14 rotate-12 bg-gradient-to-tr from-[#34D399] to-[#10B981] opacity-85 shadow-md" />
  
          {/* Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.6'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
      </div>
    );
  }
  