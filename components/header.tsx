import Link from "next/link"
import { Bell, Trophy, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-[#f1f0f4] px-4 py-3 md:px-10">
      <div className="flex items-center gap-4 text-[#131118]">
        <div className="size-4">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <Link href="/">
          <h2 className="text-lg font-bold tracking-[-0.015em] hover:text-[#7847ea] transition-colors cursor-pointer">
            Personality AI
          </h2>
        </Link>
      </div>
      <div className="flex flex-1 justify-end gap-4 md:gap-8">
        <nav className="hidden md:flex items-center gap-9">
          <Link href="/" className="text-sm font-medium hover:text-[#7847ea] transition-colors">
            Home
          </Link>
          <Link href="/describe" className="text-sm font-medium hover:text-[#7847ea] transition-colors">
            Quizzes
          </Link>
          <Link href="/results" className="text-sm font-medium hover:text-[#7847ea] transition-colors">
            Results
          </Link>
          <Link
            href="/leaderboard"
            className="text-sm font-medium hover:text-[#7847ea] transition-colors flex items-center gap-1"
          >
            <Trophy size={16} />
            Leaderboard
          </Link>
          <Link
            href="/analytics"
            className="text-sm font-medium hover:text-[#7847ea] transition-colors flex items-center gap-1"
          >
            <BarChart3 size={16} />
            Analytics
          </Link>
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-10 w-10 bg-[#f1f0f4] text-[#131118] hover:bg-[#e8e6ef]"
        >
          <Bell size={20} />
        </Button>
        <div
          className="bg-center bg-no-repeat bg-cover rounded-full size-10 cursor-pointer hover:ring-2 hover:ring-[#7847ea] hover:ring-offset-2 transition-all"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAr5TCfE7GGBqjiFT2uj3QQqtTi20YVWV3tsqOcgUHkkOK3SU1R65yMRDaAFjAY1rRgVpP3dwaXFiHzqjYkQ8D03QW70ahXAO1N4XGbXbw3JOgFr26beVvrQ-G__PYM8oGZdQN1zUKLJsv6-5W3IbcazsI9-Ae41FbsUa2FvXdJrhJZ4EiYRdsTWNIYhrM5xbNlrfvI3ZkY5RA7oR1Wuv5AspJVFQpWKcKJJib5sgtg3sfsvz6hwkUx4o1WBK5cdSTMhD-2K3KwoD8b")',
          }}
        />
      </div>
    </header>
  )
}
