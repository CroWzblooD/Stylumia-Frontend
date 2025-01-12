import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <div className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-marcellus gradient-text">
            Stylumia Fashion
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Transform your online shopping experience with AI-powered virtual try-on technology
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-fashion-pink/20 text-fashion-orange hover:bg-fashion-orange hover:text-white transition-colors">
                <span className="text-lg">𝕏</span>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-fashion-pink/20 text-fashion-orange hover:bg-fashion-orange hover:text-white transition-colors">
                <span className="text-lg">📘</span>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-fashion-pink/20 text-fashion-orange hover:bg-fashion-orange hover:text-white transition-colors">
                <span className="text-lg">📸</span>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-fashion-pink/20 text-fashion-orange hover:bg-fashion-orange hover:text-white transition-colors">
                <span className="text-lg">💼</span>
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-marcellus text-lg font-medium">Contact Us</h4>
            <div className="space-y-3">
              <a href="mailto:hello@fashionontology.com" className="flex items-center gap-2 text-sm text-gray-600 hover:text-fashion-orange">
                <Mail className="w-4 h-4" />
                <span>Stylumia@fashionontology.com</span>
              </a>
              <a href="tel:+15551234567" className="flex items-center gap-2 text-sm text-gray-600 hover:text-fashion-orange">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </a>
              <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-fashion-orange">
                <MapPin className="w-4 h-4" />
                <span>Fashion Street, NY 10001</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-marcellus text-lg font-medium">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Home', 'About', 'Features', 'Pricing',
                'Blog', 'Contact', 'Terms', 'Privacy'
              ].map((link) => (
                <a 
                  key={link} 
                  href="#" 
                  className="text-sm text-gray-600 hover:text-fashion-orange"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-marcellus text-lg font-medium">Stay Updated</h4>
            <p className="text-sm text-gray-600">
              Subscribe to our newsletter for the latest updates and exclusive offers
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-fashion-orange/20"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-fashion-orange to-fashion-deep-pink text-white rounded-lg hover:shadow-lg transition-all">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 text-center text-sm text-gray-600">
          <p>© 2024 Fashion Ontology. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}