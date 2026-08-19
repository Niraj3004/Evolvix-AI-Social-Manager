import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import cloudinary from '../config/cloudinary';

export class TemplateService {
  private templatesDir = path.join(__dirname, '../templates');

  async renderAndUpload(topic: string, caption: string, brandColor: string, brandName: string, backgroundImageUrl?: string): Promise<string> {
    try {
      // 1. Load the template
      const templateName = backgroundImageUrl ? 'social-post-image.svg' : 'social-post.svg';
      const templatePath = path.join(this.templatesDir, templateName);
      let svgContent = fs.readFileSync(templatePath, 'utf-8');

      // If background image is provided, fetch it and convert to base64
      let backgroundB64 = '';
      if (backgroundImageUrl) {
        const response = await fetch(backgroundImageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = response.headers.get('content-type') || 'image/jpeg';
        backgroundB64 = `data:${mimeType};base64,${buffer.toString('base64')}`;
      }

      // 2. Escape special characters
      const safeCaption = caption.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const safeTopic = topic.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const safeBrandName = brandName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      // 3. Replace variables
      svgContent = svgContent
        .replace(/{{BRAND_COLOR}}/g, brandColor || '#3b82f6')
        .replace(/{{TOPIC}}/g, safeTopic.substring(0, 25).toUpperCase()) 
        .replace(/{{CAPTION}}/g, safeCaption)
        .replace(/{{BRAND_NAME}}/g, safeBrandName);

      if (backgroundImageUrl) {
        svgContent = svgContent.replace(/{{BACKGROUND_B64}}/g, backgroundB64);
      }

      // 4. Render to PNG buffer using sharp
      const pngBuffer = await sharp(Buffer.from(svgContent))
        .png()
        .toBuffer();

      // 5. Upload to Cloudinary using a Promise wrapper
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'evolvix/templates' },
          (error, result) => {
            if (error) return reject(error);
            if (result) return resolve(result.secure_url);
            reject(new Error('Upload failed with no result'));
          }
        );
        uploadStream.end(pngBuffer);
      });
    } catch (error) {
      console.error('[TemplateService] Failed to render and upload template:', error);
      throw error;
    }
  }
}

export const templateService = new TemplateService();
