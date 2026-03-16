# HomePubv16

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Docker

Build and run with Docker Compose (backend must be reachable as `api:3000`):

```bash
docker compose up --build
```

For **Render** (or any host where the API is a separate service), set these at **build time**:

- In Render Dashboard: **Environment** → add **Build-time** variables:
  - `BACKEND_URL` = `https://homepub.onrender.com` (API base URL, no trailing slash)
  - `BACKEND_HOST` = `homepub.onrender.com` (backend hostname only; for HTTPS and Host header)
  - `APP_ORIGIN` = `https://your-frontend.onrender.com` (UI public URL for OAuth redirect; no trailing slash)
- Ensure the build passes them as Docker build args (e.g. build command: `docker build --build-arg BACKEND_URL=$BACKEND_URL --build-arg BACKEND_HOST=$BACKEND_HOST --build-arg APP_ORIGIN=$APP_ORIGIN -t app .`).

One image works for Compose and Render; only the build args differ.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
