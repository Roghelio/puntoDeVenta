/**
 * esta interfaz representa los productos que estan a la venta
 */
export interface Producto {
  id: number;
  categoria: string;
  nombre:string;
  tamaño: string;
  descripcion: string;
  precio: number;
  cantidad:number;// es la cantidad de producto que va a salir en la venta
}
