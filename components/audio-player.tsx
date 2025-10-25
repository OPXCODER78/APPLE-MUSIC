"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X } from "lucide-react"
import { Song, addCacheBuster } from "@/lib/supabase"

interface AudioPlayerProps {
  song: Song
  onClose: () => void
}

export default function AudioPlayer({ song, onClose }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

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
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#2a2a2a] border-t border-[#3a3a3a] z-50 p-4">
      <audio
        ref={audioRef}
        src={song.song_url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Song Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src={addCacheBuster(song.thumbnail_url)}
              alt={song.song_name}
              className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder.jpg";
              }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold truncate text-sm md:text-base">{song.song_name}</h3>
              {song.artist && (
                <p className="text-[rgba(255,255,255,0.64)] text-xs md:text-sm truncate">{song.artist}</p>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10)
                  }
                }}
                className="p-2 hover:bg-[#3a3a3a] rounded-full transition-colors"
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
                  <Play className="w-6 h-6 text-white" />
                )}
              </button>
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10)
                  }
                }}
                className="p-2 hover:bg-[#3a3a3a] rounded-full transition-colors"
              >
                <SkipForward className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 w-full max-w-md">
              <span className="text-xs text-[rgba(255,255,255,0.64)] min-w-[40px]">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1 bg-[#3a3a3a] rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #ff0000 0%, #ff0000 ${(currentTime / duration) * 100}%, #3a3a3a ${(currentTime / duration) * 100}%, #3a3a3a 100%)`
                }}
              />
              <span className="text-xs text-[rgba(255,255,255,0.64)] min-w-[40px] text-right">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume & Close */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <button onClick={toggleMute} className="p-2 hover:bg-[#3a3a3a] rounded-full transition-colors">
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
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-[#3a3a3a] rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#3a3a3a] rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
