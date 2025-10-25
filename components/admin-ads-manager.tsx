'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, Ad, addCacheBuster } from '@/lib/supabase'
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, Save, X } from 'lucide-react'

interface AdFormData {
  title: string
  description: string
  image_url: string
  link_url: string
  button_text: string
  is_active: boolean
  display_order: number
}

export default function AdminAdsManager() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState<AdFormData>({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    button_text: '',
    is_active: true,
    display_order: 0
  })

  const fetchAds = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
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

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `ad-${Date.now()}.${fileExt}`
      const filePath = `ads/${fileName}`

      // Try 'images' bucket first, then 'thumbnails' as fallback
      let uploadError: any = null
      let bucketName = 'images'
      
      const { error: imagesError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (imagesError) {
        // Try thumbnails bucket as fallback
        const { error: thumbnailsError } = await supabase.storage
          .from('thumbnails')
          .upload(filePath, file)
        
        if (thumbnailsError) {
          throw new Error(`Storage upload failed. Please ensure you have an 'images' or 'thumbnails' bucket in Supabase Storage.`)
        }
        bucketName = 'thumbnails'
      }

      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, image_url: data.publicUrl }))
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(`Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingAd) {
        const { error } = await supabase
          .from('ads')
          .update(formData)
          .eq('id', editingAd.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('ads')
          .insert([formData])

        if (error) throw error
      }

      await fetchAds()
      resetForm()
      alert(editingAd ? 'Ad updated successfully!' : 'Ad created successfully!')
    } catch (error) {
      console.error('Error saving ad:', error)
      alert('Error saving ad')
    }
  }

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad)
    setFormData({
      title: ad.title,
      description: ad.description || '',
      image_url: ad.image_url,
      link_url: ad.link_url || '',
      button_text: ad.button_text || '',
      is_active: ad.is_active,
      display_order: ad.display_order
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return

    try {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchAds()
      alert('Ad deleted successfully!')
    } catch (error) {
      console.error('Error deleting ad:', error)
      alert('Error deleting ad')
    }
  }

  const toggleActive = async (ad: Ad) => {
    try {
      const { error } = await supabase
        .from('ads')
        .update({ is_active: !ad.is_active })
        .eq('id', ad.id)

      if (error) throw error
      await fetchAds()
    } catch (error) {
      console.error('Error updating ad status:', error)
      alert('Error updating ad status')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      link_url: '',
      button_text: '',
      is_active: true,
      display_order: ads.length
    })
    setEditingAd(null)
    setShowForm(false)
  }

  if (loading) {
    return <div className="p-8 text-center">Loading ads...</div>
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ads Manager</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add New Ad
        </button>
      </div>

      {/* Ad Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingAd ? 'Edit Ad' : 'Create New Ad'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded-lg h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image *</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file)
                    }}
                    className="w-full p-2 border rounded-lg"
                    disabled={uploading}
                  />
                  {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
                  {formData.image_url && (
                    <img
                      src={addCacheBuster(formData.image_url)}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Link URL</label>
                <input
                  type="url"
                  value={formData.link_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Button Text</label>
                <input
                  type="text"
                  value={formData.button_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Learn More"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
                  className="w-full p-2 border rounded-lg"
                  min="0"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium">Active</label>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={uploading || !formData.title || !formData.image_url}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={20} />
                  {editingAd ? 'Update' : 'Create'} Ad
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ads List */}
      <div className="grid gap-6">
        {ads.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No ads found. Create your first ad to get started.
          </div>
        ) : (
          ads.map((ad) => (
            <div key={ad.id} className="bg-white rounded-lg shadow-md p-6 border">
              <div className="flex gap-4">
                <img
                  src={addCacheBuster(ad.image_url)}
                  alt={ad.title}
                  className="w-32 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{ad.title}</h3>
                      {ad.description && (
                        <p className="text-gray-600 mt-1">{ad.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Order: {ad.display_order}</span>
                        {ad.link_url && <span>Has Link</span>}
                        {ad.button_text && <span>Button: {ad.button_text}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleActive(ad)}
                        className={`p-2 rounded-lg ${
                          ad.is_active
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={ad.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {ad.is_active ? <Eye size={20} /> : <EyeOff size={20} />}
                      </button>
                      <button
                        onClick={() => handleEdit(ad)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                        title="Edit"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(ad.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}