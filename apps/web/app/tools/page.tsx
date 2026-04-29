import { Search } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToolCard from '@/components/listings/ToolCard';
import ToolsSearchFilters from '@/components/listings/ToolsSearchFilters';
import ToolsClient from '@/components/tools/ToolsClient';
import { getListings, getCategories } from '@/lib/data';

interface ToolsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  // Await the searchParams object (Next.js 15+ requirement/good practice)
  const query = typeof searchParams.q === 'string' ? searchParams.q : '';
  const category = typeof searchParams.category === 'string' ? searchParams.category : '';
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'relevance';
  const lat = typeof searchParams.lat === 'string' ? parseFloat(searchParams.lat) : undefined;
  const lng = typeof searchParams.lng === 'string' ? parseFloat(searchParams.lng) : undefined;

  const [listings, categories] = await Promise.all([
    getListings({ 
      query, 
      category, 
      sort, 
      userLat: lat, 
      userLng: lng 
    }),
    getCategories()
  ]);

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50/50">
        <div className="section-padding py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-dark-900 mb-2">Browse Tools</h1>
            <p className="text-gray-500">Find the perfect tool for your next project</p>
          </div>

          <ToolsSearchFilters categories={categories} />

          <ToolsClient 
            listings={listings} 
            userCoordinates={lat && lng ? { lat, lng } : undefined} 
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
