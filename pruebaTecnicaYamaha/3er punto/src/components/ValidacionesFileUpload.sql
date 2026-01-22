CREATE OR REPLACE FUNCTION cargar_ventas_simple(
    datos_json JSONB
) RETURNS JSONB AS $$
DECLARE
    registro JSONB;
    resultado JSONB;
    total INTEGER := 0;
    exitosos INTEGER := 0;
    errores TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- Contar total de registros
    SELECT jsonb_array_length(datos_json) INTO total;
    
    -- Procesar cada registro
    FOR registro IN SELECT * FROM jsonb_array_elements(datos_json)
    LOOP
        BEGIN
            -- Validaciones básicas en una sola consulta
            IF NOT EXISTS (
                SELECT 1 
                FROM clientes c
                JOIN vehiculos v ON v.chasis = registro->>'vehiculo_id'
                JOIN tiendas t ON t.id = (registro->>'tienda_id')::INTEGER
                WHERE c.id = (registro->>'cliente_id')::INTEGER
                AND NOT EXISTS (
                    SELECT 1 FROM ventas 
                    WHERE factura_num = registro->>'factura_num'
                    OR vehiculo_id = registro->>'vehiculo_id'
                )
            ) THEN
                errores := array_append(errores, 
                    'Factura ' || (registro->>'factura_num') || ': Datos inválidos');
                CONTINUE;
            END IF;
            
            -- Insertar
            INSERT INTO ventas (
                factura_num, fecha, precio, cliente_id, 
                vehiculo_id, tienda_id, vendedor_id
            ) VALUES (
                registro->>'factura_num',
                (registro->>'fecha')::DATE,
                (registro->>'precio')::DECIMAL,
                (registro->>'cliente_id')::INTEGER,
                registro->>'vehiculo_id',
                (registro->>'tienda_id')::INTEGER,
                (registro->>'vendedor_id')::INTEGER
            );
            
            exitosos := exitosos + 1;
            
        EXCEPTION WHEN OTHERS THEN
            errores := array_append(errores, SQLERRM);
        END;
    END LOOP;
    
    -- Construir respuesta JSON
    resultado := jsonb_build_object(
        'success', exitosos > 0,
        'total', total,
        'processed', exitosos,
        'errors', errores
    );
    
    RETURN resultado;
END;