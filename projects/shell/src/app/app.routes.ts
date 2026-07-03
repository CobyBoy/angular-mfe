import { Routes } from '@angular/router';
import { getManifest } from '@angular-architects/module-federation';
import { CustomManifest } from './federation/manifest.types';
import { buildRoutes } from './federation/build-routes';

const manifest = getManifest<CustomManifest>();

export const routesFromManifest: Routes = manifest ? buildRoutes(manifest) : [];

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
     {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    },
    ...routesFromManifest,
   
];
