import { getImageThunk } from '@/store/slices/imageSlice';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function useUserImages(userId) {
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const dispatch = useDispatch();
  const imagesData = useSelector((state) => state.image?.images || []);

  useEffect(() => {
    if (imagesData.length > 0) {
      const formatted = imagesData.map((img) => ({
        id: img.original_name,
        date: new Date(img.created_at).toLocaleDateString(),
        total: formatFileSize(img.s3_key),
        status: 'Completed',
        signed_url: img.signed_url,
        s3_key: img.s3_key,
      }));
      setImages(formatted);
    }
  }, [imagesData]);

  const fetchImages = useCallback(async () => {
    if (!userId || imagesData.length > 0) return;

    setLoadingImages(true);
    try {
      await dispatch(getImageThunk(userId)).unwrap();
    } catch (error) {
    } finally {
      setLoadingImages(false);
    }
  }, [userId, dispatch, imagesData.length]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return { images, loadingImages, fetchImages };
}

function formatFileSize(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'png':
    case 'jpg':
    case 'jpeg':
      return '200 KB';
    case 'pdf':
      return '1 MB';
    default:
      return 'N/A';
  }
}
