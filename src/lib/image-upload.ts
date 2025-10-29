/**
 * Global image upload utility function
 * Uploads an image file to the server and returns the URL
 */
export async function uploadImage(file: File): Promise<string> {
  try {
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 5MB. Please compress your image.');
    }

    // Create FormData for image upload
    const formData = new FormData();
    formData.append('image', file);

    // Upload to the image endpoint
    const response = await fetch('https://api-kreatifweb.vercel.app/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      // Check if endpoint doesn't exist
      if (response.status === 404) {
        throw new Error('Upload endpoint not found. Please configure the /api/upload endpoint on your backend server.');
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to upload image (Status: ${response.status})`);
    }

    const result = await response.json();

    if (!result.url) {
      throw new Error('Image upload did not return a URL');
    }

    return result.url; // Return the image URL
  } catch (error) {
    console.error('Image upload failed:', error);

    // Show user-friendly error message
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';

    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      alert(`Network Error: Cannot connect to upload server.\n\nPlease check your internet connection.`);
    } else {
      alert(`Image Upload Error: ${errorMessage}\n\nPlease contact support or try again later.`);
    }

    // Don't use base64 fallback - throw the error instead
    throw error;
  }
}