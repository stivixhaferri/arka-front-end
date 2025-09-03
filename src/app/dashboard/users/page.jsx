'use client';

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { domain } from "@/lib/consts";
import CreateClerkUser from "@/components/CreateClerkUser";
import EditClerkUser from "@/components/EditClerkUser";
import DeleteClerkUser from "@/components/DeleteClerkUser";
import { toast } from "sonner";

const ClerkUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch clerk users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${domain}clerkusers`);
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data || []);
      } catch (err) {
        toast.error(err.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p className="text-center py-8">Loading users...</p>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className="w-1/2">
          <h2 className="text-3xl font-semibold">Users</h2>
        </div>
        <div className="w-1/2 flex justify-end">
          <CreateClerkUser />
        </div>
      </div>

      {users.length > 0 ? (
        <div className="overflow-x-auto border rounded-md">
          <Table>
            <TableCaption>A list of all clerk users.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user.id || index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{user.email || '-'}</TableCell>
                  <TableCell>{user.createdAt?.substring(0, 10) || '-'}</TableCell>
                  <TableCell className="flex gap-2 justify-end">
                    <EditClerkUser email={user.email} />
                    <DeleteClerkUser email={user.email} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-center py-8 text-neutral-500">No users found.</p>
      )}
    </div>
  );
};

export default ClerkUsersPage;
