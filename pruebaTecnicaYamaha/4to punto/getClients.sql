SELECT 
    c.nombres, 
    c.documento,
    COUNT(v.id) AS total_compras,
    AVG(CURRENT_DATE - v.fecha) AS periodicidad_promedio_compra,
    CURRENT_DATE + AVG(CURRENT_DATE - v.fecha) * INTERVAL '1 day' AS proxima_compra
FROM clientes c
JOIN ventas v ON c.id = v.cliente_id
GROUP BY c.id, c.nombres, c.documento
HAVING COUNT(v.id) > 2;