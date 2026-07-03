const { share, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'products',

  exposes: {
    //'./Component': './projects/products/src/app/app.component.ts',
    './Routes': './projects/products/src/app/app.routes.ts',
  },

  shared: share({
  '@angular/core': {
    singleton: true,
    strictVersion: true,
    requiredVersion: 'auto',
  },
  '@angular/common': {
    singleton: true,
    strictVersion: true,
    requiredVersion: 'auto',
  },
  '@angular/router': {
    singleton: true,
    strictVersion: true,
    requiredVersion: 'auto',
  },
  rxjs: {
    singleton: true,
    strictVersion: true,
    requiredVersion: 'auto',
  },
})

});
