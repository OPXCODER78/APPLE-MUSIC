"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { Movie, addCacheBuster } from "@/lib/supabase"

interface MovieCardProps {
  movie: Movie
  onPlay: (movie: Movie) => void
  index?: number
}

export default function MovieCard({ movie, onPlay, index = 0 }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="tray-vertical-card group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlay(movie)}
      data-testid="tray-card-default"
      aria-label={`${movie.movie_name}, Movie`}
      tabIndex={0}
    >
      <div className="card-image-wrapper">
        <img
          alt={movie.movie_name}
          src={addCacheBuster(movie.thumbnail_url)}
          loading="lazy"
          className="transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/placeholder.jpg";
          }}
        />
        
        {/* Top-10 Rank Overlay Image */}
        {index < 4 && (
          <div className="top-10-overlay">
            <img 
              src={`https://img10.hotstar.com/image/upload/f_auto,q_90/discovery/PROD/top-10-overlays/version-1/LTR/overlay-${index + 1}.png`}
              loading="lazy"
              alt={`Rank ${index + 1}`}
            />
          </div>
        )}
        
        {/* Play button overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="bg-black/60 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-all duration-300">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
      </div>

      {/* NEW RELEASE Badge */}
      <div className="new-release-badge">
        <span className="badge-text">NEW RELEASE</span>
      </div>

      <style jsx>{`
        .tray-vertical-card {
          width: 156.984px;
          height: 209.312px;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          position: relative;
          display: block;
          overflow: hidden;
          border-radius: 4px;
          background-color: #16181f;
          cursor: pointer;
        }

        .card-image-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .card-image-wrapper img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .top-10-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10;
        }

        .new-release-badge {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          padding: 0 4px;
          height: 20px;
          display: flex;
          align-items: center;
          border-radius: 4px;
          max-width: 144px;
          background: rgba(0, 0, 0, 0.7);
        }

        .badge-text {
          color: rgb(255, 255, 255);
          font-family: 'Inter, sans-serif';
          font-size: 11px;
          font-weight: 700;
          line-height: 20px;
          letter-spacing: 0.2px;
          white-space: nowrap;
        }

        .tray-vertical-card:hover {
          transform: scale(1.05);
          transition: transform 0.3s ease;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
          z-index: 100;
        }
      `}</style>
    </div>
  )
}
