import { Link, useLocation } from "react-router-dom";
import {
  Shield,
  FileText,
  BookOpen,
  HelpCircle,
  Heart,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Award,
  Github,
} from "lucide-react";

export default function Footer() {
  const { pathname } = useLocation();
  const hideFooter = pathname === "/emergency";

  if (hideFooter) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-8">
      {/* Google Solution Challenge Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-3 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 flex-wrap">
          <Award size={20} className="shrink-0 animate-pulse" />
          <p className="text-sm font-medium text-center">
            <span className="font-bold">Google Solution Challenge 2026</span> —
            <span className="text-blue-100">
              {" "}
              Rapid Crisis Response: Accelerated Emergency Response and Crisis
              Coordination in Hospitality
            </span>
          </p>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full shrink-0">
            Hosted on Hack2Skill
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Emergency Helplines - Mobile Optimized */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-5 mb-8 border border-red-100 dark:border-red-800/30">
          <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2 mb-3">
            <Phone size={18} />
            Emergency Helplines (India)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {[
              { label: "Police", number: "100", color: "bg-blue-500" },
              { label: "Ambulance", number: "108", color: "bg-green-500" },
              { label: "Fire", number: "101", color: "bg-orange-500" },
              {
                label: "Women Helpline",
                number: "1091",
                color: "bg-purple-500",
              },
            ].map((item) => (
              <a
                key={item.number}
                href={`tel:${item.number}`}
                className="group flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${item.color} group-hover:scale-125 transition-transform`}
                />
                <div className="flex flex-col">
                  <span className="text-gray-500 dark:text-gray-400 text-[10px]">
                    {item.label}
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {item.number}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Main Footer Content - Multi Column */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3 group">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-500/30">
                <Heart size={20} className="text-white fill-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  LifeLine+
                </span>
                <p className="text-[10px] text-gray-500">Every second counts</p>
              </div>
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              Real-time emergency response platform for India. Connecting you
              with hospitals, ambulances, and emergency services instantly.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/KGFCH2/LifeLine"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/30"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/emergency", label: "Emergency" },
                { to: "/doctors", label: "Doctors" },
                { to: "/dashboard", label: "Dashboard" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-red-500 group-hover:w-2 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">
              Legal
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/privacy", icon: Shield, label: "Privacy Policy" },
                { to: "/terms", icon: FileText, label: "Terms of Service" },
                { to: "/faqs", icon: HelpCircle, label: "FAQs" },
                { to: "/docs", icon: BookOpen, label: "Documentation" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                  >
                    <link.icon
                      size={12}
                      className="opacity-50 group-hover:opacity-100 transition-opacity"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">
              Contact
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@lifelineplus.in"
                  className="group flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                >
                  <Mail
                    size={12}
                    className="group-hover:scale-110 transition-transform"
                  />
                  support@lifelineplus.in
                </a>
              </li>
              <li className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                <MapPin size={12} className="shrink-0 mt-0.5" />
                <span>India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center sm:text-left">
            &copy; {currentYear} LifeLine+ Team. Built with
            <Heart
              size={10}
              className="inline mx-1 text-red-500 fill-red-500 animate-pulse"
            />
            for India.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="text-[11px] text-gray-500 hover:text-red-600 transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-[11px] text-gray-500 hover:text-red-600 transition-colors"
            >
              Terms
            </Link>
            <a
              href="#"
              className="text-[11px] text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              Status <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
