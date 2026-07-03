# Clase 1: Creación del Host y del Remote
Objetivo

Crear un entorno de aprendizaje para entender Webpack Module Federation con Angular 18, sin preocuparnos todavía por manifests, backend o múltiples repositorios.

¿Por qué usamos un Workspace?

Aunque en producción cada microfrontend suele vivir en su propio repositorio, usamos un workspace porque:

Compartimos una única instalación de dependencias (node_modules).
Todos los proyectos usan la misma versión de Angular.
Nos permite concentrarnos en aprender Module Federation sin agregar complejidad.

Importante: Module Federation funciona perfectamente con proyectos independientes. El workspace fue una decisión didáctica.

¿Qué hace ng add @angular-architects/module-federation?

El schematic transforma una aplicación Angular normal en una aplicación preparada para usar Webpack Module Federation.

Los cambios más importantes fueron:

Cambiar el builder a Webpack.
Crear webpack.config.js.
Crear webpack.prod.config.js.
Separar el bootstrap en un nuevo archivo (bootstrap.ts).
Modificar main.ts.
¿Por qué aparece bootstrap.ts?

Antes:

main.ts
    ↓
Angular arranca inmediatamente

Ahora:

main.ts
    ↓
Webpack inicializa Module Federation
    ↓
bootstrap.ts
    ↓
Angular arranca

La separación no es por Angular, sino para darle tiempo al runtime de Webpack a inicializar Module Federation antes de arrancar la aplicación.

¿Qué hace el webpack.config.js del Host?

El Host configura:

dónde encontrar cada Remote (remotes);
qué dependencias compartir (shared).

Ejemplo:

remotes: {
  products: "http://localhost:4201/remoteEntry.js"
}

Cuando el Host necesite el microfrontend products, descargará ese remoteEntry.js.

¿Qué significa shared?

El objetivo es evitar cargar varias copias de una misma librería.

Sin shared:

Shell
└── Angular

Products
└── Angular

El navegador terminaría ejecutando dos instancias de Angular.

Con:

singleton: true

solo existirá una instancia compartida.

¿Por qué existe strictVersion?

Module Federation negocia versiones entre aplicaciones.

Con:

strictVersion: true

si las versiones no son compatibles, la aplicación falla durante la inicialización en lugar de generar errores difíciles de detectar en tiempo de ejecución.

shareAll()

shareAll() es una configuración conveniente para comenzar.

En proyectos reales suele reemplazarse por una lista explícita de librerías compartidas, normalmente:

@angular/core
@angular/common
@angular/router
rxjs

# Clase 2 - Host y Remote funcionando

## El schematic también modifica `angular.json`

Además de crear archivos nuevos, configura el servidor de desarrollo.

Ejemplo:

json
"port": 4201,
"publicHost": "http://localhost:4201",
"extraWebpackConfig": "projects/products/webpack.config.js"


# Clase 3 - El Host inicia la comunicación

## Existen dos formas de localizar un Remote

### Configuración estática

El Host conoce los Remotes desde `webpack.config.js`.

js
remotes: {
  products: "products@http://localhost:4201/remoteEntry.js"
}

Luego puede referirse al Remote por su nombre.

Configuración dinámica

El Host recibe directamente la URL del remoteEntry.js.

remoteEntry: "http://localhost:4201/remoteEntry.js"

En este caso no necesita conocer previamente el nombre del Remote.

# Clase 4 - Primera comunicación entre Host y Remote

## Primer microfrontend funcionando

El Shell puede renderizar un componente que pertenece a otra aplicación.

Flujo:

Router
    ↓
loadRemoteModule()
    ↓
remoteEntry.js
    ↓
Webpack obtiene el componente
    ↓
Angular lo renderiza

## Angular no descarga el Remote

El runtime de Webpack es el encargado de:

- descargar `remoteEntry.js`;
- localizar el módulo expuesto;
- devolver el objeto exportado.

Angular solamente renderiza el componente recibido.

## El Shell sigue existiendo

Cuando se carga un microfrontend, el Shell no desaparece.

El Shell normalmente mantiene:

- layout;
- navegación;
- autenticación;
- router principal.

Los microfrontends ocupan únicamente una parte de la pantalla.

