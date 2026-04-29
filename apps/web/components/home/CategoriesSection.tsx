import CategoryCard from '@/components/listings/CategoryCard';
import { getCategories } from '@/lib/data';

export default async function CategoriesSection() {
  const categories = await getCategories();
  
  return (
    <section className="py-20 bg-white" id="categories-section">
      <div className="section-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            From power tools to plumbing, find exactly what you need for your next project.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.map((cat: { slug: string; name: string; iconName?: string; _count?: { listings: number } }, index: number) => (
            <CategoryCard
              key={cat.slug}
              name={cat.name}
              slug={cat.slug}
              iconName={cat.iconName || 'wrench'}
              count={cat._count?.listings || 0}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
