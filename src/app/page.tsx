import HeroSlider from "@/components/HeroSlider";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedGems from "@/components/FeaturedGems";
import ShopByShape from "@/components/ShopByShape";
import ShopByColor from "@/components/ShopByColor";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <CategoryGrid />
      <FeaturedGems />
      <ShopByShape />
      <ShopByColor />
      <CTASection />
    </>
  );
}
