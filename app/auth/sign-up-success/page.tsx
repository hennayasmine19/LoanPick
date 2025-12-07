import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Particles } from "@/components/ui/particles"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden">
      <Particles className="absolute inset-0" quantity={100} color="#0ea5e9" />
      <div className="w-full max-w-sm relative z-10">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">Loan Picks</h1>
            <p className="text-muted-foreground">Find your perfect loan</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Account Created!</CardTitle>
              <CardDescription>Verify your email to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-foreground">
                We've sent a verification email to your inbox. Please click the link in the email to confirm your
                account.
              </p>
              <p className="text-sm text-muted-foreground">
                Once verified, you can log in and start exploring personalized loan recommendations.
              </p>
              <Link href="/auth/login" className="block">
                <Button className="w-full">Back to Login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
