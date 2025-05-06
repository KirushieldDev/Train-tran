export async function checkIfLogin(): Promise<{sub: string; email: string} | null> {
    const res = await fetch("/api/auth/session");
    if (!res.ok) return null;
    const {user} = (await res.json()) as {user: {sub: string; email: string} | null};
    return user;
}
