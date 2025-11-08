import React from "react";
import { CheckCircle } from "lucide-react";
import { useTheme } from '../../contexts/ThemeContext';

//Leadership Team Section 

const members = [
  { name: "MTNS Perera", title: "Chief Executive Officer", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" },
  { name: "G.P. Jayamanna", title: "Head of Operations", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face&auto=format&q=80" },
  { name: "OPNYK Bandara", title: "Lead Technician", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" },
  { name: "Malidu M.D.K.D", title: "Customer Experience Director", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face" },
  { name: "MJH PINTO", title: "Marketing Manager", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face" },
  { name: "Hewagama S", title: "Finance Director", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face" },
  { name: "James Patel", title: "Innovation Lead", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face" },
  { name: "Olivia Gomez", title: "Operations Analyst", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face" },
  { name: "Henry Wilson", title: "Technical Advisor", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face" },
  { name: "Lisa Brown", title: "HR Manager", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face" },
];

const LeadershipTeam: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Show only first 6 members in a clean grid layout
  const displayMembers = members.slice(0, 6);

  return (
    <section className={`${isLight ? 'bg-gray-50' : 'bg-bg-primary'} py-20 px-6` } >
      <div className="w-full border-y-[3px] border-[#D60507] py-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            className="text-5xl font-bold mb-4" 
            style={{ 
              color: isLight ? '#000000' : '#FFFFFF',
              textShadow: isLight ? '1px 1px 2px rgba(255,255,255,0.8)' : '2px 2px 4px rgba(0,0,0,0.8)'
            }}
          >
            Meet our team
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto" 
            style={{ 
              color: '#717182', 
              
              WebkitTextFillColor: '#717182',
            }}
          >
            Experienced professionals dedicated to automotive excellence and innovation in service management
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {displayMembers.map((member, index) => (
            <div 
              key={index}
              className="group text-center"
            >
              {/* Profile Image */}
              <div className="relative mb-6 mx-auto w-64 h-64 overflow-hidden rounded-full">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/256x256/e5e7eb/6b7280?text=Team+Member';
                  }}
                />
              </div>

              {/* Member Info */}
              <div>
                <h3 
                  className="text-xl font-semibold mb-2" 
                  style={{ 
                    color: isLight ? '#000000' : '#FFFFFF',
                    textShadow: isLight ? '1px 1px 2px rgba(255,255,255,0.8)' : '1px 1px 2px rgba(0,0,0,0.8)'
                  }}
                >
                  {member.name}
                </h3>
                <p 
                  className="text-sm" 
                  style={{ 
                    color: isLight ? '#666666' : '#A1A1AA',
                    textShadow: isLight ? '1px 1px 2px rgba(255,255,255,0.8)' : '1px 1px 2px rgba(0,0,0,0.8)'
                  }}
                >
                  {member.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Optional: View All Team Button */}
        <div className="text-center mt-12">
          <button 
            className={`px-8 py-3 rounded-lg font-medium transition-colors duration-300 ${
              isLight 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-primary hover:bg-primary-dark'
            }`}
            style={{ 
              color: 'black',
              WebkitTextFillColor: '#FFFFFF',
            }}
          >
            View All Team Members
          </button>
        </div>
      </div>

      <WhatSetsUsApart />
    </section>
  );
};

//What Sets Us Apart Section 

const WhatSetsUsApart: React.FC = () => {
  const features = [
    {
      title: "Real-Time Transparency",
      description:
        "Track your vehicle's service progress live from your phone. Know exactly what's happening, when it's happening.",
    },
    {
      title: "Quality Parts Guarantee",
      description:
        "We use only OEM or premium aftermarket parts backed by comprehensive warranties.",
    },
    {
      title: "Convenient Scheduling",
      description:
        "Book appointments online 24/7 with instant confirmation and flexible time slots.",
    },
    {
      title: "Certified Technicians",
      description:
        "All our technicians are ASE certified with continuous training in the latest automotive technologies.",
    },
    {
      title: "Advanced Diagnostics",
      description:
        "State-of-the-art diagnostic equipment ensures accurate problem identification every time.",
    },
    {
      title: "Comprehensive Warranty",
      description:
        "All services come with our industry-leading warranty for your peace of mind.",
    },
  ];

  return (
    <div
      id="services"
      className={`bg-bg-tertiary py-15 mt-20 mb-10 px-6 text-center`}
    >
      <h2 className="text-primary text-5xl font-bold mb-2">What Sets Us Apart</h2>
      <p className="text-text-tertiary mb-12 text-lg">
        Why thousands of customers trust AutoCare Pro
      </p>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-left">
        {features.map((item, index) => (
          <div
            key={index}
            className={`bg-bg-card text-text-primary flex items-start space-x-3 p-6 rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300`}
          >
            <CheckCircle
              className={`w-6 h-6 flex-shrink-0 mt-1 text-success`}
            />
            <div>
              <h3 className={`text-xl font-semibold mb-2 text-text-primary`}>{item.title}</h3>
              <p className="text-sm text-text-primary" >{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadershipTeam;
