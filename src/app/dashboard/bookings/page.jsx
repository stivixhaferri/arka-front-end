'use client';

import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Info } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { domain } from "@/lib/consts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${domain}bookings`);
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data = await res.json();
        setBookings(data || []);
      } catch (err) {
        toast.error(err.message);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <p className="text-center py-8">Loading bookings...</p>;
  }

  if (!bookings.length) {
    return <p className="text-center py-8 text-neutral-500">No bookings found.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-4">Bookings</h2>
      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableCaption>A list of all bookings.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((el, index) => (
              <TableRow
                key={index}
                className={
                  el.property?.exclusive
                    ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                    : ""
                }
              >
                <TableCell className="font-medium">{el.name || '-'}</TableCell>
                <TableCell>{el.phone || '-'}</TableCell>
                <TableCell>{el.email || '-'}</TableCell>
                <TableCell>{el.category?.toUpperCase() || '-'}</TableCell>
                <TableCell>{el.startDate?.substring(0, 10) || '-'}</TableCell>
                <TableCell>{el.endDate?.substring(0, 10) || '-'}</TableCell>

                {/* Details Dialog */}
                <TableCell>
                  {el.property ? (
                    <Dialog>
                      <DialogTrigger>
                        <Button className="cursor-pointer"><Info /></Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{el.property.titleSq || '-'}</DialogTitle>
                          {el.property.images?.[0] && (
                            <img
                              src={el.property.images[0]}
                              alt="Property"
                              className="rounded-lg w-full mb-2"
                            />
                          )}
                        </DialogHeader>

                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="default">Guests: {el.guests || 0}</Badge>
                          <Badge variant="default">Status: {el.status || '-'}</Badge>
                          <Badge variant="default">City: {el.property.city || '-'}</Badge>
                          <Badge variant="default">Zone: {el.property.zone || '-'}</Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="default">Address: {el.property.address || '-'}</Badge>
                          <Badge variant="default">Property Type: {el.property.propertyType || '-'}</Badge>
                          {el.property.furnished && <Badge variant="default">Furnished</Badge>}
                          {el.property.invested && <Badge variant="default">Invested</Badge>}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="default">Bedrooms: {el.property.bedrooms || '-'}</Badge>
                          <Badge variant="default">Bathrooms: {el.property.bathrooms || '-'}</Badge>
                          {el.category === "rent" ? (
                            <Badge variant="default">Price per day: {el.property.pricePerDay || '-'}€</Badge>
                          ) : (
                            <Badge variant="default">Price: {el.property.price || '-'}€</Badge>
                          )}
                          <Badge variant="default">Area: {el.property.area || '-'} m²</Badge>
                        </div>

                        {el.note && (
                          <div className="w-full py-2">
                            <Textarea value={el.note} readOnly />
                          </div>
                        )}

                        {el.property.id && (
                          <a
                            target="_blank"
                            href={`/properties/${el.property.titleEn}_${el.property.city}_${el.property.category}_${el.property.propertyType}/${el.property.id}`}
                          >
                            <Button className="w-full mt-2">Go to property</Button>
                          </a>
                        )}
                      </DialogContent>
                    </Dialog>
                  ) : (
                    "-"
                  )}
                </TableCell>

                {/* Contact Dialog */}
                <TableCell>
                  {el.phone ? (
                    <Dialog>
                      <DialogTrigger>
                        <Button className="cursor-pointer">Contact</Button>
                      </DialogTrigger>
                      <DialogContent className="flex flex-col gap-4">
                        <DialogHeader>
                          <DialogTitle>Contact {el.name || '-'}</DialogTitle>
                          <DialogDescription>Choose a method:</DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-2 mt-4">
                          <a
                            href={`https://wa.me/${el.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 text-white py-2 px-4 rounded text-center"
                          >
                            WhatsApp
                          </a>
                          <a
                            href={`tel:${el.phone}`}
                            className="bg-blue-500 text-white py-2 px-4 rounded text-center"
                          >
                            Call
                          </a>
                          <a
                            href={`sms:${el.phone}`}
                            className="bg-gray-700 text-white py-2 px-4 rounded text-center"
                          >
                            SMS
                          </a>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BookingsPage;
