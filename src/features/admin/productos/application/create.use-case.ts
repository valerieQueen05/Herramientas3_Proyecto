// Importamos tu ICreate exactamente como lo tienes en tu entity
import { ICreate } from "../domain/product.entity"; 
import { ProductRepository } from "../domain/product.repository";

export class CreateUseCase {
    constructor(private repo: ProductRepository) { }

    // Recibimos los datos que vienen del controlador (lo que llenó el usuario)
    // Le ponemos 'any' por ahora para no complicarnos, igual que en categorías
    execute(datos: Omit<ICreate, 'url'>) {
        
        // 1. Fabricamos la URL a partir del título, justo como hizo tu compañera
        const urlGenerada = datos.titulo.trim().toLowerCase().replace(/\s+/g, '-');
        
        // 2. Ahora sí, armamos la variable 'data' de tipo 'ICreate'. 
        // Como ICreate exige que le pasemos todos estos campos, los sacamos de 'datos' y le sumamos la 'urlGenerada'
        const data: ICreate = {
            titulo: datos.titulo,
            url: urlGenerada,
            precioCompra: datos.precioCompra,
            precioVenta: datos.precioVenta,
            stock: datos.stock,
            imagen: datos.imagen,
            categoriaId: datos.categoriaId,
            descripcion: datos.descripcion
        };

        // 3. Se lo mandamos al repositorio, que espera recibir un ICreate
        return this.repo.create(data);
    }
}