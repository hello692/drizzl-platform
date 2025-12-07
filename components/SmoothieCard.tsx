import Link from 'next/link';

interface SmoothieCardProps {
  id: string;
  name: string;
  image: string;
  badge?: string;
  price?: number;
  showPrice?: boolean;
}

export default function SmoothieCard({ 
  id, 
  name, 
  image, 
  badge = 'BEST SELLER',
  price,
  showPrice = false 
}: SmoothieCardProps) {
  const badgeColor = badge === 'New' || badge === 'NEW' ? '#22c55e' : '#E85A71';
  
  return (
    <Link href={`/products/${id}`} className="smoothie-card">
      <div className="smoothie-card-header">
        <p className="smoothie-card-badge" style={{ color: badgeColor }}>
          {badge}
        </p>
        <h3 className="smoothie-card-name">
          {name}
        </h3>
        <p className="smoothie-card-subtitle">
          Smoothie
          {showPrice && price && (
            <span className="smoothie-card-price"> · ${price.toFixed(2)}</span>
          )}
        </p>
      </div>
      <div className="smoothie-card-image-container">
        <img
          src={image}
          alt={name}
          className="smoothie-card-image"
          draggable={false}
        />
      </div>
    </Link>
  );
}
