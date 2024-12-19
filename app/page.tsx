import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md text-center">
        <img 
          src="https://www.trustimpact.com/wp-content/uploads/2020/09/trust-impact-logo.png" 
          alt="Trust Impact Logo" 
          className="mx-auto h-16 mb-8"
        />
        <h1 className="text-3xl font-bold mb-4">Impact Diagnostic Assessment Tool</h1>
        <p className="mb-8">Evaluate the impact readiness of charities and organizations</p>
        <Link href="/login" passHref>
          <Button className="w-full bg-[#f7d32e] text-black hover:bg-[#e6c41d]">
            Login to Start
          </Button>
        </Link>
      </div>
    </div>
  )
}

