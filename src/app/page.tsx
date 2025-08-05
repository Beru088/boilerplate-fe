import LoginForm from '@/components/loginForm'
import Image from 'next/image'

const Home = () => {
  return (
    <div className='bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
      <Image
        src='/images/temp-background.gif'
        alt='Background'
        fill
        className='z-0 object-cover'
        unoptimized
        priority
      />
      <div className='z-10 flex w-full max-w-sm flex-col gap-6'>
        <LoginForm />
      </div>
    </div>
  )
}

export default Home
