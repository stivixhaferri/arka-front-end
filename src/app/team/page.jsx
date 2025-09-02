import ClientTheme from "@/components/layout-theme";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { FaPhoneAlt } from "react-icons/fa";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { domain } from "@/lib/consts";
import {getTranslations} from 'next-intl/server';

function TeamMemberCard({ member, index  , moreText}) {
    
  return (
      <div key={index} className="group bg-card h-[480px]  w-full overflow-hidden rounded-xl opacity-100 shadow-sm transition-opacity">
        <div className="relative h-[240px] w-full overflow-hidden">
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
          <div className="mb-3">
            <p className="text-muted-foreground text-sm">{member.email}</p>
          </div>
          <div className="mt-auto flex items-center gap-3">
            {/* Phone Link */}
            <Link
              prefetch={false}
              key={`phone-${index}`}
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
                key={`whatsapp-${index}`}
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
          <div className=" my-4">
            <Link href={`/team/${member.id}`}>
              <button className="bg-orange-500 cursor-pointer hover:bg-orange-600 rounded text-lg font-semibold text-white w-full py-2 px-4">{moreText}</button>
            </Link>
          </div>
        </div>
      </div>
    
  );
}

const page = async () => {
  const res = await fetch(`${domain}user`);
  const data = await res.json();
  const t = await getTranslations('Team');
  return (
    <ClientTheme>
      <section className="py-5  bg-blue-700">
        <div className="container mx-auto px-4 text-center bg-blue-700">
          <h2 className="text-4xl font-bold text- mb-4 text-white">
            {t("team_title")}
          </h2>
          <p className="text-xl text-white max-w-2xl mx-auto">
            {t("team_Description")}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full py-5">
       
        <div className="container px-4 md:px-6">
          <div className="mx-auto mb-16 w-full overflow-x-hidden text-center"></div>
          <div className="grid lg:grid-cols-4 grid-cols-1 gap-3 items-center  w-full justify-center  lg:px-[5%]">
            {data.map((member , index) => (
              <TeamMemberCard key={index} member={member} moreText={t("more")} />
            ))}
          </div>
        </div>
      </section>
    </ClientTheme>
  );
};

export default page;
