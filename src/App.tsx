import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { PoliciesModal } from './components/PoliciesModal';
import { Footer } from './components/Footer';
import rawProducts from './data/products.json';
import { Product, CartItem } from './types/store';
import { storeConfig } from './config/store';
import { MessageCircle } from 'lucide-react';

export function App() {
  const products: Product[] = rawProducts as Product[];

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);
  const [activePolicyTab, setActivePolicyTab] = useState<'returns' | 'shipping' | 'terms' | 'privacy'>('returns');
  const [orderData, setOrderData] = useState<any>(null);

  // Extract categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [products]);

  // Extract brands
  const brands = useMemo(() => {
    const brs = new Set<string>();
    products.forEach((p) => {
      if (p.brand && p.brand !== 'None' && p.brand !== 'أصلي') brs.add(p.brand);
    });
    return Array.from(brs);
  }, [products]);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchBrand = selectedBrand === 'all' || p.brand === selectedBrand;
      const matchQuery = !searchQuery || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchBrand && matchQuery;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });
  }, [products, selectedCategory, selectedBrand, searchQuery, sortBy]);

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOpenPolicies = (tab: 'returns' | 'shipping' | 'terms' | 'privacy') => {
    setActivePolicyTab(tab);
    setIsPoliciesOpen(true);
  };

  const handleOrderSuccess = (data: any) => {
    setOrderData(data);
    setCart([]);
    setIsCheckoutOpen(false);
    setIsSuccessOpen(true);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0a120c] text-slate-100 flex flex-col font-sans">
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenPolicies={handleOpenPolicies}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <Hero
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
        brands={brands}
        productsCount={products.length}
      />

      <Features />

      {/* Main Catalog Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>{selectedCategory === 'all' ? 'جميع قطع الغيار ومستلزمات السيارات' : selectedCategory}</span>
              {selectedBrand !== 'all' && (
                <span className="text-xs bg-[#3d7a46]/30 text-emerald-300 px-2.5 py-1 rounded-full border border-[#3d7a46]/50">
                  ماركة: {selectedBrand}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              عرض {filteredProducts.length} قطعة متوفرة للشحن الفوري
            </p>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">ترتيب حسب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#132216] border border-[#3d7a46]/40 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#4ea259] font-bold"
            >
              <option value="featured">المميز والأكثر طلباً</option>
              <option value="price-low">السعر: من الأقل للأعلى</option>
              <option value="price-high">السعر: من الأعلى للأقل</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#132216] border border-[#3d7a46]/30 rounded-3xl p-12 text-center text-slate-400">
            <p className="text-base font-bold text-slate-200 mb-2">لم يتم العثور على قطع غيار تطابق بحثك</p>
            <p className="text-xs text-slate-500 mb-4">جرب البحث بكلمات أخرى أو اختر فئة/ماركة مختلفة من القائمة أعلاه</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedBrand('all');
              }}
              className="bg-gradient-to-r from-[#3d7a46] to-[#2e5c35] text-white font-bold text-xs px-5 py-2.5 rounded-xl border border-[#4ea259]/40 shadow-lg shadow-[#3d7a46]/30"
            >
              إعادة تعيين البحث
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={setSelectedProduct}
                onAddToCart={(p) => handleAddToCart(p, 1)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer onOpenPolicies={handleOpenPolicies} />

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent('السلام عليكم، أريد الاستفسار عن توفر قطع غيار لسيارتي')}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 left-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 hover:scale-110 transition transform border-2 border-white/20"
        title="تواصل مع الدعم الفني عبر واتساب"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="hidden sm:inline text-xs font-bold">تواصل معنا</span>
      </a>

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderSuccessModal
        orderData={orderData}
        onClose={() => setIsSuccessOpen(false)}
      />

      <PoliciesModal
        isOpen={isPoliciesOpen}
        onClose={() => setIsPoliciesOpen(false)}
        activeTab={activePolicyTab}
        setActiveTab={setActivePolicyTab}
      />
    </div>
  );
}

export default App;
