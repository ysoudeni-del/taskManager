# Copilot instructions

## Project structure

- This is a client-side React 18 app built with Vite. `src/main.jsx` mounts the app and provides the React Router `RouterProvider`.
- `src/router/Router.jsx` defines routes. `src/App.jsx` is the shared layout and renders child routes through `Outlet`; the home route renders `src/components/Home.jsx`, which hosts the task UI in `src/components/Task.jsx`. Route errors use `src/pages/ErrorPage.jsx`.
- Task state, CRUD actions, search, sorting, and persistence currently live together in `Task.jsx`. Tasks are stored in browser `localStorage` under the `tasks` key; keep task creation and updates consistent with the existing task fields (`id`, `text`, `completed`, `createdAt`, `priority`, `timestamp`).
- Styling is primarily Tailwind utility classes in JSX. `src/index.css` loads Tailwind layers; `tailwind.config.js` scans `index.html` and `src`.

## Commands

- `npm run dev` — start the Vite development server.
- `npm run build` — create a production build in `dist`.
- `npm run preview` — serve the production build locally.
- `npm run lint` — lint the project with ESLint.
- There is no configured test script, test runner, or existing test suite, so there is no single-test command.

## Conventions

- Use the existing React function-component and hooks patterns in `.jsx` files; the project uses ES modules.
- Keep task filtering and sorting derived from the task list rather than storing a second copy of the displayed list.
- Task priority values are `high`, `medium`, and `low`; keep these values consistent across task data, sorting, and the priority selector.
- Use React Router for navigation and route-level error handling rather than adding a separate routing mechanism.
