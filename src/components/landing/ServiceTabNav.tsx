import React from "react";
import type { ServiceTabType } from "./vehicleRepairs.types";

interface ServiceTabNavProps {
  activeTab: ServiceTabType;
  onTabChange: (tab: ServiceTabType) => void;
}

const ServiceTabNav: React.FC<ServiceTabNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: ServiceTabType[] = ["Maintenance", "Repairs", "Modifications"];

  return (
    <div className="flex justify-center mb-12">
      <div className="inline-flex bg-gray-200 rounded-full p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            style={activeTab === tab ? { backgroundColor: "#D60507" } : {}}
            className={`px-12 py-1.5 rounded-full text-md font-medium transition-all duration-300 ${
              activeTab === tab
                ? "text-white shadow-md"
                : "bg-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceTabNav;
