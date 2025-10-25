"use client"

import { useState, useEffect } from "react"
import { Film, Play } from "lucide-react"
import { supabase, Movie } from "@/lib/supabase"
import MovieCard from "@/components/movie-card"
import VideoPlayer from "@/components/video-player"

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null)

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) {
        setMovies(data)
      }
    } catch (err) {
      console.error('Error fetching movies:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePlayMovie = (movie: Movie) => {
    setCurrentMovie(movie)
  }

  const handleClosePlayer = () => {
    setCurrentMovie(null)
  }

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-2">
        <Film className="w-8 h-8 text-[#ff0000]" />
        <h1 className="text-4xl font-bold text-white">Movies</h1>
      </div>
      <p className="text-[rgba(255,255,255,0.64)] mb-8">Watch your favorite movies</p>
      
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-[rgba(255,255,255,0.64)]">Loading movies...</div>
        </div>
      ) : movies.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
                className="animate-fade-in-up"
              >
                <MovieCard movie={movie} onPlay={handlePlayMovie} index={index} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <Film className="w-16 h-16 text-[rgba(255,255,255,0.3)] mb-4" />
          <p className="text-[rgba(255,255,255,0.64)] text-center mb-2">No movies uploaded yet</p>
          <p className="text-[rgba(255,255,255,0.4)] text-sm text-center">
            Visit the <a href="/admin" className="text-[#ff0000] hover:underline">admin panel</a> to upload your first movie
          </p>
        </div>
      )}

      {/* Video Player */}
      {currentMovie && (
        <VideoPlayer movie={currentMovie} onClose={handleClosePlayer} />
      )}

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
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
