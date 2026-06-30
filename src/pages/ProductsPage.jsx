import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, fetchCategories } from "../utils/api";
import ProductCard from "../components/ProductCard";
import { SearchOffIcon } from "../components/Icons";
import "./ProductsPage.css";

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A-Z" },
  { value: "name-desc", label: "Name: Z-A" },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categoryId = searchParams.get("categoryId");
  const search = searchParams.get("search");
  const LIMIT = 16;

  const fetchPage = useCallback(async (nextOffset, reset = false) => {
    if (reset) setLoading(true); else setLoadingMore(true);
    try {
      const data = await fetchProducts({ categoryId, limit: LIMIT, offset: nextOffset, title: search });
      if (reset) setProducts(data);
      else setProducts(prev => [...prev, ...data]);
      setHasMore(data.length === LIMIT);
      setOffset(nextOffset + LIMIT);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [categoryId, search]);

  const loadProducts = () => {
    fetchPage(offset, false);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => fetchPage(0, true), 0);
    return () => window.clearTimeout(timer);
  }, [categoryId, search, fetchPage]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  const sorted = [...products]
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name-asc") return a.title.localeCompare(b.title);
      if (sort === "name-desc") return b.title.localeCompare(a.title);
      return 0;
    });

  const activeCat = categories.find(c => String(c.id) === String(categoryId));

  return (
    <div className="products-page">
      <div className="container">
        <div className="breadcrumb">
          <button onClick={() => setSearchParams({})}>All Products</button>
          {activeCat && <><span>/</span><span>{activeCat.name}</span></>}
          {search && <><span>/</span><span>"{search}"</span></>}
        </div>

        <div className="icon"><SearchOffIcon /></div>

        <div className="page-layout">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            Filters {sidebarOpen ? "Hide" : "Show"}
          </button>

          <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <h3>Categories</h3>
            <ul className="cat-list">
              <li>
                <button className={!categoryId ? "active" : ""} onClick={() => setSearchParams({})}>
                  All Products
                </button>
              </li>
              {categories.map(c => (
                <li key={c.id}>
                  <button
                    className={String(c.id) === String(categoryId) ? "active" : ""}
                    onClick={() => setSearchParams({ categoryId: c.id })}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>

            <div className="divider" />
            <h3>Price Range</h3>
            <div className="price-range">
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], +e.target.value])}
              />
              <div className="price-labels">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </aside>

          <main className="products-main">
            <div className="products-toolbar">
              <p className="results-count">
                {loading ? "Loading..." : `${sorted.length} products`}
                {activeCat ? ` in ${activeCat.name}` : ""}
                {search ? ` for "${search}"` : ""}
              </p>
              <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {loading ? (
              <div className="grid">
                {Array(8).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 340, borderRadius: 20 }} />)}
              </div>
            ) : sorted.length === 0 ? (
              <div className="empty-state">
                <div className="icon">No results</div>
                <h3>No products found</h3>
                <p>Try a different search term or category.</p>
                <button className="btn btn-primary" onClick={() => setSearchParams({})}>Clear filters</button>
              </div>
            ) : (
              <>
                <div className="grid">
                  {sorted.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                </div>
                {hasMore && !loading && (
                  <div className="load-more">
                    <button className="btn btn-secondary" onClick={() => loadProducts()} disabled={loadingMore}>
                      {loadingMore ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />Loading...</> : "Load More Products"}
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
