'use client';
import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { domain } from '@/lib/consts';

const OfficesPage = () => {
  const [offices, setOffices] = useState([]);
  const [newOfficeName, setNewOfficeName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [officeToDelete, setOfficeToDelete] = useState(null);
  const [editingOffice, setEditingOffice] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    try {
      const res = await fetch(`${domain}office`);
      if (!res.ok) throw new Error('Failed to fetch offices');
      const data = await res.json();
      setOffices(data || []);
    } catch (err) {
      toast.error(err.message);
      setOffices([]);
    }
  };

  const handleAddOffice = async (e) => {
    e.preventDefault();
    if (!newOfficeName.trim()) return toast.error('Office name cannot be empty');

    try {
      const res = await fetch(`${domain}office`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newOfficeName.trim() }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to add office');
      }
      const newOffice = await res.json();
      setOffices([...offices, newOffice]);
      setNewOfficeName('');
      toast.success('Office added successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateOffice = async () => {
    if (!editingOffice?.name.trim()) return toast.error('Office name cannot be empty');

    try {
      const res = await fetch(`${domain}office/${editingOffice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingOffice.name.trim() }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to update office');
      }
      const updatedOffice = await res.json();
      setOffices(offices.map(o => (o.id === updatedOffice.id ? updatedOffice : o)));
      setIsEditing(false);
      setEditingOffice(null);
      toast.success('Office updated successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteOffice = async () => {
    if (!officeToDelete) return;
    try {
      const res = await fetch(`${domain}office/${officeToDelete.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to delete office');
      }
      setOffices(offices.filter(o => o.id !== officeToDelete.id));
      setOfficeToDelete(null);
      setIsDialogOpen(false);
      toast.success('Office deleted successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const startEditing = (office) => {
    setEditingOffice({ ...office });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditingOffice(null);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Add/Edit Office Form */}
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Pencil className="h-5 w-5" /> Edit Office
                </>
              ) : (
                <>
                  <PlusCircle className="h-5 w-5" /> Add New Office
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                isEditing ? handleUpdateOffice() : handleAddOffice(e);
              }}
              className="space-y-4"
            >
              <Input
                type="text"
                placeholder="Office name"
                value={isEditing ? editingOffice?.name : newOfficeName}
                onChange={(e) =>
                  isEditing
                    ? setEditingOffice({ ...editingOffice, name: e.target.value })
                    : setNewOfficeName(e.target.value)
                }
              />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {isEditing ? 'Update' : 'Add'} Office
                </Button>
                {isEditing && (
                  <Button variant="outline" className="flex-1" onClick={cancelEditing}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Offices List */}
        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Office Locations</CardTitle>
            </CardHeader>
            <CardContent>
              {offices.length === 0 ? (
                <p className="text-center py-6 text-neutral-500">
                  No offices found. Start by adding a new office!
                </p>
              ) : (
                <Table>
                  <TableCaption>A list of your company offices.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offices.map((office) => (
                      <TableRow key={office.id}>
                        <TableCell className="font-medium">{office.name || '-'}</TableCell>
                        <TableCell className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => startEditing(office)}>
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Dialog
                            open={isDialogOpen && officeToDelete?.id === office.id}
                            onOpenChange={setIsDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setOfficeToDelete(office);
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Are you sure?</DialogTitle>
                                <DialogDescription>
                                  This action cannot be undone. This will permanently delete the{' '}
                                  {officeToDelete?.name || '-'} office.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button variant="destructive" onClick={handleDeleteOffice}>
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OfficesPage;
