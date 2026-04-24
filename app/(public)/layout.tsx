import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/**
 * Layout for public (marketing) pages — includes top Navbar and Footer.
 * Dashboard pages use their own layout with sidebar instead.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-14">{children}</main>
      <Footer />
    </>
  );
}
