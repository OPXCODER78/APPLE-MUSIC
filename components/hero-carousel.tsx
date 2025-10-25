'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, Ad, addCacheBuster } from '@/lib/supabase'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'

export default function HeroCarousel() {
  const [ads, setAds] = useState<Ad[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch ads from database
  const fetchAds = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) throw error
      setAds(data || [])
    } catch (error) {
      console.error('Error fetching ads:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAds()
  }, [fetchAds])

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || ads.length <= 1) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [isPlaying, ads.length, currentIndex])

  const updateSlides = (newIndex: number) => {
    setCurrentIndex(newIndex)
  }

  const nextSlide = () => {
    if (isTransitioning || ads.length === 0) return
    setIsTransitioning(true)
    const newIndex = (currentIndex + 1) % ads.length
    updateSlides(newIndex)
    setTimeout(() => setIsTransitioning(false), 700)
  }

  const prevSlide = () => {
    if (isTransitioning || ads.length === 0) return
    setIsTransitioning(true)
    const newIndex = (currentIndex - 1 + ads.length) % ads.length
    updateSlides(newIndex)
    setTimeout(() => setIsTransitioning(false), 700)
  }

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex || ads.length === 0) return
    setIsTransitioning(true)
    updateSlides(index)
    setTimeout(() => setIsTransitioning(false), 700)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleAdClick = (ad: Ad) => {
    if (ad.link_url) {
      window.open(ad.link_url, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="relative aspect-[16/10] rounded-3xl bg-gray-900 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/60">Loading ads...</div>
          </div>
        </div>
      </div>
    )
  }

  if (ads.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="relative aspect-[16/10] rounded-3xl bg-gray-900 flex items-center justify-center">
          <div className="text-white/60">No ads available</div>
        </div>
      </div>
    )
  }

  const currentAd = ads[currentIndex]

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-0">
      <div className="relative aspect-[4/5] sm:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
        {/* Slides Container */}
        <div className="absolute inset-0">
          {ads.map((ad, index) => (
            <div
              key={ad.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={addCacheBuster(ad.image_url)}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
              <div 
                className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent`}
                style={{
                  background: `linear-gradient(to top, 
                    hsl(${(index * 60) % 360}, 70%, 20%, 0.8), 
                    hsl(${(index * 60) % 360}, 70%, 30%, 0.6), 
                    transparent)`
                }}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {ads.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="hidden sm:block absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white hover:scale-110 transition-all duration-300"
              disabled={isTransitioning}
            >
              <ChevronLeft size={40} className="sm:w-[60px] sm:h-[60px] drop-shadow-lg" />
            </button>
            <button
              onClick={nextSlide}
              className="hidden sm:block absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white hover:scale-110 transition-all duration-300"
              disabled={isTransitioning}
            >
              <ChevronRight size={40} className="sm:w-[60px] sm:h-[60px] drop-shadow-lg" />
            </button>
          </>
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-8 md:p-12 z-10">
          {/* Logo */}
          <div className="flex items-center gap-2 text-white">
            <span className="text-xl sm:text-2xl">📺</span>
            <span className="text-xl sm:text-2xl font-semibold">tv+</span>
          </div>

          {/* Content */}
          <div className="space-y-2 sm:space-y-4">
            <h1 
              className={`text-2xl sm:text-4xl md:text-6xl font-bold text-white leading-tight transition-all duration-700 ${
                isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}
            >
              {currentAd?.title}
            </h1>
            
            {currentAd?.description && (
              <p 
                className={`text-sm sm:text-base md:text-xl text-white/90 max-w-md sm:max-w-xl md:max-w-2xl transition-all duration-700 delay-100 ${
                  isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
              >
                {currentAd.description}
              </p>
            )}

            {(currentAd?.link_url || currentAd?.button_text) && (
              <button
                onClick={() => handleAdClick(currentAd)}
                className={`inline-block mt-3 sm:mt-6 px-5 sm:px-8 py-2 sm:py-3 text-sm sm:text-base bg-white text-black font-semibold rounded-full hover:bg-white/90 hover:scale-105 transition-all duration-300 delay-200 ${
                  isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
              >
                {currentAd.button_text || 'Learn More'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* External Controls */}
      <div className="relative w-full h-10 sm:h-12 mt-3 sm:mt-4">
        {/* Play/Pause Button */}
        {ads.length > 1 && (
          <button
            onClick={togglePlayPause}
            className="absolute top-0 right-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all duration-300"
          >
            {isPlaying ? <Pause size={16} className="sm:w-5 sm:h-5" /> : <Play size={16} className="sm:w-5 sm:h-5" />}
          </button>
        )}

        {/* Dots Navigation */}
        {ads.length > 1 && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-10 sm:h-12 flex items-center gap-1.5 sm:gap-2">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 border-0 p-0 ${
                  index === currentIndex
                    ? 'w-6 sm:w-8 bg-white'
                    : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Text */}
      <p className="text-white/40 text-xs sm:text-sm text-center mt-4 sm:mt-6 px-4">
        {ads.length > 1 ? (
          <>
            <span className="hidden sm:inline">Swipe or use arrows to navigate • Tap play/pause to control autoplay</span>
            <span className="sm:hidden">Swipe to navigate • Tap to control autoplay</span>
          </>
        ) : (
          'Advertisement'
        )}
      </p>
    </div>
  )
}