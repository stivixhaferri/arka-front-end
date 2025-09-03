'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { domain, roles, positions } from "@/lib/consts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { MailIcon, PhoneIcon, LampDesk } from "lucide-react";

const Page = () => {
  const [offices, setOffices] = useState([]);
  const [members, setMembers] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    whatsapp: "",
    role: "",
    position: "",
    office: "",
    image: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [officesRes, membersRes] = await Promise.all([
        axios.get(`${domain}office`),
        axios.get(`${domain}user`),
      ]);

      setOffices(officesRes.data || []);
      setMembers(membersRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMembers([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== "") {
        formPayload.append(key, formData[key]);
      }
    }
    try {
      await axios.post(`${domain}user`, formPayload);
      fetchData();
      resetForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating member:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== "") {
        formPayload.append(key, formData[key]);
      }
    }
    try {
      await axios.put(`${domain}user/${currentMember.id}`, formPayload);
      fetchData();
      resetForm();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${domain}user/${currentMember.id}`);
      fetchData();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const openEditDialog = (member) => {
    setCurrentMember(member);
    setFormData({
      fullName: member.fullName || "",
      email: member.email || "",
      phone: member.phone || "",
      whatsapp: member.whatsapp || "",
      role: member.role || "",
      position: member.position || "",
      office: member.office || "",
      image: null,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (member) => {
    setCurrentMember(member);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      whatsapp: "",
      role: "",
      position: "",
      office: "",
      image: null,
    });
    setCurrentMember(null);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Team Members</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Member</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="grid gap-4 py-4">
              <MemberForm formData={formData} handleChange={handleChange} offices={offices} />
              <DialogFooter>
                <Button type="submit">Add Member</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Show message if no members */}
      {members.length === 0 && (
        <div className="p-6 text-center text-lg text-gray-500">
          No team members found. Start by adding a new member!
        </div>
      )}

      {/* Members Grid */}
      {members.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                {member.image && (
                  <img
                    src={member.image}
                    alt={member.fullName}
                    className="w-48 h-48 rounded-full object-cover mx-auto mb-4"
                  />
                )}
                <CardTitle className="text-xl font-semibold">{member.fullName}</CardTitle>
                <CardDescription className="text-neutral-500 flex items-center gap-2">
                  {member.position && <Badge>{member.position.toUpperCase()}</Badge>}
                  {member.office && (
                    <Badge variant="secondary">
                      <LampDesk /> {member.office.toUpperCase()}
                    </Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 text-neutral-500">
                {member.email && (
                  <div className="flex items-center gap-2">
                    <MailIcon className="w-4 h-4" />
                    <span>{member.email}</span>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4" />
                    <span>{member.phone}</span>
                  </div>
                )}
                {member.whatsapp && (
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4" />
                    <span>WhatsApp: {member.whatsapp}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="lg" onClick={() => openEditDialog(member)}>
                  Edit
                </Button>
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="lg" onClick={() => openDeleteDialog(member)}>
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete {currentMember?.fullName}? This action cannot
                        be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDelete}>
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="grid gap-4 py-4">
            <MemberForm formData={formData} handleChange={handleChange} offices={offices} />
            <DialogFooter>
              <Button type="submit">Update Member</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Member Form Component
const MemberForm = ({ formData, handleChange, offices }) => (
  <div className="grid grid-cols-1 gap-4">
    <div className="space-y-2">
      <Label htmlFor="fullName">Full Name</Label>
      <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="whatsapp">WhatsApp</Label>
        <Input id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          name="role"
          value={formData.role}
          onValueChange={(val) => handleChange({ target: { name: "role", value: val } })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="position">Position</Label>
        <Select
          name="position"
          value={formData.position}
          onValueChange={(val) => handleChange({ target: { name: "position", value: val } })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent>
            {positions.map((pos) => (
              <SelectItem key={pos} value={pos}>
                {pos}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="office">Office</Label>
      <Select
        name="office"
        value={formData.office}
        onValueChange={(val) => handleChange({ target: { name: "office", value: val } })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select office" />
        </SelectTrigger>
        <SelectContent>
          {offices.length > 0 ? (
            offices.map((office) => (
              <SelectItem key={office.id} value={office.name}>
                {office.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem disabled>No offices available</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label htmlFor="image">Profile Image</Label>
      <Input id="image" name="image" type="file" accept="image/*" onChange={handleChange} />
      {formData.image && typeof formData.image === "string" && (
        <div className="mt-2">
          <img src={formData.image} alt="Current profile" className="h-20 w-20 object-cover rounded" />
        </div>
      )}
    </div>
  </div>
);

export default Page;
