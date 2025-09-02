'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { domain } from '@/lib/consts'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

const BookingForm = ({ property }) => {
  const t = useTranslations('Property')
  const [fullName, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [category, setCategory] = useState('rent')
  const [price, setPrice] = useState(property?.price)
  const [pricePerDay, setPricePerDay] = useState(true)
  const [note, setNote] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [cap, setCap] = useState('')
  const [guests, setGuests] = useState(1) // 👈 guests state
  const propertyId = property?.id

  const handleSubmit = async () => {
    if (cap !== '') return // simple bot honeypot

    try {
      await axios.post(`${domain}book`, {
        name: fullName,
        email,
        phone,
        category,
        price: property.price,
        pricePerDay,
        note,
        date: new Date().toISOString(), // current date
        propertyId,
        guests, 
        startDate,
        endDate,
        status: 'pending',
      })

      toast.success('Booking submitted successfully!')
      setName('')
      setEmail('')
      setPhone('')
      setNote('')
      setStartDate('')
      setEndDate('')
      setGuests(1)
    } catch (error) {
      console.error(error)
      toast.error('Failed to submit booking')
    }
  }

  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="flex items-center gap-2 flex-col">
        <Label className="w-full text-start">{t('full_name')}</Label>
        <Input type="text" value={fullName} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="flex items-center gap-2 pt-1 flex-col">
        <Label className="w-full text-start">Email</Label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="flex items-center gap-2 pt-1 flex-col">
        <Label className="w-full text-start">{t('phone_number')}</Label>
        <Input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      {/* Guests Field */}
      <div className="flex items-center gap-2 pt-1 flex-col">
        <Label className="w-full text-start">{t('guests')}</Label>
        <Input
          type="number"
          min="1"
          max={property?.capacity || 20}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        />
      </div>
      <div className="flex items-center gap-2 pt-1 flex-col">
        <Label className="w-full text-start">{t('from')}:</Label>
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>
      <div className="flex items-center gap-2 pt-1 flex-col">
        <Label className="w-full text-start">{t('to')}:</Label>
        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <div className="flex items-center gap-2 pt-1 flex-col">
        <Label className="w-full text-start">{t('notes')}</Label>
        <Textarea rows={5} value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      {/* Honeypot CAPTCHA */}
      <div className="flex items-center gap-2 pt-1 flex-col h-[1px]" style={{ visibility: 'hidden' }}>
        <Input type="text" value={cap} onChange={(e) => setCap(e.target.value)} />
      </div>
      <Button className="mt-2" onClick={handleSubmit}>
        {t('submit')}
      </Button>
    </div>
  )
}

export default BookingForm
