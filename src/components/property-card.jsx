'use client'
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Bed, Bath, Ruler, Star, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';



export const PropertyCard = ({ property, className }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  
  const title = property[`title${locale.charAt(0).toUpperCase() + locale.slice(1)}`];
  const description = property[`description${locale.charAt(0).toUpperCase() + locale.slice(1)}`];

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const navigateToDetail = () => {
    router.push(`/properties/${property.titleEn}_${property.city}_${property.category}_${property.propertyType}/${property.id}`);
  };

  // Price formatting
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(Number(property.price));

  const pricePerDay = property.pricePerDay ? new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(Number(property.pricePerDay)) : null;

  return (
    <Card 
      key={property.id} 
      className={`group rounded-none relative pt-0 overflow-hidden  border border-gray-100 shadow-sm transition-all hover:shadow-md ${className}`}
      onClick={navigateToDetail}
    >
      {/* Image Section */}
      <CardHeader className="relative p-0 h-60 overflow-hidden ">
        {property.images?.length > 0 ? (
          <img
            src={property.images[0]}
            alt={title}
            fill
            className="object-cover  transition-transform duration-300 h-full group-hover:scale-105"
            
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Home className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-2">
          {property.exclusive && (
            <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-none shadow-sm">
              Exclusive
            </Badge>
          )}
          {property.status === 'rent' && (
            <Badge className="bg-blue-600 text-white border-none shadow-sm">
              For Rent
            </Badge>
          )}
          {property.status === 'sale' && (
            <Badge className="bg-green-600 text-white border-none shadow-sm">
              For Sale
            </Badge>
          )}
        </div>

    
      </CardHeader>

      {/* Content Section */}
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
        
        </div>

        <div className="flex items-center text-gray-600 mb-3 text-sm">
          <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
          <span className="line-clamp-1">{property.address}, {property.city}</span>
        </div>

        <div className="mb-4">
          <p className="text-xl font-bold text-blue-600">{formattedPrice}</p>
          {pricePerDay && (
            <p className="text-xs text-gray-500">{pricePerDay}/day</p>
          )}
        </div>

        {/* Property Features */}
        <div className="grid grid-cols-3 gap-2 text-sm border-t pt-3">
          <div className="flex flex-col items-center">
            <div className="flex items-center text-gray-700">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.bedrooms || 0}</span>
            </div>
            <span className="text-xs text-gray-500">Bedrooms</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center text-gray-700">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms || 0}</span>
            </div>
            <span className="text-xs text-gray-500">Bathrooms</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center text-gray-700">
              <Ruler className="h-4 w-4 mr-1" />
              <span>{property.area}</span>
            </div>
            <span className="text-xs text-gray-500">m²</span>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="outline" 
          className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
          onClick={navigateToDetail}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};