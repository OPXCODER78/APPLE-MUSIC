"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, X, RotateCcw } from "lucide-react"
import { Movie, supabase, addCacheBuster } from "@/lib/supabase"

interface VideoPlayerProps {
  movie: Movie
  onClose: () => void
}

export default function VideoPlayer({ movie, onClose }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [upcomingMovie, setUpcomingMovie] = useState<Movie | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [isPlaying])
  
  useEffect(() => {
    // Fetch upcoming movie when not in fullscreen
    const fetchUpcomingMovie = async () => {
      if (!isFullscreen) {
        try {
          const { data } = await supabase
            .from('movies')
            .select('*')
            .neq('id', movie.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()
          
          setUpcomingMovie(data || null)
        } catch (error) {
          console.error('Error fetching upcoming movie:', error)
          setUpcomingMovie(null)
        }
      }
    }
    
    fetchUpcomingMovie()
  }, [isFullscreen, movie.id])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      setIsLoading(false)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const pos = (e.clientX - rect.left) / rect.width
      const time = pos * duration
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value)
    setVolume(vol)
    setIsMuted(vol === 0)
  }

  const toggleMute = () => {
    if (isMuted) {
      setVolume(1)
      setIsMuted(false)
    } else {
      setVolume(0)
      setIsMuted(true)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds))
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === ' ') {
      e.preventDefault()
      togglePlay()
    }
  }

  return (
    <div 
      ref={playerRef}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <video
        ref={videoRef}
        src={movie.video_url}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-white text-xl font-semibold truncate max-w-md">
                {movie.movie_name}
              </h2>
              {movie.duration && (
                <span className="text-white/70 text-sm">
                  {formatTime(movie.duration)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <RotateCcw className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close video player"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Big Bold Cancel Button at Center Top */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full text-lg shadow-lg transition-all duration-300 flex items-center gap-2"
            aria-label="Close video player"
          >
            <X className="w-6 h-6" />
            <span>CANCEL</span>
          </button>
        </div>

        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="p-6 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all transform hover:scale-110"
          >
            {isPlaying ? (
              <Pause className="w-12 h-12 text-white" />
            ) : (
              <Play className="w-12 h-12 text-white fill-white" />
            )}
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <div
              onClick={handleSeek}
              className="h-1 bg-white/30 rounded-full cursor-pointer group"
            >
              <div
                className="h-full bg-[#ff0000] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleSkip(-10)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <SkipBack className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={togglePlay}
                className="p-3 bg-[#ff0000] hover:bg-[#cc0000] rounded-full transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white fill-white" />
                )}
              </button>

              <button
                onClick={() => handleSkip(10)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <SkipForward className="w-5 h-5 text-white" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5 text-white" />
                ) : (
                  <Maximize className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute bottom-20 right-4 bg-black/90 backdrop-blur-sm rounded-lg p-4 min-w-48">
            <h3 className="text-white font-semibold mb-3">Playback Speed</h3>
            <div className="space-y-2">
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  onClick={() => {
                    setPlaybackRate(rate)
                    if (videoRef.current) {
                      videoRef.current.playbackRate = rate
                    }
                    setShowSettings(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${
                    playbackRate === rate
                      ? 'bg-[#ff0000] text-white'
                      : 'text-white/70 hover:bg-white/20'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Upcoming Movie Recommendation (only when not in fullscreen) */}
      {!isFullscreen && (
        <div className="absolute bottom-24 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 max-w-xs">
          <h3 className="text-white font-semibold mb-2">Up Next</h3>
          {upcomingMovie ? (
            <div className="flex items-center gap-3">
              <div className="w-20 h-12 overflow-hidden rounded">
                <img 
                  src={addCacheBuster(upcomingMovie.thumbnail_url)}
                  alt={upcomingMovie.movie_name}
                  className="w-full h-full object-cover rounded-md"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/placeholder.jpg";
                  }}
                />
              </div>
              <div>
                <p className="text-white text-sm font-medium">{upcomingMovie.movie_name}</p>
                {upcomingMovie.duration && (
                  <p className="text-white/70 text-xs">{formatTime(upcomingMovie.duration)}</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-white/70 text-sm">No more movies available</p>
          )}
        </div>
      )}
    </div>
  )
}
