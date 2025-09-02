import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='flex items-center gap-2 justify-center min-h-screen w-full'>
     <SignIn redirectUrl="/dashboard" />
     
    </div>
  )
}