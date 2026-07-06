# Angular Micro Frontends Playground

A reference project for experimenting with **Micro Frontend architectures** using **Angular** and **Webpack Module Federation**.

This repository contains a Shell application and multiple independent Micro Frontends used to validate architectural decisions, runtime behavior, integration strategies, dependency sharing, and cross-framework interoperability.

## Features

- Angular Shell (Host)
- Angular Remote
- Webpack Module Federation
- Dynamic remote loading
- Manifest-based remote configuration
- Dynamic route generation
- Standalone component exposure
- Shared dependency configuration
- Browser API communication (`CustomEvent`, `BroadcastChannel`, `postMessage`)

## Project Structure

```text
projects/
├── shell/        # Host application
└── products/     # Remote application
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the Shell:

```bash
ng serve shell
```

Run the Angular Remote:

```bash
ng serve products
```

Or run all configured applications:

```bash
npm run run:all
```

## Technologies

- Angular 18
- Webpack Module Federation
- TypeScript