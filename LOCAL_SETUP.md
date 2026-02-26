# Local Setup Instructions - Consumer UI Redesign

## 1. Fetch & Checkout Branch

Open your terminal in the `bkm-zishop-frontend` directory and run:

```bash
git fetch origin
git checkout feature/consumer-ui-redesign
```

## 2. Install Dependencies

Ensure you have all the necessary packages installed, including the new UI components:

```bash
pnpm install
```

## 3. Run Development Server

Start the Next.js frontend:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## 4. Backend Integration (Optional)

To test the live data connection:

1. Ensure your Spring Boot backend is running on port `8080`.
2. The frontend will automatically try to fetch products from `http://localhost:8080/api/products`.
3. If the backend is not running, the frontend will seamlessly fallback to the mock data defined in `lib/fallback-data.ts`.

## 5. Verification Steps

1. **Home Page**: Navigate to `/`. You should see the "Lush Farm Green" background, the 5-image hero slider, the 3 pillars section, and featured products.
2. **All Products**: Click on "All Products" or any category pillar. Verify the glassmorphic grid and pill filters.
3. **Navbar/Footer**: Check the fixed glassmorphic navbar and footer.
