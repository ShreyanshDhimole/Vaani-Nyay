import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call with animation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success animation
      const loginCard = document.querySelector('.login-card');
      if (loginCard) {
        loginCard.classList.add('animate-pulse');
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      // Navigate to forms dashboard after login
      navigate('/forms');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      const loginCard = document.querySelector('.login-card');
      if (loginCard) {
        loginCard.classList.add('animate-shake');
        setTimeout(() => {
          loginCard.classList.remove('animate-shake');
        }, 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#141E28] text-white">
      {/* Left Section */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center bg-gradient-to-br from-[#141E28] to-[#0f172a]">
        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-bold text-[#33FEBF]">Vaani-Nyay</h1>
          <p className="text-xl text-white">Voice for Justice - Accessible Legal Aid Platform</p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-[#33FEBF]"></div>
              <span>AI-Powered Legal Assistance</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-[#33FEBF]"></div>
              <span>Multilingual Support</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-[#33FEBF]"></div>
              <span>Secure Document Handling</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="login-card w-full max-w-md bg-[#141E28] rounded-xl shadow-lg p-8 transition-all duration-300">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Welcome to Vaani-Nyay</h2>
            <p className="text-gray-300">Sign in to access legal services</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500 text-white p-3 rounded-md text-center animate-fade-in">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg bg-[#1E293B] text-white placeholder-gray-400 border border-[#334155] focus:outline-none focus:ring-2 focus:ring-[#33FEBF]"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg bg-[#1E293B] text-white placeholder-gray-400 border border-[#334155] focus:outline-none focus:ring-2 focus:ring-[#33FEBF] pr-12"
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-[#33FEBF]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="h-4 w-4 text-[#33FEBF] focus:ring-[#33FEBF] border-gray-600 rounded bg-[#1E293B]"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              <button type="button" className="text-sm text-[#33FEBF] hover:underline">
                Forgot password?
              </button>
            </div>
            
            <button 
              type="submit" 
              className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-colors duration-300 ${
                loading ? 'bg-[#2a4a3e] cursor-not-allowed' : 'bg-[#33FEBF] hover:bg-[#2bd4a8] text-[#141E28]'
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn className="mr-2" size={20} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-300">
            <p>Don't have an account? <Link to="/register" className="text-[#33FEBF] hover:underline">Register here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;