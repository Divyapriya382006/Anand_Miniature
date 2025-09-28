import React, { useEffect, useRef } from 'react';
import { Heart, Award, Users, Sparkles } from 'lucide-react';

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.fade-in-element');
    elements?.forEach(element => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="fade-in-element opacity-0 text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About Anand Miniature
          </h2>
          <p className="fade-in-element opacity-0 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Where every creation tells a story of love, care, and dedication to bringing joy into your life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="fade-in-element opacity-0">
            <img
              src="https://images.pexels.com/photos/7876056/pexels-photo-7876056.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Artisan crafting toys"
              className="rounded-2xl shadow-2xl w-full h-96 object-cover"
            />
          </div>
          
          <div className="fade-in-element opacity-0 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-pink-500" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Our Story
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Anand Miniature was born from a simple belief: that the most beautiful things in life 
              are made with love and care. Started as a small family venture, we've been creating 
              handmade toys and delightful jellies that bring smiles to faces across the country.
            </p>
            
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Every product that leaves our workshop carries with it hours of meticulous craftsmanship, 
              premium materials, and most importantly, the joy we feel in creating something special 
              just for you.
            </p>
            
            <div className="flex items-center gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-500">50+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">1+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Years Crafting</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">100%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Love</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="fade-in-element opacity-0 text-center p-8 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-purple-900 rounded-2xl">
            <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Sold with Love
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Every product is sold with care, attention to detail, and a whole lot of love. 
              We believe this makes all the difference.
            </p>
          </div>
          
          <div className="fade-in-element opacity-0 text-center p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-blue-900 rounded-2xl">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Premium Quality
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              We use only the finest materials and natural ingredients to ensure our products 
              meet the highest standards of quality and safety.
            </p>
          </div>
          
          <div className="fade-in-element opacity-0 text-center p-8 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-green-900 rounded-2xl">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Community First
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              We're not just a business, we're part of a community. Your feedback and stories 
              inspire us to keep creating magic every day.
            </p>
          </div>
        </div>

        <div className="fade-in-element opacity-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-center text-white">
          <Sparkles className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Our Promise</h3>
          <p className="text-lg max-w-3xl mx-auto">
            Every Anand Miniature product comes with our promise of quality, authenticity, and joy. 
            If our creation doesn't bring a smile to your face, we haven't done our job right.
          </p>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default About;