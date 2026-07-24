'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUp } from 'lucide-react';
import { getTopCategories, trackCategoryClick } from '@/lib/trackInteraction';

type Item = {
  id: number;
  title: string;
  slug: string;
  image_url: string;
  category: string;
  is_free?: boolean;
  price?: number;
};

export default function CategoryListingPage({
  items,
  itemHrefPrefix,
  pageTitle,
}: {
  items: Item[];
  itemHrefPrefix: string;
  pageTitle: string;
}) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [orderedCategories, setOrderedCategories] = useState<string[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const allCategories = Array.from(new Set(items.map((i) => i.category))).filter(Boolean);

  useEffect(() => {
    const preferred = getTopCategories(allCategories.length);
    const rest = allCategories.filter((c) => !preferred.includes(c));
    setOrderedCategories([...preferred.filter((c) => allCategories.includes(c)), ...rest]);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCategory = (category: string) => {
    setActiveFilter(category);
    sectionRefs.current[category]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const categoriesToShow = orderedCategories.length > 0 ? orderedCategories : allCategories;

  const renderBadge = (item: Item) => {
  if (item.is_free === false) {
    return <span className="price-badge price-badge-paid">Payant</span>;
  }
  return <span className="price-badge price-badge-free">Gratuit</span>;
};

  return (
    <div style={{ padding: '32px clamp(16px, 4vw, 48px)' }}>
      <nav className="breadcrumb">
        <Link href="/">Accueil</Link>
        <span>/</span>
        <span>{pageTitle}</span>
      </nav>

      <h1>{pageTitle}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
        {items.length} résultat{items.length > 1 ? 's' : ''}
      </p>

      {allCategories.length > 1 && (
        <div className="filter-chips">
          {categoriesToShow.map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${activeFilter === cat ? 'filter-chip-active' : ''}`}
              onClick={() => scrollToCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {categoriesToShow.map((category) => {
        const categoryItems = items.filter((i) => i.category === category);
        if (categoryItems.length === 0) return null;

        const [featured, ...rest] = categoryItems;

        return (
          <div
            key={category}
            ref={(el) => { sectionRefs.current[category] = el; }}
            className="category-group"
          >
            <h2>{category}</h2>
            <div className="mixed-grid">
              <Link
                href={`${itemHrefPrefix}/${featured.slug}`}
                className="featured-card"
                onClick={() => trackCategoryClick(featured.category)}
              >
                <Image src={featured.image_url} alt={featured.title} fill sizes="500px" />
                <div className="featured-card-overlay">
                  {renderBadge(featured)}
                  <span className="featured-card-title">{featured.title}</span>
                </div>
              </Link>

              <div className="small-cards-grid">
                {rest.map((item) => (
                  <Link
                    key={item.id}
                    href={`${itemHrefPrefix}/${item.slug}`}
                    className="showcase-card"
                    onClick={() => trackCategoryClick(item.category)}
                  >
                    <div className="showcase-card-image">
                      <Image src={item.image_url} alt={item.title} fill sizes="200px" />
                      <div className="showcase-card-badge">{renderBadge(item)}</div>
                    </div>
                    <span className="showcase-card-title">{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {showBackToTop && (
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Retour en haut"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}