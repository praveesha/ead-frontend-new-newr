import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const GetStarted: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const goToBooking = () => {
    if (isLoading) return; // still checking auth
    if (isAuthenticated) {
      navigate('/book');
    } else {
      // redirect to login; optionally preserve where the user wanted to go
      navigate('/login', { state: { next: '/book' } });
    }
  };

  const gotoSignUp = () => {
    if (isLoading) return; // still checking auth
    if (isAuthenticated) {
      navigate('/customer');
    } else {
      // redirect to login; optionally preserve where the user wanted to go
      navigate('/signup', { state: { next: '/book' } });
    }
  };

  return (
    <section className="fixed-getstarted bg-bg-tertiary min-h-[400px] flex items-center justify-center px-4 py-12 sm:py-16 overflow-hidden">
      <div className="max-w-2xl w-full mx-auto text-center">
        {/* Calendar Icon */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center" style={{ border: '2px solid #D4D4D8' }}>
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8"
              style={{ color: 'var(--color-text-primary)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2 text-text-primary">
          Ready to Get Started?
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg mb-8 sm:mb-12 max-w-xl mx-auto leading-relaxed px-2 text-text-primary">
          Experience the future of automobile service management. Book your appointment
          today and track your service in real-time.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
          <button
            onClick={goToBooking}
            className="btn-primary font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-colors duration-200 w-full sm:w-auto sm:min-w-[160px] text-sm sm:text-base"
            style={{ backgroundColor: '#D60507', color: '#FFFFFF' }}
          >
            Book Appointment
          </button>

          <button
            onClick={gotoSignUp}
            className="btn-outline font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-200 w-full sm:w-auto sm:min-w-[160px] text-sm sm:text-base"
            style={{ border: '2px solid var(--color-text-primary)', color: 'var(--color-text-primary)' }}
          >
            Create Account
          </button>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;