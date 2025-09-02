'use client'
import React, { useState, useEffect } from 'react'
import { PlusCircle, Trash2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import {domain} from '@/lib/consts'


const OfficesPage = () => {
  const [offices, setOffices] = useState([])
  const [newOfficeName, setNewOfficeName] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [officeToDelete, setOfficeToDelete] = useState(null)
  const [editingOffice, setEditingOffice] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  // Fetch offices on component mount
  useEffect(() => {
    fetchOffices()
  }, [])

  const fetchOffices = async () => {
    try {
      const response = await fetch(`${domain}office`)
      if (!response.ok) {
        throw new Error('Failed to fetch offices')
      }
      const data = await response.json()
      setOffices(data)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleAddOffice = async (e) => {
    e.preventDefault()
    if (!newOfficeName.trim()) {
      toast.error('Office name cannot be empty')
      return
    }

    try {
      const response = await fetch(`${domain}office`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newOfficeName.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to add office')
      }

      const newOffice = await response.json()
      setOffices([...offices, newOffice])
      setNewOfficeName('')
      toast.success('Office added successfully')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleUpdateOffice = async () => {
    if (!editingOffice?.name.trim()) {
      toast.error('Office name cannot be empty')
      return
    }

    try {
      const response = await fetch(`${domain}office/${editingOffice.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editingOffice.name.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update office')
      }

      const updatedOffice = await response.json()
      setOffices(offices.map(office => 
        office.id === updatedOffice.id ? updatedOffice : office
      ))
      setIsEditing(false)
      setEditingOffice(null)
      toast.success('Office updated successfully')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDeleteOffice = async () => {
    if (!officeToDelete) return

    try {
      const response = await fetch(`${domain}office/${officeToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete office')
      }

      setOffices(offices.filter(office => office.id !== officeToDelete.id))
      setOfficeToDelete(null)
      setIsDialogOpen(false)
      toast.success('Office deleted successfully')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const startEditing = (office) => {
    setEditingOffice({ ...office })
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditingOffice(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Add/Edit Office Form */}
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Pencil className="h-5 w-5" />
                  Edit Office
                </>
              ) : (
                <>
                  <PlusCircle className="h-5 w-5" />
                  Add New Office
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form 
              onSubmit={isEditing ? (e) => { e.preventDefault(); handleUpdateOffice() } : handleAddOffice} 
              className="space-y-4"
            >
              <div>
                <Input
                  type="text"
                  placeholder="Office name"
                  value={isEditing ? editingOffice?.name : newOfficeName}
                  onChange={(e) => 
                    isEditing 
                      ? setEditingOffice({...editingOffice, name: e.target.value})
                      : setNewOfficeName(e.target.value)
                  }
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {isEditing ? 'Update' : 'Add'} Office
                </Button>
                {isEditing && (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={cancelEditing}
                  >
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
                      <TableCell className="font-medium">{office.name}</TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => startEditing(office)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Dialog open={isDialogOpen && officeToDelete?.id === office.id} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setOfficeToDelete(office)
                                setIsDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Are you sure?</DialogTitle>
                              <DialogDescription>
                                This action cannot be undone. This will permanently delete the {officeToDelete?.name} office.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default OfficesPage