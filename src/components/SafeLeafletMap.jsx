'use client'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'

const MapClickHandler = ({ onLocationChange }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng
      onLocationChange(lat, lng)
    },
  })
  return null
}

const SafeLeafletMap = ({ L, position, onDragEnd, onClick, mapRef }) => {
  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      className='z-[2]'
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <Marker
        position={position}
        draggable={true}
        eventHandlers={{
          dragend: onDragEnd,
        }}
      />

      <MapClickHandler onLocationChange={onClick} />
    </MapContainer>
  )
}

export default SafeLeafletMap
