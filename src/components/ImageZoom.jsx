"use client";
import {ImageZoom} from '@/components/ui/image-zoom'
import Image from "next/image";

export default function ImageZoomComponent({ src , height}) {
  return (
    <ImageZoom zoomMargin={80}>
      <img
        alt="Placeholder image"
         className={`object-cover w-full   rounded-lg lg:h-[700px] h-[400px]`}
        src={`${src}`}
        unoptimized
      />
    </ImageZoom>
  );
}
