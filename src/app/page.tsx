import LoginForm from '@/components/loginForm'
import Image from 'next/image'

const Home = () => {
  return (
    <main className='relative h-screen w-full overflow-hidden'>
      <Image src='/images/temp-background.gif' alt='Background' fill className='z-0 object-cover' priority />
      <div className='absolute inset-0 z-10 flex items-center justify-center'>
        <LoginForm />
      </div>
    </main>
  )
}

export default Home
