/**
 * Image Upload Utility using Cloudinary
 */

export const uploadProductImage = async (file, productId) => {
  // Cloudinary configuration
  const cloudName = 'ds5u1pcll';
  const uploadPreset = 'art_shop_preset';

  // Validate image first
  validateImage(file);

  // Create form data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('cloud_name', cloudName);
  formData.append('folder', `products${productId ? `/${productId}` : ''}`); // Organize images in products folder

  try {
    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Cloudinary upload failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`Upload failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Return the secure URL of uploaded image
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

export const validateImage = (file) => {
  // Allowed image types
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  // Max file size: 5MB
  const maxSize = 5 * 1024 * 1024;

  // Check file type
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload JPG, PNG, or WebP images.');
  }

  // Check file size
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 5MB.');
  }

  return true;
};

// Optional: Delete image from Cloudinary (requires authentication)
// This would need backend implementation for security
export const deleteProductImage = async (imageUrl) => {
  // Note: Deleting from Cloudinary requires authenticated requests
  // For now, images will remain in Cloudinary even after product deletion
  // You can manually delete from Cloudinary dashboard or implement backend deletion
  console.log('Image deletion not implemented. Remove manually from Cloudinary dashboard:', imageUrl);
};