import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LogIn } from 'lucide-react';

const About = () => {
  const features = [
    "Multilingual voice and text input",
    "AI-powered form filling and auto-correction", 
    "Secure digital signing with Aadhaar",
    "Real-time case tracking",
    "24/7 legal assistance chatbot"
  ];

  const team = [
    {
      name: "Legal Experts",
      description: "Experienced lawyers and paralegals ensuring accurate legal guidance"
    },
    {
      name: "Technology Team", 
      description: "Skilled developers creating accessible solutions"
    },
    {
      name: "Community Partners",
      description: "NGOs and grassroots organizations helping reach underserved communities"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-indigo-600 hover:text-indigo-800">
                <ArrowLeft className="mr-2" size={20} />
                <span className="text-xl font-bold">Vaani-Nyay</span>
              </Link>
            </div>
            <Link 
              to="/login" 
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center"
            >
              <LogIn className="mr-2" size={16} />
              Login
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">About Vaani-Nyay</h1>
            <p className="text-xl text-gray-600">Voice for Justice - Accessible Legal Aid Platform</p>
          </div>
          
          <div className="space-y-12">
            {/* Mission Section */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-indigo-600 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                Vaani-Nyay aims to democratize access to legal aid by providing an accessible platform that bridges the gap between citizens and the justice system through technology. We believe that every Indian citizen deserves equal access to justice, regardless of their location, language, or technical expertise.
              </p>
            </div>
            
            {/* Features Section */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-indigo-600 mb-6">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-indigo-600 mr-3 text-xl">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Team Section */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-indigo-600 mb-6">Our Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {team.map((member, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-3">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Contact Section */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-indigo-600 mb-6">Contact Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Email</h3>
                  <p className="text-gray-600">contact@vaani-nyay.org</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Phone</h3>
                  <p className="text-gray-600">1800-123-4567</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-indigo-600 text-white rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="mb-6">Join thousands of citizens who have already benefited from our platform.</p>
              <Link 
                to="/login" 
                className="bg-white text-indigo-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 inline-flex items-center"
              >
                <LogIn className="mr-2" size={20} />
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;