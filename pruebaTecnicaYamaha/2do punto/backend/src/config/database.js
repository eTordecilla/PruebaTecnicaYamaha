const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'yamaha_test',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Database schema initialization
async function setupDatabase() {
  try {
    // Create tables if they don't exist
    await createTables();
    console.log('✅ Database tables verified/created');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
}

async function createTables() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Clientes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        documento VARCHAR(20) UNIQUE NOT NULL,
        nombres VARCHAR(100) NOT NULL,
        apellidos VARCHAR(100) NOT NULL,
        direccion TEXT,
        fecha_nacimiento DATE,
        genero VARCHAR(10),
        celular VARCHAR(20) NOT NULL,
        email VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Modelos table
    await client.query(`
      CREATE TABLE IF NOT EXISTS modelos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        categoria VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Vehiculos table
    await client.query(`
      CREATE TABLE IF NOT EXISTS vehiculos (
        id SERIAL PRIMARY KEY,
        modelo_id INTEGER REFERENCES modelos(id),
        motor VARCHAR(50) NOT NULL,
        cilindraje INTEGER NOT NULL,
        color VARCHAR(50) NOT NULL,
        fecha_ensamble DATE NOT NULL,
        anio_modelo INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ventas table
    await client.query(`
      CREATE TABLE IF NOT EXISTS ventas (
        id SERIAL PRIMARY KEY,
        fecha DATE NOT NULL,
        factura_num VARCHAR(50) UNIQUE NOT NULL,
        ciudad VARCHAR(100) NOT NULL,
        tienda VARCHAR(100) NOT NULL,
        precio DECIMAL(12,2) NOT NULL,
        cliente_id INTEGER REFERENCES clientes(id),
        vehiculo_id INTEGER REFERENCES vehiculos(id),
        vendedor VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert some default modelos if empty
    const modelosCount = await client.query('SELECT COUNT(*) FROM modelos');
    if (parseInt(modelosCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO modelos (nombre, categoria) VALUES 
        ('MT-07', 'Naked'),
        ('YZF-R3', 'Sport'),
        ('Ténéré 700', 'Adventure'),
        ('NMAX', 'Scooter')
      `);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  setupDatabase,
  createTables
};
