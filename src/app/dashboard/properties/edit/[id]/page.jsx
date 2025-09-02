import EditProperty from '@/components/EditProperty'
import React from 'react'
import { domain } from '@/lib/consts';

const page = async ({params}) => {
  const { id } = await params;


  const res = await fetch(`${domain}property/${id}`);
  if (!res.ok) {
  console.error('Failed to fetch property:', res.status, res.statusText);
  return;
  }

  const property = await res.json();
  


  return (
    <div className=''> 
        <EditProperty  id={id} property={property} />
    </div>
  )
}

export default page