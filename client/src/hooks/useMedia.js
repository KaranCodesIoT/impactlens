import { useState, useEffect, useCallback } from 'react';
import { getProjectMedia, registerMedia, deleteMedia as apiDeleteMedia } from '../services/api.js';

export function useMedia(projectId) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMedia = useCallback(async (filters = {}) => {
    if (!projectId) return;
    try {
      setLoading(true);
      const data = await getProjectMedia(projectId, filters);
      setMedia(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const addMedia = async (cloudinaryData) => {
    const newMedia = await registerMedia(projectId, cloudinaryData);
    setMedia(prev => [newMedia, ...prev]);
    return newMedia;
  };

  const removeMedia = async (mediaId) => {
    await apiDeleteMedia(mediaId);
    setMedia(prev => prev.filter(m => m._id !== mediaId));
  };

  // Update a media item in the local state (e.g., after analysis completes)
  const updateMediaItem = (mediaId, updates) => {
    setMedia(prev => prev.map(m =>
      m._id === mediaId ? { ...m, ...updates } : m
    ));
  };

  return { media, loading, error, fetchMedia, addMedia, removeMedia, updateMediaItem };
}
