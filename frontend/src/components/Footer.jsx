import { Link, useLocation } from 'react-router-dom'
import { Shield, FileText, BookOpen, HelpCircle, Heart, Phone } from 'lucide-react'

export default function Footer() {
  const { pathname } = useLocation()
  const hideFooter = pathname === '/emergency'

  if (hideFooter) return null

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-8 pb-8">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Emergency Helplines */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-5">
          <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2 mb-2">
            <Phone size={16} />
            Emergency Helplines (India)
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>Police: <strong>100</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>Ambulance: <strong>108</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>Fire: <strong>101</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>Women Helpline: <strong>1091</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-4 gap-3">
          <Link to="/privacy" className="group flex flex-col items-center gap-1.5 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 group-hover:text-red-500 transition-all duration-200">
              <Shield size={20} />
            </div>
            <span className="text-[11px] text-gray-600 dark:text-gray-400 font-medium group-hover:text-red-600 transition-colors">Privacy</span>
          </Link>
          <Link to="/terms" className="group flex flex-col items-center gap-1.5 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 group-hover:text-red-500 transition-all duration-200">
              <FileText size={20} />
            </div>
            <span className="text-[11px] text-gray-600 dark:text-gray-400 font-medium group-hover:text-red-600 transition-colors">Terms</span>
          </Link>
          <Link to="/docs" className="group flex flex-col items-center gap-1.5 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 group-hover:text-red-500 transition-all duration-200">
              <BookOpen size={20} />
            </div>
            <span className="text-[11px] text-gray-600 dark:text-gray-400 font-medium group-hover:text-red-600 transition-colors">Docs</span>
          </Link>
          <Link to="/faqs" className="group flex flex-col items-center gap-1.5 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 group-hover:text-red-500 transition-all duration-200">
              <HelpCircle size={20} />
            </div>
            <span className="text-[11px] text-gray-600 dark:text-gray-400 font-medium group-hover:text-red-600 transition-colors">FAQs</span>
          </Link>
        </div>

        {/* Brand & Copyright */}
        <div className="text-center border-t border-gray-100 dark:border-gray-800 pt-4">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Heart size={14} className="text-red-500 fill-red-500" />
            <span className="text-sm font-bold text-gray-900 dark:text-white">LifeLine+</span>
          </div>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed">
            Built for India. Every second counts.<br />
            &copy; {new Date().getFullYear()} LifeLine+ Team. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
