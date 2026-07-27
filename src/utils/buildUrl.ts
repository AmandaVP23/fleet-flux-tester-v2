export function buildUrl(
    baseUrl: string,
    params: Record<string, string | number | null | undefined> = {},
): string {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (value !== null && value !== undefined) {
            searchParams.append(key, String(value));
        }
    }

    const query = searchParams.toString();
    return query ? `${baseUrl}?${query}` : baseUrl;
}
