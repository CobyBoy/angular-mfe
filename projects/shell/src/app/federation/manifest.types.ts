import { RemoteConfig } from "@angular-architects/module-federation";

export type ManifestEntry = RemoteConfig & {
  remoteEntry: string;
  exposedModule: string;
  routePath: string;
  exportName: string;
}

export type CustomManifest = Record<string, ManifestEntry>;