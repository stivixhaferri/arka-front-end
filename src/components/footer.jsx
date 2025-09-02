'use client';
import { useTranslations } from "next-intl";
export default function Footer() {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full overflow-hidden pt-16 pb-8 bg-black">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-orange-500"></div>
      
      {/* Main container */}
      <div className="relative mx-auto w-full lg:px-[5%]">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-12 px-6 lg:px-0">
          
          {/* Left column - Logo and description */}
          <div className="lg:w-1/3">
            <a href="#" className="mb-6 inline-block">
              <img src="/images/logo_blue.svg" className="w-[160px] transition-transform hover:scale-105" alt="Arka Home" />
            </a>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              <b className="text-orange-500">{t("arka_home")}</b> {t("arka_home_des")}
            </p>
          </div>
          
          {/* Right columns - Navigation */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pages column */}
            <div>
              <div className="mb-4 text-xs font-semibold tracking-widest text-blue-500 uppercase border-b border-gray-700 pb-2">
                {t("pages")}
              </div>
              <div className="space-y-3">
                <div>
                  <a href="/" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="mr-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">›</span>
                    {t("home")}
                  </a>
                </div>
                <div>
                  <a href="/properties?category=rent" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="mr-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">›</span>
                    {t("properties_for_rent")}
                  </a>
                </div>
                <div>
                  <a href="/properties?category=sale" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="mr-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">›</span>
                    {t("properties_for_sale")}
                  </a>
                </div>
                <div>
                  <a href="/team" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="mr-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">›</span>
                    {t("team")}
                  </a>
                </div>
              </div>
            </div>
            
            {/* Quick links column */}
            <div>
              <div className="mb-4 text-xs font-semibold tracking-widest text-blue-500 uppercase border-b border-gray-700 pb-2">
                {t("quick_links")}
              </div>
              <div className="space-y-3">
                <div>
                  <a href="/contact" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="mr-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">›</span>
                    {t("contact")}
                  </a>
                </div>
                <div>
                  <a href="/privacy" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="mr-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">›</span>
                    {t("privacy_policy")}
                  </a>
                </div>
                <div>
                  <a href="/terms" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="mr-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">›</span>
                    {t("terms_and_conditions")}
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact column */}
            <div>
              <div className="mb-4 text-xs font-semibold tracking-widest text-blue-500 uppercase border-b border-gray-700 pb-2">
                Contact us
              </div>
              <div className="space-y-3">
                <div>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="mr-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">›</span>
                    info@arkahome.al
                  </a>
                </div>
                <div>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="mr-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">›</span>
                    marketing@arkahome.al
                  </a>
                </div>
                <div>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="mr-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">›</span>
                    support@arkahome.al
                  </a>
                </div>
                <div className="text-gray-300 mt-4 flex items-start">
                  <span className="mr-2 text-blue-500">›</span>
                  <span>Rruga Mustafa Qosja (Vasil Shanto) Tirane</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom section with copyright */}
        <div className="mt-12 pt-6 border-t border-gray-800">
          <div className="text-center text-gray-400 text-sm">
            <span>&copy; {currentYear} Arka Home Real Estate. All rights reserved. Powered by <a href={"https://www.loenmarketing.com/"}  className="text-white">Loen Marketing</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
}