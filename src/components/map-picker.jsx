'use client'
import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import leaflet CSS only in the client
if (typeof window !== 'undefined') {
  import('leaflet/dist/leaflet.css')
}

const MapPicker = ({ latitude, longitude, onLocationChange, height = '400px' }) => {
  const [L, setL] = useState(null)
  const [position, setPosition] = useState([latitude, longitude])
  const mapRef = useRef(null)

  useEffect(() => {
    setPosition([latitude, longitude])
  }, [latitude, longitude])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((leaflet) => {
        delete leaflet.Icon.Default.prototype._getIconUrl
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        })
        setL(leaflet)
      })
    }
  }, [])

  const handleLocationChange = (lat, lng) => {
    setPosition([lat, lng])
    onLocationChange(lat, lng)
  }

  const handleMarkerDragEnd = (event) => {
    const marker = event.target
    const { lat, lng } = marker.getLatLng()
    handleLocationChange(lat, lng)
  }

  const MapComponent = dynamic(() => import('./SafeLeafletMap'), { ssr: false })

  return (
    <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
        <p className="text-sm text-gray-600">
          Click on the map or drag the marker to set the property location
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {/* Coordinates: {position[0].toFixed(6)}, {position[1]?.toFixed(6)} */}
           Coordinates: {position[0]}, {position[1]}
        </p>
      </div>

      <div style={{ height }}>
        {L && (
          <MapComponent
            L={L}
            position={position}
            onDragEnd={handleMarkerDragEnd}
            onClick={handleLocationChange}
            mapRef={mapRef}
          />
        )}
      </div>
    </div>
  )
}

export default MapPicker
