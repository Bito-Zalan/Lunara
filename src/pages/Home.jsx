import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";

function Home({ products }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

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
          <div className="badge">
            <span className="badge-icon" aria-hidden="true" />
            Gyors szállítás
          </div>
          <div className="badge">
            <span className="badge-icon" aria-hidden="true" />
            Biztonságos vásárlás
          </div>
          <div className="badge">
            <span className="badge-icon" aria-hidden="true" />
            Prémium minőség
          </div>
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

        <div className="products-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>
    </main>
  );
}

export default Home;




