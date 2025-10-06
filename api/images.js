import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'bootyverse-gallery/',
      context: true,
      max_results: 50,
      direction: 'desc',
    });

    const images = result.resources.map(img => {
      // Construct optimized thumbnail URL
      const parts = img.secure_url.split('/upload/');
      const thumbnailUrl = `${parts[0]}/upload/w_600,q_auto,f_auto/${parts[1]}`;

      return {
        url: thumbnailUrl,              // optimized thumbnail
        full_url: img.secure_url,       // original for modal
        public_id: img.public_id,
        title: img.context?.custom?.title || 'Untitled',
        description: img.context?.custom?.description || '',
      };
    });

    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
}
