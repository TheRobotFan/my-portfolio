import { z } from "zod"

const disposableDomains = ['mailinator.com', '10minutemail.com', 'tempmail.com', 'dropmail.me', 'yopmail.com', 'guerrillamail.com', 'test.com', 'example.com'];

// Strict schema validation for the contact form
export const contactSchema = z.object({
    name: z.string()
        .min(4, "Name must be at least 4 characters")
        .max(100, "Name is too long")
        .regex(/^[a-zA-Z\s\-']+$/, "Name must contain strictly standard Latin characters.")
        .refine(name => {
            // Require First + Last Name (at least two separate words, each at least 2 chars long)
            const parts = name.trim().split(/\s+/);
            if (parts.length < 2) return false;
            if (parts.some(p => p.length < 2)) return false;

            // Block extremely repetitive characters
            if (/(.)\1{2,}/.test(name)) return false;
            
            // Block URLs or HTML tags injected in the Name field
            if (/<[^>]*>|https?:\/\//i.test(name)) return false;

            // Strict Blacklist for Names
            const spamKeywords = ['seo', 'marketing', 'agency', 'crypto', 'invest', 'bitcoin', 'viagra', 'admin', 'test', 'founder', 'ceo', 'company'];
            const lowerName = name.toLowerCase();
            if (spamKeywords.some(spam => lowerName.includes(spam))) return false;
            
            // Block pure numbers or pure symbols in name (already covered by regex, but good safety net)
            if (/^[^a-zA-Z]+$/.test(name)) return false;

            // Block 4+ consecutive consonants
            if (/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{4,}/.test(name)) return false;

            return true;
        }, "Please enter your full, real name (First and Last Name required)."),
    email: z.string()
        .min(5, "Email is too short")
        .max(100, "Email is too long")
        .email("Please provide a valid email address.")
        .regex(
            /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/, 
            "The email format provided is structurally invalid."
        )
        .refine(email => {
            const parts = email.split('@');
            if (parts.length !== 2) return false;
            
            const localPart = parts[0];
            const domain = parts[1];
            const domainParts = domain.split('.');
            const domainName = domainParts[0];
            const tld = domainParts[domainParts.length - 1].toLowerCase();

            // Block highly abused top-level domains associated with scam/spam
            const scamTLDs = ['xyz', 'biz', 'info', 'ru', 'cn', 'tk', 'ml', 'ga', 'cf', 'gq', 'top', 'site', 'online', 'club', 'click'];
            if (scamTLDs.includes(tld)) return false;

            // Block disposable domains
            if (disposableDomains.includes(domain.toLowerCase())) return false;
            
            // Block dummy emails like "gatto@gatto.com", "test@test.com", "admin@admin.com"
            if (localPart.toLowerCase() === domainName.toLowerCase()) return false;

            // Block local parts possessing 6+ consecutive numbers (often bot-generated e.g., "john1234567@gmail.com")
            if (/\d{6,}/.test(localPart)) return false;

            return true;
        }, "Temporary, invalid, or high-risk scam email addresses are strictly blocked."),
    message: z.string()
        .min(10, "Your message must be at least 10 characters to be meaningful")
        .max(5000, "Message is too long")
        .refine(msg => {
            // Block exactly repeated massive character blocks (down to 4 keys max)
            if (/(.)\1{4,}/.test(msg)) return false;
            
            // Block HTML payloads, BBCode link injections, and scripts
            if (/<[^>]+>|\[url=.*?\]|\[link=.*?\]|document\.cookie|<script/i.test(msg)) return false;

            // Character Entropy Check: > 20 chars requires > 10 distinct letters.
            const uniqueChars = new Set(msg.toLowerCase().replace(/[^a-z]/g, '').split(''));
            if (msg.length > 20 && uniqueChars.size < 10) return false;

            // Minimum 8 words required for a "Professional Collaboration" message
            const words = msg.trim().split(/\s+/);
            if (words.length < 8) return false;

            // Block dummy repetition: less than 40% of words are unique
            const uniqueWords = new Set(words.map(w => w.toLowerCase()));
            if ((uniqueWords.size / words.length) < 0.4) return false;

            // Block long "words" containing absolutely zero vowels
            if (words.some(word => word.length > 7 && !/[aeiouyAEIOUY]/.test(word) && !word.includes('http'))) return false;

            // Block if message is primarily composed of numbers (e.g. fake phone number dumps)
            const numCount = (msg.match(/\d/g) || []).length;
            if (numCount > msg.length * 0.4) return false;

            // Linguistic Grammar Check: A human sentence usually contains prepositions/articles.
            // If none of these common IT/EN glue words exist in a 8+ word phrase, it's just an SEO keyword list.
            const grammarGlues = [' it ', ' a ', ' the ', ' to ', ' in ', ' is ', ' di ', ' e ', ' il ', ' la ', ' un ', ' per ', ' con ', ' da '];
            const lowerMsg = ` ${msg.toLowerCase()} `;
            if (!grammarGlues.some(glue => lowerMsg.includes(glue))) return false;

            // Ultra-Strict Payload & Keyword Blacklist (using boundaries \b)
            const spamRegex = /\b(seo services|rank first|crypto|bitcoin|casino|viagra|lottery|invest|guaranteed traffic|marketing expert|100% free|earn money|\$\$\$)\b/i;
            if (spamRegex.test(msg)) return false;

            // URL Limit: Honest freelance inquiries rarely start with MULTIPLE links.
            const urlCount = (msg.match(/https?:\/\//gi) || []).length;
            if (urlCount > 1) return false; // Strictly 1 URL max

            return true;
        }, "Message failed strict heuristics. It must be written by a human, adequately detailed, and not contain unauthorized TLDs/links."),
    policy: z.boolean().refine(val => val === true, "You must accept the privacy policy to proceed.")
})

export type ContactFormData = z.infer<typeof contactSchema>
