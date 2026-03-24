"use server"

import { Resend } from "resend"
import { headers } from "next/headers"
import { contactSchema, ContactFormData } from "@/lib/validations/contact"

// ─────────────────────────────────────────────────────────────────────────────
// In-Memory Rate Limiter (per IP, max 3 requests per 10 minutes)
// In production, replace this with Upstash Redis for persistence across workers.
// ─────────────────────────────────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
        return true;
    }

    if (record.count >= RATE_LIMIT) {
        return false;
    }

    record.count++;
    return true;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContactForm(data: ContactFormData & { _trap?: string }) {
    // ─────────────────────────────────────────────────────────────────────────
    // 0. Honeypot Check — bots fill hidden fields, humans don't.
    // ─────────────────────────────────────────────────────────────────────────
    if (data._trap && data._trap.trim().length > 0) {
        // Silent fail — never reveal honeypot detection to the bot.
        return { success: true, message: "Transmission received." };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 1. Rate Limiting — get client IP from request headers.
    // ─────────────────────────────────────────────────────────────────────────
    const headersList = headers();
    const ip =
        headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headersList.get("x-real-ip") ||
        "unknown";

    if (!checkRateLimit(ip)) {
        return {
            success: false,
            message: "Too many requests. Please wait 10 minutes before trying again."
        };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. Server-side Zod Validation (second line of defense after the client).
    // ─────────────────────────────────────────────────────────────────────────
    const parsed = contactSchema.safeParse(data)

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
            message: "Validation failed."
        }
    }

    const { name, email, message } = parsed.data;

    // ─────────────────────────────────────────────────────────────────────────
    // 3. Send Email via Resend
    // ─────────────────────────────────────────────────────────────────────────
    try {
        await resend.emails.send({
            from: "Contact Form <onboarding@resend.dev>",         // Change to your domain after verification
            to: ["your@email.com"],                                // ← PUT YOUR EMAIL ADDRESS HERE
            replyTo: email,
            subject: `New Collaboration Request from ${name}`,
            html: `
                <div style="font-family: monospace; background: #0a0a0a; color: #e5e5e5; padding: 40px; border-radius: 12px; border: 1px solid #333;">
                    <h2 style="color: #a78bfa; margin: 0 0 24px 0;">🚀 New Collaboration Request</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 12px; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; width: 80px;">From</td>
                            <td style="padding: 8px 12px; font-weight: bold;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 12px; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Email</td>
                            <td style="padding: 8px 12px;"><a href="mailto:${email}" style="color: #a78bfa;">${email}</a></td>
                        </tr>
                        <tr style="background: #111; border-radius: 8px;">
                            <td style="padding: 16px 12px; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top;">Message</td>
                            <td style="padding: 16px 12px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</td>
                        </tr>
                    </table>
                    <p style="color: #555; font-size: 11px; margin-top: 24px;">
                        Received by AetherDev Contact Form · IP: ${ip}
                    </p>
                </div>
            `
        });
    } catch (emailError) {
        console.error("[RESEND ERROR]", emailError);
        // Don't block the user if the email provider has a temporary hiccup
        // but log it securely.
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 4. Secure Server Log
    // ─────────────────────────────────────────────────────────────────────────
    console.log("[SECURE LOG] New Request | FROM:", name, `<${email}>`)

    return {
        success: true,
        message: "Transmission received securely."
    }
}
