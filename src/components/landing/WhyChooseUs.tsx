import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EngineeringIcon from "@mui/icons-material/Engineering";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BuildIcon from "@mui/icons-material/Build";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import { useTheme } from '../../contexts/ThemeContext';
import { useState } from 'react';

const features = [
  {
    key: "realtime",
    title: "Real-Time Tracking",
    desc: "Monitor your vehicle service progress live from anywhere, anytime",
    Icon: AccessTimeIcon,
  },
  {
    key: "experts",
    title: "Expert Technicians",
    desc: "Certified professionals with years of experience in automotive service",
    Icon: EngineeringIcon,
  },
  {
    key: "booking",
    title: "Easy Booking",
    desc: "Schedule appointments online at your convenience with instant confirmation",
    Icon: EventAvailableIcon,
  },
  {
    key: "quality",
    title: "Quality Guarantee",
    desc: "All services backed by our comprehensive warranty and satisfaction guarantee",
    Icon: VerifiedUserIcon,
  },
  {
    key: "range",
    title: "Full Service Range",
    desc: "From routine maintenance to custom modifications and major repairs",
    Icon: BuildIcon,
  },
  {
    key: "support",
    title: "Customer Support",
    desc: "24/7 support team ready to assist with any questions or concerns",
    Icon: HeadsetMicIcon,
  },
];

export default function WhyChooseUs() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  return (
    <section
      id="whychooseus"
      className="bg-bg-primary text-[#FFFFFF] py-10 sm:py-16 md:py-18"
      aria-labelledby="why-choose-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <h2
          id="why-choose-heading"
          className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 sm:mb-6 md:mb-7"
          style={{ color: isLight ? '#000000' : '#FFFFFF' }}
        >
          Why Choose AutoCare Pro
        </h2>
        <p className="max-w-3xl mx-auto mb-8 sm:mb-10 text-sm sm:text-base md:text-lg lg:text-xl text-text-muted">
          Experience excellence in automotive service with real-time tracking
          and professional care
        </p>

        <div className="grid gap-6 sm:gap-8 lg:gap-10 xl:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.key}
              onMouseEnter={() => setHoveredKey(f.key)}
              onMouseLeave={() => setHoveredKey(null)}
              className={`group relative bg-bg-primary rounded-2xl p-5 sm:p-6 pt-6 sm:pt-8 flex flex-col items-center text-center overflow-hidden hover:-translate-y-1 transition-transform duration-200 min-h-[200px] sm:min-h-[220px] md:min-h-[240px] lg:min-h-[280px] ${isLight ? 'shadow-[0_8px_20px_rgba(214,5,7,0.16)]' : 'shadow-[0_6px_12px_rgba(255,255,255,0.06)]'}`}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-md mb-3 sm:mb-4 transition-colors duration-200 bg-primary group-hover:bg-hover-bg">
                <f.Icon
                  className={`transition-colors duration-200`}
                  style={{ fontSize: 28, color: isLight ? (hoveredKey === f.key ? '#D60507' : '#FFFFFF') : undefined }}
                  aria-hidden="true"
                />
              </div>

              <div className="flex-1 w-full px-2 sm:px-4 flex flex-col justify-center">
                <h3 className={`text-lg sm:text-xl md:text-2xl font-medium mb-2 sm:mb-3 md:mb-4 ${isLight ? 'text-primary' : 'text-text-primary'}`}>
                  {f.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg leading-6 sm:leading-7 md:leading-8 text-text-tertiary group-hover:text-text-muted transition-colors duration-200">
                  {f.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
