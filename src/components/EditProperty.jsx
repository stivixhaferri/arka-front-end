"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import { cities } from "@/lib/consts"
import { domain } from "@/lib/consts"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MarkdownEditor from "@/components/markdown-editor"
import MapPicker from "@/components/map-picker"

const EditProperty = ({ id, property }) => {
  // Form state
  const [formData, setFormData] = useState({
    titleEn: property?.titleEn || "",
    titleSq: property?.titleSq || "",
    titleIt: property?.titleIt || "",
    metaDescriptionEn: property?.metaDescriptionEn || "",
    metaDescriptionSq: property?.metaDescriptionSq || "",
    metaDescriptionIt: property?.metaDescriptionIt || "",
    city: property?.city || "",
    zone: property?.zone || "",
    address: property?.address || "",
    category: property?.category || "",
    propertyType: property?.propertyType || "",
    exclusive: property?.exclusive ? "yes" : "no",
    furnished: property?.furnished ? "yes" : "no",
    elevator: property?.elevator ? "yes" : "no",
    invested: property?.invested ? "yes" : "no",
    status: property?.status || "",
    bedrooms: property?.bedrooms?.toString() || "",
    bathrooms: property?.bathrooms?.toString() || "",
    price: property?.price?.toString() || "",
    pricePerDay: property?.pricePerDay?.toString() || "",
    area: property?.area?.toString() || "",
    latitude: property?.latitude || 41.3275,
    longitude: property?.longitude || 19.8187,
    descriptionEn: property?.descriptionEn || "",
    descriptionSq: property?.descriptionSq || "",
    descriptionIt: property?.descriptionIt || "",
    amenities: property?.amenities || [],
    images: property?.images || [],
    agentIds: property?.agents?.map((agent) => agent.id) || [],
  })

  const [descriptionEn, setDescriptionEn] = useState(`${property.descriptionEn}`)
  const [descriptionSq, setDescriptionSq] = useState(`${property.descriptionSq}`)
  const [descriptionIt, setDescriptionIt] = useState(`${property.descriptionIt}`)
  const [amenities, setAmenities] = useState(property.amenities ? property.amenities : [])
  const [images, setImages] = useState([])
  const [agents, setAgents] = useState(property.agents ? property.agents : [])
  const [zones, setZones] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsRes, zonesRes] = await Promise.all([axios.get(`${domain}agents`), axios.get(`${domain}zone`)])
        setAgents(agentsRes.data)
        setZones(zonesRes.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLocationChange = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }))
  }

  const handleAmenityChange = (amenity) => {
    setAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
  }

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
   
      const formDataToSend = new FormData()

      // Append all form fields from formData
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formDataToSend.append(key, item)
          })
        } else {
          formDataToSend.append(key, value)
        }
      })

      // Append descriptions
      formDataToSend.append("descriptionEn", descriptionEn)
      formDataToSend.append("descriptionSq", descriptionSq)
      formDataToSend.append("descriptionIt", descriptionIt)

      // Append amenities
      amenities.forEach((amenity) => formDataToSend.append("amenities", amenity))

      formData.agentIds.forEach((agentId) => formDataToSend.append("agentIds", agentId))

      // Append images
      images.forEach((image) => formDataToSend.append("images", image))

      // Submit PUT request
      const response = await axios.put(`${domain}property/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Property updated:", response.data)
      // Reset form or redirect
    } catch (error) {
      console.error("Error updating property:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (agents.length === 0) {
    return <div className="p-6 w-full text-center text-lg font-semibold">Create an agent before adding a property</div>
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Edit Property</h2>
      <form onSubmit={handleSubmit}>
        {/* Title Section */}
        <div className="grid grid-cols-3 gap-3 pt-5">
          <div className="flex flex-col gap-2">
            <Label>Title En*</Label>
            <Input type="text" name="titleEn" value={formData.titleEn} onChange={handleChange} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Title SQ*</Label>
            <Input type="text" name="titleSq" value={formData.titleSq} onChange={handleChange} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Title IT*</Label>
            <Input type="text" name="titleIt" value={formData.titleIt} onChange={handleChange} required />
          </div>
        </div>

        {/* Meta Description Section */}
        <div className="grid grid-cols-3 gap-3 pt-5">
          <div className="flex flex-col gap-2">
            <Label>Meta Description En</Label>
            <Input type="text" name="metaDescriptionEn" value={formData.metaDescriptionEn} onChange={handleChange} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Meta Description SQ</Label>
            <Input type="text" name="metaDescriptionSq" value={formData.metaDescriptionSq} onChange={handleChange} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Meta Description IT</Label>
            <Input type="text" name="metaDescriptionIt" value={formData.metaDescriptionIt} onChange={handleChange} />
          </div>
        </div>

        {/* Description Section */}
        <div className="grid grid-cols-1 gap-3 py-5">
          <div className="flex flex-col gap-2">
            <Label>Description EN*</Label>
            <MarkdownEditor value={descriptionEn} onChange={setDescriptionEn} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Description SQ*</Label>
            <MarkdownEditor value={descriptionSq} onChange={setDescriptionSq} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Description IT*</Label>
            <MarkdownEditor value={descriptionIt} onChange={setDescriptionIt} />
          </div>
        </div>

        {/* Location Section */}
        <div className="grid grid-cols-3 gap-3 pt-5">
          <div className="flex flex-col gap-2">
            <Label>City*</Label>
            <Select value={formData.city} onValueChange={(value) => handleSelectChange("city", value)} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city, index) => (
                  <SelectItem key={index} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {zones.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Zone</Label>
              <Select value={formData.zone} onValueChange={(value) => handleSelectChange("zone", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Zone" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone, index) => (
                    <SelectItem key={index} value={zone.name}>
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label>Address*</Label>
            <Input type="text" name="address" value={formData.address} onChange={handleChange} required />
          </div>
        </div>

        {/* Map Location Section */}
        <div className="py-5">
          <h3 className="text-lg font-semibold mb-4">Property Location</h3>
          <MapPicker
            latitude={formData.latitude}
            longitude={formData.longitude}
            onLocationChange={handleLocationChange}
          />
        </div>

        {/* Property Details Section */}
        <div className="grid grid-cols-3 gap-3 pt-5">
          <div className="flex flex-col gap-2">
            <Label>Category*</Label>
            <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Property Type*</Label>
            <Select
              value={formData.propertyType}
              onValueChange={(value) => handleSelectChange("propertyType", value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="shop">Shop</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="garage">Garage</SelectItem>
                <SelectItem value="warehouse">Warehouse</SelectItem>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="bar">Bar / Restaurant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Agents</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn("w-full justify-between", formData.agentIds.length === 0 && "text-muted-foreground")}
                >
                  {formData.agentIds.length > 0
                    ? agents
                        .filter((agent) => formData.agentIds.includes(agent.id))
                        .map((a) => a.fullName)
                        .join(", ")
                    : "Select Agents"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search agents..." />
                  <CommandList>
                    {agents.map((agent, index) => (
                      <CommandItem
                        key={index}
                        onSelect={() => {
                          const alreadySelected = formData.agentIds.includes(agent.id)
                          setFormData((prev) => ({
                            ...prev,
                            agentIds: alreadySelected
                              ? prev.agentIds.filter((id) => id !== agent.id)
                              : [...prev.agentIds, agent.id],
                          }))
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Check
                            className={cn(
                              "h-4 w-4",
                              formData.agentIds.includes(agent.id) ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {agent.fullName}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Property Features Section */}
        <div className="grid grid-cols-3 gap-3 pt-5">
          <div className="flex flex-col gap-2">
            <Label>Exclusive</Label>
            <Select value={formData.exclusive} onValueChange={(value) => handleSelectChange("exclusive", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Exclusive" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Furnished</Label>
            <Select value={formData.furnished} onValueChange={(value) => handleSelectChange("furnished", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Furnished" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Elevator</Label>
            <Select value={formData.elevator} onValueChange={(value) => handleSelectChange("elevator", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Elevator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Property Status Section */}
        <div className="grid grid-cols-3 gap-3 pt-5">
          <div className="flex flex-col gap-2">
            <Label>Invested</Label>
            <Select value={formData.invested} onValueChange={(value) => handleSelectChange("invested", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Invested" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Status*</Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="used">Used</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="under_construction">Under Construction</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Property Specifications Section */}
        <div className="grid grid-cols-3 gap-3 pt-5">
          <div className="flex flex-col gap-2">
            <Label>Bedrooms*</Label>
            <Select value={formData.bedrooms} onValueChange={(value) => handleSelectChange("bedrooms", value)} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Bathrooms*</Label>
            <Select
              value={formData.bathrooms}
              onValueChange={(value) => handleSelectChange("bathrooms", value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Bathrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="grid grid-cols-3 gap-3 pt-5">
          <div className="flex flex-col gap-2">
            <Label>Price*</Label>
            <Input type="number" name="price" value={formData.price} onChange={handleChange} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Price per day</Label>
            <Input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Area (sqm)*</Label>
            <Input type="number" name="area" value={formData.area} onChange={handleChange} required />
          </div>
        </div>

        {/* Amenities Section */}
        <div className="grid grid-cols-1 gap-3 py-5">
          <h3 className="text-lg font-semibold">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Indoor Amenities */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="wifi"
                checked={amenities.includes("wifi")}
                onChange={() => handleAmenityChange("wifi")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="wifi">WiFi</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="airConditioning"
                checked={amenities.includes("airConditioning")}
                onChange={() => handleAmenityChange("airConditioning")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="airConditioning">Air Conditioning</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="heating"
                checked={amenities.includes("heating")}
                onChange={() => handleAmenityChange("heating")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="heating">Heating</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="tv"
                checked={amenities.includes("tv")}
                onChange={() => handleAmenityChange("tv")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="tv">TV</Label>
            </div>

            {/* Outdoor Amenities */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="balcony"
                checked={amenities.includes("balcony")}
                onChange={() => handleAmenityChange("balcony")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="balcony">Balcony</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terrace"
                checked={amenities.includes("terrace")}
                onChange={() => handleAmenityChange("terrace")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="terrace">Terrace</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="garden"
                checked={amenities.includes("garden")}
                onChange={() => handleAmenityChange("garden")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="garden">Garden</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="seaView"
                checked={amenities.includes("seaView")}
                onChange={() => handleAmenityChange("seaView")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="seaView">Sea View</Label>
            </div>

            {/* Parking */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="garage"
                checked={amenities.includes("garage")}
                onChange={() => handleAmenityChange("garage")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="garage">Garage</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="parking"
                checked={amenities.includes("parking")}
                onChange={() => handleAmenityChange("parking")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="parking">Parking</Label>
            </div>

            {/* Security */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="security"
                checked={amenities.includes("security")}
                onChange={() => handleAmenityChange("security")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="security">Security System</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="concierge"
                checked={amenities.includes("concierge")}
                onChange={() => handleAmenityChange("concierge")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="concierge">Concierge</Label>
            </div>

            {/* Other Facilities */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="pool"
                checked={amenities.includes("pool")}
                onChange={() => handleAmenityChange("pool")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="pool">Swimming Pool</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="gym"
                checked={amenities.includes("gym")}
                onChange={() => handleAmenityChange("gym")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="gym">Gym</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="elevator"
                checked={amenities.includes("elevator")}
                onChange={() => handleAmenityChange("elevator")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="elevator">Elevator</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="fireplace"
                checked={amenities.includes("fireplace")}
                onChange={() => handleAmenityChange("fireplace")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="fireplace">Fireplace</Label>
            </div>

            {/* Accessibility */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="wheelchair"
                checked={amenities.includes("wheelchair")}
                onChange={() => handleAmenityChange("wheelchair")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="wheelchair">Wheelchair Access</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="petFriendly"
                checked={amenities.includes("petFriendly")}
                onChange={() => handleAmenityChange("petFriendly")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="petFriendly">Pet Friendly</Label>
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="grid grid-cols-1 gap-3 py-5">
          <div className="flex flex-col gap-2">
            <Label>Images</Label>
            <Input type="file" multiple onChange={handleImageChange} accept="image/*" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 py-5">
          {property?.images?.map((el, index) => {
            return (
              <img
                src={`${el}`}
                key={index}
                alt={`Property image ${index + 1}`}
                className="w-full h-32 object-cover rounded"
              />
            )
          })}
        </div>

        {/* Submit Button */}
        <div className="w-full flex items-center gap-2 py-5 justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditProperty