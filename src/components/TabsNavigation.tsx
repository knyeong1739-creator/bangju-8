import React from 'react';
import { Home, CheckCircle2, ShoppingBag, Trophy } from 'lucide-react';
import { audioManager } from '../lib/audio';

export type TabType = 'home' | 'missions' | 'shop' | 'ranking';

interface TabsNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabsNavigation: React.FC<TabsNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as TabType, label: '홈', icon: Home },
    { id: 'missions' as TabType, label: '미션', icon: CheckCircle2 },
    { id: 'shop' as TabType, label: '넓은 들판(상점)', icon: ShoppingBag },
    { id: 'ranking' as TabType, label: '랭킹', icon: Trophy },
  ];

  const handleSelect = (tabId: TabType) => {
    audioManager.playClick();
    onTabChange(tabId);
  };

  return (
    <div className="flex md:flex-col gap-1.5 z-20 flex-shrink-0 font-sans md:-ml-1 mt-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => handleSelect(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-t-lg md:rounded-t-none md:rounded-r-xl border-[1.5px] transition-all select-none relative ${
              isActive
                ? 'bg-[#0086B3] text-white border-[#006A8E] md:border-l-0 md:translate-x-1.5 shadow-md z-20'
                : 'bg-[#E2EEF3] hover:bg-[#D0E2EC] hover:translate-x-1 text-slate-700 border-[#779CB0]/70 z-10'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFD166]' : 'text-[#0086B3]'}`} />
            <span className="whitespace-nowrap font-bold tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

