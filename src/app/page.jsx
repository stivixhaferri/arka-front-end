import React from "react";
import ClientTheme from "@/components/layout-theme";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { domain } from "@/lib/consts";
import { PropertyCard } from "@/components/property-card";
import { Card, CardContent } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import {
  Star,
  Users,
} from "lucide-react";
import HeroSearch from "@/components/hero-search";

const page = async () => {
  const t = await getTranslations("HomePage");

  // --- Safe fetch for exclusives ---
  let featuredProperties = [];
  try {
    const res = await fetch(`${domain}exclusives`, { cache: "no-store" });

    if (res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        featuredProperties = data?.properties || [];
      } else {
        console.error("Expected JSON, got:", contentType);
      }
    } else {
      console.error("Fetch failed:", res.status, res.statusText);
    }
  } catch (error) {
    console.error("Error fetching exclusives:", error);
  }

  const testimonials = [
    {
      id: 1,
      name: "Giulia Bianchi",
      role: "Proprietaria di casa",
      content:
        "Ho trovato la casa dei miei sogni in sole due settimane! Gli agenti sono stati estremamente disponibili durante tutto il processo.",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Investor",
      content:
        "Excellent investment properties with great ROI potential. The market analysis provided was spot on.",
      rating: 4,
    },
    {
      id: 3,
      name: "Ardit Hoxha",
      role: "Blerës për herë të parë",
      content:
        "Si blerës për herë të parë isha i pasigurt, por agjenti im më udhëhoqi në çdo hap. Nuk mund të isha më i lumtur!",
      rating: 5,
    },
  ];

  const mainCities = [
    { img: "/citites/2.jpg", value: "Tirana" },
    { img: "/citites/3.jpg", value: "Vlorë" },
    { img: "/citites/4.jpg", value: "Shkodër" },
    { img: "/citites/5.jpg", value: "Korçë" },
    { img: "/citites/6.jpg", value: "Berat" },
    { img: "/citites/1.jpg", value: "Durrës" },
    { img: "/citites/7.jpg", value: "Pogradec" },
    { img: "/citites/8.jpg", value: "Kukës" },
    { img: "/citites/9.jpg", value: "Lezhë" },
    { img: "/citites/10.jpg", value: "Gjirokastër" },
    { img: "/citites/11.jpg", value: "Sarandë" },
    { img: "/citites/12.jpg", value: "Tepelenë" },
    { img: "/citites/13.jpg", value: "Krujë" },
  ];

  return (
    <ClientTheme>
      <div className="min-h-screen bg-white ">
        {/* Hero Section */}
        <section className="pb-[10%] pt-[50px] px-4 lg:px-[5%] relative bg-[#D2F7FE] ">
          <img src="/houses.png" className="absolute bottom-0 right-0" alt="" />
          <div className="absolute bottom-0 right-0 bg-[#2C5AE2] w-[350px] h-[450px] mb-[5%] rounded-xl blur-3xl opacity-[0.1]"></div>

          <h2 className="text-neutral-950 lg:text-[80px] text-[30px] font-bold relative py-[3%] lg:max-w-[65%]">
            {t("hero_title")}
          </h2>
          <HeroSearch />
        </section>

        {/* Featured Properties */}
        {featuredProperties.length > 0 && (
          <section className="py-16 lg:px-[5%] px-3 bg-white">
            <div className="w-full mx-auto">
              <div className="flex justify-between items-center mb-8 lg:flex-row flex-col">
                <div>
                  <h2 className="text-2xl font-bold lg:text-start text-center text-gray-800">
                    {t("featured_properties")}
                  </h2>
                  <p className="text-gray-600">
                    {t("featured_properties_description")}
                  </p>
                </div>
                <Link href={"/properties"}>
                  <Button
                    variant="outline"
                    className="border-blue-600 lg:my-0 my-3 text-blue-600 hover:bg-blue-50 rounded-none text-lg cursor-pointer"
                  >
                    {t("view_all")}
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {featuredProperties.map((property, index) => (
                  <PropertyCard key={index} property={property} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* About Section */}
        <div className="w-full lg:px-[5%]  px-4 gap-8 py-[5%] flex lg:flex-row flex-col items-center ">
          <div className="lg:w-[50%] w-full flex items-center text-start flex-col gap-3">
            <h2 className="text-5xl font-semibold w-full text-start">
              {t("dream_home_title")}
            </h2>
            <p className="text-xl py-2 text-neutral-800">
              {t("ream_home_title_description")}
            </p>
            <img src="/about2.png" className="w-full" alt="" />
          </div>
          <div className="lg:w-[50%] w-full flex flex-col gap-3">
            <img src="/about1.png" alt="" />
            <img src="/about3.png" alt="" />
          </div>
        </div>

        {/* Cities */}
        <div className="w-full lg:px-[5%] mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {t("browse_cities")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[200px] gap-6">
            {mainCities.map((city, idx) => (
              <div
                key={idx}
                className={`group relative rounded-2xl lg:w-auto w-full overflow-hidden shadow-md hover:shadow-xl transition-all duration-300
                ${idx % 7 === 0 ? "row-span-2" : ""}
                ${idx % 5 === 0 ? "col-span-2" : ""}`}
              >
                <Image
                  src={city.img}
                  alt={city.value}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <h3 className="text-xl font-semibold mb-4 drop-shadow-md">
                    {city.value}
                  </h3>
                  <Link
                    href={`/properties?&city=${encodeURIComponent(city.value)}`}
                    className="px-4 py-2 rounded-xl bg-white text-gray-900 font-medium hover:bg-gray-100 shadow"
                  >
                    {t("view_properties")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="lg:px-[5%] py-[5%] px-4 grid lg:grid-cols-3 grid-cols-1 gap-3">
          <div className="w-full rounded  relative h-[340px] overflow-hidden">
            <Link
              href={"properties?category=sale"}
              className="w-full h-full relative  flex items-start justify-center flex flex-col"
            >
              <Button className=" hover:bg-black w-[220px] absolute top-[10%] left-0 right-0 mx-auto bg-black z-[3] cursor-pointer">
                {t("buy")}
              </Button>
            </Link>
            <img
              src="/sale.png"
              className="absolute h-full w-full top-0 object-cover object-bottom left-0 right-0 bottom-0"
              alt=""
            />
          </div>
          <div className="w-full rounded  relative h-[340px] overflow-hidden">
            <Link
              href={"properties?category=rent"}
              className="w-full h-full relative  flex items-center justify-center"
            >
              <Button className=" hover:bg-black w-[220px]  absolute top-[10%] left-0 right-0 mx-auto bg-black z-[3] cursor-pointer">
                {t("rent")}
              </Button>
            </Link>
            <img
              src="/rent.png"
              className="absolute h-full w-full object-cover object-bottom top-0 left-0 right-0 bottom-0"
              alt=""
            />
          </div>
          <div className="w-full rounded  relative h-[340px] overflow-hidden">
            <Link
              href={"properties?category=exclusive"}
              className="w-full h-full relative  flex items-center justify-center"
            >
              <Button className=" hover:bg-black w-[220px] absolute top-[10%] left-0 right-0 mx-auto bg-black z-[3] cursor-pointer">
                {t("exclusive")}
              </Button>
            </Link>
            <img
              src="/exclusive.png"
              className="absolute h-full w-full object-cover object-bottom top-0 left-0 right-0 bottom-0"
              alt=""
            />
          </div>
        </div>

        {/* Testimonials */}
        <section className="py-[5%] px-4 lg:px-[5%] bg-white">
          <div className="mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t("testimonials_title")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mr-4">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-gray-500 text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t("ready_title")}
            </h2>
            <p className="mb-8 text-blue-100 max-w-2xl mx-auto">
              {t("ready_text")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href={"/properties"}>
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 cursor-pointer">
                  {t("browe_properties")}
                </Button>
              </Link>
              <Link href={"/contact"}>
                <Button
                  variant="outline"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 hover:text-blue-500 cursor-pointer"
                >
                  {t("contact_us")}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </ClientTheme>
  );
};

export default page;
