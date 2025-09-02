"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ import router
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Home, Building2, Crown } from "lucide-react";
import { cities } from "@/lib/consts";
import { propertyTypes } from "@/lib/consts";
import { useTranslations } from "next-intl";

const priceConfig = {
  buy: {
    min: 100000,
    max: 10000000,
    step: 10000,
    placeholder: "e.g. 500000",
  },
  rent: {
    min: 500,
    max: 20000,
    step: 100,
    placeholder: "e.g. 2000",
  },
  exclusive: {
    min: 1000000,
    max: 50000000,
    step: 100000,
    placeholder: "e.g. 5000000",
  },
};

const HeroSearch = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("buy");
  const [selectedCity, setSelectedCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const t = useTranslations("HomePage");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMinPrice("");
    setMaxPrice("");
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    // Always include category
    const categoryParam = activeTab == "buy" ? "sale" : activeTab;
    params.append("category", activeTab);

    // Add only filled values
    if (selectedCity) params.append("city", selectedCity);
    if (selectedType) params.append("type", selectedType);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="w-full mx-auto bg-white p-6 border relative">
      <Tabs defaultValue="buy" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-3 h-12 lg:w-[30%] w-full bg-gray-100">
          <TabsTrigger value="buy" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            {t("buy")}
          </TabsTrigger>
          <TabsTrigger value="rent" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            {t("rent")}
          </TabsTrigger>
          <TabsTrigger value="exclusive" className="flex items-center gap-2">
            <Crown className="w-4 h-4" />
            {t("exclusive")}
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 justify-start">
            {/* City Selector */}
            <Select onValueChange={setSelectedCity}>
              <SelectTrigger className="h-14 border-gray-300 w-full rounded-none">
                <SelectValue placeholder={t("all_cities")} />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Property Type */}
            <Select onValueChange={setSelectedType}>
              <SelectTrigger className="h-14 border-gray-300 w-full rounded-none">
                <SelectValue placeholder={t("all_types")} />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem
                    key={type}
                    value={type.toLowerCase().replace(" ", "-")}
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Min Price */}
            <div className="flex flex-col">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  Є
                </span>
                <Input
                  type="number"
                  placeholder={t("min_price")}
                  className="pl-8 border-gray-300 rounded-none"
                  min={priceConfig[activeTab].min}
                  max={priceConfig[activeTab].max}
                  step={priceConfig[activeTab].step}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Max Price */}
            <div className="flex flex-col">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                 Є
                </span>
                <Input
                  type="number"
                  placeholder={t("max_price")}
                  className="pl-8 border-gray-300 rounded-none"
                  min={priceConfig[activeTab].min}
                  max={priceConfig[activeTab].max}
                  step={priceConfig[activeTab].step}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-end w-full">
            <Button
              onClick={handleSearch}
              className="cursor-pointer px-8 py-5 text-xl rounded-none gap-2 bg-[#F47F29] hover:bg-[#F47F29]"
            >
              <Search className="w-12 h-12" />
              {t("search")}
            </Button>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default HeroSearch;
