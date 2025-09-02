import React from "react";
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


const page = async () => {

    const res = await fetch(`${domain}clerkusers`);
    const data = await res.json();





  return (
    <div className="p-6">
      <div className="flex items-center ">
        <div className="w-[50%] flex items-center ">
          <h2 className="text-3xl font-semibold">Users</h2>
        </div>
        <div className="w-[50%] flex items-center justify-end">
            <CreateClerkUser/>
        </div>
      </div>
      <div className=" mt-4 overflow-x-auto border rounded-md">
        <Table >
        
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((el , index) => {
                return <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{el.email}</TableCell>
              <TableCell>{el.createdAt?.substring(0 ,10)}</TableCell>
              <TableCell className="text-right flex gap-2 justify-end">
                <EditClerkUser email={el.email} />
                <DeleteClerkUser email={el.email} />
              </TableCell>
            </TableRow>
            })}
            
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default page;
