# Local Setup Instructions for Consumer UI Redesign

Follow these steps to set up the redesigned Consumer UI (Liquid Glass Theme) on your local machine.

## Prerequisites
- Node.js (v18 or higher recommended)
- `pnpm` (Package Manager)
- Local Spring Boot Backend running on port 8080 (optional but recommended for full testing)

## 1. Fetch and Checkout the Branch

Open your terminal in the project root and run:

```bash
git fetch origin
git checkout feature/consumer-ui-redesign
```

## 2. Install Dependencies

Install the new dependencies required for the redesign (including `embla-carousel-autoplay`):

```bash
pnpm install
```

## 3. Start the Development Server

Run the Next.js development server:

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 4. Backend Connection (Optional)

The frontend is configured to attempt to fetch products from your local Spring Boot backend at `http://localhost:8080/api/products`.

- **If your Spring Boot server is running:** The frontend will display live data from your backend.
- **If your Spring Boot server is NOT running:** The frontend will automatically fallback to the mock data (demo products and images), so the UI will still be fully functional and populated.

## 5. Verification

1.  **Home Page:** Navigate to `/` to see the new "Lush Farm Green" background, the Hero Carousel, the "3 Pillars" section, and the Featured Products grid.
2.  **All Products:** Navigate to `/all` (or click "View All") to see the full product catalog with pill-shaped category filters.
3.  **Responsiveness:** Resize your browser window to verify the mobile layout and navigation menu.

## Troubleshooting

-   **Images not loading?** Ensure your internet connection is active, as the project uses images from Unsplash.
-   **Build errors?** Try running `pnpm run build` to check for any TypeScript or linting issues locally.
