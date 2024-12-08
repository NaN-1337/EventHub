import { Illustration } from "@/components/auth/illustration"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden md:block">
        <Illustration />
      </div>
      <div className="flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  )
}
