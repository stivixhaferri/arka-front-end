'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { domain } from '@/lib/consts';

// Shadcn components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination';
import { Pencil  , Trash } from 'lucide-react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const PropertiesTable = () => {
  const router = useRouter();

  // States
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters
  const [filterCity, setFilterCity] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  // Fetch properties from API with pagination & filters
  const getProperties = async () => {
    setLoading(true);
    try {
      // Compose query params
      const params = new URLSearchParams({
        page,
      });

      if (filterCity) params.append('city', filterCity);
      if (filterCategory) params.append('category', filterCategory);

      const res = await axios.get(`${domain}property?${params.toString()}`);
      const data = res.data;

      setProperties(data.properties);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getProperties();
  }, [page, filterCity, filterCategory]);

  // Delete property
  const handleDelete = async () => {
    if (!propertyToDelete) return;
    try {
      await axios.delete(`${domain}property/${propertyToDelete.id}`);
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
      getProperties();
    } catch (error) {
      console.error('Failed to delete property', error);
    }
  };

  // Render table rows
  const rows = properties.map((property) => (
    <TableRow key={property.id}>
      <TableCell>{property.titleEn}</TableCell>
      <TableCell>{property.city}</TableCell>
      <TableCell>{property.category}</TableCell>
      <TableCell>{property.price}</TableCell>
      <TableCell>{property.bedrooms}</TableCell>
      <TableCell>{property.bathrooms}</TableCell>
      <TableCell className="flex space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/dashboard/properties/edit/${property.id}`)}
          aria-label="Edit property"
        >
          <Pencil className="w-5 h-5" />
        </Button>
        <Dialog open={deleteDialogOpen && propertyToDelete?.id === property.id} onOpenChange={setDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setPropertyToDelete(property);
                setDeleteDialogOpen(true);
              }}
              aria-label="Delete property"
              className="text-red-600"
            >
              <FiTrash2 className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <p>Are you sure you want to delete the property &quot;{property.titleEn}&quot;?</p>
            </DialogHeader>
            <DialogDescription className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  ));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Properties</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          placeholder="Filter by city"
          value={filterCity}
           onChange={(e) => {
                setFilterCity(e.target.value);
                setPage(1);
            }}
          className="max-w-xs"
        />
        <Select
           onValueChange={(value) => {
                setFilterCategory(value);
                setPage(1);
            }}
          value={filterCategory}
          defaultValue=""
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rent">Rent</SelectItem>
            <SelectItem value="sale">Sale</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Bedrooms</TableHead>
              <TableHead>Bathrooms</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{loading ? <tr><td colSpan={7} className="text-center py-8">Loading...</td></tr> : rows.length ? rows : (
            <tr><td colSpan={7} className="text-center py-8">No properties found.</td></tr>
          )}</TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <Pagination
          page={page}
          total={totalPages}
          onChange={(page) => setPage(page)}
          aria-label="Properties pagination"
        />
      </div>
    </div>
  );
};

export default PropertiesTable;
