"use client"
import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { PropertyCard } from "./property-card"

// Fix default marker icon issues with Webpack/Next.js
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  className: "custom-marker-icon",
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const ResizeMap = () => {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize()
    }, 100)
  }, [map])
  return null
}



const PropertyMap = ({ properties }) => {
  const [selectedProperty, setSelectedProperty] = useState(null)

  const validProperties = properties.filter(
    (property) => property.latitude && property.longitude && !isNaN(property.latitude) && !isNaN(property.longitude),
  )

  if (!validProperties.length) {
    return (
      <div className="flex h-screen max-h-screen w-full relative rounded-xl overflow-hidden bg-gray-100 items-center justify-center">
        <p className="text-gray-500">No properties with valid coordinates to display</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen max-h-screen w-full relative rounded-xl overflow-hidden">
      <div className="flex-1 relative">
        <MapContainer center={[41.3275, 19.8189]} zoom={13} className="h-full w-full z-0">
          <ResizeMap />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {validProperties.map((property) => (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
              icon={customIcon}
              eventHandlers={{
                click: () => setSelectedProperty(property),
              }}
            />
          ))}
        </MapContainer>
      </div>

      {selectedProperty && (
        <div key={selectedProperty.id} className="lg:w-[340px] w-full absolute lg:bottom-2 bottom-0 lg:right-2  bg-transparent shadow-lg">
          <PropertyCard property={selectedProperty} className="h-[60%]" />
          <button
            onClick={() => setSelectedProperty(null)}
            className="absolute top-2 right-2 bg-white w-[35px] h-[35px] p-1 shadow-md hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

export default PropertyMap
