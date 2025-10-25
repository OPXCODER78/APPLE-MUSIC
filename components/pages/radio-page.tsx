"use client"

import { Radio, Signal } from "lucide-react"

export default function RadioPage() {
  const radioStations = [
    {
      id: 1,
      name: "Hits Radio",
      description: "Today's biggest hits",
      gradient: "from-[#ff0000] via-[#ff3333] to-[#ff6666]",
      isLive: true,
    },
    {
      id: 2,
      name: "Chill Radio",
      description: "Relaxing vibes",
      gradient: "from-blue-400 via-blue-500 to-blue-600",
      isLive: true,
    },
    {
      id: 3,
      name: "Rock Classics",
      description: "Legendary rock anthems",
      gradient: "from-purple-500 via-purple-600 to-purple-700",
      isLive: false,
    },
    {
      id: 4,
      name: "Hip Hop Nation",
      description: "Latest hip hop beats",
      gradient: "from-yellow-500 via-orange-500 to-red-500",
      isLive: true,
    },
    {
      id: 5,
      name: "Electronic Dance",
      description: "EDM and house music",
      gradient: "from-cyan-400 via-cyan-500 to-cyan-600",
      isLive: false,
    },
    {
      id: 6,
      name: "Jazz Cafe",
      description: "Smooth jazz classics",
      gradient: "from-amber-600 via-amber-700 to-amber-800",
      isLive: true,
    },
  ]

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-2">
        <Radio className="w-8 h-8 text-[#ff0000]" />
        <h1 className="text-4xl font-bold text-white">Radio</h1>
      </div>
      <p className="text-[rgba(255,255,255,0.64)] mb-8">Live radio stations and curated music</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {radioStations.map((station, index) => (
          <div
            key={station.id}
            data-testid={`radio-station-${station.id}`}
            className="group bg-[#2a2a2a] rounded-xl overflow-hidden hover:bg-[#333333] transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-2xl"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: "fade-in-up 0.5s ease-out forwards",
              opacity: 0,
            }}
          >
            <div className="relative h-48 overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${station.gradient} transition-transform duration-500 group-hover:scale-110`}></div>
              
              {/* Live indicator */}
              {station.isLive && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Signal className="w-4 h-4 text-[#ff0000] animate-pulse" />
                  <span className="text-white text-xs font-semibold">LIVE</span>
                </div>
              )}
              
              {/* Animated sound waves */}
              <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center gap-1 px-8 pb-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-white rounded-full"
                    style={{
                      height: `${20 + Math.random() * 40}%`,
                      animation: station.isLive
                        ? `wave ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate`
                        : "none",
                      animationDelay: `${i * 0.05}s`,
                    }}
                  ></div>
                ))}
              </div>
              
              {/* Radio icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-[rgba(0,0,0,0.6)] backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-all duration-300">
                  <Radio className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="font-bold text-xl text-white mb-1 group-hover:text-[#ff0000] transition-colors duration-200">
                {station.name}
              </h3>
              <p className="text-[rgba(255,255,255,0.64)] text-sm group-hover:text-[rgba(255,255,255,0.92)] transition-colors duration-200">
                {station.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes wave {
          from {
            transform: scaleY(0.5);
          }
          to {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  )
}
