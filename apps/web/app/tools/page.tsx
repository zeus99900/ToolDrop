import { Search } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToolCard from '@/components/listings/ToolCard';
import ToolsSearchFilters from '@/components/listings/ToolsSearchFilters';
import ToolsClient from '@/components/tools/ToolsClient';
import { getListings, getCategories } from '@/lib/data';

interface ToolsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';
  const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : '';
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : 'relevance';
  const lat = typeof resolvedParams.lat === 'string' ? parseFloat(resolvedParams.lat) : undefined;
  const lng = typeof resolvedParams.lng === 'string' ? parseFloat(resolvedParams.lng) : undefined;

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
