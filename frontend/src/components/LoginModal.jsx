import { useState } from 'react'
import { signInWithPopup, signOut } from 'firebase/auth'
import { useGoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext.jsx'
import { auth, firebaseEnabled, googleProvider } from '../lib/firebase.js'
import { X, Mail, User as UserIcon, ChevronRight, AlertCircle, WifiOff } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function LoginModal({ onClose }) {
  const { login, verifyGoogleToken } = useAuth()
  const [mode, setMode] = useState('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userNotFound, setUserNotFound] = useState(false)
  const [backendUnavailable, setBackendUnavailable] = useState(false)

  // Pure Google OAuth Fallback
  const { login: triggerGoogleFallback } = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true)
        console.log('🔄 [Auth Fallback] Google OAuth Success, verifying token...')
        
        // Use the access token to verify with our backend
        // Our backend dual-verification handles both Firebase ID tokens and Google Access/ID tokens
        await verifyGoogleToken(tokenResponse.access_token, 'google_pure')
        onClose()
      } catch (err) {
        console.error('❌ [Auth Fallback] Verification failed:', err)
        setError('Fallback authentication failed. Please check your connection.')
        setLoading(false)
        setMode('form')
      }
    },
    onError: () => {
      console.error('❌ [Auth Fallback] Google Login Failed')
      setError('Google Login failed. Please try again.')
      setLoading(false)
      setMode('form')
    }
  })

  const googleLogin = async () => {
    setMode('google')
    setLoading(true)
    setError('')
    setBackendUnavailable(false)

    // Strategy 1: Try Firebase first
    try {
      console.log('🔐 [Auth] Attempting Firebase Google Login...')
      if (!firebaseEnabled || !auth || !googleProvider) {
        throw new Error('Firebase not configured')
      }

      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()
      
      await verifyGoogleToken(idToken, 'firebase')
      setLoading(false)
      onClose()
    } catch (err) {
      console.warn('⚠️ [Auth] Firebase failed, triggering Pure Google fallback...', err.message)
      
      // Strategy 2: Fallback to Pure Google OAuth
      try {
        triggerGoogleFallback()
      } catch (fallbackErr) {
        console.error('❌ [Auth] All login methods failed')
        setError('Authentication failed. Please use email signin.')
        setLoading(false)
        setMode('form')
      }
    }
  }

  const submitForm = async (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    
    setLoading(true)
    setError('')
    setBackendUnavailable(false)
    
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
      const checkResponse = await fetch(`${backendUrl}/api/auth/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      if (checkResponse.status === 404) {
        setBackendUnavailable(true)
        setLoading(false)
        return
      }
      
      const checkData = await checkResponse.json()
      if (!checkData.exists) {
        setError('Account not found. Please create an account first.')
        setUserNotFound(true)
        setLoading(false)
        return
      }
      
      const signinResponse = await fetch(`${backendUrl}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const signinData = await signinResponse.json()
      if (!signinData.success) {
        setError(signinData.message || 'Sign-in failed')
        setLoading(false)
        return
      }
      
      login(signinData.user)
      setLoading(false)
      onClose()
    } catch (error) {
      setError(error.message || 'Sign-in failed. Please try again.')
      setLoading(false)
    }
  }

  const loginWithDemoMode = () => {
    const demoUser = {
      id: `demo-${Date.now()}`,
      name: name || 'Demo User',
      email: email || 'demo@lifelineplus.in',
      provider: 'demo'
    }
    login(demoUser)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full sm:w-[400px] sm:rounded-3xl rounded-t-3xl p-6 shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Sign In</h2>
            <p className="text-xs text-gray-400 mt-0.5">Access emergency features</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all">
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        {mode === 'google' ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Connecting to Google...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-3">
                <AlertCircle size={18} className="text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <button
              onClick={googleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all active:scale-95 mb-4 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 my-4 text-gray-400">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] uppercase tracking-wider">or continue with email</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <form onSubmit={submitForm} className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input-field"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full shadow-lg shadow-red-500/20"
              >
                {loading ? 'Processing...' : 'Continue as Guest'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
