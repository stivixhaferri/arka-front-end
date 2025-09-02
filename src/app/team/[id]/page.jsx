import { domain } from "@/lib/consts"
import ClientTheme from "@/components/layout-theme"
import {Phone , Mail } from 'lucide-react'
import { PropertyCard } from "@/components/property-card";
import { Badge } from "@/components/ui/badge";
import { FaPhoneAlt } from "react-icons/fa";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";



function TeamMemberCard({ member }) {
  return (
      <div  className="group bg-card h-[420px] w-full overflow-hidden rounded-xl opacity-100 shadow-sm transition-opacity">
        <div className="relative h-[200px] w-full overflow-hidden">
          <img
            src={member.image}
            alt={member.fullName}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex h-[220px] flex-col p-5">
          {member.office && (
            <div className="text-muted-foreground mb-1 flex items-center text-xs">
              <div className="bg-primary mr-1.5 h-1.5 w-1.5 rounded-full" />
              {member.office}
            </div>
          )}
          <h3 className="mb-1 text-xl font-bold">{member.fullName}</h3>
          <p className="text-primary mb-2 text-sm font-medium">
            {member.position}
          </p>
          <div className="mb-1">
            <p className="text-muted-foreground text-sm">{member.email}</p>
          </div>
          <div className="mt-auto flex items-center gap-3">
            {/* Phone Link */}
            <Link
              prefetch={false}
            
              href={`tel:${member.phone}`}
            >
              <Badge variant="default">
                <FaPhoneAlt /> {member.phone}
              </Badge>
            </Link>

            {/* WhatsApp Link */}
            {member.whatsapp.length > 0 && (
              <Link
                prefetch={false}
              
                href={`https://wa.me/${member.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge
                  variant="default"
                  className="bg-green-600 hover:bg-green-600"
                >
                  <FaWhatsapp /> {member.whatsapp}
                </Badge>
              </Link>
            )}
          </div>
        
        </div>
      </div>
    
  );
}


export default async function MemberDetailPage({ params }) {
   const { id } = await params
  const res = await fetch(`${domain}user/${id}`);
  const member  = await res.json();


  const secRes= await fetch(`${domain}properties/agent/${member.id}`)
  const properties = await secRes.json();


  return (
    <ClientTheme>

     <div className="w-full lg:px-[5%] px-3 py-5 flex lg:flex-row flex-col items-start gap-5">
      <div className="lg:w-[25%] w-full">
        <TeamMemberCard member={member} />
      </div>
      <div className="lg:w-[75%] w-full grid lg:grid-cols-3 grid-cols-1 gap-3">
        {properties.map((property , index) => {
            return <div key={index}>
                  <PropertyCard
                    property={property}
                    className="custom-class-if-needed"
                  />
                </div>
        })}
      </div>
     </div>



    </ClientTheme>
  )
}
