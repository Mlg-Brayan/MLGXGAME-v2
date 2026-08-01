'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Globe, Monitor, Smartphone, AppWindow, LayoutTemplate, ShoppingBag } from 'lucide-react';
import { sortByPreference, trackCategoryClick } from '@/lib/trackInteraction';

const icons = {
  globe: Globe,
  monitor: Monitor,
  smartphone: Smartphone,
  appwindow: AppWindow,
  template: LayoutTemplate,
  shop: ShoppingBag,
};

type Item = {
  id: number;
  title: string;
  slug: string;
  image_url: string;
  category?: string;
};

export default function CategoryShowcase({
  title,
  items,
  itemHrefPrefix,
  seeMoreHref,
  iconName,
  accentColor,
}: {
  title: string;
  items: Item[];
  itemHrefPrefix: string;
  seeMoreHref: string;
  iconName: keyof typeof icons;
  accentColor: string;
}) {
  const [sortedItems, setSortedItems] = useState(items);
  const [activeIndex, setActiveIndex] = useState(0);
  const [bannerIndex, setBannerIndex] = useState(0);
  const Icon = icons[iconName];

  useEffect(() => {
    setSortedItems(sortByPreference(items));
  }, [items]);

  const displayItems = sortedItems.slice(0, 4);

  useEffect(() => {
    if (displayItems.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % displayItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [displayItems.length]);

  useEffect(() => {
    if (displayItems.length <= 1) return;
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % displayItems.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [displayItems.length]);

  if (displayItems.length === 0) return null;

  return (
    <section className="category-showcase" style={{ borderLeft: `3px solid ${accentColor}` }}>
      <div className="showcase-title-row">
        <Icon className="showcase-title-icon" style={{ color: accentColor }} strokeWidth={2} />
        <h2>{title}</h2>
      </div>

      <div className="showcase-layout">
        <div className="showcase-small-grid">
          {displayItems.map((item) => (
            <Link
              key={item.id}
              href={`${itemHrefPrefix}/${item.slug}`}
              className="showcase-card"
              onClick={() => item.category && trackCategoryClick(item.category)}
            >
              <div className="showcase-card-image">
                <Image src={item.image_url} alt={item.title} fill sizes="200px" />
              </div>
              <span className="showcase-card-title">{item.title}</span>
            </Link>
          ))}
        </div>

        <Link href={seeMoreHref} className="showcase-big-card">
          {displayItems.map((item, index) => (
            <Image
              key={item.id}
              src={item.image_url}
              alt={item.title}
              fill
              sizes="400px"
              className="showcase-big-image"
              style={{ opacity: index === activeIndex ? 1 : 0 }}
            />
          ))}
          <div className="showcase-big-overlay" style={{ background: `linear-gradient(to top, ${accentColor}CC, transparent 70%)` }}>
            <span>Voir plus</span>
          </div>
        </Link>
      </div>

      <Link href={seeMoreHref} className="showcase-banner">
        {displayItems.map((item, index) => (
          <Image
            key={item.id}
            src={item.image_url}
            alt={item.title}
            fill
            sizes="1200px"
            className="showcase-banner-image"
            style={{ opacity: index === bannerIndex ? 1 : 0 }}
          />
        ))}
        <div className="showcase-banner-overlay" style={{ background: `linear-gradient(90deg, ${accentColor}DD, transparent 80%)` }}>
          <span className="showcase-banner-text">Voir plus de {title.toLowerCase()}</span>
        </div>
      </Link>
    </section>
  );
}