import React from 'react';
import { X, Phone, Mail, ChevronLeft } from 'lucide-react';
import { storeConfig } from '../config/store';
import { Logo } from './Logo';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onSelectCategory: (cat: string) => void;
  onOpenPolicies?: (tab: 'returns' | 'shipping' | 'terms' | 'privacy') => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  onSelectCategory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-sm bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-[#f8f9fa]">
          <Logo />
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-black rounded-lg hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Categories */}
          <div>
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">أقسام السيارات</h4>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onSelectCategory('all');
                  onClose();
                }}
                className="w-full flex items-center justify-between text-right p-2.5 rounded-xl hover:bg-gray-100 text-xs font-bold text-gray-800"
              >
                <span>جميع الأقسام</span>
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    onSelectCategory(c);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between text-right p-2.5 rounded-xl hover:bg-gray-100 text-xs font-bold text-gray-700"
                >
                  <span>{c}</span>
                  <ChevronLeft className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#347b42]" />
              <span>خدمة العملاء: {storeConfig.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#347b42]" />
              <span>{storeConfig.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
