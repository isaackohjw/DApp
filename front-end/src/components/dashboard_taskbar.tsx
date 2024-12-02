import React from "react";

interface TabProps {
  label: string;
  value: string;
  activeTab: string;
  onClick: (tab: string) => void;
}

const Tab: React.FC<TabProps> = ({ label, value, activeTab, onClick }) => {
  return (
    <button
      onClick={() => onClick(value)}
      className={`py-2 px-4 text-sm font-medium rounded-t-md ${
        activeTab === value
          ? "border-b-4 border-blue-600 bg-gray-700"
          : "text-gray-300 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
};

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { label: string; value: string }[];
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="mt-20 bg-gray-800 z-10">
      {" "}
      <div className="flex space-x-4">
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
            activeTab={activeTab}
            onClick={onTabChange}
          />
        ))}
      </div>
    </div>
  );
};
