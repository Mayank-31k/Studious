import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Allowed redirect paths (must start with these)
const ALLOWED_REDIRECT_PREFIXES = ['/dashboard', '/profile', '/groups'];

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    let next = searchParams.get('next') ?? '/dashboard';

    // Prevent open redirect attacks
    // Only allow relative paths that start with allowed prefixes
    const isValidRedirect =
        next.startsWith('/') &&
        !next.startsWith('//') &&
        ALLOWED_REDIRECT_PREFIXES.some(prefix => next.startsWith(prefix));

    if (!isValidRedirect) {
        next = '/dashboard';
    }

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
