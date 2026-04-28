import { useState, useEffect, useRef, useCallback } from 'react'

const GEO_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0
}

export function useGeolocation() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [accuracy, setAccuracy] = useState(null)
  const watchIdRef = useRef(null)

  const handleSuccess = useCallback((position) => {
    const { latitude, longitude, accuracy: locAccuracy } = position.coords
    setLocation({
      lat: latitude,
      lng: longitude,
      accuracy: locAccuracy,
      timestamp: position.timestamp
    })
    setAccuracy(locAccuracy)
    setError(null)
    setLoading(false)
  }, [])

  const handleError = useCallback((err) => {
    let msg = 'Unable to get location'
    switch (err.code) {
      case err.PERMISSION_DENIED:
        msg = 'Location permission denied. Please enable it in browser settings.'
        break
      case err.POSITION_UNAVAILABLE:
        msg = 'Location unavailable. Check GPS or network.'
        break
      case err.TIMEOUT:
        msg = 'Location request timed out.'
        break
      default:
        msg = `Error: ${err.message}`
    }
    setError(msg)
    setLoading(false)
    // Fallback to Kolkata
    if (!location) {
      setLocation({ lat: 22.5726, lng: 88.3639, accuracy: null, timestamp: Date.now() })
    }
  }, [location])

  const refreshLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation not supported')
      setLocation({ lat: 22.5726, lng: 88.3639, accuracy: null, timestamp: Date.now() })
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, GEO_OPTIONS)
  }, [handleSuccess, handleError])

  useEffect(() => {
    refreshLocation()
    
    // Watch for position updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      GEO_OPTIONS
    )
    
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [refreshLocation, handleSuccess, handleError])

  // Get accuracy quality and color
  const getAccuracyQuality = () => {
    if (!accuracy) return 'unknown'
    if (accuracy <= 10) return 'excellent'
    if (accuracy <= 50) return 'good'
    if (accuracy <= 100) return 'fair'
    return 'poor'
  }

  const getAccuracyColor = () => {
    const quality = getAccuracyQuality()
    switch (quality) {
      case 'excellent': return 'text-green-500'
      case 'good': return 'text-blue-500'
      case 'fair': return 'text-yellow-500'
      case 'poor': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  return {
    location,
    error,
    loading,
    accuracy,
    accuracyQuality: getAccuracyQuality(),
    accuracyColor: getAccuracyColor(),
    refreshLocation
  }
}

export default useGeolocation
