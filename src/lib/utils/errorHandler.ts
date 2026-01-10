// Utility function to convert technical Supabase errors to user-friendly messages
export function getErrorMessage(error: any): string {
    if (!error) return 'An unexpected error occurred';

    // Handle Supabase auth errors
    if (error.message) {
        const msg = error.message.toLowerCase();

        if (msg.includes('invalid login credentials') || msg.includes('invalid email or password')) {
            return 'Invalid email or password. Please try again.';
        }

        if (msg.includes('email not confirmed')) {
            return 'Please check your email and confirm your account before logging in.';
        }

        if (msg.includes('user already registered')) {
            return 'This email is already registered. Please log in instead.';
        }

        if (msg.includes('network') || msg.includes('fetch')) {
            return 'Network error. Please check your connection and try again.';
        }

        if (msg.includes('database') || msg.includes('sql')) {
            return 'A database error occurred. Please try again later.';
        }

        if (msg.includes('storage')) {
            return 'File upload failed. Please try again.';
        }

        if (msg.includes('rate limit')) {
            return 'Too many attempts. Please wait a moment and try again.';
        }

        if (msg.includes('permission') || msg.includes('unauthorized')) {
            return 'You do not have permission to perform this action.';
        }
    }

    // Return generic message for unknown errors
    return 'Something went wrong. Please try again.';
}

// Handle async operations with proper error handling
export async function handleAsync<T>(
    promise: Promise<T>,
    errorMessage?: string
): Promise<{ data: T | null; error: string | null }> {
    try {
        const data = await promise;
        return { data, error: null };
    } catch (err: any) {
        console.error('Error in handleAsync:', err);
        return { data: null, error: errorMessage || getErrorMessage(err) };
    }
}
