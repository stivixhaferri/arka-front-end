"use client"
import { useEffect, useState, useMemo, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import ClientTheme from "@/components/layout-theme"
import PropertyMap from "@/components/PropertyMap"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/multi-select"
import { Label } from "@/components/ui/label"
import { cities, domain, propertyTypes } from "@/lib/consts"
import axios from "axios"
import { useTranslations } from "next-intl"
import { PropertyCard } from "@/components/property-card"

const Page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations("Properties")

  const propertyTypeOptions = useMemo(
    () =>
      propertyTypes.map((type) => ({
        name: type,
        value: type,
      })),
    [],
  )

  const [zones, setZones] = useState([])
  const [properties, setProperties] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)

  const [filters, setFilters] = useState({
    keyword: "",
    selectedPropertyTypes: [],
    selectedZones: [],
    category: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    invested: "",
    elevator: "",
    furnished: "",
    bedrooms: "",
    bathrooms: "",
    status: "",
  })

  useEffect(() => {
    if (!isInitialized) {
      const searchCategory = searchParams.get("category")
      const newCategory =
        searchCategory === "rent"
          ? "rent"
          : searchCategory === "buy"
            ? "sale"
            : searchCategory === "exclusive"
              ? "exclusive"
              : searchCategory || ""

      const typeParam = searchParams.get("type")
      const zonesParam = searchParams.get("zones")

      setFilters({
        keyword: searchParams.get("keyword") || "",
        selectedPropertyTypes: typeParam ? typeParam.split(",") : [],
        selectedZones: zonesParam ? zonesParam.split(",") : [],
        category: newCategory,
        city: searchParams.get("city") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        minArea: searchParams.get("minArea") || "",
        maxArea: searchParams.get("maxArea") || "",
        invested: searchParams.get("invested") || "",
        elevator: searchParams.get("elevator") || "",
        furnished: searchParams.get("furnished") || "",
        bedrooms: searchParams.get("bedrooms") || "",
        bathrooms: searchParams.get("bathrooms") || "",
        status: searchParams.get("status") || "",
      })

      setIsInitialized(true)
    }
  }, [searchParams, isInitialized])

  const updateURL = useCallback(
    (newFilters) => {
      const params = new URLSearchParams()

      Object.entries(newFilters).forEach(([key, value]) => {
        if (key === "selectedPropertyTypes" && value.length) {
          params.set("type", value.join(","))
        } else if (key === "selectedZones" && value.length) {
          params.set("zones", value.join(","))
        } else if (value && key !== "selectedPropertyTypes" && key !== "selectedZones") {
          params.set(key, value)
        }
      })

      const newURL = `/properties?${params.toString()}`
      if (window.location.pathname + window.location.search !== newURL) {
        router.replace(newURL, { scroll: false })
      }
    },
    [router],
  )

  useEffect(() => {
    if (isInitialized) {
      const timeoutId = setTimeout(() => {
        updateURL(filters)
      }, 100) // Small debounce to prevent rapid updates

      return () => clearTimeout(timeoutId)
    }
  }, [filters, isInitialized, updateURL])

  const getZones = async () => {
    try {
      const res = await axios.get(`${domain}zone`)
      setZones(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getFilteredProperties = async () => {
    try {
      const params = {
        keyword: filters.keyword,
        city: filters.city,
        category: filters.category,
        status: filters.status,
        propertyType: filters.selectedPropertyTypes.length ? filters.selectedPropertyTypes.join(",") : undefined,
        zone: filters.selectedZones.length ? filters.selectedZones.join(",") : undefined,
        invested: filters.invested,
        furnished: filters.furnished,
        elevator: filters.elevator,
        bedrooms: filters.bedrooms,
        bathrooms: filters.bathrooms,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minArea: filters.minArea,
        maxArea: filters.maxArea,
      }

      const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== "" && v !== undefined))

      const res = await axios.get(`${domain}property/filter`, { params: filteredParams })
      setProperties(res.data)
    } catch (error) {
      console.log("Error fetching filtered properties:", error)
    }
  }

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  const handleResetFilters = () => {
    const resetFilters = {
      keyword: "",
      selectedPropertyTypes: [],
      selectedZones: [],
      category: "",
      city: "",
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      invested: "",
      elevator: "",
      furnished: "",
      bedrooms: "",
      bathrooms: "",
      status: "",
    }
    setFilters(resetFilters)
  }

  useEffect(() => {
    getZones()
  }, [])

  useEffect(() => {
    if (isInitialized) {
      getFilteredProperties()
    }
  }, [filters, isInitialized])

  return (
    <ClientTheme>
      <div className="relative pt-[3%] lg:px-[5%] px-3 flex items-start gap-3">
        <div className="flex items-center gap-1 w-full justify-end">
          <Sheet>
            <SheetTrigger>
              <Button className="flex items-center gap-2 bg-[#203E97] text-white">
                <SlidersHorizontal /> {t("filters")}
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto px-4">
              <SheetHeader>
                <SheetTitle>{t("filters")}</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>{t("keyword")}</Label>
                  <Input
                    value={filters.keyword}
                    onChange={(e) => updateFilter("keyword", e.target.value)}
                    placeholder={t("filters")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t("property_types")}</Label>
                  <MultiSelect
                    options={propertyTypeOptions}
                    selected={filters.selectedPropertyTypes}
                    onChange={(value) => updateFilter("selectedPropertyTypes", value)}
                    placeholder={t("select_property_types")}
                    variant="inverted"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t("category")}</Label>
                  <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("select_category")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">{t("sale")}</SelectItem>
                      <SelectItem value="rent">{t("rent")}</SelectItem>
                      <SelectItem value="exclusive">{t("exclusive")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>{t("city")}</Label>
                  <Select value={filters.city} onValueChange={(value) => updateFilter("city", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("select_city")} />
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
                <div className="grid gap-2">
                  <Label>{t("zone")}</Label>
                  <MultiSelect
                    options={zones}
                    selected={filters.selectedZones}
                    onChange={(value) => updateFilter("selectedZones", value)}
                    placeholder={t("select_zones")}
                    variant="inverted"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t("price_range")}</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder={t("min_price")}
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => updateFilter("minPrice", e.target.value)}
                    />
                    <Input
                      placeholder={t("max_price")}
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => updateFilter("maxPrice", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>{t("area_range")} (m²)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder={t("min_area")}
                      type="number"
                      value={filters.minArea}
                      onChange={(e) => updateFilter("minArea", e.target.value)}
                    />
                    <Input
                      placeholder={t("max_area")}
                      type="number"
                      value={filters.maxArea}
                      onChange={(e) => updateFilter("maxArea", e.target.value)}
                    />
                  </div>
                </div>
                {[
                  { label: t("invested"), key: "invested" },
                  { label: t("elevator"), key: "elevator" },
                  { label: t("furnished"), key: "furnished" },
                ].map(({ label, key }) => (
                  <div className="grid gap-2" key={key}>
                    <Label>{label}</Label>
                    <Select value={filters[key]} onValueChange={(value) => updateFilter(key, value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">{t("yes")}</SelectItem>
                        <SelectItem value="no">{t("no")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
                <div className="grid gap-2">
                  <Label>{t("bedrooms")}</Label>
                  <Select value={filters.bedrooms} onValueChange={(value) => updateFilter("bedrooms", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("select_bedrooms")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5+">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>{t("bathrooms")}</Label>
                  <Select value={filters.bathrooms} onValueChange={(value) => updateFilter("bathrooms", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("select_bathrooms")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5+">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>{t("status")}</Label>
                  <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="used">{t("used")}</SelectItem>
                      <SelectItem value="new">{t("new")}</SelectItem>
                      <SelectItem value="under_construction">{t("under_construction")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2 pt-4">
                  <Button variant="outline" className="w-full bg-transparent" onClick={handleResetFilters}>
                    {t("reset")}
                  </Button>
                  <Button className="w-full bg-[#203E97]" onClick={getFilteredProperties}>
                    {t("apply_filters")}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="lg:px-[5%] px-3">
        <Tabs defaultValue="listing" className="w-full">
          <TabsList>
            <TabsTrigger value="listing">{t("properties_and_map")}</TabsTrigger>
            <TabsTrigger value="map">{t("full_map")}</TabsTrigger>
          </TabsList>

          <TabsContent value="listing">
            {properties.length === 0 ? (
              <p className="mt-4 text-muted-foreground">{t("no_properties_found")}</p>
            ) : (
              <div className="flex items-start lg:flex-row flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 lg:w-[55%] w-full h-screen overflow-y-scroll lg:mb-1 mb-5">
                  {properties.map((property, index) => (
                    <div key={property.id || index}>
                      <PropertyCard property={property} className="custom-class-if-needed" />
                    </div>
                  ))}
                </div>
                <div className="w-[45%] overflow-hidden pb-5 lg:flex hidden">
                  <PropertyMap properties={properties} />
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="map" className={'overflow-hidden  pb-5'}>
            <PropertyMap properties={properties} />
          </TabsContent>
        </Tabs>
      </div>
    </ClientTheme>
  )
}

export default Page
