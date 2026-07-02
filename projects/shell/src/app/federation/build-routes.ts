import { Routes } from '@angular/router';
import { CustomManifest } from './manifest.types';
import { loadRemoteModule } from '@angular-architects/module-federation';

export function buildRoutes(manifest: CustomManifest): Routes {
  if (!manifest || Object.keys(manifest).length === 0) {
    return [];
  }
  return Object.keys(manifest).map((mfe) => {
    const entry = manifest[mfe];
    return {
      path: entry.routePath,
      loadComponent: () => {
        console.log('Loading remote module for route:', entry.routePath);
        return loadRemoteModule({
          type: 'manifest',
          remoteName: mfe,
          //remoteEntry: entry.remoteEntry NO, el plugin ya lo resuelve
          exposedModule: entry.exposedModule,
        }).then((m) => m[entry.exportName]);
      },
    };
  });
}
