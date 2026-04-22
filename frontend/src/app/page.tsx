import { apiGetProducts } from '@/lib/api';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import { Product } from '@/types';

export const revalidate = 60;

export default async function HomePage() {
  let products: Product[] = [];
  try {
    products = await apiGetProducts();
  } catch {
    // graceful degradation — render without products
  }

  return (
    <>
      <HeroSection />
      <FeaturedProducts products={products} />
    </>
  );
}
