import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const { addItem } = useCart(user?.id);

  // Placeholder product data - in production, fetch from API
  const product = {
    id: id || '1',
    name: 'Strawberry + Peach Smoothie',
    price: 8.49,
    description: 'A delicious blend of strawberries and peaches with organic superfoods.',
    image_url: 'https://via.placeholder.com/500x500?text=Smoothie',
    ingredients: ['Strawberries', 'Peaches', 'Spinach', 'Protein Powder', 'Almond Milk'],
    nutrition: {
      calories: 180,
      protein: '12g',
      carbs: '24g',
      fat: '2g',
    },
  };

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/auth');
      return;
    }
    await addItem(product.id, 1);
    alert('Added to cart!');
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '60vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
            {/* Image */}
            <div>
              <img
                src={product.image_url}
                alt={product.name}
                style={{
                  width: '100%',
                  borderRadius: '4px',
                  background: '#f9f9f9',
                }}
              />
            </div>

            {/* Details */}
            <div>
              <h1 style={{ marginBottom: '16px' }}>{product.name}</h1>
              <p style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
                ${product.price}
              </p>

              <p style={{ marginBottom: '32px', lineHeight: '1.8' }}>
                {product.description}
              </p>

              <button
                onClick={handleAddToCart}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  background: '#000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '40px',
                  cursor: 'pointer',
                }}
              >
                Add to Cart
              </button>

              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Ingredients</h3>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {product.ingredients.map((ing, idx) => (
                    <li key={idx} style={{ marginBottom: '8px', color: '#666' }}>
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Nutrition Facts</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#999', fontSize: '14px' }}>Calories</p>
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '18px' }}>
                      {product.nutrition.calories}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#999', fontSize: '14px' }}>Protein</p>
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '18px' }}>
                      {product.nutrition.protein}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#999', fontSize: '14px' }}>Carbs</p>
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '18px' }}>
                      {product.nutrition.carbs}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#999', fontSize: '14px' }}>Fat</p>
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '18px' }}>
                      {product.nutrition.fat}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
