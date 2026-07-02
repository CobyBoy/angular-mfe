import { RemoteConfig } from "@angular-architects/module-federation";

export type ExposedType = 'component' | 'routes';

export type ManifestEntry = RemoteConfig & {
  remoteEntry: string;
  exposedModule: string;
  routePath: string;
  exportName: string;
  exposedType: ExposedType;
}

export type CustomManifest = Record<string, ManifestEntry>;