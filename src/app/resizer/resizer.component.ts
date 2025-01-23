import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resizer',
  templateUrl: './resizer.component.html',
  styleUrls: ['./resizer.component.scss'],
  imports: [FormsModule, CommonModule],
  standalone: true,
})
export class ResizerComponent {
  images: { file: File; preview: string; width: number; height: number }[] = [];
  maintainAspectRatio: boolean = true;

  // Single width and height values for all images
  globalWidth: number | null = null;
  globalHeight: number | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files) {
      Array.from(input.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const img = new Image();
          img.src = e.target.result;
          img.onload = () => {
            this.images.push({
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
      this.images = this.images.map((image) => {
        if (this.maintainAspectRatio) {
          const aspectRatio = image.width / image.height;
          if (this.globalWidth) {
            return {
              ...image,
              width: this.globalWidth,
              height: Math.round(this.globalWidth / aspectRatio),
            };
          } else if (this.globalHeight) {
            return {
              ...image,
              height: this.globalHeight,
              width: Math.round(this.globalHeight * aspectRatio),
            };
          }
        } else {
          return {
            ...image,
            width: this.globalWidth || image.width,
            height: this.globalHeight || image.height,
          };
        }
        return image;
      });
    }
  }

  downloadImage(index: number): void {
    const image = this.images[index];
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
        link.download = `resized-${image.file.name}`;
        link.href = canvas.toDataURL('image/jpeg');
        link.click();
      };
    }
  }

  downloadAll(): void {
    this.images.forEach((_, index) => this.downloadImage(index));
  }
}
