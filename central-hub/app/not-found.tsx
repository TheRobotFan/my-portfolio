import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
            <div className="text-center space-y-4 max-w-md">
                <h2 className="text-3xl font-bold text-foreground">404 - Pagina non trovata</h2>
                <p className="text-muted-foreground">
                    La pagina che stai cercando non esiste o è stata spostata.
                </p>
                <Button asChild>
                    <Link href="/">
                        Torna alla Home
                    </Link>
                </Button>
            </div>
        </div>
    )
}
