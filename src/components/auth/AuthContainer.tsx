import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Login from "./Login";
import Signup from "./SignUp";

export default function AuthContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignup, setIsSignup] = useState(location.pathname === "/signup");

  useEffect(() => {
    setIsSignup(location.pathname === "/signup");
  }, [location.pathname]);

  const handleSwitchToSignup = () => {
    setIsSignup(true);
    navigate("/signup");
  };

  const handleSwitchToLogin = () => {
    setIsSignup(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-bg-header flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl bg-bg-primary rounded-3xl shadow-2xl overflow-hidden border border-border-primary">
        {/* Blob animations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-hover-bg rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-hover-bg rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-hover-bg rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative flex flex-col sm:flex-row min-h-[600px]">
          {/* Forms Container */}
          <div
            className={`w-full sm:w-1/2 transition-all duration-700 ease-in-out order-2 sm:order-1 ${
              isSignup ? "sm:order-2" : "sm:order-1"
            }`}
          >
            <div className="relative w-full h-full overflow-y-auto">
              <div
                className={`transition-all duration-700 ease-in-out ${
                  isSignup
                    ? "opacity-0 h-0 overflow-hidden pointer-events-none"
                    : "opacity-100"
                }`}
              >
                <Login onSwitchToSignup={handleSwitchToSignup} />
              </div>

              <div
                className={`transition-all duration-700 ease-in-out ${
                  isSignup
                    ? "opacity-100"
                    : "opacity-0 h-0 overflow-hidden pointer-events-none"
                }`}
              >
                <Signup onSwitchToLogin={handleSwitchToLogin} />
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div
            className={`hidden sm:block w-1/2 transition-all duration-700 ease-in-out order-1 sm:order-2 ${
              isSignup ? "sm:order-1" : "sm:order-2"
            }`}
          >
            <div className="relative w-full h-full">
              {/* Sign Up Panel */}
              <div
                className={`bg-bg-secondary transition-all duration-700 ease-in-out border-l border-border-primary h-full ${
                  isSignup
                    ? "opacity-0 pointer-events-none absolute inset-0"
                    : "opacity-100"
                }`}
              >
                <div className="h-full flex items-center justify-center p-12 text-text-primary">
                  <div className="text-center space-y-6 animate-fadeIn">
                    <h2 className="text-4xl font-bold text-text-primary">
                      Hello!
                    </h2>
                    <p className="text-lg text-text-secondary">
                      New to Auto Care Pro
                    </p>
                    <button
                      onClick={handleSwitchToSignup}
                      className="mt-8 px-8 py-3 border-2 border-border-strong rounded-xl font-semibold text-text-secondary hover:bg-hover hover:text-text-primary hover:border-hover transition-all duration-200"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>

              {/* Sign In Panel */}
              <div
                className={`bg-bg-secondary transition-all duration-700 ease-in-out border-l border-border-primary h-full ${
                  isSignup
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none absolute inset-0"
                }`}
              >
                <div className="h-full flex items-center justify-center p-12 text-text-primary">
                  <div className="text-center space-y-6 animate-fadeIn">
                    <h2 className="text-4xl font-bold text-text-primary">
                      Welcome Back!
                    </h2>
                    <p className="text-lg text-text-secondary">
                      To keep connected with us please login with your personal
                      info
                    </p>
                    <button
                      onClick={handleSwitchToLogin}
                      className="mt-8 px-8 py-3 border-2 border-border-strong rounded-xl font-semibold text-text-secondary hover:bg-hover hover:text-text-primary hover:border-hover transition-all duration-200"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
