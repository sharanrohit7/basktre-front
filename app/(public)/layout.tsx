import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PromoBar from "@/components/layout/PromoBar";

/**
 * Layout for public (marketing) pages — includes top Navbar and Footer.
 * Dashboard pages use their own layout with sidebar instead.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PromoBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
