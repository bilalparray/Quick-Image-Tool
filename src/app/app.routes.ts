import { Routes } from '@angular/router';
import { ConverterComponent } from './converter/converter.component';
import { HomeComponent } from './home/home.component';
import { ResizerComponent } from './resizer/resizer.component';
import { Base64Component } from './base64/base64.component';
import { CropperComponent } from './cropper/cropper.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'converter', component: ConverterComponent },
  { path: 'resizer', component: ResizerComponent },
  { path: 'base64', component: Base64Component },
  { path: 'cropper', component: CropperComponent },
  { path: '**', redirectTo: '' },
];
