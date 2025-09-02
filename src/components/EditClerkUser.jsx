"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { domain } from "@/lib/consts";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import axios from "axios";
import { toast } from "sonner";
import {  FiTrash2 } from 'react-icons/fi';
import { Pencil  } from 'lucide-react';

const EditClerkUser = ({ email }) => {
  const [newEmail, setNewEmail] = useState(email || "");
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleUpdate = async () => {
    if (!emailRegex.test(newEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");

    try {
      await axios.put(`${domain}clerkuser/${email}`, { newEmail });
      toast.success("User updated successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Failed to update user");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Delete property"
           
          >
            <Pencil className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Edit Clerk User</DialogTitle>
          </DialogHeader>
          <Label className="text-lg">Update the email of this user</Label>
          <Input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="example@email.com"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button onClick={handleUpdate}>Save changes</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditClerkUser;
