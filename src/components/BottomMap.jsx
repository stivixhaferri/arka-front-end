'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for marker icons when using Next.js or Webpack
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
})

// Optional: custom marker icon
const customIcon = new L.Icon({
  iconUrl: '/map_pin.png',
  iconSize: [35, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: 'custom-marker-icon',
})

// Handle map resize properly when shown dynamically
const ResizeMap = () => {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize()
    }, 100)
  }, [map])
  return null
}

const BottomMap = ({ latitude, longitude, title = 'Property Location' }) => {
  if (!latitude || !longitude) {
    return <div>No location provided</div>
  }

  const position = [latitude, longitude]

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
      <MapContainer
        center={position}
        zoom={14}
        className="h-full w-full z-0"
        scrollWheelZoom={false}
      >
        <ResizeMap />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />
        <Marker position={position} icon={customIcon}>
          {/* Optional popup */}
          {/* <Popup>{title}</Popup> */}
        </Marker>
      </MapContainer>
    </div>
  )
}

export default BottomMap
