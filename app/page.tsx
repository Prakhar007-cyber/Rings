import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import Gold from "@/components/sections/Gold";
import Diamond from "@/components/sections/Diamond";
import Craft from "@/components/sections/Craft";
import Collection from "@/components/sections/Collection";
import Moment from "@/components/sections/Moment";
import Finale from "@/components/sections/Finale";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <Navbar />
      <main>
        <Hero />
        <Gold />
        <Diamond />
        <Craft />
        <Collection />
        <Moment />
        <Finale />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
