export interface ICreateAssetDTO {
  nombre: string;
  tipo: string;
  marca: string;
  modelo: string;
  ambienteId: number;
}

export interface IUpdateAssetDTO {
  nombre?: string;
  tipo?: string;
  marca?: string;
  modelo?: string;
  ambienteId?: number;
}