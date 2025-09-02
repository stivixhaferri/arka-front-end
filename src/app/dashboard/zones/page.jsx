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
import { domain } from '@/lib/consts'

const ZonePage = () => {
  const [zones, setZones] = useState([])
  const [newZoneName, setNewZoneName] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [zoneToDelete, setZoneToDelete] = useState(null)
  const [editingZone, setEditingZone] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  // Fetch zones on component mount
  useEffect(() => {
    fetchZones()
  }, [])

  const fetchZones = async () => {
    try {
      const response = await fetch(`${domain}zone`)
      if (!response.ok) {
        throw new Error('Failed to fetch zones')
      }
      const data = await response.json()
      setZones(data)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleAddZone = async (e) => {
    e.preventDefault()
    if (!newZoneName.trim()) {
      toast.error('Zone name cannot be empty')
      return
    }

    try {
      const response = await fetch(`${domain}zone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newZoneName.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to add zone')
      }

      const newZone = await response.json()
      setZones([...zones, newZone])
      setNewZoneName('')
      toast.success('Zone added successfully')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleUpdateZone = async () => {
    if (!editingZone?.name.trim()) {
      toast.error('Zone name cannot be empty')
      return
    }

    try {
      const response = await fetch(`${domain}zone/${editingZone.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editingZone.name.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update zone')
      }

      const updatedZone = await response.json()
      setZones(zones.map(zone => 
        zone.id === updatedZone.id ? updatedZone : zone
      ))
      setIsEditing(false)
      setEditingZone(null)
      toast.success('Zone updated successfully')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDeleteZone = async () => {
    if (!zoneToDelete) return

    try {
      const response = await fetch(`${domain}zone/${zoneToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete zone')
      }

      setZones(zones.filter(zone => zone.id !== zoneToDelete.id))
      setZoneToDelete(null)
      setIsDialogOpen(false)
      toast.success('Zone deleted successfully')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const startEditing = (zone) => {
    setEditingZone({ ...zone })
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditingZone(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Add/Edit Zone Form */}
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Pencil className="h-5 w-5" />
                  Edit Zone
                </>
              ) : (
                <>
                  <PlusCircle className="h-5 w-5" />
                  Add New Zone
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form 
              onSubmit={isEditing ? (e) => { e.preventDefault(); handleUpdateZone() } : handleAddZone} 
              className="space-y-4"
            >
              <div>
                <Input
                  type="text"
                  placeholder="Zone name"
                  value={isEditing ? editingZone?.name : newZoneName}
                  onChange={(e) => 
                    isEditing 
                      ? setEditingZone({...editingZone, name: e.target.value})
                      : setNewZoneName(e.target.value)
                  }
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {isEditing ? 'Update' : 'Add'} Zone
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

        {/* Zones List */}
        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Zone Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>A list of your company zones.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zones.map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell className="font-medium">{zone.name}</TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => startEditing(zone)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Dialog open={isDialogOpen && zoneToDelete?.id === zone.id} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setZoneToDelete(zone)
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
                                This action cannot be undone. This will permanently delete the {zoneToDelete?.name} zone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button variant="destructive" onClick={handleDeleteZone}>
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

export default ZonePage