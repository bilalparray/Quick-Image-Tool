import { Routes } from '@angular/router';
import { ConverterComponent } from './converter/converter.component';
import { HomeComponent } from './home/home.component';
import { ResizerComponent } from './resizer/resizer.component';
import { Base64Component } from './base64/base64.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'converter', component: ConverterComponent },
  { path: 'resizer', component: ResizerComponent },
  { path: 'base64', component: Base64Component },
  { path: '**', redirectTo: 'home' },
];
