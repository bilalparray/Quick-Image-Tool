import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';

const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'base64',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'converter',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'resizer',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'cropper',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];

export default serverRoutes;
