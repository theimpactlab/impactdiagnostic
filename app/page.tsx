import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <img 
          src="https://www.trustimpact.com/wp-content/uploads/2020/09/trust-impact-logo.png" 
          alt="Trust Impact Logo" 
          className="mx-auto h-16"
        />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Impact Diagnostic Assessment Tool
          </h1>
          <p className="mt-4 text-gray-600">
            Evaluate the impact readiness of charities and organizations
          </p>
        </div>
        <Link href="/login" className="block">
          <Button 
            className="w-full bg-[#f7d32e] text-black hover:bg-[#e6c41d] font-semibold"
          >
            Login to Start
          </Button>
        </Link>
      </div>
    </div>
  )
}

