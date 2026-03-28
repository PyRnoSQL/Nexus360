const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const uploadDir = path.join(__dirname, '../../uploads');

class UploadService {
  // Ensure upload directory exists
  static ensureUploadDir() {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  }
  
  // Save and optimize photo
  static async savePhoto(file, incidentId) {
    try {
      this.ensureUploadDir();
      
      // Generate unique filename
      const timestamp = Date.now();
      const extension = path.extname(file.originalname);
      const filename = `${incidentId}-${timestamp}${extension}`;
      const filepath = path.join(uploadDir, filename);
      
      // Optimize image with sharp
      await sharp(file.buffer)
        .resize(1200, 1200, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .jpeg({ quality: 80, progressive: true })
        .toFile(filepath);
      
      return {
        success: true,
        filename: filename,
        path: `/uploads/${filename}`,
        size: file.size,
        optimized_size: fs.statSync(filepath).size
      };
    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message,
        path: null
      };
    }
  }
  
  // Delete photo
  static async deletePhoto(filename) {
    try {
      const filepath = path.join(uploadDir, filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        return { success: true };
      }
      return { success: false, error: 'File not found' };
    } catch (error) {
      console.error('Delete error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get photo info
  static async getPhotoInfo(filename) {
    try {
      const filepath = path.join(uploadDir, filename);
      if (fs.existsSync(filepath)) {
        const stats = fs.statSync(filepath);
        return {
          success: true,
          filename: filename,
          size: stats.size,
          created: stats.birthtime,
          path: `/uploads/${filename}`
        };
      }
      return { success: false, error: 'File not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = UploadService;
