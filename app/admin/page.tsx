"use client"

import { useState, useEffect } from "react"
import { supabase, News, Movie } from "@/lib/supabase"
import { Upload, Music, X, CheckCircle, Loader2, Newspaper, Plus, Film, Megaphone } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [songName, setSongName] = useState("")
  const [artist, setArtist] = useState("")
  const [songFile, setSongFile] = useState<File | null>(null)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState("")
  const [songs, setSongs] = useState<any[]>([])
  
  // News states
  const [news, setNews] = useState<News[]>([])
  const [activeTab, setActiveTab] = useState("songs")
  const [newsTitle, setNewsTitle] = useState("")
  const [newsDescription, setNewsDescription] = useState("")
  const [newsImage, setNewsImage] = useState<File | null>(null)
  const [newsButtonName, setNewsButtonName] = useState("")
  const [newsButtonUrl, setNewsButtonUrl] = useState("")
  
  // Movies states
  const [movies, setMovies] = useState<Movie[]>([])
  const [movieName, setMovieName] = useState("")
  const [movieDescription, setMovieDescription] = useState("")
  const [movieFile, setMovieFile] = useState<File | null>(null)
  const [movieThumbnail, setMovieThumbnail] = useState<File | null>(null)

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    if (auth === "true") {
      setIsAuthenticated(true)
      fetchSongs()
      fetchNews()
      fetchMovies()
    }
  }, [])

  const fetchSongs = async () => {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setSongs(data)
  }

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setNews(data)
  }

  const fetchMovies = async () => {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setMovies(data)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === "admin123") {
      setIsAuthenticated(true)
      localStorage.setItem("adminAuth", "true")
      fetchSongs()
    } else {
      setError("Incorrect password")
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!songName || !songFile) {
      setError("Song name and file are required")
      return
    }

    setUploading(true)
    setError("")

    try {
      // Upload song file
      const songFileName = `${Date.now()}_${songFile.name}`
      const { data: songData, error: songError } = await supabase.storage
        .from('songs')
        .upload(songFileName, songFile)

      if (songError) throw songError

      const { data: { publicUrl: songUrl } } = supabase.storage
        .from('songs')
        .getPublicUrl(songFileName)

      // Upload thumbnail if provided
      let thumbnailUrl = null
      if (thumbnail) {
        const thumbnailFileName = `${Date.now()}_${thumbnail.name}`
        const { data: thumbData, error: thumbError } = await supabase.storage
          .from('thumbnails')
          .upload(thumbnailFileName, thumbnail)

        if (!thumbError) {
          const { data: { publicUrl } } = supabase.storage
            .from('thumbnails')
            .getPublicUrl(thumbnailFileName)
          thumbnailUrl = publicUrl
        }
      }

      // Save to database
      const { error: dbError } = await supabase
        .from('songs')
        .insert([
          {
            song_name: songName,
            artist: artist || null,
            song_url: songUrl,
            thumbnail_url: thumbnailUrl,
          }
        ])

      if (dbError) throw dbError

      // Reset form
      setSongName("")
      setArtist("")
      setSongFile(null)
      setThumbnail(null)
      setUploadSuccess(true)
      fetchSongs()
      setTimeout(() => setUploadSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string, songUrl: string, thumbnailUrl?: string) => {
    try {
      // Delete from storage
      const songPath = songUrl.split('/').pop()
      if (songPath) {
        await supabase.storage.from('songs').remove([songPath])
      }
      
      if (thumbnailUrl) {
        const thumbPath = thumbnailUrl.split('/').pop()
        if (thumbPath) {
          await supabase.storage.from('thumbnails').remove([thumbPath])
        }
      }

      // Delete from database
      await supabase.from('songs').delete().eq('id', id)
      fetchSongs()
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const handleNewsUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsTitle) {
      setError("News title is required")
      return
    }

    setUploading(true)
    setError("")

    try {
      // Upload image if provided
      let imageUrl = null
      if (newsImage) {
        const imageFileName = `${Date.now()}_${newsImage.name}`
        const { data: imageData, error: imageError } = await supabase.storage
          .from('thumbnails')
          .upload(imageFileName, newsImage)

        if (imageError) throw imageError

        const { data: { publicUrl } } = supabase.storage
          .from('thumbnails')
          .getPublicUrl(imageFileName)
        imageUrl = publicUrl
      }

      // Save to database
      const { error: dbError } = await supabase
        .from('news')
        .insert([
          {
            title: newsTitle,
            description: newsDescription || null,
            image_url: imageUrl,
            button_name: newsButtonName || null,
            button_url: newsButtonUrl || null,
          }
        ])

      if (dbError) throw dbError

      // Reset form
      setNewsTitle("")
      setNewsDescription("")
      setNewsImage(null)
      setNewsButtonName("")
      setNewsButtonUrl("")
      setUploadSuccess(true)
      fetchNews()
      setTimeout(() => setUploadSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || "News upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteNews = async (id: string, imageUrl?: string) => {
    try {
      // Delete image from storage if exists
      if (imageUrl) {
        const imagePath = imageUrl.split('/').pop()
        if (imagePath) {
          await supabase.storage.from('thumbnails').remove([imagePath])
        }
      }

      // Delete from database
      await supabase.from('news').delete().eq('id', id)
      fetchNews()
    } catch (err) {
      console.error('Delete news error:', err)
    }
  }

  const handleMovieUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!movieName || !movieFile) {
      setError("Movie name and file are required")
      return
    }

    setUploading(true)
    setError("")

    try {
      // Upload movie file
      const movieFileName = `${Date.now()}_${movieFile.name}`
      const { data: movieData, error: movieError } = await supabase.storage
        .from('movies')
        .upload(movieFileName, movieFile)

      if (movieError) throw movieError

      const { data: { publicUrl: movieUrl } } = supabase.storage
        .from('movies')
        .getPublicUrl(movieFileName)

      // Upload thumbnail if provided
      let thumbnailUrl = null
      if (movieThumbnail) {
        const thumbnailFileName = `${Date.now()}_${movieThumbnail.name}`
        const { data: thumbData, error: thumbError } = await supabase.storage
          .from('thumbnails')
          .upload(thumbnailFileName, movieThumbnail)

        if (!thumbError) {
          const { data: { publicUrl } } = supabase.storage
            .from('thumbnails')
            .getPublicUrl(thumbnailFileName)
          thumbnailUrl = publicUrl
        }
      }

      // Save to database
      const { error: dbError } = await supabase
        .from('movies')
        .insert([
          {
            movie_name: movieName,
            description: movieDescription || null,
            video_url: movieUrl,
            thumbnail_url: thumbnailUrl,
          }
        ])

      if (dbError) throw dbError

      // Reset form
      setMovieName("")
      setMovieDescription("")
      setMovieFile(null)
      setMovieThumbnail(null)
      setUploadSuccess(true)
      fetchMovies()
      setTimeout(() => setUploadSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || "Movie upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteMovie = async (id: string, videoUrl: string, thumbnailUrl?: string) => {
    try {
      // Delete video from storage
      const videoPath = videoUrl.split('/').pop()
      if (videoPath) {
        await supabase.storage.from('movies').remove([videoPath])
      }
      
      if (thumbnailUrl) {
        const thumbPath = thumbnailUrl.split('/').pop()
        if (thumbPath) {
          await supabase.storage.from('thumbnails').remove([thumbPath])
        }
      }

      // Delete from database
      await supabase.from('movies').delete().eq('id', id)
      fetchMovies()
    } catch (err) {
      console.error('Delete movie error:', err)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] p-4">
        <div className="bg-[#2a2a2a] p-8 rounded-xl w-full max-w-md">
          <div className="text-center mb-6">
            <Music className="w-16 h-16 text-[#ff0000] mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-[rgba(255,255,255,0.64)]">Enter password to continue</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-[#ff0000] mb-4"
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#ff0000] text-white py-3 rounded-lg font-semibold hover:bg-[#cc0000] transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-[rgba(255,255,255,0.64)]">Upload and manage content</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-[#3a3a3a] text-white rounded-lg hover:bg-[#4a4a4a] transition-colors"
          >
            Back to Home
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("songs")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              activeTab === "songs" 
                ? "bg-[#ff0000] text-white" 
                : "bg-[#3a3a3a] text-[rgba(255,255,255,0.64)] hover:bg-[#4a4a4a]"
            }`}
          >
            <Music className="w-5 h-5" />
            Songs
          </button>
          <button
            onClick={() => setActiveTab("news")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              activeTab === "news" 
                ? "bg-[#ff0000] text-white" 
                : "bg-[#3a3a3a] text-[rgba(255,255,255,0.64)] hover:bg-[#4a4a4a]"
            }`}
          >
            <Newspaper className="w-5 h-5" />
            News
          </button>
          <button
            onClick={() => setActiveTab("movies")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              activeTab === "movies" 
                ? "bg-[#ff0000] text-white" 
                : "bg-[#3a3a3a] text-[rgba(255,255,255,0.64)] hover:bg-[#4a4a4a]"
            }`}
          >
            <Film className="w-5 h-5" />
            Movies
          </button>
          <button
            onClick={() => setActiveTab("ads")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              activeTab === "ads" 
                ? "bg-[#ff0000] text-white" 
                : "bg-[#3a3a3a] text-[rgba(255,255,255,0.64)] hover:bg-[#4a4a4a]"
            }`}
          >
            <Megaphone className="w-5 h-5" />
            Ads
          </button>
        </div>

        {/* Songs Tab */}
        {activeTab === "songs" && (
          <>
            {/* Upload Form */}
            <div className="bg-[#2a2a2a] p-6 md:p-8 rounded-xl mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Upload New Song</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-white mb-2">Song Name *</label>
              <input
                type="text"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
                placeholder="Enter song name"
                className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-[#ff0000]"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Artist (Optional)</label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Enter artist name"
                className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-[#ff0000]"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Song File *</label>
              <div className="relative">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setSongFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="song-file"
                  required
                />
                <label
                  htmlFor="song-file"
                  className="flex items-center justify-center w-full px-4 py-8 bg-[#1a1a1a] text-white rounded-lg border-2 border-dashed border-[#3a3a3a] hover:border-[#ff0000] cursor-pointer transition-colors"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-[#ff0000] mx-auto mb-2" />
                    <p className="text-sm">{songFile ? songFile.name : "Click to upload song file"}</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">Thumbnail (Optional)</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                  className="hidden"
                  id="thumbnail-file"
                />
                <label
                  htmlFor="thumbnail-file"
                  className="flex items-center justify-center w-full px-4 py-8 bg-[#1a1a1a] text-white rounded-lg border-2 border-dashed border-[#3a3a3a] hover:border-[#ff0000] cursor-pointer transition-colors"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-[#ff0000] mx-auto mb-2" />
                    <p className="text-sm">{thumbnail ? thumbnail.name : "Click to upload thumbnail"}</p>
                  </div>
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {uploadSuccess && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Song uploaded successfully!
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-[#ff0000] text-white py-3 rounded-lg font-semibold hover:bg-[#cc0000] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Song"
              )}
            </button>
          </form>
        </div>

        {/* Songs List */}
        <div className="bg-[#2a2a2a] p-6 md:p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-white mb-6">Uploaded Songs ({songs.length})</h2>
          <div className="space-y-4">
            {songs.map((song) => (
              <div
                key={song.id}
                className="bg-[#1a1a1a] p-4 rounded-lg flex items-center gap-4"
              >
                {song.thumbnail_url ? (
                  <img
                    src={song.thumbnail_url}
                    alt={song.song_name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-[#3a3a3a] rounded-lg flex items-center justify-center">
                    <Music className="w-8 h-8 text-[#ff0000]" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{song.song_name}</h3>
                  {song.artist && (
                    <p className="text-[rgba(255,255,255,0.64)] text-sm">{song.artist}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(song.id, song.song_url, song.thumbnail_url)}
                  className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            {songs.length === 0 && (
              <p className="text-[rgba(255,255,255,0.64)] text-center py-8">No songs uploaded yet</p>
            )}
          </div>
        </div>
          </>
        )}

        {/* News Tab */}
        {activeTab === "news" && (
          <>
            {/* News Upload Form */}
            <div className="bg-[#2a2a2a] p-6 md:p-8 rounded-xl mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Create News Update</h2>
              <form onSubmit={handleNewsUpload} className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Title *</label>
                  <input
                    type="text"
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    placeholder="Enter news title"
                    className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-[#ff0000]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Description (Optional)</label>
                  <textarea
                    value={newsDescription}
                    onChange={(e) => setNewsDescription(e.target.value)}
                    placeholder="Enter news description"
                    rows={3}
                    className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-[#ff0000] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Image (Optional)</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewsImage(e.target.files?.[0] || null)}
                      className="hidden"
                      id="news-image-file"
                    />
                    <label
                      htmlFor="news-image-file"
                      className="flex items-center justify-center w-full px-4 py-8 bg-[#1a1a1a] text-white rounded-lg border-2 border-dashed border-[#3a3a3a] hover:border-[#ff0000] cursor-pointer transition-colors"
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-[#ff0000] mx-auto mb-2" />
                        <p className="text-sm">{newsImage ? newsImage.name : "Click to upload image"}</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-2">Button Name (Optional)</label>
                    <input
                      type="text"
                      value={newsButtonName}
                      onChange={(e) => setNewsButtonName(e.target.value)}
                      placeholder="e.g., Learn More"
                      className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-[#ff0000]"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Button URL (Optional)</label>
                    <input
                      type="url"
                      value={newsButtonUrl}
                      onChange={(e) => setNewsButtonUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-[#ff0000]"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {uploadSuccess && (
                  <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    News created successfully!
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-[#ff0000] text-white py-3 rounded-lg font-semibold hover:bg-[#cc0000] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Create News
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* News List */}
            <div className="bg-[#2a2a2a] p-6 md:p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-white mb-6">News Updates ({news.length})</h2>
              <div className="space-y-4">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#1a1a1a] p-4 rounded-lg"
                  >
                    <div className="flex items-start gap-4">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                        {item.description && (
                          <p className="text-[rgba(255,255,255,0.64)] text-sm mb-2 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        {item.button_name && item.button_url && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[rgba(255,255,255,0.4)]">Button:</span>
                            <span className="text-xs bg-[#ff0000]/20 text-[#ff0000] px-2 py-1 rounded">
                              {item.button_name}
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteNews(item.id, item.image_url)}
                        className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors flex-shrink-0"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                {news.length === 0 && (
                  <p className="text-[rgba(255,255,255,0.64)] text-center py-8">No news updates yet</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Movies Tab */}
        {activeTab === "movies" && (
          <>
            {/* Movies Upload Form */}
            <div className="bg-[#2a2a2a] p-6 md:p-8 rounded-xl mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Upload New Movie</h2>
              <form onSubmit={handleMovieUpload} className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Movie Name *</label>
                  <input
                    type="text"
                    value={movieName}
                    onChange={(e) => setMovieName(e.target.value)}
                    placeholder="Enter movie name"
                    className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-[#ff0000]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Description (Optional)</label>
                  <textarea
                    value={movieDescription}
                    onChange={(e) => setMovieDescription(e.target.value)}
                    placeholder="Enter movie description"
                    rows={3}
                    className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-[#ff0000] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Movie File *</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setMovieFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="movie-file"
                    />
                    <label
                      htmlFor="movie-file"
                      className="flex items-center justify-center w-full px-4 py-8 bg-[#1a1a1a] text-white rounded-lg border-2 border-dashed border-[#3a3a3a] hover:border-[#ff0000] cursor-pointer transition-colors"
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-[#ff0000] mx-auto mb-2" />
                        <p className="text-sm">{movieFile ? movieFile.name : "Click to upload movie file"}</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2">Thumbnail (Optional)</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setMovieThumbnail(e.target.files?.[0] || null)}
                      className="hidden"
                      id="movie-thumbnail-file"
                    />
                    <label
                      htmlFor="movie-thumbnail-file"
                      className="flex items-center justify-center w-full px-4 py-8 bg-[#1a1a1a] text-white rounded-lg border-2 border-dashed border-[#3a3a3a] hover:border-[#ff0000] cursor-pointer transition-colors"
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-[#ff0000] mx-auto mb-2" />
                        <p className="text-sm">{movieThumbnail ? movieThumbnail.name : "Click to upload thumbnail"}</p>
                      </div>
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {uploadSuccess && (
                  <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Movie uploaded successfully!
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-[#ff0000] text-white py-3 rounded-lg font-semibold hover:bg-[#cc0000] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Upload Movie
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Movies List */}
            <div className="bg-[#2a2a2a] p-6 md:p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Uploaded Movies ({movies.length})</h2>
              <div className="space-y-4">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="bg-[#1a1a1a] p-4 rounded-lg flex items-center gap-4"
                  >
                    {movie.thumbnail_url ? (
                      <img
                        src={movie.thumbnail_url}
                        alt={movie.movie_name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-[#3a3a3a] rounded-lg flex items-center justify-center">
                        <Film className="w-8 h-8 text-[#ff0000]" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{movie.movie_name}</h3>
                      {movie.description && (
                        <p className="text-[rgba(255,255,255,0.64)] text-sm line-clamp-2">
                          {movie.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteMovie(movie.id, movie.video_url, movie.thumbnail_url)}
                      className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                {movies.length === 0 && (
                  <p className="text-[rgba(255,255,255,0.64)] text-center py-8">No movies uploaded yet</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Ads Tab */}
        {activeTab === "ads" && (
          <div className="bg-[#2a2a2a] p-6 md:p-8 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Ads Management</h2>
              <button
                onClick={() => router.push('/admin/ads')}
                className="px-4 py-2 bg-[#ff0000] text-white rounded-lg hover:bg-[#cc0000] transition-colors flex items-center gap-2"
              >
                <Megaphone className="w-5 h-5" />
                Manage Ads
              </button>
            </div>
            <div className="text-center py-12">
              <Megaphone className="w-16 h-16 text-[#ff0000] mx-auto mb-4" />
              <p className="text-[rgba(255,255,255,0.64)] mb-4">
                Manage your website advertisements and promotional content
              </p>
              <p className="text-[rgba(255,255,255,0.4)] text-sm mb-6">
                Create, edit, and organize ads that appear in the hero carousel on your homepage
              </p>
              <button
                onClick={() => router.push('/admin/ads')}
                className="px-6 py-3 bg-[#ff0000] text-white rounded-lg hover:bg-[#cc0000] transition-colors font-semibold"
              >
                Open Ads Manager
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
