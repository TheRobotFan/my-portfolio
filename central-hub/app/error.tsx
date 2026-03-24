'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
            <div className="text-center space-y-4 max-w-md">
                <h2 className="text-3xl font-bold text-foreground">Ops! Qualcosa è andato storto</h2>
                <p className="text-muted-foreground">
                    Si è verificato un errore imprevisto durante il caricamento della pagina.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button onClick={() => reset()} variant="default">
                        Riprova
                    </Button>
                    <Button onClick={() => window.location.href = '/'} variant="outline">
                        Torna alla Home
                    </Button>
                </div>
            </div>
        </div>
    )
}
