import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { BrandsSection } from './components/BrandsSection';
import { CarSection, CircularModel } from './components/CarSection';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { PoliciesModal } from './components/PoliciesModal';
import { MenuDrawer } from './components/MenuDrawer';
import { Footer } from './components/Footer';
import rawProducts from './data/products.json';
import rawBrands from './data/brands.json';
import { ProductCard } from './components/ProductCard';
import { Product, CartItem } from './types/store';
import { storeConfig } from './config/store';

export function App() {
  const products: Product[] = rawProducts as Product[];
  const brands: any[] = rawBrands;

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);
  const [activePolicyTab, setActivePolicyTab] = useState<'returns' | 'shipping' | 'terms' | 'privacy'>('returns');
  const [orderData, setOrderData] = useState<any>(null);

  // Categories
  const categories = useMemo(() => {
    return [
      'جمس - شفرولية - بيوك',
      'كاديلاك',
      'هونداي',
      'كيا',
      'دوج - جيب - كرايسلر - رام',
      'TOYOTA - LEXUS',
      'فورد - لينكولن',
      'قطع عامة وماركات أخرى'
    ];
  }, []);

  // Filtered Products for Search or specific Brand filter
  const isFiltering = searchQuery.trim() !== '' || selectedBrand !== 'all' || selectedCategory !== 'all';
  
  const searchFilteredProducts = useMemo(() => {
    if (!isFiltering) return [];
    return products.filter((p) => {
      const matchBrand = selectedBrand === 'all' || p.brand === selectedBrand;
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q));
      return matchBrand && matchCat && matchQuery;
    });
  }, [products, searchQuery, selectedBrand, selectedCategory, isFiltering]);

  // Cart logic
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
  const totalCartAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Car models for each manufacturer matching screenshots
  const gmcModels: CircularModel[] = [
    { name: 'سوبربان', image: 'https://cdn.salla.sa/rxyaX/8baac58d-09d8-480b-a854-2a8213c8d7db-432.55620316403x500-ef6gfowGUEbjqCHodXYlhORL1ww1kLHuFf17f1FW.jpg' },
    { name: 'سييرا', image: 'https://cdn.salla.sa/rxyaX/d9a97445-060b-4d44-8f34-7dc8cdb8a2fa-500x500-vLc9y1JPqUG33RBswajqMftqKvV3ehGG0U7pzTcn.jpg' },
    { name: 'كلاسيك قديم', image: 'https://cdn.salla.sa/rxyaX/3f82cb55-e4d0-4d51-a968-3d1912ec5859-500x333.33333333333-wE5XW1w9XvCjB8N1500ZtK.jpg' },
    { name: 'سلفرادو', image: 'https://cdn.salla.sa/rxyaX/03f69ce6-9ae3-4204-a8f7-be5b5b31aa10-500x333.33333333333-tn5Xqx7JP8fjBE1q5OS1XfEfgytyIfMcWhhyORE8.png' },
    { name: 'امبالا', image: 'https://cdn.salla.sa/rxyaX/8baac58d-09d8-480b-a854-2a8213c8d7db-432.55620316403x500-ef6gfowGUEbjqCHodXYlhORL1ww1kLHuFf17f1FW.jpg' },
    { name: 'كمارو', image: 'https://cdn.salla.sa/rxyaX/d9a97445-060b-4d44-8f34-7dc8cdb8a2fa-500x500-vLc9y1JPqUG33RBswajqMftqKvV3ehGG0U7pzTcn.jpg' },
  ];

  const cadillacModels: CircularModel[] = [
    { name: 'كاديلاك CTS', image: 'https://cdn.salla.sa/rxyaX/d9a97445-060b-4d44-8f34-7dc8cdb8a2fa-500x500-vLc9y1JPqUG33RBswajqMftqKvV3ehGG0U7pzTcn.jpg' },
    { name: 'SEVILLE', image: 'https://cdn.salla.sa/rxyaX/8baac58d-09d8-480b-a854-2a8213c8d7db-432.55620316403x500-ef6gfowGUEbjqCHodXYlhORL1ww1kLHuFf17f1FW.jpg' },
    { name: '60 SPECIAL', image: 'https://cdn.salla.sa/rxyaX/03f69ce6-9ae3-4204-a8f7-be5b5b31aa10-500x333.33333333333-tn5Xqx7JP8fjBE1q5OS1XfEfgytyIfMcWhhyORE8.png' },
    { name: 'كاديلاك XLR', image: 'https://cdn.salla.sa/rxyaX/3f82cb55-e4d0-4d51-a968-3d1912ec5859-500x333.33333333333-wE5XW1w9XvCjB8N1500ZtK.jpg' },
    { name: 'كاديلاك DTS', image: 'https://cdn.salla.sa/rxyaX/d9a97445-060b-4d44-8f34-7dc8cdb8a2fa-500x500-vLc9y1JPqUG33RBswajqMftqKvV3ehGG0U7pzTcn.jpg' },
    { name: 'كاديلاك ديفيل', image: 'https://cdn.salla.sa/rxyaX/8baac58d-09d8-480b-a854-2a8213c8d7db-432.55620316403x500-ef6gfowGUEbjqCHodXYlhORL1ww1kLHuFf17f1FW.jpg' },
  ];

  const hyundaiModels: CircularModel[] = [
    { name: 'ماكس كروز', image: 'https://cdn.salla.sa/rxyaX/03f69ce6-9ae3-4204-a8f7-be5b5b31aa10-500x333.33333333333-tn5Xqx7JP8fjBE1q5OS1XfEfgytyIfMcWhhyORE8.png' },
    { name: 'كونا بنزين وديزل', image: 'https://cdn.salla.sa/rxyaX/d9a97445-060b-4d44-8f34-7dc8cdb8a2fa-500x500-vLc9y1JPqUG33RBswajqMftqKvV3ehGG0U7pzTcn.jpg' },
    { name: 'سنتينيال', image: 'https://cdn.salla.sa/rxyaX/8baac58d-09d8-480b-a854-2a8213c8d7db-432.55620316403x500-ef6gfowGUEbjqCHodXYlhORL1ww1kLHuFf17f1FW.jpg' },
    { name: 'اكسنت بنزين', image: 'https://cdn.salla.sa/rxyaX/3f82cb55-e4d0-4d51-a968-3d1912ec5859-500x333.33333333333-wE5XW1w9XvCjB8N1500ZtK.jpg' },
    { name: 'كريتا', image: 'https://cdn.salla.sa/rxyaX/03f69ce6-9ae3-4204-a8f7-be5b5b31aa10-500x333.33333333333-tn5Xqx7JP8fjBE1q5OS1XfEfgytyIfMcWhhyORE8.png' },
    { name: 'اكسنت ديزل', image: 'https://cdn.salla.sa/rxyaX/d9a97445-060b-4d44-8f34-7dc8cdb8a2fa-500x500-vLc9y1JPqUG33RBswajqMftqKvV3ehGG0U7pzTcn.jpg' },
    { name: 'جينسس Genesis', image: 'https://cdn.salla.sa/rxyaX/8baac58d-09d8-480b-a854-2a8213c8d7db-432.55620316403x500-ef6gfowGUEbjqCHodXYlhORL1ww1kLHuFf17f1FW.jpg' },
    { name: 'فيراكروز', image: 'https://cdn.salla.sa/rxyaX/3f82cb55-e4d0-4d51-a968-3d1912ec5859-500x333.33333333333-wE5XW1w9XvCjB8N1500ZtK.jpg' },
  ];

  const kiaModels: CircularModel[] = [
    { name: 'بونغو BONGO', image: 'https://cdn.salla.sa/rxyaX/03f69ce6-9ae3-4204-a8f7-be5b5b31aa10-500x333.33333333333-tn5Xqx7JP8fjBE1q5OS1XfEfgytyIfMcWhhyORE8.png' },
    { name: 'كارينز', image: 'https://cdn.salla.sa/rxyaX/d9a97445-060b-4d44-8f34-7dc8cdb8a2fa-500x500-vLc9y1JPqUG33RBswajqMftqKvV3ehGG0U7pzTcn.jpg' },
    { name: 'باص Pregio', image: 'https://cdn.salla.sa/rxyaX/8baac58d-09d8-480b-a854-2a8213c8d7db-432.55620316403x500-ef6gfowGUEbjqCHodXYlhORL1ww1kLHuFf17f1FW.jpg' },
    { name: 'K2500 ديزل', image: 'https://cdn.salla.sa/rxyaX/3f82cb55-e4d0-4d51-a968-3d1912ec5859-500x333.33333333333-wE5XW1w9XvCjB8N1500ZtK.jpg' },
    { name: 'كارنفال', image: 'https://cdn.salla.sa/rxyaX/03f69ce6-9ae3-4204-a8f7-be5b5b31aa10-500x333.33333333333-tn5Xqx7JP8fjBE1q5OS1XfEfgytyIfMcWhhyORE8.png' },
    { name: 'بيكانتو', image: 'https://cdn.salla.sa/rxyaX/d9a97445-060b-4d44-8f34-7dc8cdb8a2fa-500x500-vLc9y1JPqUG33RBswajqMftqKvV3ehGG0U7pzTcn.jpg' },
    { name: 'ريو', image: 'https://cdn.salla.sa/rxyaX/8baac58d-09d8-480b-a854-2a8213c8d7db-432.55620316403x500-ef6gfowGUEbjqCHodXYlhORL1ww1kLHuFf17f1FW.jpg' },
    { name: 'كوريس K9', image: 'https://cdn.salla.sa/rxyaX/3f82cb55-e4d0-4d51-a968-3d1912ec5859-500x333.33333333333-wE5XW1w9XvCjB8N1500ZtK.jpg' },
  ];

  const dodgeModels: CircularModel[] = [
    { name: 'جراند شيروكي', image: 'https://cdn.salla.sa/rxyaX/8baac58d-09d8-480b-a854-2a8213c8d7db-432.55620316403x500-ef6gfowGUEbjqCHodXYlhORL1ww1kLHuFf17f1FW.jpg' },
    { name: 'دورانقو', image: 'https://cdn.salla.sa/rxyaX/d9a97445-060b-4d44-8f34-7dc8cdb8a2fa-500x500-vLc9y1JPqUG33RBswajqMftqKvV3ehGG0U7pzTcn.jpg' },
    { name: 'تشارجر', image: 'https://cdn.salla.sa/rxyaX/03f69ce6-9ae3-4204-a8f7-be5b5b31aa10-500x333.33333333333-tn5Xqx7JP8fjBE1q5OS1XfEfgytyIfMcWhhyORE8.png' },
    { name: 'تشالنجر', image: 'https://cdn.salla.sa/rxyaX/3f82cb55-e4d0-4d51-a968-3d1912ec5859-500x333.33333333333-wE5XW1w9XvCjB8N1500ZtK.jpg' },
    { name: 'رام RAM', image: 'https://cdn.salla.sa/rxyaX/8baac58d-09d8-480b-a854-2a8213c8d7db-432.55620316403x500-ef6gfowGUEbjqCHodXYlhORL1ww1kLHuFf17f1FW.jpg' },
    { name: 'كرايسلر 300C', image: 'https://cdn.salla.sa/rxyaX/d9a97445-060b-4d44-8f34-7dc8cdb8a2fa-500x500-vLc9y1JPqUG33RBswajqMftqKvV3ehGG0U7pzTcn.jpg' },
  ];

  // Helper to get products for each section
  const getProductsFor = (keywords: string[]) => {
    return products.filter((p) => {
      const text = (p.category + ' ' + p.title + ' ' + p.description).toLowerCase();
      return keywords.some((k) => text.includes(k.toLowerCase()));
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800 flex flex-col font-sans">
      <Header
        cartCount={totalCartCount}
        cartTotal={totalCartAmount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenPolicies={handleOpenPolicies}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* If search or filtering is active, show the filtered grid */}
      {isFiltering ? (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="flex items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div>
              <h2 className="text-base sm:text-lg font-black text-gray-900">
                نتائج البحث والتصفية
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                تم العثور على {searchFilteredProducts.length} قطعة متوفرة
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBrand('all');
                setSelectedCategory('all');
              }}
              className="text-xs text-red-600 hover:underline font-bold bg-red-50 px-3 py-1.5 rounded-lg"
            >
              إلغاء التصفية وعرض الكل
            </button>
          </div>

          {searchFilteredProducts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center text-gray-500 shadow-sm">
              <p className="text-base font-bold text-gray-800 mb-2">لم يتم العثور على قطع غيار تطابق بحثك</p>
              <p className="text-xs text-gray-400 mb-4">جرب البحث بكلمات أخرى أو تصفح الأقسام أدناه</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-6">
              {searchFilteredProducts.map((product) => (
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
      ) : (
        /* Standard Home Layout Matching Saudi Parts Store Screenshots */
        <main className="flex-1">
          {/* 1. Brands Bar */}
          <BrandsSection
            brands={brands}
            selectedBrand={selectedBrand}
            onSelectBrand={(b) => setSelectedBrand(b)}
          />

          {/* 2. GMC / Chevrolet / Buick Section */}
          <CarSection
            title="جمس - شفرولية - بيوك"
            bannerTitle="جمس - شفرولية - بيوك"
            bannerImage="https://cdn.salla.sa/rxyaX/8baac58d-09d8-480b-a854-2a8213c8d7db-432.55620316403x500-ef6gfowGUEbjqCHodXYlhORL1ww1kLHuFf17f1FW.jpg"
            bannerBgGradient="from-[#e2e8f0] via-[#cbd5e1] to-[#e2e8f0]"
            models={gmcModels}
            products={getProductsFor(['جمس', 'شفرولية', 'بيوك', 'سوبربان', 'سييرا', 'سلفرادو', 'امبالا', 'كمارو'])}
            onSelectProduct={setSelectedProduct}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onSelectModel={(m) => setSearchQuery(m)}
          />

          {/* 3. Cadillac Section */}
          <CarSection
            title="كاديلاك"
            bannerTitle="كاديلاك"
            bannerImage="https://cdn.salla.sa/rxyaX/d9a97445-060b-4d44-8f34-7dc8cdb8a2fa-500x500-vLc9y1JPqUG33RBswajqMftqKvV3ehGG0U7pzTcn.jpg"
            bannerBgGradient="from-[#dcfce7] via-[#bbf7d0] to-[#dcfce7]"
            models={cadillacModels}
            products={getProductsFor(['كاديلاك', 'cts', 'dts', 'xlr', 'seville', 'اسكاليد'])}
            onSelectProduct={setSelectedProduct}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onSelectModel={(m) => setSearchQuery(m)}
          />

          {/* 4. Hyundai Section */}
          <CarSection
            title="هونداي"
            bannerTitle="هونداي - قطع غيار أصلية"
            bannerImage="https://cdn.salla.sa/rxyaX/03f69ce6-9ae3-4204-a8f7-be5b5b31aa10-500x333.33333333333-tn5Xqx7JP8fjBE1q5OS1XfEfgytyIfMcWhhyORE8.png"
            bannerBgGradient="from-[#e0f2fe] via-[#bae6fd] to-[#e0f2fe]"
            models={hyundaiModels}
            products={getProductsFor(['هونداي', 'سوناتا', 'النترا', 'اكسنت', 'ازيرا', 'توسان', 'سنتافي', 'جينسس', 'كريتا', 'كونا'])}
            onSelectProduct={setSelectedProduct}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onSelectModel={(m) => setSearchQuery(m)}
          />

          {/* 5. Kia Section */}
          <CarSection
            title="كيا"
            bannerTitle="كيا - قطع غيار واكسسوارات"
            bannerImage="https://cdn.salla.sa/rxyaX/3f82cb55-e4d0-4d51-a968-3d1912ec5859-500x333.33333333333-wE5XW1w9XvCjB8N1500ZtK.jpg"
            bannerBgGradient="from-[#fee2e2] via-[#fecaca] to-[#fee2e2]"
            models={kiaModels}
            products={getProductsFor(['كيا', 'كارينز', 'كارنفال', 'ريو', 'بيكانتو', 'سول', 'كوريس', 'k5'])}
            onSelectProduct={setSelectedProduct}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onSelectModel={(m) => setSearchQuery(m)}
          />

          {/* 6. Dodge / Jeep / Chrysler / Ram Section */}
          <CarSection
            title="دوج - جيب - كرايسلر - رام"
            bannerTitle="دوج - جيب - كرايسلر - رام"
            bannerImage="https://cdn.salla.sa/rxyaX/8baac58d-09d8-480b-a854-2a8213c8d7db-432.55620316403x500-ef6gfowGUEbjqCHodXYlhORL1ww1kLHuFf17f1FW.jpg"
            bannerBgGradient="from-[#f1f5f9] via-[#e2e8f0] to-[#f1f5f9]"
            models={dodgeModels}
            products={getProductsFor(['دوج', 'جيب', 'كرايسلر', 'رام', 'دورانقو', 'شروكي', 'تشارجر', 'تشالنجر'])}
            onSelectProduct={setSelectedProduct}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onSelectModel={(m) => setSearchQuery(m)}
          />

          {/* 7. Toyota & Ford Sections */}
          <CarSection
            title="TOYOTA - LEXUS"
            bannerTitle="تويوتا - لكزس"
            bannerImage="https://cdn.salla.sa/rxyaX/03f69ce6-9ae3-4204-a8f7-be5b5b31aa10-500x333.33333333333-tn5Xqx7JP8fjBE1q5OS1XfEfgytyIfMcWhhyORE8.png"
            bannerBgGradient="from-[#fef3c7] via-[#fde68a] to-[#fef3c7]"
            models={[]}
            products={getProductsFor(['تويوتا', 'لكزس', 'لاندكروزر', 'كامري', 'سيكويا', 'تندرا'])}
            onSelectProduct={setSelectedProduct}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onSelectModel={(m) => setSearchQuery(m)}
          />

          <CarSection
            title="فورد - لينكولن"
            bannerTitle="فورد - لينكولن"
            bannerImage="https://cdn.salla.sa/rxyaX/d9a97445-060b-4d44-8f34-7dc8cdb8a2fa-500x500-vLc9y1JPqUG33RBswajqMftqKvV3ehGG0U7pzTcn.jpg"
            bannerBgGradient="from-[#e0e7ff] via-[#c7d2fe] to-[#e0e7ff]"
            models={[]}
            products={getProductsFor(['فورد', 'لينكولن', 'فكتوريا', 'ماركيز', 'تورس', 'اكسبلورر', 'نافيجيتور'])}
            onSelectProduct={setSelectedProduct}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onSelectModel={(m) => setSearchQuery(m)}
          />
        </main>
      )}

      <Footer onOpenPolicies={handleOpenPolicies} />

      {/* Floating WhatsApp Green Button */}
      <a
        href={`https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent('السلام عليكم، أريد الاستفسار عن توفر قطع غيار لسيارتي')}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 left-6 z-40 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition transform border-2 border-white"
        title="تواصل معنا عبر واتساب"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.767-2.587 5.768-5.766 0-3.18-2.588-5.767-5.768-5.767zm9.969 5.766c0 5.518-4.482 10-10 10-1.745 0-3.385-.45-4.821-1.242l-5.179 1.304 1.341-4.887c-.886-1.488-1.341-3.184-1.341-4.975 0-5.518 4.482-10 10-10s10 4.482 10 10z" />
        </svg>
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

      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        categories={categories}
        onSelectCategory={(c) => {
          setSelectedCategory(c);
          setSelectedBrand('all');
        }}
        onOpenPolicies={handleOpenPolicies}
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
