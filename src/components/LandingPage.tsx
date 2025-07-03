/* eslint-disable react/no-unescaped-entities */
"use client";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Heart, Brain, Shield, Users, Star, ChevronRight,  } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    router.push('/consent');
  };

  const features = [
    { icon: Shield, title: "Confidential & Safe", desc: "100% private sessions" },
    { icon: Brain, title: "Expert Counselors", desc: "Professional guidance" },
    { icon: Heart, title: "Holistic Wellness", desc: "Mind & body support" },
    { icon: Users, title: "Community Support", desc: "Peer connections" }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/15 rounded-full blur-2xl animate-bounce"></div>
      </div>

      {/* Subtle floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/50 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Main hero card */}
          <Card className="backdrop-blur-xl bg-white/80 border-blue-200/50 shadow-2xl rounded-3xl overflow-hidden transform hover:scale-[1.02] transition-all duration-700">
            <CardHeader className="relative text-center p-12 bg-gradient-to-r from-blue-50/80 to-white/90">
              {/* Logo section */}
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-3xl blur-xl opacity-60 animate-pulse group-hover:opacity-80 transition-opacity duration-500"></div>
                  <Image
                    src="/logos.webp"
                    alt="Aditya University Logo"
                    width={128}
                    height={128}
                    className="relative w-32 h-32 object-contain bg-white rounded-3xl p-4 shadow-2xl transform group-hover:scale-105 transition-all duration-300 border-2 border-blue-200/30"
                    priority
                  />
                </div>
              </div>

              <CardTitle className="text-6xl md:text-7xl font-black bg-gradient-to-r from-blue-800 via-blue-600 to-blue-700 bg-clip-text text-transparent leading-tight">
                Aditya University
                <br />
                <span className="text-4xl md:text-5xl font-light">Counselling</span>
              </CardTitle>
              
              <div className="flex items-center justify-center mt-6 space-x-2">
                <p className="text-2xl text-blue-700 font-light">
                  Supporting Your Mental Well-Being at Surampalem
                </p>
              </div>

              {/* Wellbeing Quote */}
              <div className="mt-8 p-4 bg-blue-50/70 rounded-2xl border border-blue-200/50">
                <p className="text-lg text-blue-800 italic font-light">
                  "Mental health is not a destination, but a process. It's about how you drive, not where you're going."
                </p>
                <p className="text-blue-600 text-sm mt-2">— Noam Shpancer</p>
              </div>
            </CardHeader>

            <CardContent className="p-12">
              {/* Main description */}
              <div className="text-center mb-12">
                <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-4xl mx-auto">
                  At Aditya University, we prioritize your physical and mental well-being. Our University Counselling Centre offers a 
                  <span className="text-blue-600 font-semibold"> safe and confidential space</span> for all students to explore personal concerns, 
                  develop coping strategies, and enhance overall well-being.
                </p>
               
              </div>

              {/* Feature cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-500 transform hover:scale-105 ${
                        activeFeature === index
                          ? 'bg-gradient-to-br from-blue-100/80 to-blue-200/60 border-blue-300/50 shadow-xl'
                          : 'bg-white/60 border-blue-200/30 hover:bg-white/80'
                      }`}
                    >
                      <Icon className={`w-10 h-10 mb-4 mx-auto transition-all duration-500 ${
                        activeFeature === index ? 'text-blue-600 scale-110' : 'text-blue-500'
                      }`} />
                      <h3 className="text-gray-800 font-semibold text-center mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm text-center">{feature.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Stats section with quote */}
              <div className="mb-12">
                <div className="flex justify-center items-center space-x-8 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">24/7</div>
                    <div className="text-gray-600 text-sm">Support Available</div>
                  </div>
                  <div className="w-px h-12 bg-blue-200"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-700">100%</div>
                    <div className="text-gray-600 text-sm">Confidential</div>
                  </div>
                  <div className="w-px h-12 bg-blue-200"></div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <div className="text-gray-600 text-sm">Rated Experience</div>
                  </div>
                </div>

                {/* Inspirational Quote */}
                <div className="text-center p-6 bg-gradient-to-r from-blue-50/80 to-white/90 rounded-2xl border border-blue-200/50">
                  <p className="text-xl text-blue-700 italic font-light mb-2">
                    "Taking care of your mental health is an act of self-love, not selfishness."
                  </p>
                  <p className="text-gray-600 text-sm">Start your wellness journey today</p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <Button
                  onClick={handleGetStarted}
                  className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xl px-12 py-6 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/25"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center space-x-3">
                    <span>Begin Your Journey</span>
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
                
                <p className="text-gray-600 text-sm mt-4">
                  Take the first step towards better mental health
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bottom accent */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center space-x-2 text-gray-500 text-sm">
              <Heart className="w-4 h-4" />
              <span>Powered by care, driven by excellence</span>
              <Heart className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}