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

  updateDimensions(
    index: number,
    event: Event,
    dimension: 'width' | 'height'
  ): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      const newValue = parseInt(input.value, 10);
      const image = this.images[index];
      if (this.maintainAspectRatio) {
        const aspectRatio = image.width / image.height;
        if (dimension === 'width') {
          image.width = newValue;
          image.height = Math.round(newValue / aspectRatio);
        } else if (dimension === 'height') {
          image.height = newValue;
          image.width = Math.round(newValue * aspectRatio);
        }
      } else {
        if (dimension === 'width') {
          image.width = newValue;
        } else if (dimension === 'height') {
          image.height = newValue;
        }
      }
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
