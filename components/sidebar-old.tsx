"use client"

import { Home, Music, Radio, Search, Waves } from "lucide-react"

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "new", label: "New", icon: Waves },
    { id: "radio", label: "Radio", icon: Radio },
  ]

  return (
    <aside className="w-[260px] bg-[#252526] border-r border-[#3a3a3a] flex flex-col h-screen">
      {/* Logo Section */}
      <div 
        data-testid="logo" 
        className="flex items-center justify-between px-[30px] pt-[17px] pb-0 h-[55px] min-h-[55px]"
      >
        <a 
          href="#" 
          className="flex items-center gap-2 group transition-all duration-200 hover:opacity-80"
          aria-label="Music"
        >
          <Music className="w-6 h-6 text-[#ff0000]" />
          <span className="text-xl font-semibold text-white">SINGH MUSIC</span>
        </a>
      </div>

      {/* Scrollable Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Primary Navigation Items */}
        <nav data-testid="navigation-items-primary" className="pt-[9px]">
          <ul className="px-[25px] pb-[9px] space-y-[2px]">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id

              return (
                <li
                  key={item.id}
                  data-testid="navigation-item"
                  aria-selected={isActive}
                  className={`rounded-[6px] transition-all duration-200 ${
                    isActive ? "bg-[rgba(235,235,245,0.1)]" : ""
                  }`}
                >
                  <button
                    onClick={() => onNavigate(item.id)}
                    data-testid={item.id}
                    aria-pressed={isActive}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-[6px] transition-all duration-200 hover:bg-[rgba(235,235,245,0.05)] group"
                  >
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                      <Icon 
                        className={`w-5 h-5 transition-all duration-200 ${
                          isActive 
                            ? "text-white" 
                            : "text-[rgba(255,255,255,0.92)] group-hover:text-white"
                        }`} 
                      />
                    </span>
                    <span 
                      className={`flex-1 text-left text-[15px] leading-[20px] overflow-hidden text-ellipsis whitespace-nowrap transition-all duration-200 ${
                        isActive 
                          ? "text-white font-medium" 
                          : "text-[rgba(255,255,255,0.92)] group-hover:text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              )
            })}
            
            {/* Search Item */}
            <li
              data-testid="navigation-item"
              aria-selected={false}
              className="rounded-[6px] transition-all duration-200"
            >
              <button
                data-testid="search"
                aria-pressed={false}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-[6px] transition-all duration-200 hover:bg-[rgba(235,235,245,0.05)] group"
              >
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                  <Search className="w-5 h-5 text-[rgba(255,255,255,0.92)] group-hover:text-white transition-all duration-200" />
                </span>
                <span className="flex-1 text-left text-[15px] leading-[20px] overflow-hidden text-ellipsis whitespace-nowrap text-[rgba(255,255,255,0.92)] group-hover:text-white transition-all duration-200">
                  Search
                </span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Native CTA Section */}
        <div className="border-t border-[rgba(0,0,0,0.1)]">
          <div data-testid="native-cta" className="px-[25px] py-4">
            <button 
              data-testid="native-cta-button"
              className="w-full flex items-center justify-start gap-2 transition-all duration-200 hover:opacity-80 group"
            >
              <span className="flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="text-white" aria-hidden="true">
                  <path d="M22.567 1.496C21.448.393 19.956.045 17.293.045H6.566c-2.508 0-4.028.376-5.12 1.465C.344 2.601 0 4.09 0 6.611v10.727c0 2.695.33 4.18 1.432 5.257 1.106 1.103 2.595 1.45 5.275 1.45h10.586c2.663 0 4.169-.347 5.274-1.45C23.656 21.504 24 20.033 24 17.338V6.752c0-2.694-.344-4.179-1.433-5.256Zm.411 4.9v11.299c0 1.898-.338 3.286-1.188 4.137-.851.864-2.256 1.191-4.141 1.191H6.35c-1.884 0-3.303-.341-4.154-1.191-.85-.851-1.174-2.239-1.174-4.137V6.54c0-2.014.324-3.445 1.16-4.295.851-.864 2.312-1.177 4.313-1.177h11.154c1.885 0 3.29.341 4.141 1.191.864.85 1.188 2.239 1.188 4.137Z" fill="currentColor" />
                  <path d="M7.413 19.255c.987 0 2.48-.728 2.48-2.672v-6.385c0-.35.063-.428.378-.494l5.298-1.095c.351-.067.534.025.534.333l.035 4.286c0 .337-.182.586-.53.652l-1.014.228c-1.361.3-2.007.923-2.007 1.937 0 1.017.79 1.748 1.926 1.748.986 0 2.444-.679 2.444-2.64V5.654c0-.636-.279-.821-1.016-.66L9.646 6.298c-.448.091-.674.329-.674.699l.035 7.697c0 .336-.148.546-.446.613l-1.067.21c-1.329.266-1.986.93-1.986 1.993 0 1.017.786 1.745 1.905 1.745Z" fill="currentColor" />
                </svg>
              </span>
              <span className="flex-1 text-left text-[13px] leading-4 text-[rgba(255,255,255,0.64)] group-hover:text-[rgba(255,255,255,0.92)] transition-all duration-200 overflow-hidden text-ellipsis whitespace-nowrap">
                Open in Music
              </span>
              <span className="flex-shrink-0">
                <svg height="16" width="16" viewBox="0 0 16 16" className="text-white opacity-60" aria-hidden="true">
                  <path d="M1.559 16 13.795 3.764v8.962H16V0H3.274v2.205h8.962L0 14.441 1.559 16z" fill="currentColor" />
                </svg>
              </span>
            </button>
          </div>
          
          <button 
            data-testid="try-beta"
            className="w-full flex items-center justify-start gap-2 px-[25px] pb-[13px] transition-all duration-200 hover:opacity-80 group"
          >
            <span className="text-[13px] leading-[18px] text-[rgba(255,255,255,0.64)] group-hover:text-[rgba(255,255,255,0.92)] transition-all duration-200">
              Try Beta
            </span>
            <span className="flex-shrink-0">
              <svg height="16" width="16" viewBox="0 0 16 16" className="text-white opacity-60" aria-hidden="true">
                <path d="M1.559 16 13.795 3.764v8.962H16V0H3.274v2.205h8.962L0 14.441 1.559 16z" fill="currentColor" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </aside>
  )
}
