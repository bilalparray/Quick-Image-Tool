import { Routes } from '@angular/router';
import { ConverterComponent } from './converter/converter.component';

export const routes: Routes = [
  { path: '', redirectTo: 'converter', pathMatch: 'full' },
  { path: 'converter', component: ConverterComponent },
  { path: '**', redirectTo: 'home' },
];
