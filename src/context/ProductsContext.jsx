import { createContext, useContext, useEffect, useState } from "react";
import { fetchProducts } from "../services/products";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");

const refreshProducts = async () => {
  console.log("REFRESH PRODUCTS: start");
  try {
    setLoadingProducts(true);
    setProductsError("");
    const data = await fetchProducts();
    console.log("REFRESH PRODUCTS: got", data);
    setProducts(data || []);
  } catch (e) {
    console.log("REFRESH PRODUCTS: error", e);
    setProductsError(e?.message ?? "Hiba a termékek betöltésénél");
  } finally {
    console.log("REFRESH PRODUCTS: finally");
    setLoadingProducts(false);
  }
};

  

  useEffect(() => {
    refreshProducts();
  }, []);

  return (
    <ProductsContext.Provider
      value={{ products, loadingProducts, productsError, refreshProducts }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => useContext(ProductsContext);
