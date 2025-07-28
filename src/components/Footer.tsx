import { FaFacebookF, FaInstagram, FaTwitter, FaPhone, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-purple-900 text-purple-200 py-10 px-4 md:px-8 border-b-[15px] border-purple-200">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-8">
        {/* Column 1: Shiwama Drive Info */}
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-bold mb-4 uppercase text-footerHeadingDark">Shiwama Drive</h3>
          <p className="flex items-center justify-center sm:justify-start gap-2 mb-2 text-footerLinkRed">
            <FaPhone className="text-footerHeadingDark" />
            0740798648
          </p>
          <p className="flex items-center justify-center sm:justify-start gap-2 text-footerLinkRed">
            <FaEnvelope className="text-footerHeadingDark" />
            sdrive@gmail.com
          </p>
        </div>

        {/* Column 2: Hours */}
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-bold mb-4 uppercase text-footerHeadingDark">Hours</h3>
          <p className="mb-2 text-footerLinkRed">Monday - Sunday</p>
          <p className="text-footerLinkRed">24/7</p>
        </div>

        {/* Column 3: Quick Links */}
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-bold mb-4 uppercase text-footerHeadingDark">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/contact" className="hover:underline text-footerLinkRed block">Contact</Link>
            </li>
            <li>
              <Link to="/register" className="hover:underline text-footerLinkRed block">Register</Link>
            </li>
            <li>
              <Link to="/login" className="hover:underline text-footerLinkRed block">Login</Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Follow Us / Social Media */}
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-bold mb-4 uppercase text-footerHeadingDark">Follow Us</h3>
          <div className="flex justify-center sm:justify-start space-x-4">
            <a 
              href="https://www.facebook.com/Shiphira-Wamaitha" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-3xl text-footerHeadingDark hover:text-gray-600 transition-colors duration-200"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a 
              href="https://www.instagram.com/Shiphira-Wamaitha" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-3xl text-footerHeadingDark hover:text-gray-600 transition-colors duration-200"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a 
              href="https://www.twitter.com/yourhandle" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-3xl text-footerHeadingDark hover:text-gray-600 transition-colors duration-200"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-footerLinkRed mt-6 pt-4 border-t border-purple-700">
        <p>© 2025 SHIWAMA DRIVE. All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;