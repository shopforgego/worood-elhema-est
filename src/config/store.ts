import { StoreConfig } from '../types/store';

export const storeConfig: StoreConfig = {
  storeNameAr: import.meta.env.VITE_STORE_NAME || "متجر ورود الهمة لقطع غيار وإكسسوارات السيارات",
  storeNameEn: import.meta.env.VITE_COMPANY_NAME_EN || "Wurud Alhimah Auto Parts & Accessories",
  companyNameAr: import.meta.env.VITE_COMPANY_NAME || "مؤسسة ورود الهمه التجارية",
  companyNameEn: import.meta.env.VITE_COMPANY_NAME_EN || "Wurud Alhimah Commercial Establishment",
  taglineAr: import.meta.env.VITE_TAGLINE || "وجهتك الأولى لقطع غيار وإكسسوارات وزينة السيارات الأصلية والبديلة في المملكة",
  taglineEn: "Your Premier Destination for Genuine Auto Parts & Car Accessories in Saudi Arabia",
  cr: import.meta.env.VITE_CR || "7055018035",
  taxNumber: import.meta.env.VITE_TAX_NUMBER || "310550180350003",
  shortAddress: import.meta.env.VITE_SHORT_ADDRESS || "GAPA7004",
  city: import.meta.env.VITE_CITY || "جازان",
  district: import.meta.env.VITE_DISTRICT || "حي الرحاب 2",
  fullAddress: import.meta.env.VITE_FULL_ADDRESS || "المملكة العربية السعودية - جازان - حي الرحاب 2 - شارع عبدالقاهر الجرجاني - مبنى 7004",
  phone: import.meta.env.VITE_PHONE || "0591300628",
  whatsapp: import.meta.env.VITE_WHATSAPP || "966591300628",
  email: import.meta.env.VITE_EMAIL || "woroodelhema1@gmail.com",
  supportHours: "السبت - الخميس: 8:00 صباحاً - 11:00 مساءً",
  currency: "SAR",
  currencySymbol: "ر.س",
  freeShippingThreshold: Number(import.meta.env.VITE_FREE_SHIPPING_THRESHOLD) || 250,
  shippingCost: Number(import.meta.env.VITE_SHIPPING_COST) || 28,
};
