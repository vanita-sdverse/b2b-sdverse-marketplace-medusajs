import { Hero } from "@/components/Hero"
import { CategoryGrid } from "@/components/CategoryGrid"
import { TrustSection } from "@/components/TrustSection"
import {ProductCollectionSection} from "@/components/ProductCollectionSection";

export default function HomePage() {
  return (
    <div>
        <Hero/>
        <ProductCollectionSection title="Recommended Products" key="recommended-products"/>
        <ProductCollectionSection title="Featured Products" key="featured-products"/>
        <ProductCollectionSection title="Recently Viewed Products" key="recently-viewed-products"/>
        <CategoryGrid/>
        <TrustSection/>
    </div>
  )
}
