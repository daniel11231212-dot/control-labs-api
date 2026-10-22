export interface ICreateEnvironmentDTO {
  nombre: string;
  tipo: string;
  capacidad: number;
  ubicacion: string;
}

export interface IUpdateEnvironmentDTO {
  nombre?: string;
  tipo?: string;
  capacidad?: number;
  ubicacion?: string;
}