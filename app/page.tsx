"use client"

import { useState, useEffect } from "react"
import { Menu, X, Home as HomeIcon, Waves, Radio as RadioIcon, Search, Music } from "lucide-react"
import Sidebar from "@/components/sidebar"
import HomePage from "@/components/pages/home-page"
import NewPage from "@/components/pages/new-page"
import MoviesPage from "@/components/pages/movies-page"
import RadioPage from "@/components/pages/radio-page"
import PageTransition from "@/components/page-transition"
import AudioPlayer from "@/components/audio-player-v2"
import { supabase, Song } from "@/lib/supabase"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("home")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onPlaySong={setCurrentSong} />
      case "new":
        return <NewPage />
      case "movies":
        return <MoviesPage />
      case "radio":
        return <RadioPage />
      default:
        return <HomePage onPlaySong={setCurrentSong} />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Mobile Header */}
      {isMobile && (
        <div className="md:hidden bg-[#252526] border-b border-[#3a3a3a] px-4 py-3 flex items-center justify-between z-50 sticky top-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#ff0000] to-[#cc0000] rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-white">SINGH MUSIC</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="relative p-3 hover:bg-[#3a3a3a] rounded-xl transition-all duration-300 group"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <span className={`absolute top-1 left-0 w-6 h-0.5 bg-white transition-all duration-300 ${isSidebarOpen ? 'rotate-45 translate-y-2.5' : 'translate-y-0'}`}></span>
              <span className={`absolute top-2.5 left-0 w-6 h-0.5 bg-white transition-all duration-300 ${isSidebarOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`absolute top-4 left-0 w-6 h-0.5 bg-white transition-all duration-300 ${isSidebarOpen ? '-rotate-45 -translate-y-2.5' : 'translate-y-0'}`}></span>
            </div>
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobile && isSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-300"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="fixed left-0 top-0 bottom-0 z-50 w-80 max-w-[85vw] animate-in slide-in-from-left duration-300">
              <div className="h-full bg-[#252526] border-r border-[#3a3a3a] shadow-2xl">
                <Sidebar
                  currentPage={currentPage}
                  onNavigate={(page) => {
                    setCurrentPage(page)
                    setIsSidebarOpen(false)
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto pb-20 md:pb-24">
          <PageTransition key={currentPage}>{renderPage()}</PageTransition>
        </main>
      </div>

      {/* Bottom Navigation (Mobile) */}
      {isMobile && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#252526] border-t border-[#3a3a3a] z-40">
          <div className="flex items-center justify-around py-2">
            <button
              onClick={() => setCurrentPage("home")}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                currentPage === "home" ? "text-[#ff0000]" : "text-[rgba(255,255,255,0.64)]"
              }`}
            >
              <HomeIcon className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </button>
            <button
              onClick={() => setCurrentPage("new")}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                currentPage === "new" ? "text-[#ff0000]" : "text-[rgba(255,255,255,0.64)]"
              }`}
            >
              <Waves className="w-6 h-6" />
              <span className="text-xs">New</span>
            </button>
            <button
              onClick={() => setCurrentPage("radio")}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                currentPage === "radio" ? "text-[#ff0000]" : "text-[rgba(255,255,255,0.64)]"
              }`}
            >
              <RadioIcon className="w-6 h-6" />
              <span className="text-xs">Radio</span>
            </button>
            <button
              className="flex flex-col items-center gap-1 p-2 rounded-lg text-[rgba(255,255,255,0.64)]"
            >
              <Search className="w-6 h-6" />
              <span className="text-xs">Search</span>
            </button>
          </div>
        </div>
      )}

      {/* Audio Player */}
      {currentSong && (
        <AudioPlayer
          song={currentSong}
          onClose={() => setCurrentSong(null)}
        />
      )}
    </div>
  )
}
