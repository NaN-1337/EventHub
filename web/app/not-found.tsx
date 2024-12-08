import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotEnoughXP() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Organizer Status Not Achieved
      </h1>
      <Image
        src="/404-image.png"
        alt="Level Insufficient Illustration"
        width={400}
        height={400}
        className="mb-4"
      />
      <p className="text-xl mb-8 text-center">
        You need more XP points to gain Organizer status. Please continue using our mobile app to level up.
      </p>
      <Button asChild>
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  )
}
