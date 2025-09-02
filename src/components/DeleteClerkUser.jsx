"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { domain } from "@/lib/consts";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { FiTrash2 } from "react-icons/fi";

const DeleteClerkUser = ({ email }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`${domain}clerkuser/${email}`);
      toast.success("User deleted successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Delete user"
            className="text-red-600 hover:text-red-700 hover:bg-red-100"
          >
            <FiTrash2 className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Delete Clerk User</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{email}</span>? This action cannot
            be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteClerkUser;
