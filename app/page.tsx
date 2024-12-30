import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-8">
          <img 
            src="https://www.trustimpact.com/wp-content/uploads/2020/09/trust-impact-logo.png" 
            alt="Trust Impact Logo" 
            className="h-16 w-auto"
          />
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Impact Diagnostic Assessment Tool
            </h1>
            <p className="text-gray-600">
              Evaluate the impact readiness of charities and organizations
            </p>
          </div>
          <Link href="/login" className="w-full">
            <Button 
              className="w-full bg-[#f7d32e] text-black hover:bg-[#e6c41d] font-semibold"
            >
              Login to Start
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

