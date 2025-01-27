import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-base64',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './base64.component.html',
  styleUrl: './base64.component.scss',
})
export class Base64Component {
  base64Image: string = '';
  convertedImageSrc: string = '';

  // Function to convert the selected image to Base64
  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.base64Image = reader.result as string; // Store Base64 string
    };
  }

  // Function to copy Base64 string to the clipboard
  copyToClipboard() {
    if (this.base64Image) {
      navigator.clipboard.writeText(this.base64Image).then(
        () => alert('Base64 string copied to clipboard!'),
        (err) => alert('Failed to copy: ' + err)
      );
    }
  }

  // Function to render Base64 back into an image
  renderBase64AsImage() {
    if (this.base64Image) {
      this.convertedImageSrc = this.base64Image; // Use the Base64 string as the image source
    } else {
      alert('Please provide a valid Base64 string.');
    }
  }
}
