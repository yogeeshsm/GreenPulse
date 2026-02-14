import { useState, useEffect } from 'react';
import { Menu, X, Leaf, Home, Calendar, Zap, BarChart3, User, LayoutDashboard, Award, BookOpen, ArrowLeft, Calculator, ClipboardList, Users, ScanLine } from 'lucide-react';
import type { DaySession } from '@/types';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  daySession?: DaySession;
}

export function Navigation({ currentView, onViewChange, daySession }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'input', label: 'Input Calculator', icon: ClipboardList },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'micromoves', label: 'Micro-Moves', icon: Zap },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'ledger', label: 'Impact Ledger', icon: BookOpen },
    { id: 'carbon-calculator', label: 'Carbon Credits', icon: Calculator },
    { id: 'footprint-calculator', label: 'Footprint Calculator', icon: BarChart3 },
    { id: 'ecoscan', label: 'EcoScan', icon: ScanLine },
    { id: 'communities', label: 'Communities', icon: Users },
    { id: 'summary', label: 'Daily Summary', icon: Award },
  ];

  return (
    <>
      {/* Fixed Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-xl shadow-sm' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo and Back Button */}
          <div className="flex items-center gap-3">
            {currentView !== 'home' && (
              <button
                onClick={() => onViewChange('home')}
                className="gp-pill flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#22C55E] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#22C55E] rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className={`font-semibold text-lg transition-colors ${
                isScrolled ? 'text-gray-800' : 'text-gray-800'
              }`}>
                GreenPulse
              </span>
            </div>
          </div>

          {/* Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className={`gp-pill flex items-center gap-2 text-sm font-medium transition-all ${
              isScrolled ? 'text-gray-700' : 'text-gray-700 bg-white/70'
            }`}
          >
            <Menu className="w-4 h-4" />
            Menu
          </button>
        </div>
      </header>

      {/* Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[100] transition-all duration-300 ${
          isMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div 
          className={`absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-2xl transition-transform duration-300 overflow-y-auto ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6 pb-24">
            {/* Close Button */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#22C55E] rounded-lg flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-800">Menu</span>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Nav Items */}
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onViewChange(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                      isActive 
                        ? 'bg-[#22C55E]/10 text-[#22C55E]' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-[#22C55E]' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-[#22C55E] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Stats */}
            <div className="mt-8 p-6 bg-gradient-to-br from-[#22C55E]/10 to-[#22C55E]/5 rounded-2xl">
              <p className="text-sm text-gray-500 mb-2">Today's Points</p>
              <p className="text-3xl font-bold text-[#22C55E]">
                {daySession?.totals.greenPoints || 0}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {daySession?.streakDays || 0}-day streak!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
