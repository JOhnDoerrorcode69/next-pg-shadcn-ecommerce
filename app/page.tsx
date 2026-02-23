import Link from "next/link";

export default function AppRouterPlaceholder() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ marginBottom: "0.75rem" }}>Bharat Krishi Mitra</h1>
        <p style={{ marginBottom: "1rem" }}>
          Pages router is active for this project.
        </p>
        <Link href="/home">Go to Home</Link>
      </div>
    </main>
  );
}
