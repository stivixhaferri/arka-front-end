import React from 'react'
import NewNavbar from './new-navbar'
import Footer from './footer'
import ScrollToTop from './ScrollToTop'
import { TabsHome } from './Tabs'


const ClientTheme = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden relative'>
        <NewNavbar/>
        <div className='min-h-screen relative'>
            {children}
        </div>
        <TabsHome/>
        <ScrollToTop/>
        <Footer/>
        
    </div>
  )
}

export default ClientTheme