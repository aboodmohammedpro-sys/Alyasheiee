import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>
                        Enter your details to register as a site recorder or manager
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input label="Full Name" placeholder="John Doe" />
                    <Input label="Email" placeholder="name@example.com" type="email" />
                    <Input label="Password" type="password" />
                    <Input label="Confirm Password" type="password" />
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full">Create Account</Button>
                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-accent hover:underline font-medium">
                            Sign in here
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
