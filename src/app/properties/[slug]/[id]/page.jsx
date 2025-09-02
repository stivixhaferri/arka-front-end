import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import ImageZoomComponent from "@/components/ImageZoom";
import { FaPhoneAlt } from "react-icons/fa";
import Link from "next/link";
import { IoIosMore } from "react-icons/io";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaShareAlt,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlineMail } from "react-icons/md";
import ClientTheme from "@/components/layout-theme";
import ReactMarkdown from "react-markdown";
import { SiWhatsapp } from "react-icons/si";
import { domain } from "@/lib/consts";
import BookingForm from "@/components/BookingForm";

import BottomMap from "@/components/BottomMap";
import { getTranslations } from "next-intl/server";


const PropertyDetailsPage = async ({ params }) => {
  const t = await getTranslations("Property");

  const { id } = params;
  const res = await fetch(`${domain}property/${id}`);
  const property = await res.json();

  return (
    <ClientTheme>
      <div className="min-h-screen bg-white pt-[0px] w-full overflow-hidden">
        {/* Property Header */}
        <div className="bg-[#223F8F] text-white py-4">
          <div className="lg:px-[5%] mx-auto px-4">
            <div className="flex items-center lg:text-sm text-[10px]">
              <Link href={'/'}>{t("home")} </Link>
              <IoIosArrowForward className="lg:mx-2" />
              <Link href={'/properties'}>{t("properties")}</Link>
              <IoIosArrowForward className="lg:mx-2" />
              <Link href={`/properties?&city=${encodeURIComponent(property.city)}`}>{property.city}</Link>
              <IoIosArrowForward className="lg:mx-2" />
              <span className="lg:font-semibold">{property.titleEn}</span>
            </div>
            <h1 className="lg:text-3xl text-xl font-bold mt-2">{property.titleEn}</h1>
            <div className="flex items-center mt-4">
              <div className="flex items-center mr-6">
                <FaBed className="mr-2" />
                <span>
                  {property.bedrooms} {t("bedrooms")}
                </span>
              </div>
              <div className="flex items-center mr-6">
                <FaBath className="mr-2" />
                <span>
                  {property.bathrooms} {t("bathrooms")}
                </span>
              </div>
              <div className="flex items-center">
                <FaRulerCombined className="mr-2" />
                <span>{property.area} m²</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:px-[5%] mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Property Images and Details */}
            <div className="lg:w-2/3">
              {/* Image Gallery */}
              <div className="mb-8">
                <Carousel className="lg:w-[95%] w-full mx-auto lg:min-h-[700px] ">
                  <CarouselContent>
                    {property.images.map((image, index) => (
                      <CarouselItem
                        key={index}
                        className="relative lg:h-[700px] h-[400px]  w-full object-cover  overflow-hidden"
                      >
                        <ImageZoomComponent  src={image}  heright={`lg:h-[700px] h-[400px]`} />
                      
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>

              {/* Property Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#223F8F] mb-4">
                  {t("property_description")}
                </h2>
                <p className="text-gray-700 mb-4 w-full overflow-hidden">
                  <ReactMarkdown>{property.descriptionEn}</ReactMarkdown>
                </p>

                <h3 className="text-xl font-semibold text-[#223F8F] mt-6 mb-3">
                  {t("features")}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...new Set(property.amenities)].map(
                    (formattedAmenity, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-[#F67F2C] rounded-full mr-2"></div>
                        <span>{t(`${formattedAmenity}`)}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Location Map - Placeholder */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#223F8F] mb-4">
                  {t("location")}
                </h2>
                <BottomMap
                  latitude={property?.latitude}
                  longitude={property.longitude}
                />
                <p className="mt-2 text-gray-700">
                  {property.address}, {property.zone}, {property.city}
                </p>
              </div>
            </div>

            {/* Right Column - Booking/Sale Info and Agents */}
            <div className="lg:w-1/3">
              {/* Price Box */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-[#223F8F]">
                    {property.category == "rent" ? "For Rent" : "For Sale"}
                  </h3>
                  {property.exclusive && (
                    <span className="bg-[#F67F2C] text-white text-xs font-bold px-2 py-1 rounded">
                      {t("exclusive")}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-3xl font-bold text-gray-900">
                    {property.category === "rent"
                      ? `$${property.price}/${t("month")}`
                      : `$${property.price}`}
                  </p>
                  {property.category === "rent" && property.pricePerDay && (
                    <p className="text-gray-600">
                      ${property.pricePerDay}/{t("day")}
                    </p>
                  )}
                </div>

                {property.category === "rent" && <BookingForm   property={property} />}

                {property.category === "sale" && (
                  <button className="w-full bg-[#223F8F] hover:bg-[#1a336e] text-white font-bold py-3 px-4 rounded-lg transition duration-200">
                    {t("contact_to_purchase")}
                  </button>
                )}

                <div className="flex justify-between mt-4">
                  <button className="flex items-center text-gray-600 hover:text-[#223F8F]">
                    <FaShareAlt className="mr-2" />
                    {t("share")}
                  </button>
                </div>
              </div>

              {/* Agents Section */}
              {property.agents.map((agent, index) => (
                <div
                  key={index}
                  className="bg-white  rounded-xl border-[0.3px] border-neutral-200 my-5"
                >
                  <div className="p-3">
                    <img
                      src={agent.image}
                      alt={agent.name}
                      className="object-cover h-[450px] rounded-lg  w-full"
                    />
                  </div>
                  <div className="px-3 py-3">
                    <h4 className="font-bold text-black text-2xl">
                      {agent.fullName}
                    </h4>
                    <h4 className="font-bold text-black text-lg">
                      {agent.position}
                    </h4>
                    <h4 className="font-bold text-black text-md">
                      📍 {agent.office}
                    </h4>
                  </div>
                  <div className="flex items-center flex-col gap-2 py-3 px-3">
                    {agent.whatsapp && (
                      <Link
                        className="w-full py-2 bg-[#25D366] hover:bg-[#25d359] rounded-lg flex items-center justify-center gap-3 text-white "
                        href={"/"}
                      >
                        <SiWhatsapp />
                        {agent.whatsapp}
                      </Link>
                    )}
                    {agent.phone && (
                      <Link
                        className="w-full py-2 bg-[#F47F29] hover:bg-[#f48b29] rounded-lg flex items-center justify-center gap-3 text-white "
                        href={"/"}
                      >
                        <FaPhoneAlt /> {agent.phone}
                      </Link>
                    )}

                    <Link
                      className="w-full py-2 bg-[#203F96] hover:bg-[#203b96] rounded-lg flex items-center justify-center gap-3 text-white "
                      href={"/"}
                    >
                      <MdOutlineMail /> {agent.email}
                    </Link>
                    <Link
                      className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center justify-center gap-3 text-black"
                      href={`/team/${agent.fullName?.toLowerCase()}/${agent.position?.toLowerCase()}/${
                        agent.id
                      }`}
                    >
                      <IoIosMore /> {t("more")}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ClientTheme>
  );
};

export default PropertyDetailsPage;
