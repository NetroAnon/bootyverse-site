import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { data, title, description } = req.body; // image + meta
      const uploadResponse = await cloudinary.uploader.upload(data, {
        upload_preset: 'ml_default',
        context: {
          title: title,
          description: description,
        },
      });

      res.status(200).json({
        url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
        title,
        description,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Upload failed' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
