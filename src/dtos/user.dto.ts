export interface ICreateUserDTO {
  nombre: string;
  correo: string;
  password: string;
  rol: string;
}

export interface IUpdateUserDTO {
  nombre?: string;
  correo?: string;
  password?: string;
  rol?: string;
}