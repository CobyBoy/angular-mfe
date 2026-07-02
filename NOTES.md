Clase 1: Creación del Host y del Remote
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