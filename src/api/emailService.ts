import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_70777';
const TEMPLATE_ID = 'template_trr7ies';
const PUBLIC_KEY = '1JGw1m7Ry_mNjHpFx';

// Initialize EmailJS
emailjs.init(PUBLIC_KEY);

export function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationEmail(
    toEmail: string,
    verificationCode: string
): Promise<boolean> {
    try {
        const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
            to_email: toEmail,
            verification_code: verificationCode,
        });

        console.log('Email sent successfully:', response.status);
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
}
