import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../lib/firebase';

/**
 * Upload image to Firebase Storage
 * @param {File} file - Image file
 * @param {string} productId - Product ID for organizing images
 * @returns {Promise<string>} - Download URL of uploaded image
 */
export const uploadProductImage = async (file, productId) => {
  if (!file) throw new Error('No file provided');

  // Create unique filename
  const timestamp = Date.now();
  const filename = `${timestamp}-${file.name}`;
  const storageRef = ref(storage, `products/${productId}/${filename}`);

  try {
    // Upload file
    await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Delete image from Firebase Storage
 * @param {string} imageUrl - Full URL of image to delete
 */
export const deleteProductImage = async (imageUrl) => {
  try {
    // Extract path from URL
    const urlParts = imageUrl.split('/o/');
    if (urlParts.length < 2) return;
    
    const pathPart = urlParts[1].split('?')[0];
    const path = decodeURIComponent(pathPart);
    
    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw - image might already be deleted
  }
};

/**
 * Validate image file
 * @param {File} file - Image file to validate
 * @returns {Object} - {valid: boolean, error: string}
 */
export const validateImage = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, and WebP images are allowed' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Image must be less than 5MB' };
  }

  return { valid: true, error: null };
};