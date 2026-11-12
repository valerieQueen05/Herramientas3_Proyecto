// "Cafés Calientes" -> "cafes-calientes"
export const createSlug = (name: string): string => {
    return name
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '') // quita tildes
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')    // quita caracteres especiales
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}