Clase 5
# Clase 5 - ¿Por qué existe un manifest?

## Problema

El Host conoce las URLs de los Remotes.

Ejemplo:

ts
remoteEntry: "http://localhost:4201/remoteEntry.js"

Si cambia la ubicación del Remote, es necesario modificar y volver a desplegar el Host.

Objetivo del manifest

Desacoplar el Host de las URLs reales.

En lugar de conocer:

la URL del Remote,

el Host solo conoce:

el nombre del microfrontend.

Luego consulta un manifest que le indica dónde se encuentra.

# Clase 7 - ¿Cuándo cargar el manifest?

## Dos estrategias

### Leer el manifest en cada navegación

Desventajas:

- Un request por navegación.
- Mayor latencia.
- Dependencia constante del servidor del manifest.
- Se descarga repetidamente la misma información.

### Cargar el manifest al iniciar la aplicación

Ventajas:

- Un único request.
- El manifest queda disponible en memoria.
- La navegación es inmediata.
- El Shell conoce todos los Remotes antes de comenzar a navegar.

## Principio de diseño

El manifest representa la configuración de la aplicación, no datos del usuario.

Por lo tanto, tiene sentido cargarlo durante la inicialización y reutilizarlo durante toda la vida de la aplicación.

# Clase 8 - El manifest registrado en memoria

## Dos conceptos diferentes

### Manifest físico

Es un archivo JSON (o una respuesta HTTP) que contiene la ubicación de los remotes.

### Manifest registrado

Una vez obtenido el JSON, se registra en la librería mediante:

ts
setManifest(...)
A partir de ese momento:

getManifest()

devuelve el contenido desde memoria, sin realizar nuevas peticiones HTTP.

Ventaja

loadRemoteModule() puede resolver automáticamente el remoteEntry usando el nombre del Remote (remoteName), sin necesidad de indicar la URL en cada ruta.

# Clase 9
# Clase 9 - ¿Cuándo cargar el manifest?

Después de revisar una implementación real y verificar el orden de ejecución, la estrategia más limpia es:

main.ts
    ↓
fetch(manifest)
    ↓
setManifest()
    ↓
bootstrap Angular

## Ventajas

- Angular inicia con el manifest ya disponible.
- `app.routes.ts` puede construir las rutas dinámicamente durante la inicialización.
- No es necesario modificar el Router con `resetConfig()`.
- No es necesario volver a solicitar el manifest durante la vida de la aplicación.

## Rol de `checkManifest()`

En la implementación analizada, `checkManifest()` actúa como un mecanismo de recuperación (fallback). En el flujo normal no realiza ninguna acción, ya que el manifest ya fue cargado antes del bootstrap.

# Clase 10
# Clase 10 - Exponer rutas en lugar de componentes

En aplicaciones Angular standalone, es común que un microfrontend exponga su configuración de rutas (`Routes`) en lugar de un componente.

## Antes

Shell → AppComponent

El Shell conoce el componente que implementa el microfrontend.

## Después

Shell → Routes

El Shell solo monta las rutas del microfrontend.

El propio microfrontend decide qué componentes, rutas hijas, guards y resolvers utiliza internamente.

## Ventajas

- Mayor encapsulamiento.
- El Shell no depende de la estructura interna del microfrontend.
- Permite que el microfrontend crezca sin modificar el Shell.
- Facilita la organización de rutas complejas dentro de cada microfrontend.

# Clase 11 
# Shared dependencies

`shared` evita que cada microfrontend cargue su propia copia de una dependencia.

Sin `shared`:

Shell → Angular
Products → Angular

Con `shared`:

Shell ─┐
        ├── Angular (una única instancia)
Products┘

## ¿Qué conviene compartir?

Compartir dependencias que representen infraestructura o estado:

- @angular/core
- @angular/common
- @angular/router
- rxjs
- librerías propias con servicios (Auth, Design System, etc.)

No es necesario compartir utilidades puras (por ejemplo, lodash o date-fns) salvo que exista una razón específica.

## Evitar `shareAll()`

`shareAll()` es útil para comenzar o prototipar, pero en proyectos reales es preferible declarar explícitamente las dependencias compartidas para tener un mayor control sobre la arquitectura.