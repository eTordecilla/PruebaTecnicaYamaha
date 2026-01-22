import pool from '../config/database';

export interface Cliente {
  id?: number;
  documento: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  direccion?: string;
  created_at?: Date;
}

export class ClienteModel {
  /** * Busca un cliente por documento */
  static async findByDocumento(documento: string): Promise<Cliente | null> {
    const query = 'SELECT * FROM clientes WHERE documento = $1';
    const result = await pool.query(query, [documento]);
    return result.rows[0] || null;
  }

  /** * Crea un nuevo cliente */
  static async create(cliente: Cliente): Promise<Cliente> {
    const query = ` INSERT INTO clientes (documento, nombres, apellidos, email, telefono, direccion) VALUES ($1, $2, $3, $4, $5, $6) RETURNING * `;
    const values = [
      cliente.documento,
      cliente.nombres,
      cliente.apellidos,
      cliente.email,
      cliente.telefono || null,
      cliente.direccion || null
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /** * Actualiza un cliente existente */
  static async update(id: number, cliente: Partial<Cliente>): Promise<Cliente> {
    const query = ` UPDATE clientes SET nombres = COALESCE($1, nombres), apellidos = COALESCE($2, apellidos), email = COALESCE($3, email), telefono = COALESCE($4, telefono), direccion = COALESCE($5, direccion) WHERE id = $6 RETURNING * `;
    const values = [
      cliente.nombres,
      cliente.apellidos,
      cliente.email,
      cliente.telefono,
      cliente.direccion,
      id
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}