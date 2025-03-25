import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface ProcessedImage {
  originalFile: File;
  name: string;
  url?: string;
  processing: boolean;
}

@Component({
    selector: 'app-converter',
    templateUrl: './converter.component.html',
    styleUrls: ['./converter.component.scss'],
    imports: [CommonModule, FormsModule]
})
export class ConverterComponent {
  selectedImages: File[] = [];
  outputFormat: string = 'image/png'; // Default to PNG

  // Array to hold each file's processing status and data
  processedImages: ProcessedImage[] = [];

  // Available formats with user-friendly names
  availableFormats = [
    { value: 'image/bmp', label: 'BMP' },
    { value: 'image/eps', label: 'EPS' },
    { value: 'image/gif', label: 'GIF' },
    { value: 'image/ico', label: 'ICO' },
    { value: 'image/jpeg', label: 'JPEG' },
    { value: 'image/jpg', label: 'JPG' },
    { value: 'image/odd', label: 'ODD' },
    { value: 'image/png', label: 'PNG' },
    { value: 'image/psd', label: 'PSD' },
    { value: 'image/svg+xml', label: 'SVG' },
    { value: 'image/tga', label: 'TGA' },
    { value: 'image/tiff', label: 'TIFF' },
    { value: 'image/webp', label: 'WebP' },
  ];

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImages = Array.from(input.files);
      // Reset processed images
      this.processedImages = [];
    }
  }

  convertImages(): void {
    if (this.selectedImages.length === 0) {
      alert('Please select at least one image.');
      return;
    }

    // Initialize processedImages with placeholders
    this.processedImages = this.selectedImages.map((file) => {
      const nameParts = file.name.split('.');
      const baseName =
        nameParts.length > 1 ? nameParts.slice(0, -1).join('.') : file.name;
      const newExtension = this.outputFormat.split('/')[1];
      return {
        originalFile: file,
        name: `${baseName}.${newExtension}`,
        processing: true,
      };
    });

    // Process each file
    this.selectedImages.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            alert('Error creating canvas context.');
            return;
          }
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const convertedImage = canvas.toDataURL(this.outputFormat);
          // Update processed image entry
          this.processedImages[index].url = convertedImage;
          this.processedImages[index].processing = false;
        };
      };
      reader.readAsDataURL(file);
    });
  }

  downloadZip(): void {
    const zip = new JSZip();
    const imgFolder = zip.folder('images');

    // Only add images that have finished processing
    this.processedImages.forEach((item) => {
      if (!item.processing && item.url) {
        const base64Data = item.url.split(',')[1];
        imgFolder?.file(item.name, base64Data, { base64: true });
      }
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'converted_images.zip');
    });
  }

  downloadBlob(dataUrl: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    link.click();
  }

  // Helper method to truncate long file names while preserving the extension.
  getTruncatedFileName(fileName: string, maxLength: number = 15): string {
    const dotIndex = fileName.lastIndexOf('.');
    if (dotIndex === -1) return fileName; // No extension found
    const baseName = fileName.substring(0, dotIndex);
    const extension = fileName.substring(dotIndex);
    if (baseName.length > maxLength) {
      return baseName.substring(0, maxLength) + '...' + extension;
    }
    return fileName;
  }
}
