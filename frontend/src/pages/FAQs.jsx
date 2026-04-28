import { useState, useRef, useEffect } from 'react'
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react'

const faqs = [
  { q: 'What is LifeLine+?', a: 'LifeLine+ is a real-time emergency response platform for India. It connects users with ambulances, hospitals, doctors, and police using live GPS tracking, AI-powered routing, and instant communication — all in one app.' },
  { q: 'How fast can an ambulance reach me?', a: 'Average response time is under 5 minutes in urban areas. The app calculates live ETA based on real-time traffic data from Google Maps and distance from your location. You see the exact arrival time before booking.' },
  { q: 'What if no ambulance is available nearby?', a: 'If no ambulance is within range, the app offers Civilian Mode. Gemini AI verifies your emergency request using your vehicle number, purpose, and contact. If approved, your personal vehicle gets temporary emergency status for 6 hours with police alerts along your route.' },
  { q: 'Is the LifeLine+ service free?', a: 'Emergency discovery, route planning, and AI chat assistance are completely free. Ambulance bookings and doctor appointments may involve charges set by the individual provider. We never charge for basic emergency coordination.' },
  { q: 'How does Civilian Mode work step-by-step?', a: '1) Tap "No ambulance nearby? Use Civilian Mode" 2) Enter your vehicle registration number, emergency purpose, and contact 3) Gemini AI evaluates in ~3 seconds 4) If approved, a temporary emergency vehicle ID is issued 5) Police stations along your route are auto-alerted 6) Your live GPS broadcasts every 5 seconds for safety tracking.' },
  { q: 'Are my location and personal data secure?', a: 'Absolutely. We use TLS 1.3 encryption for all API calls, location data is purged 24 hours after emergency resolution, and we comply with India\'s Digital Personal Data Protection Act, 2023. Location is only shared during active emergencies with authorized responders.' },
  { q: 'Can I book a doctor appointment through the app?', a: 'Yes. Use the Doctors tab to search nearby doctors and clinics by specialty (Cardiology, Emergency, Pediatrics, Orthopedics). View real-time availability, select a time slot, and confirm your booking. You also get the doctor\'s phone number for direct contact.' },
  { q: 'Does LifeLine+ work without internet?', a: 'The Progressive Web App (PWA) caches key assets and emergency contact numbers. Cached map tiles and saved hospital data work offline. However, live ambulance tracking, AI chat, and real-time route updates require an internet connection.' },
  { q: 'How does the ambulance demo animation work?', a: 'When you book an ambulance, the map shows a live demo of the ambulance driving from its current location to your pickup spot. A colored path appears between the two points, and the ambulance marker smoothly animates along the route with a real-time countdown timer showing arrival time.' },
  { q: 'What is the 3D ambulance marker on the map?', a: 'Unlike flat pins, LifeLine+ uses a custom 3D-style ambulance SVG marker with depth, shadows, and a subtle floating animation. This makes it easy to spot the ambulance on the map at a glance — inspired by Uber, Rapido, and Flipkart Minutes live tracking.' },
  { q: 'Can I use LifeLine+ in any city in India?', a: 'Yes. LifeLine+ works anywhere Google Maps covers in India. The backend discovers real hospitals, police stations, doctors, and pharmacies through the Google Places API. Urban areas have the highest accuracy due to denser map data.' },
  { q: 'How do I add LifeLine+ to my phone home screen?', a: 'On Android Chrome: Tap the menu (3 dots) → "Add to Home screen". On iOS Safari: Tap the Share button → "Add to Home Screen". This installs the PWA for faster access, offline fallback, and a native app-like experience.' },
]

function AccordionItem({ item, index, isOpen, onToggle }) {
  const contentRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, [])

  return (
    <div className={`card overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-md ring-1 ring-red-100 dark:ring-red-900/30' : 'hover:shadow-sm'}`}>
      <button
        onClick={() => onToggle(isOpen ? null : index)}
        className="w-full flex items-center justify-between text-left py-1"
      >
        <span className="text-sm font-semibold text-gray-900 dark:text-white pr-4 leading-snug">
          {index + 1}. {item.q}
        </span>
        <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rotate-180' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
          <ChevronDown size={16} />
        </div>
      </button>
      <div
        className="transition-all duration-300 ease-out overflow-hidden"
        style={{ maxHeight: isOpen ? height : 0, opacity: isOpen ? 1 : 0 }}
      >
        <div ref={contentRef} className="pt-3 pb-1">
          <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.a}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FAQs() {
  const [open, setOpen] = useState(null)

  return (
    <div className="pb-24">
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-5 pb-10 rounded-b-3xl">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <HelpCircle size={24} /> Frequently Asked Questions
        </h1>
        <p className="text-red-100 text-sm mt-1">Everything you need to know about LifeLine+</p>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {/* Quick support banner */}
        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3 mb-2">
          <MessageCircle size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Still have questions?</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              Reach out via the Contact page or email{' '}
              <a href="mailto:support@lifelineplus.in" className="text-blue-600 dark:text-blue-400 font-medium underline">
                support@lifelineplus.in
              </a>
            </p>
          </div>
        </div>

        {faqs.map((item, i) => (
          <AccordionItem
            key={i}
            item={item}
            index={i}
            isOpen={open === i}
            onToggle={setOpen}
          />
        ))}
      </div>
    </div>
  )
}
