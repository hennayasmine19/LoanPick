import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">Loan Picks</h1>
            <p className="text-muted-foreground">Find your perfect loan</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-destructive">Authentication Error</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {params?.error ? (
                <p className="text-sm text-foreground">{decodeURIComponent(params.error)}</p>
              ) : (
                <p className="text-sm text-foreground">An error occurred during authentication. Please try again.</p>
              )}
              <Link href="/auth/login">
                <Button className="w-full">Back to Login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
