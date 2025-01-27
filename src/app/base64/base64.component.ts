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
  copyToClipboard(copyFullString: boolean): void {
    const base64Data = this.base64Image || '';
    let textToCopy = base64Data;

    // Extract only the Base64 part if needed
    if (!copyFullString && base64Data.startsWith('data:image/')) {
      textToCopy = base64Data.split(',')[1]; // Extract only the Base64 part
    }

    // Check if the Clipboard API is supported
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(
        () =>
          alert(
            copyFullString
              ? 'Full Base64 string copied!'
              : 'Base64 data copied!'
          ),
        () => alert('Failed to copy to clipboard!')
      );
    } else {
      // Fallback: Create a temporary textarea for copying
      const tempTextarea = document.createElement('textarea');
      tempTextarea.value = textToCopy;
      document.body.appendChild(tempTextarea);
      tempTextarea.select();
      try {
        document.execCommand('copy');
        alert(
          copyFullString ? 'Full Base64 string copied!' : 'Base64 data copied!'
        );
      } catch (err) {
        alert('Failed to copy to clipboard!');
      } finally {
        document.body.removeChild(tempTextarea);
      }
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
