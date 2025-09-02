'use client'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { domain } from '@/lib/consts'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import axios from 'axios'
import { toast } from 'sonner'

const CreateClerkUser = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleCreate = async () => {
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setError("") 

    try {
      await axios.post(`${domain}clerkuser`, { email })
      setEmail("") // reset form
      toast("User created successfully!")
    } catch (err) {
      console.error("Error creating user:", err)
      setError("Failed to create user")
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button>Create new user</Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Create Clerk User</DialogTitle>
          </DialogHeader>
          <Label className="text-lg">Write the email of the new user</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button onClick={handleCreate}>Save</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateClerkUser
