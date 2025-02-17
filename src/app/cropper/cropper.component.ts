import { Component } from '@angular/core';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.scss'],
  standalone: true,
  imports: [ImageCropperComponent, FormsModule, CommonModule]
})
export class CropperComponent {
  // File input event data
  imageChangedEvent: any = '';
  // Holds the resulting cropped image (as a Base64 string)
  croppedImage: string | null = null;

  // Predefined crop sizes with labels
  presetCropSizes = [
    { width: 200, height: 200, label: '200 x 200' },
    { width: 300, height: 300, label: '300 x 300' },
    { width: 400, height: 400, label: '400 x 400' }
  ];

  // Currently selected preset; if null, custom size is used
  selectedPreset: any = null;
  // Aspect ratio (updates with preset selection or custom input)
  aspectRatio: number = 4 / 3;
  // Whether to maintain the aspect ratio (passed to the cropper)
  maintainAspectRatio: boolean = true;
  // Zoom level for scaling the image
  zoomLevel: number = 1;
  // Rotation angle (in degrees)
  rotation: number = 0;
  // Custom size inputs (when no preset is selected)
  customWidth: number = 0;
  customHeight: number = 0;

  // Triggered when the user selects a file
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  // Receives the cropped image result
  imageCropped(event: ImageCroppedEvent): void {
    console.log('Cropped event:', event);
    if (event.blob) {
      // Convert the Blob to Base64 for display
      this.convertBlobToBase64(event.blob).then((base64: string) => {
        this.croppedImage = base64;
        console.log('Converted base64:', base64);
      });
    } else if (event.objectUrl) {
      // Fallback: if Blob isn't available, use the objectUrl directly
      this.croppedImage = event.objectUrl;
    }
  }

  // Set a preset size or switch to custom mode
  setPresetSize(size: any): void {
    if (size) {
      this.selectedPreset = size;
      this.aspectRatio = size.width / size.height;
    } else {
      this.selectedPreset = null;
      // Use custom dimensions if set, or fall back to default
      if (this.customWidth && this.customHeight) {
        this.aspectRatio = this.customWidth / this.customHeight;
      } else {
        this.aspectRatio = 4 / 3;
      }
    }
  }

  // Update aspect ratio when custom dimensions change
  onCustomSizeChange(): void {
    if (!this.selectedPreset && this.customWidth && this.customHeight) {
      this.aspectRatio = this.customWidth / this.customHeight;
    }
  }

  // Rotate the image left by 90 degrees
  onRotateLeft(): void {
    this.rotation = (this.rotation - 90) % 360;
  }

  // Rotate the image right by 90 degrees
  onRotateRight(): void {
    this.rotation = (this.rotation + 90) % 360;
  }

  // Optional event handlers for additional feedback
  cropperReady(): void {
    console.log('Cropper ready');
  }

  loadImageFailed(): void {
    console.error('Failed to load image');
  }

  imageLoaded(image: LoadedImage): void {
    console.log('Image loaded', image);
  }

  // Convert a Blob to a Base64 string using FileReader
  private convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  downloadImage(format: 'png' | 'jpeg' | 'webp'): void {
    if (!this.croppedImage) {
      console.error('No image to download');
      return;
    }
  
    // Convert base64 to Blob
    const base64Data = this.croppedImage.split(',')[1]; // Remove the Base64 header
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
  
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
  
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: `image/${format}` });
  
    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `cropped-image.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
}
