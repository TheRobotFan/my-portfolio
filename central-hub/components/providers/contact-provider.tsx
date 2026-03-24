"use client"

import React, { createContext, useContext, useState } from "react"
import { ContactForm } from "@/components/contact-form"

interface ContactContextType {
    openContact: () => void
    closeContact: () => void
}

const ContactContext = createContext<ContactContextType | undefined>(undefined)

export function ContactProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)

    const openContact = () => setIsOpen(true)
    const closeContact = () => setIsOpen(false)

    return (
        <ContactContext.Provider value={{ openContact, closeContact }}>
            {children}
            <ContactForm isOpen={isOpen} onClose={closeContact} />
        </ContactContext.Provider>
    )
}

export function useContact() {
    const context = useContext(ContactContext)
    if (context === undefined) {
        throw new Error("useContact must be used within a ContactProvider")
    }
    return context
}
