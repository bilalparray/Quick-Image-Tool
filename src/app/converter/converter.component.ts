import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ConverterComponent {
  selectedImages: File[] = [];
  outputFormat: string = 'image/png'; // Default to PNG
  convertedImageData: { url: string; name: string }[] = [];

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
      this.convertedImageData = []; // Reset converted images
    }
  }

  convertImages(): void {
    if (this.selectedImages.length === 0) {
      alert('Please select at least one image.');
      return;
    }

    this.selectedImages.forEach((image, index) => {
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
          const fileName = `converted-image-${index + 1}.${
            this.outputFormat.split('/')[1]
          }`;
          this.convertedImageData.push({ url: convertedImage, name: fileName });
        };
      };

      reader.readAsDataURL(image);
    });
  }

  downloadAllFiles(): void {
    this.convertedImageData.forEach((file) => {
      this.downloadBlob(file.url, file.name);
    });
  }

  downloadBlob(dataUrl: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    link.click();
  }
}
