import { Routes } from '@angular/router';
import { ConverterComponent } from './converter/converter.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'converter', pathMatch: 'full' },
  { path: 'converter', component: ConverterComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: 'home' },
];
