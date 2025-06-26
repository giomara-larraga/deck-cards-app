# Deck of Cards Trade-Off (DECATOF) method

This project is a Svelte application for the DECATOF method. Users can drag and drop items to rank them, calculate weights, and visually assess trade-offs between different ranks using dot charts, donut (pie) charts, and heatmaps.

## Features

- **Drag-and-drop ranking:** Arrange items into ranked groups using an intuitive board interface.
- **Weight assignment:** Visualize normalized weights for each rank.
- **Trade-off analysis:** Select groups to improve or impair and explore the impact using interactive charts.
- **Visualizations:** Includes dot charts for rank overview, donut charts for weight distribution, and heatmaps for trade-off intensity.

## How to use this app

1. **Clone the repository:**

   ```bash
   git clone https://github.com/giomara-larraga/deck-cards-app.git
   cd deck-cards-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   # or start the server and open the app in a new browser tab
   npm run dev -- --open
   ```

4. **Use the app:**
   - Drag and drop cards to rank them.
   - Select one group to improve and one to impair and explore trade-offs using the provided charts.

## Building

To create a production version of the app:

```bash
npm run build
```

You can preview the production build with:

```bash
npm run preview
```

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
