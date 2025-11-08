import { useTheme } from '../../contexts/ThemeContext';

export default function Certificate() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  return (
    <section className="bg-bg-header py-10 sm:py-15 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-text-primary">

        {/* Title */}
        <h2 className="text-xl sm:text-4xl font-semibold text-primary mb-2">
          Certifications & Accreditations
        </h2>

        {/* Subtitle */}
        <p className="text-md sm:text-lg text-text-tertiary mb-12">
          Recognized for excellence in automotive service
        </p>

        {/* Certifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto">
          {/* Certification Item 1 */}
          <div className="flex flex-col items-center">
            {/* Icon - Placeholder, replace with actual SVG */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary flex items-center justify-center border-2 border-primary mb-3">
              {/* Example SVG (replace with your actual icon) */}
              <svg className="w-8 h-8 sm:w-10 sm:h-10" style={isLight ? { color: '#FFFFFF' } : undefined} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
            </div>
            <span className="text-sm sm:text-base text-text-secondary">ASE Certified</span>
          </div>

          {/* Certification Item 2 */}
          <div className="flex flex-col items-center">
            {/* Icon - Placeholder, replace with actual SVG */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary flex items-center justify-center border-2 border-primary mb-3">
              <svg className="w-8 h-8 sm:w-10 sm:h-10" style={isLight ? { color: '#FFFFFF' } : undefined} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path></svg>
            </div>
            <span className="text-sm sm:text-base text-text-secondary">ISO 9001:2015</span>
          </div>

          {/* Certification Item 3 */}
          <div className="flex flex-col items-center">
            {/* Icon - Placeholder, replace with actual SVG */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary flex items-center justify-center border-2 border-primary mb-3">
              <svg className="w-8 h-8 sm:w-10 sm:h-10" style={isLight ? { color: '#FFFFFF' } : undefined} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.105a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM18 10a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1zM15.657 14.895a1 1 0 00.707.707l.707-.707a1 1 0 00-1.414-1.414l-.707.707zM11 17a1 1 0 10-2 0v1a1 1 0 102 0v-1zM4.343 14.895a1 1 0 00-1.414-.707l-.707.707a1 1 0 001.414 1.414l.707-.707zM3 11a1 1 0 001 1v1a1 1 0 102 0v-1a1 1 0 00-1-1zM4.343 5.105a1 1 0 00.707-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707z" /><path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
            </div>
            <span className="text-sm sm:text-base text-text-secondary">AAA Approved</span>
          </div>

          {/* Certification Item 4 */}
          <div className="flex flex-col items-center">
            {/* Icon - Placeholder, replace with actual SVG */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary flex items-center justify-center border-2 border-primary mb-3">
              <svg className="w-8 h-8 sm:w-10 sm:h-10" style={isLight ? { color: '#FFFFFF' } : undefined} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path></svg>
            </div>
            <span className="text-sm sm:text-base text-text-secondary">Elite Accredited</span>
          </div>
        </div>
      </div>

    </section>
  );
}