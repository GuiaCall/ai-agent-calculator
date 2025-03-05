export function Footer() {
  return <footer className="fixed bottom-0 w-full z-50 bg-white/80 backdrop-blur-md border-t border-indigo-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-center">
        <p className="text-sm text-gray-600 flex items-center">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 w-4 rounded-full mr-2"></span>
          © {new Date().getFullYear()} 
          <span className="mx-1 font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">AI-Agent Calculator</span>
          All rights reserved.
        </p>
      </div>
    </footer>;
}