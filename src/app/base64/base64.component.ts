import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-base64',
    imports: [CommonModule, FormsModule],
    templateUrl: './base64.component.html',
    styleUrls: ['./base64.component.scss']
})
export class Base64Component {
  base64Image: string = '';
  convertedImageSrc: string = '';
  message: string = '';
  messageType: 'error' | 'success' | '' = '';
  isLoadingImage: boolean = false; // Flag to track if a new image is loading

  // Utility method to set messages (and auto-clear them after 3 seconds)
  private setMessage(msg: string, type: 'error' | 'success'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 3000);
  }

  // Convert the selected image to Base64
  async onFileSelected(event: any): Promise<void> {
    try {
      const file: File = event.target.files[0];
      if (!file) {
        this.setMessage('No file selected.', 'error');
        return;
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.setMessage('Selected file is not an image.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.base64Image = reader.result as string;
        this.setMessage('Image converted to Base64 successfully!', 'success');
      };
      reader.onerror = () => {
        this.setMessage('Error reading the file. Please try again.', 'error');
      };
    } catch (error) {
      console.error(error);
      this.setMessage(
        'Unexpected error occurred while processing the file.',
        'error'
      );
    }
  }

  // Copy Base64 string to the clipboard
  copyToClipboard(copyFullString: boolean): void {
    const base64Data = this.base64Image || '';
    if (!base64Data) {
      this.setMessage('No Base64 data available to copy.', 'error');
      return;
    }

    let textToCopy = base64Data;
    if (!copyFullString && base64Data.startsWith('data:image/')) {
      textToCopy = base64Data.split(',')[1];
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(
        () =>
          this.setMessage(
            copyFullString
              ? 'Full Base64 string copied!'
              : 'Base64 data copied!',
            'success'
          ),
        () => this.setMessage('Failed to copy to clipboard.', 'error')
      );
    } else {
      let tempTextarea: HTMLTextAreaElement | null = null;
      try {
        tempTextarea = document.createElement('textarea');
        tempTextarea.value = textToCopy;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        document.execCommand('copy');
        this.setMessage(
          copyFullString ? 'Full Base64 string copied!' : 'Base64 data copied!',
          'success'
        );
      } catch (err) {
        this.setMessage('Failed to copy to clipboard.', 'error');
      } finally {
        if (tempTextarea) {
          document.body.removeChild(tempTextarea);
        }
      }
    }
  }

  // Render Base64 string as an image using actual image events
  renderBase64AsImage(): void {
    if (!this.base64Image) {
      this.setMessage('Please provide a valid Base64 string.', 'error');
      return;
    }

    // Construct a valid data URL: if the string already has a valid prefix, use it; otherwise, default to JPEG
    const dataUrlPattern = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
    let dataUrl = this.base64Image;
    if (!dataUrlPattern.test(this.base64Image)) {
      dataUrl = 'data:image/jpeg;base64,' + this.base64Image;
    }
    // Set the loading flag before rendering the image
    this.isLoadingImage = true;
    // Assign the data URL to trigger the image loading in the template
    this.convertedImageSrc = dataUrl;
  }

  // Called when the rendered image loads successfully
  onImageLoad(): void {
    if (this.isLoadingImage) {
      this.setMessage('Image rendered successfully!', 'success');
      this.isLoadingImage = false;
    }
  }

  // Called when the rendered image fails to load
  onImageLoadError(): void {
    if (this.isLoadingImage) {
      this.setMessage(
        'Failed to load the rendered image. Check the Base64 string.',
        'error'
      );
      // Clear the image source to avoid displaying a broken image icon
      this.convertedImageSrc = '';
      this.isLoadingImage = false;
    }
  }
}
