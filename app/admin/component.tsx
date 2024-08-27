"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User } from "@prisma/client";
import { useState } from "react";

export default function AdminHome({ users } : { users: User[] }){
  const [skip, setSkip] = useState(0);
  const pages = Math.ceil(users.length/10);
  return (
    <div className="flex flex-wrap flex-col justify-center items-center">
      <div className="mb-4">
        <a href="/admin/resources" className="mr-5">
          <Button>Resources</Button>
        </a>
        <a href="/admin/problems">
          <Button>Problems</Button>
        </a>
      </div>
      <div className="md:w-[80%]">
        <Table>
          <TableCaption className="caption-top text-2xl font-bold">Users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="border">ID</TableHead>
              <TableHead className="border">Username</TableHead>
              <TableHead className="border">Joined At</TableHead>
              <TableHead className="border">Admin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.slice(10*skip, 10*(skip+1)).map(user => (
              <TableRow key={user.id}>
                <TableCell className="border">{user.id}</TableCell>
                <TableCell className="border flex justify-between items-center">
                  <span>{user.dcUserName}</span>
                  <img src={user.avatar} className="h-10 rounded-full" />
                </TableCell>
                <TableCell className="border">{user.createdAt.toDateString()}</TableCell>
                <TableCell className="border"><Checkbox checked={user.admin} disabled /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-center items-center mt-5">
          <span className="mr-5">{skip+1}/{pages}</span>
          <Button onClick={() => setSkip(skip-1)} disabled={skip == 0} className="mr-5">
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
          <Button onClick={() => setSkip(skip+1)} disabled={skip == pages-1}>
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        </div>
      </div>
    </div>
  )
}