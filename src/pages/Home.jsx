import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import { useProducts } from "../context/ProductsContext";

function Home() {
  const { products, loadingProducts, productsError } = useProducts();

  return (
    <main>
      <section className="hero-compact">
        <div className="hero-compact-inner">
          <div className="hero-text">
            <h1>Lunara</h1>
            <p>Minőségi termékek elérhető áron. Válogass a kedvenceid közül!</p>
          </div>

          <a className="hero-cta" href="#termekek">
            Vásárlás
          </a>
        </div>

        <div className="hero-badges">
          <div className="badge">Gyors szállítás</div>
          <div className="badge">Biztonságos vásárlás</div>
          <div className="badge">Prémium minőség</div>
        </div>
      </section>

      <section className="products-section" id="termekek">
        <div className="products-topbar">
          <div className="category-chips">
            <button className="chip active">Összes</button>
            <button className="chip">Makeup</button>
            <button className="chip">Beauty</button>
            <button className="chip">Ajándékcsomag</button>
          </div>
        </div>

        {productsError && <p style={{ color: "crimson" }}>{productsError}</p>}

        <div className="products-grid">
          {loadingProducts
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </main>
  );
}

export default Home;






