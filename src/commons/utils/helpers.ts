export const createSlug = (name: string): string => {
    return name.trim().toLowerCase().replace(/\s+/g, '-');
}
