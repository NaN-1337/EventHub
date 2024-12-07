import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">When you're searching for answers...</h1>
      <Image
        src="/404-image.png"
        alt="404 Error Illustration"
        width={400}
        height={400}
        className="mb-4"
      />
      <p className="text-xl mb-8 text-center">...but life hits you with a 404, so you just chill instead.</p>
      <Button asChild>
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  )
}

