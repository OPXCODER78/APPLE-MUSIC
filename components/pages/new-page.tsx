"use client"

import { useState, useEffect } from "react"
import { Sparkles, Calendar, ExternalLink } from "lucide-react"
import { supabase, News } from "@/lib/supabase"

export default function NewPage() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)
      
      if (data) {
        setNews(data)
      }
    } catch (err) {
      console.error('Error fetching news:', err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-2">
        <Sparkles className="w-8 h-8 text-[#ff0000]" />
        <h1 className="text-4xl font-bold text-white">New</h1>
      </div>
      <p className="text-[rgba(255,255,255,0.64)] mb-8">Fresh releases and featured content</p>
      
      <div className="space-y-6">
        <div 
          data-testid="featured-content-1"
          className="group bg-[#2a2a2a] rounded-xl p-8 hover:bg-[#333333] transition-all duration-300 cursor-pointer transform hover:scale-[1.01] hover:shadow-2xl"
          style={{
            animation: "fade-in-up 0.5s ease-out forwards",
          }}
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg p-3">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2 text-white group-hover:text-[#ff0000] transition-colors duration-200">
                HAPPY DIWALI
              </h2>
              <p className="text-[rgba(255,255,255,0.64)] text-lg group-hover:text-[rgba(255,255,255,0.92)] transition-colors duration-200">
                Celebrate Diwali with playlists curated for every mood.
              </p>
            </div>
          </div>
          
          <div className="relative w-full h-64 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 transition-transform duration-500 group-hover:scale-105"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            
            {/* Animated particles effect */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full opacity-60"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                ></div>
              ))}
            </div>
            
            <div className="absolute bottom-6 left-6 right-6">
              <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-[#ff0000] hover:text-white transition-all duration-300 transform hover:scale-105">
                Listen Now
              </button>
            </div>
          </div>
        </div>

        <div 
          data-testid="featured-content-2"
          className="group bg-[#2a2a2a] rounded-xl p-8 hover:bg-[#333333] transition-all duration-300 cursor-pointer transform hover:scale-[1.01] hover:shadow-2xl"
          style={{
            animation: "fade-in-up 0.5s ease-out 0.1s forwards",
            opacity: 0,
          }}
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg p-3">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="inline-block bg-[#ff0000] text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                PRE-ADD NOW
              </div>
              <h2 className="text-3xl font-bold mb-2 text-white group-hover:text-[#ff0000] transition-colors duration-200">
                Apple Music Live: Gracie Abrams
              </h2>
              <p className="text-[rgba(255,255,255,0.64)] text-lg group-hover:text-[rgba(255,255,255,0.92)] transition-colors duration-200">
                Experience an exclusive live performance
              </p>
            </div>
          </div>
          
          <div className="relative w-full h-64 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black transition-transform duration-500 group-hover:scale-105"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-[#ff0000] hover:text-white transition-all duration-300 transform hover:scale-105">
                Pre-Add
              </button>
              <div className="text-[rgba(255,255,255,0.92)] text-sm">
                Available Dec 15
              </div>
            </div>
          </div>
        </div>

        {/* News Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Latest Updates</h2>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-[rgba(255,255,255,0.64)]">Loading news...</div>
            </div>
          ) : news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item, index) => (
                <div
                  key={item.id}
                  data-testid={`news-item-${item.id}`}
                  className="group bg-[#2a2a2a] rounded-xl p-6 hover:bg-[#333333] transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-2xl"
                  style={{
                    animation: `fade-in-up 0.5s ease-out ${index * 0.1}s forwards`,
                    opacity: 0,
                  }}
                >
                  {item.image_url && (
                    <div className="relative w-full h-48 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#ff0000] transition-colors duration-200">
                      {item.title}
                    </h3>
                    
                    {item.description && (
                      <p className="text-[rgba(255,255,255,0.64)] text-sm group-hover:text-[rgba(255,255,255,0.92)] transition-colors duration-200 line-clamp-3">
                        {item.description}
                      </p>
                    )}
                    
                    {item.button_name && item.button_url && (
                      <div className="pt-2">
                        <a
                          href={item.button_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-[#ff0000] hover:bg-[#cc0000] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.button_name}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <Calendar className="w-16 h-16 text-[rgba(255,255,255,0.3)] mb-4" />
              <p className="text-[rgba(255,255,255,0.64)] text-center mb-2">No news updates yet</p>
              <p className="text-[rgba(255,255,255,0.4)] text-sm text-center">
                Check back later for the latest updates
              </p>
            </div>
          )}
        </div>

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
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
      `}</style>
    </div>
  )
}
