"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, SkipBack, SkipForward, X, Heart, Repeat, Shuffle, MoreVertical, ChevronDown } from "lucide-react"
import { Song, addCacheBuster } from "@/lib/supabase"

interface AudioPlayerProps {
  song: Song
  onClose: () => void
}

export default function AudioPlayer({ song, onClose }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
      setIsPlaying(true)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const pos = (e.clientX - rect.left) / rect.width
      const time = pos * duration
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds))
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <>
      <audio
        ref={audioRef}
        src={song.song_url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Mini Player Bar */}
      {!isExpanded && (
        <div 
          className="fixed bottom-0 left-0 right-0 bg-[#2a2a2a] border-t border-[#3a3a3a] z-50 cursor-pointer"
          onClick={() => setIsExpanded(true)}
          data-testid="mini-player"
        >
          <div className="max-w-6xl mx-auto px-4 py-3 md:px-6 md:py-4">
            <div className="flex items-center gap-3 md:gap-4">
              {/* Song Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {song.thumbnail_url ? (
                  <img
                    src={song.thumbnail_url}
                    alt={song.song_name}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#ff0000] via-[#cc0000] to-[#990000] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate text-sm md:text-base">{song.song_name}</h3>
                  {song.artist && (
                    <p className="text-[rgba(255,255,255,0.64)] text-xs md:text-sm truncate">{song.artist}</p>
                  )}
                </div>
              </div>

              {/* Mini Controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePlay()
                  }}
                  className="p-2 bg-[#ff0000] hover:bg-[#cc0000] rounded-full transition-colors"
                  data-testid="mini-play-pause"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onClose()
                  }}
                  className="p-2 hover:bg-[#3a3a3a] rounded-full transition-colors"
                  data-testid="mini-close"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-2 h-1 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#ff0000] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Player */}
      {isExpanded && (
        <div className="fixed inset-0 bg-gradient-to-b from-[#f8d9ce] to-[#f5c4b8] z-50 overflow-auto">
          <div className="max-w-md mx-auto h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-[rgba(0,0,0,0.1)] rounded-full transition-colors"
                data-testid="collapse-player"
              >
                <ChevronDown className="w-6 h-6 text-[#3e2e28]" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[rgba(0,0,0,0.1)] rounded-full transition-colors"
                data-testid="close-player"
              >
                <X className="w-6 h-6 text-[#3e2e28]" />
              </button>
            </div>

            {/* Album Art */}
            <div className="relative px-4 pt-4">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                {song.thumbnail_url ? (
                <img
                  src={addCacheBuster(song.thumbnail_url)}
                  alt={song.song_name}
                  className="w-full h-full object-cover"
                />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#ff0000] via-[#cc0000] to-[#990000] flex items-center justify-center">
                    <Play className="w-24 h-24 text-white opacity-50" />
                  </div>
                )}
                <button
                  className="absolute top-4 right-4 p-2 bg-white/70 backdrop-blur-sm rounded-full hover:bg-white/90 transition-colors"
                  data-testid="more-options"
                >
                  <MoreVertical className="w-5 h-5 text-black" />
                </button>
              </div>
            </div>

            {/* Song Info & Controls */}
            <div className="flex-1 flex flex-direction-column justify-center px-6 py-8">
              <div className="space-y-6">
                {/* Song Title and Artist */}
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#3e2e28] mb-2">
                    {song.song_name}
                  </h2>
                  {song.artist && (
                    <p className="text-base md:text-lg text-[#65524c]">
                      {song.artist}
                    </p>
                  )}
                </div>

                {/* Utility Icons */}
                <div className="flex items-center justify-between px-4">
                  <button
                    onClick={() => setIsRepeat(!isRepeat)}
                    className={`p-2 rounded-full transition-colors ${
                      isRepeat ? 'bg-[rgba(0,0,0,0.15)]' : 'hover:bg-[rgba(0,0,0,0.1)]'
                    }`}
                    data-testid="repeat-button"
                  >
                    <Repeat className="w-5 h-5 text-[#3e2e28]" />
                  </button>
                  <button
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={`p-2 rounded-full transition-colors ${
                      isShuffle ? 'bg-[rgba(0,0,0,0.15)]' : 'hover:bg-[rgba(0,0,0,0.1)]'
                    }`}
                    data-testid="shuffle-button"
                  >
                    <Shuffle className="w-5 h-5 text-[#3e2e28]" />
                  </button>
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="p-2 hover:bg-[rgba(0,0,0,0.1)] rounded-full transition-colors"
                    data-testid="like-button"
                  >
                    <Heart 
                      className={`w-5 h-5 ${isLiked ? 'fill-[#ff0000] text-[#ff0000]' : 'text-[#3e2e28]'}`}
                    />
                  </button>
                </div>

                {/* Progress Bar */}
                <div>
                  <div
                    onClick={handleSeek}
                    className="h-1.5 bg-[rgba(0,0,0,0.15)] rounded-full cursor-pointer relative group"
                    data-testid="progress-bar"
                  >
                    <div
                      className="h-full bg-black rounded-full relative"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-[#65524c]">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Main Playback Controls */}
                <div className="flex items-center justify-between px-4">
                  <button
                    onClick={() => handleSkip(-10)}
                    className="p-2 hover:bg-[rgba(0,0,0,0.1)] rounded-full transition-colors"
                    data-testid="previous-button"
                  >
                    <SkipBack className="w-6 h-6 text-[#3e2e28]" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="p-4 bg-black hover:bg-[#2a2a2a] rounded-full transition-all transform hover:scale-105 shadow-lg"
                    data-testid="play-pause-button"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white fill-white" />
                    )}
                  </button>

                  <button
                    onClick={() => handleSkip(10)}
                    className="p-2 hover:bg-[rgba(0,0,0,0.1)] rounded-full transition-colors"
                    data-testid="next-button"
                  >
                    <SkipForward className="w-6 h-6 text-[#3e2e28]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
