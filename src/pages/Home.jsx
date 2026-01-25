import ProductCard from '../components/ProductCard';

function Home({ products }) {
  return (
    <main>
      <h1></h1>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  )
}

export default Home;

