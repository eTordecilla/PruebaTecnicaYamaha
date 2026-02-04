const fs = require('fs');
const csv = require('csv-parser');
const { pool } = require('../config/database');

// Create single sale
async function createSale(req, res) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      documento, nombres, apellidos, email, direccion,
      fecha_nacimiento, genero, celular,
      motor, modelo_id, cilindraje, color, fecha_ensamble, anio_modelo,
      factura_num, precio, fecha, ciudad, tienda, vendedor
    } = req.body;

    // Find or create client
    let clienteResult = await client.query(
      'SELECT id FROM clientes WHERE documento = $1',
      [documento]
    );
    
    let clienteId;
    if (clienteResult.rows.length === 0) {
      const newCliente = await client.query(
        `INSERT INTO clientes (documento, nombres, apellidos, email, direccion, fecha_nacimiento, genero, celular)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [documento, nombres, apellidos, email, direccion, fecha_nacimiento, genero, celular]
      );
      clienteId = newCliente.rows[0].id;
    } else {
      clienteId = clienteResult.rows[0].id;
    }

    // Create vehicle
    const vehiculoResult = await client.query(
      `INSERT INTO vehiculos (modelo_id, motor, cilindraje, color, fecha_ensamble, anio_modelo)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [modelo_id, motor, cilindraje, color, fecha_ensamble, anio_modelo]
    );
    const vehiculoId = vehiculoResult.rows[0].id;

    // Create sale
    const ventaResult = await client.query(
      `INSERT INTO ventas (fecha, factura_num, ciudad, tienda, precio, cliente_id, vehiculo_id, vendedor)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [fecha, factura_num, ciudad, tienda, precio, clienteId, vehiculoId, vendedor]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Venta creada exitosamente',
      data: {
        venta_id: ventaResult.rows[0].id,
        cliente_id: clienteId,
        vehiculo_id: vehiculoId
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating sale:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error al crear la venta',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    client.release();
  }
}

// Process sales file (CSV/TXT)
async function processSalesFile(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No se proporcionó ningún archivo'
    });
  }

  const client = await pool.connect();
  const results = [];
  let processedCount = 0;
  let errorCount = 0;

  try {
    await client.query('BEGIN');

    const filePath = req.file.path;
    const stream = fs.createReadStream(filePath);

    await new Promise((resolve, reject) => {
      stream
        .pipe(csv({
          separator: ',',
          headers: [
            'documento', 'nombres', 'apellidos', 'email', 'direccion',
            'fecha_nacimiento', 'genero', 'celular',
            'motor', 'modelo_id', 'cilindraje', 'color', 'fecha_ensamble', 'anio_modelo',
            'factura_num', 'precio', 'fecha', 'ciudad', 'tienda', 'vendedor'
          ],
          skipLinesWithError: true
        }))
        .on('data', async (row) => {
          try {
            // Validate required fields
            if (!row.documento || !row.nombres || !row.factura_num || !row.precio) {
              errorCount++;
              results.push({
                row: processedCount + 1,
                error: 'Campos requeridos faltantes',
                data: row
              });
              return;
            }

            // Find or create client
            let clienteResult = await client.query(
              'SELECT id FROM clientes WHERE documento = $1',
              [row.documento.trim()]
            );
            
            let clienteId;
            if (clienteResult.rows.length === 0) {
              const newCliente = await client.query(
                `INSERT INTO clientes (documento, nombres, apellidos, email, direccion, fecha_nacimiento, genero, celular)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
                [
                  row.documento?.trim(),
                  row.nombres?.trim(),
                  row.apellidos?.trim(),
                  row.email?.trim(),
                  row.direccion?.trim(),
                  row.fecha_nacimiento || null,
                  row.genero || null,
                  row.celular?.trim()
                ]
              );
              clienteId = newCliente.rows[0].id;
            } else {
              clienteId = clienteResult.rows[0].id;
            }

            // Create vehicle
            const vehiculoResult = await client.query(
              `INSERT INTO vehiculos (modelo_id, motor, cilindraje, color, fecha_ensamble, anio_modelo)
               VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
              [
                parseInt(row.modelo_id) || 1,
                row.motor?.trim(),
                parseInt(row.cilindraje) || 0,
                row.color?.trim() || 'Sin especificar',
                row.fecha_ensamble || new Date().toISOString().split('T')[0],
                parseInt(row.anio_modelo) || new Date().getFullYear()
              ]
            );
            const vehiculoId = vehiculoResult.rows[0].id;

            // Create sale
            const ventaResult = await client.query(
              `INSERT INTO ventas (fecha, factura_num, ciudad, tienda, precio, cliente_id, vehiculo_id, vendedor)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
              [
                row.fecha || new Date().toISOString().split('T')[0],
                row.factura_num.trim(),
                row.ciudad?.trim() || 'Sin especificar',
                row.tienda?.trim() || 'Sin especificar',
                parseFloat(row.precio) || 0,
                clienteId,
                vehiculoId,
                row.vendedor?.trim() || 'Sin especificar'
              ]
            );

            processedCount++;
            results.push({
              row: processedCount,
              success: true,
              venta_id: ventaResult.rows[0].id,
              factura_num: row.factura_num
            });

          } catch (error) {
            errorCount++;
            results.push({
              row: processedCount + 1,
              error: error.message,
              data: row
            });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    await client.query('COMMIT');

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: `Procesamiento completado. ${processedCount} ventas creadas, ${errorCount} errores.`,
      data: {
        processed: processedCount,
        errors: errorCount,
        total: processedCount + errorCount,
        details: results
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    console.error('Error processing file:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error al procesar el archivo',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    client.release();
  }
}

module.exports = {
  createSale,
  processSalesFile
};
