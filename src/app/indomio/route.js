// app/indomio/route.js
import { NextResponse } from "next/server";
import { domain } from "@/lib/consts";

function escapeCDATA(text) {
  if (!text) return "";
  return `<![CDATA[ ${text} ]]>`;
}

// Map property type to XML features block with boilerplate defaults
function getFeaturesXML(p) {
  const common = `
    <floorNumber>${p.floorNumber || 1}</floorNumber>
    <levels>${p.levels || 1}</levels>
    <status>${p.status || "used"}</status>
    <constructionYear>${p.createdAt ? new Date(p.createdAt).getFullYear() : 2025}</constructionYear>
    <furnished>${p.furnished ? "true" : "false"}</furnished>
  `;

  if (p.propertyType === "villa" || p.propertyType === "apartment") {
    return `
      <residential_features>
        <bedrooms>${p.bedrooms || 2}</bedrooms>
        <livingRooms>1</livingRooms>
        <kitchens>1</kitchens>
        <bathrooms>${p.bathrooms || 1}</bathrooms>
        <halfBathrooms>0</halfBathrooms>
        ${common}
        <parkingSpaces>0</parkingSpaces>
        <airConditioning>${p.amenities?.includes("airConditioning") || false}</airConditioning>
        <elevator>${p.elevator || false}</elevator>
        <balconiesSize>0</balconiesSize>
        <garden>${p.amenities?.includes("garden") || false}</garden>
        <swimmingPool>${p.amenities?.includes("pool") || false}</swimmingPool>
        <penthouse>false</penthouse>
        <alarm>false</alarm>
        <fireplace>false</fireplace>
        <bright>true</bright>
        <airy>true</airy>
      </residential_features>
    `;
  } else if (p.propertyType === "business" || p.propertyType === "warehouse") {
    return `
      <commercial_features>
        <rooms>${p.bedrooms || 1}</rooms>
        <bathrooms>${p.bathrooms || 1}</bathrooms>
        ${common}
        <airConditioning>${p.amenities?.includes("airConditioning") || false}</airConditioning>
        <elevator>${p.elevator || false}</elevator>
        <garden>${p.amenities?.includes("garden") || false}</garden>
        <floorType>ceramic tiles</floorType>
        <petsAllowed>false</petsAllowed>
      </commercial_features>
    `;
  } else {
    return `<otherProperty_features>${common}</otherProperty_features>`;
  }
}

export async function GET() {
  let data = { properties: [] };

  try {
    const res = await fetch(`${domain}property`, { next: { revalidate: 60 } });
    if (res.ok) data = await res.json();
  } catch (e) {
    console.warn("Failed to fetch properties, using empty array");
  }

  // If no properties, create a dummy example
  if (!data.properties.length) {
    data.properties.push({
      id: "dummy-1",
      titleEn: "Example Property",
      titleSq: "Shembull Pronë",
      titleIt: "Esempio Proprietà",
      descriptionEn: "This is a sample property description in English.",
      descriptionSq: "Kjo është një përshkrim shembull në shqip.",
      descriptionIt: "Questa è una descrizione di esempio in italiano.",
      city: "Tiranë",
      zone: "Xhamlliku",
      address: "Rruga Telo Ndini",
      latitude: "41.336220",
      longitude: "19.837414",
      area: "190",
      category: "sale",
      propertyType: "apartment",
      status: "used",
      furnished: false,
      elevator: true,
      invested: false,
      bedrooms: 4,
      bathrooms: 1,
      amenities: ["airConditioning", "pool", "garden"],
      images: ["http://yoursite.com/photo_01.jpg", "http://yoursite.com/photo_02.jpg"],
      agents: [{ fullName: "Dragan Milosevic", phone: "+381051874793", email: "email@example.com" }],
      createdAt: "2025-07-01T00:00:00.000Z",
      updatedAt: "2025-09-01T00:00:00.000Z",
    });
  }

  const xmlProperties = data.properties.map((p, index) => {
    const agent = p.agents?.[0] || {};

    const photosXML = (p.images || []).map((img, i) => `
      <photo>
        <url>${escapeCDATA(img)}</url>
        <priority>${i + 1}</priority>
      </photo>
    `).join("");

    return `
<property>
  <mainFeatures>
    <id>${index + 1}</id>
    <brokerListingID>${escapeCDATA(p.id)}</brokerListingID>
    <dateUpdated>${new Date(p.updatedAt).toISOString().split("T")[0]}</dateUpdated>
    <dateAvailable>${new Date(p.createdAt).toISOString().split("T")[0]}</dateAvailable>
    <size>${p.area}</size>
    <listingType>${p.category === "rent" ? "for rent" : "for sale"}</listingType>
    <price>
      <amount>${p.price || "0"}</amount>
      <currency>EUR</currency>
    </price>
    <investment>${p.invested || false}</investment>
    <corner>false</corner>
    <noAgentFee>false</noAgentFee>
  </mainFeatures>

  <location>
    <geographyId>507074</geographyId>
    <originalLocation>${escapeCDATA(`${p.city}\\${p.zone}`)}</originalLocation>
    <addresses>
      <address>
        <language>sq</language>
        <streetAddress>${escapeCDATA(p.address)}</streetAddress>
      </address>
      <addressVisible>true</addressVisible>
    </addresses>
    <geocodes>
      <latitude>${p.latitude}</latitude>
      <longitude>${p.longitude}</longitude>
    </geocodes>
    <zip>1000</zip>
    <zoning>${p.category}</zoning>
    <roadType>asphalt</roadType>
  </location>

  <categoryFeatures>
    <propertyType category="${p.category}" subCategory="${p.propertyType}"/>
    <originalPropertyType>${escapeCDATA(p.propertyType)}</originalPropertyType>
    ${getFeaturesXML(p)}
  </categoryFeatures>

  <descriptions>
    <description>
      <language>en</language>
      <description>${escapeCDATA(p.descriptionEn)}</description>
    </description>
    <description>
      <language>sq</language>
      <description>${escapeCDATA(p.descriptionSq)}</description>
    </description>
    <description>
      <language>it</language>
      <description>${escapeCDATA(p.descriptionIt)}</description>
    </description>
  </descriptions>

  <media>
    <photos>${photosXML}</photos>
  </media>

  <agent>
    <firstName>${escapeCDATA(agent.fullName || "")}</firstName>
    <lastName></lastName>
    <phoneNumber>${agent.phone || ""}</phoneNumber>
    <email>${agent.email || ""}</email>
  </agent>
</property>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<properties xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="indomio.xsd">
${xmlProperties}
</properties>`;

  return new NextResponse(xml, { headers: { "Content-Type": "application/xml" } });
}
