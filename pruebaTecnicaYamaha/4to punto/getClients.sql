SELECT
  c.nombres,
  c.documento,
  
  -- 1. Listamos los modelos separados por coma
  STRING_AGG(m.nombre_modelo, ', ') AS modelos_comprados,
  
  -- 2. Total de compras
  COUNT(v.id) AS total_compras,
  
  -- 3. Cálculo real de periodicidad: (Última fecha - Primera fecha) / (Compras - 1)
  (MAX(v.fecha) - MIN(v.fecha)) / NULLIF(COUNT(v.id) - 1, 0) AS periodicidad_dias,
  
  -- 4. Pronóstico: Última fecha + Periodicidad calculada
  MAX(v.fecha) + 
    ((MAX(v.fecha) - MIN(v.fecha)) / NULLIF(COUNT(v.id) - 1, 0)) * INTERVAL '1 day' 
    AS proxima_compra

FROM clientes c
JOIN ventas v ON c.id = v.cliente_id
JOIN vehiculos veh ON v.vehiculo_id = veh.chasis
JOIN modelos m ON veh.modelo_id = m.id
GROUP BY c.id, c.nombres, c.documento
HAVING COUNT(v.id) > 2;