import React from "react";
import type { RepairService } from "./vehicleRepairs.types";

interface RepairCardProps {
  service: RepairService;
}

const RepairCard: React.FC<RepairCardProps> = ({ service }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Icon and Title */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "#D60507" }}
        >
          <span className="text-white text-2xl">{service.icon}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            {service.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        {service.description}
      </p>

      {/* Duration and Price */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 border-t-2 border-r-2 border-gray-400 rotate-45"></div>
          </div>
          <span className="text-sm text-gray-600">{service.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-green-600">
            {service.price}
          </span>
        </div>
      </div>

      {/* Get Quote Button */}
      <button className="w-full py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition-colors duration-200">
        Get Quote
      </button>
    </div>
  );
};

export default RepairCard;
