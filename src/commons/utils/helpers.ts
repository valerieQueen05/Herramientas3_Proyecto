export const createSlug = (name: string): string => {
    return value.trim().toLowerCase().replace(/\s+/g, '-');
}