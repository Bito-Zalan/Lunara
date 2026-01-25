import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="category">{product.category}</p>
      <p className="description">{product.description}</p>
      <p className="price">
        {product.price.toLocaleString("hu-HU")} Ft
      </p>

      <button onClick={() => addToCart(product)}>
        Kosárba
      </button>
    </div>
  );
}

export default ProductCard;
