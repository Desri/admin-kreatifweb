/**
 * Global image upload utility function
 * Uploads an image file to the server and returns the URL
 */
export async function uploadImage(file: File): Promise<string> {
  try {
    // Create FormData for image upload
    const formData = new FormData();
    formData.append('image', file);

    // Upload to the image endpoint
    const response = await fetch('https://api-kreatifweb.vercel.app/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const result = await response.json();
    return result.url; // Return the image URL
  } catch (error) {
    console.error('Image upload failed:', error);
    // Fallback: compress and convert to base64 (still not ideal but smaller)
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Compress to max 400px width for inline images
        const ratio = Math.min(400 / img.width, 400 / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob!);
        }, file.type, 0.5); // Lower quality for inline images
      };

      img.src = URL.createObjectURL(file);
    });
  }
}