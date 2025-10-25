"use client"

import { useState, useEffect } from "react"
import { Play, Music } from "lucide-react"
import { supabase, Song } from "@/lib/supabase"
import HeroCarousel from "@/components/hero-carousel"

interface HomePageProps {
  onPlaySong: (song: Song) => void
}

export default function HomePage({ onPlaySong }: HomePageProps) {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSongs()
  }, [])

  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) {
        setSongs(data)
      }
    } catch (err) {
      console.error('Error fetching songs:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Carousel Section */}
      <div className="p-4 md:p-8 pb-0">
        <HeroCarousel />
      </div>
      
      <div className="p-4 md:p-8 pt-8">
        <h1 className="text-4xl font-bold mb-2 text-white">Your Music</h1>
        <p className="text-[rgba(255,255,255,0.64)] mb-8">Discover and play your favorite songs</p>
      
      {/* Songs Section */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-[rgba(255,255,255,0.64)]">Loading songs...</div>
        </div>
      ) : songs.length > 0 ? (
        <>
          <h2 className="text-2xl font-bold text-white mb-4">Your Songs</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
            {songs.map((song, index) => (
              <div
                key={song.id}
                data-testid={`song-card-${song.id}`}
                onClick={() => onPlaySong(song)}
                role="button"
                aria-disabled="false"
                aria-labelledby={`song-title-${song.id}`}
                aria-describedby={`song-artist-${song.id}`}
                tabIndex={0}
                className="CardButton-sc-g9vf2u-0 eWZOJQ"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <h3 id={`song-title-${song.id}`} className="font-semibold text-sm text-white mb-1 truncate">
                  {song.song_name}
                </h3>
                {song.artist && (
                  <p id={`song-artist-${song.id}`} className="text-[rgba(255,255,255,0.64)] text-xs truncate">
                    {song.artist}
                  </p>
                )}
                
                {/* THE CLEANED UP PLAY BUTTON */}
                <span className="PlayButton">
                  <span aria-hidden="true" className="e-91000-button__icon-wrapper">
                    <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24">
                      <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
                    </svg>
                  </span>
                </span>
                {/* END OF PLAY BUTTON */}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <Music className="w-16 h-16 text-[rgba(255,255,255,0.3)] mb-4" />
          <p className="text-[rgba(255,255,255,0.64)] text-center mb-2">No songs uploaded yet</p>
          <p className="text-[rgba(255,255,255,0.4)] text-sm text-center">
            Visit the <a href="/admin" className="text-[#ff0000] hover:underline">admin panel</a> to upload your first song
          </p>
        </div>
      )}
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
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }

        /* ---------------------------------- */
        /* 1. Main Card Styles */
        /* ---------------------------------- */
        .CardButton-sc-g9vf2u-0 {
            /* Essential Layout and Positioning */
            display: block;
            position: relative;
            width: 177.719px;
            height: 229.719px;
            box-sizing: border-box;
            overflow: hidden;
            z-index: 0;

            /* Appearance & Interaction */
            background-color: #1a1a1a;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease-in-out; /* Added 'all' for smoother hover */

            /* Typography & Color */
            color: rgb(255, 255, 255);
            font-family: 'SpotifyMixUI', CircularSp-Arab, sans-serif;
            text-align: start;
            padding: 15px;
            border-radius: 8px;
        }

        .CardButton-sc-g9vf2u-0 h3 {
            margin-top: 100px;
            font-size: 1.1em;
        }

        .CardButton-sc-g9vf2u-0 p {
            font-size: 0.9em;
            opacity: 0.7;
        }

        .CardButton-sc-g9vf2u-0:hover {
            background-color: #282828;
            transform: translateY(-4px) scale(1.02); /* Slight lift and scale on hover */
        }


        /* ---------------------------------- */
        /* 2. Play Button Styles (Cleaned from inline) */
        /* ---------------------------------- */
        .PlayButton {
            /* Positioning */
            position: absolute;
            right: 20px;
            bottom: 20px;
            z-index: 10; /* Ensure it's above other elements */

            /* Size and Shape */
            width: 48px;
            height: 48px;
            border-radius: 9999px;
            
            /* Color and Appearance */
            background-color: rgb(26, 188, 84); /* Bright Green */
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5); /* Added shadow for visual pop */
            
            /* Hover/Visibility State (Initially hidden) */
            opacity: 0;
            transform: translateY(10px); /* Hidden position */
            transition: opacity 0.3s ease-out, transform 0.3s ease-out;
        }

        /* ---------------------------------- */
        /* 3. Hover Visibility Logic */
        /* ---------------------------------- */
        .CardButton-sc-g9vf2u-0:hover .PlayButton {
            opacity: 1; /* Show on hover */
            transform: translateY(0); /* Move to final position */
        }

        /* ---------------------------------- */
        /* 4. Mobile View Visibility Logic */
        /* ---------------------------------- */
        @media (max-width: 600px) {
            .PlayButton {
                opacity: 1; /* Always visible on small screens */
                transform: translateY(0);
            }
        }

        /* Icon (SVG) Styles */
        .PlayButton svg {
            fill: black; /* Changed to black for contrast on green button */
            width: 24px;
            height: 24px;
        }
        .PlayButton:hover {
            transform: scale(1.05); /* Slight scale on button hover */
        }
      `}</style>
    </div>
  )
}
