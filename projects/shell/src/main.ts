import { setManifest } from '@angular-architects/module-federation';
import { environment } from './app/core/environments/environment';

const manifestUrl = environment.addresses.getManifest;

fetch(manifestUrl)
  .then((response) => (response.status === 401 ? [] : response.json()))
  .then((data) => {
	console.log('Manifest data:', data);
    setManifest(data, true);
  })
  .catch((error) => console.error('Error fetching manifest:', error))
  .finally(() => import('./bootstrap').catch((error) => console.error(error)));