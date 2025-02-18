import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { saveAs } from 'file-saver';
import JSZip from 'jszip';

interface ImageData {
  file: File;
  preview: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-resizer',
  templateUrl: './resizer.component.html',
  styleUrls: ['./resizer.component.scss'],
  imports: [FormsModule, CommonModule],
  standalone: true,
})
export class ResizerComponent {
  // Array to hold the original uploaded images
  uploadedImages: ImageData[] = [];
  // Array to hold the resized images after processing
  resizedImages: ImageData[] = [];
  maintainAspectRatio: boolean = true;

  // Global width and height values for resizing
  globalWidth: number | null = null;
  globalHeight: number | null = null;
  showAlert = false;
  // Flags for controlling UI state
  showResizedImages: boolean = false;
  isLoading: boolean = false;
  closeAlert() {
    this.showAlert = false;
  }
  onFileSelected(event: Event): void {
    // Clear previous images and results
    this.uploadedImages = [];
    this.resizedImages = [];
    this.showResizedImages = false;
    const input = event.target as HTMLInputElement;
    if (input?.files) {
      Array.from(input.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const img = new Image();
          img.src = e.target.result;
          img.onload = () => {
            this.uploadedImages.push({
              file: file,
              preview: e.target.result,
              width: img.width,
              height: img.height,
            });
          };
        };
        reader.readAsDataURL(file);
      });
    }
  }

  applyDimensions(): void {
    if (this.globalWidth || this.globalHeight) {
      // Clear previous results and show the results container
      this.resizedImages = [];
      this.isLoading = true;
      this.showResizedImages = true;

      let processed = 0;
      // Process each image asynchronously to simulate a loading delay
      this.uploadedImages.forEach((image, index) => {
        setTimeout(() => {
          let newWidth = image.width;
          let newHeight = image.height;
          if (this.maintainAspectRatio) {
            const aspectRatio = image.width / image.height;
            if (this.globalWidth) {
              newWidth = this.globalWidth;
              newHeight = Math.round(this.globalWidth / aspectRatio);
            } else if (this.globalHeight) {
              newHeight = this.globalHeight;
              newWidth = Math.round(this.globalHeight * aspectRatio);
            }
          } else {
            newWidth = this.globalWidth || image.width;
            newHeight = this.globalHeight || image.height;
          }
          this.resizedImages.push({
            file: image.file,
            preview: image.preview,
            width: newWidth,
            height: newHeight,
          });
          processed++;

          // When all images are processed, hide the loader and scroll to the results
          if (processed === this.uploadedImages.length) {
            this.isLoading = false;
            setTimeout(() => {
              const resultsEl = document.getElementById('resized-results');
              if (resultsEl) {
                resultsEl.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
          }
        }, index * 200); // 200ms delay for each image (adjust as needed)
      });
    }
  }

  downloadResizedImage(index: number): void {
    const image = this.resizedImages[index];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    if (ctx) {
      img.src = image.preview;
      img.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(img, 0, 0, image.width, image.height);

        const link = document.createElement('a');
        link.download = image.file.name;
        link.href = canvas.toDataURL('image/jpeg');
        link.click();
      };
    }
  }

  downloadAllResized(): void {
    // Trigger individual downloads (may be blocked for large numbers)
    this.resizedImages.forEach((_, index) => this.downloadResizedImage(index));
  }

  downloadAllAsZip(): void {
    const zip = new JSZip();
    const imgFolder = zip.folder("resized_images");

    // Create an array of promises to ensure all images are processed before zipping
    const promises = this.resizedImages.map((image) => {
      return new Promise<void>((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = image.preview;
        img.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;
          ctx!.drawImage(img, 0, 0, image.width, image.height);
          const dataUrl = canvas.toDataURL('image/jpeg');
          // Remove the data URL prefix (e.g. "data:image/jpeg;base64,")
          const base64Data = dataUrl.split(',')[1];
          imgFolder?.file(image.file.name, base64Data, { base64: true });
          resolve();
        };
      });
    });

    Promise.all(promises).then(() => {
      zip.generateAsync({ type: 'blob' }).then((content:any) => {
        saveAs(content, 'resized_images.zip');
      });
    });
  }
}
