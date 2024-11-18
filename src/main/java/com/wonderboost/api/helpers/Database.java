package com.wonderboost.api.helpers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Component
public class Database {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public Database(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    // Método para ejecutar una sentencia SQL genérica (INSERT, UPDATE, DELETE)
    public boolean executeRow(String query, Object[] values) {
        try {
            jdbcTemplate.update(query, values);
            return true;
        } catch (Exception e) {
            setException(e.getMessage());
            return false;
        }
    }

    // Método para obtener el último ID insertado
    public int getLastRow(String query, Object[] values) {
        try {
            return jdbcTemplate.queryForObject(query, Integer.class, values);
        } catch (Exception e) {
            setException(e.getMessage());
            return 0;
        }
    }

    // Método para obtener una sola fila (registro)
    public List<String> getRow(String query, Object[] values) {
        try {
            return jdbcTemplate.query(query, values, new RowMapper<String>() {
                @Override
                public String mapRow(ResultSet resultSet, int rowNum) throws SQLException {
                    StringBuilder row = new StringBuilder();
                    int columnCount = resultSet.getMetaData().getColumnCount();
                    for (int i = 1; i <= columnCount; i++) {
                        row.append(resultSet.getString(i)).append(", ");
                    }
                    return row.toString();
                }
            });
        } catch (Exception e) {
            setException(e.getMessage());
            return null;
        }
    }

    // Método para obtener varias filas (registros)
    public List<List<String>> getRows(String query, Object[] values) {
        try {
            return jdbcTemplate.query(query, values, new RowMapper<List<String>>() {
                @Override
                public List<String> mapRow(ResultSet resultSet, int rowNum) throws SQLException {
                    List<String> row = new java.util.ArrayList<>();
                    int columnCount = resultSet.getMetaData().getColumnCount();
                    for (int i = 1; i <= columnCount; i++) {
                        row.add(resultSet.getString(i));
                    }
                    return row;
                }
            });
        } catch (Exception e) {
            setException(e.getMessage());
            return null;
        }
    }

    // Método para manejar excepciones de base de datos y asignar mensajes de error
    // personalizados
    private static void setException(String code, String message) {
        error = message + "\n"; // Asigna el mensaje original del error

        // Se compara el código del error para establecer un error personalizado.
        switch (code) {
            case "2002":
                error = "Servidor desconocido";
                break;
            case "1049":
                error = "Base de datos desconocida";
                break;
            case "1045":
                error = "Acceso denegado";
                break;
            case "42S02":
                error = "Tabla no encontrada";
                break;
            case "42S22":
                error = "Columna no encontrada";
                break;
            case "45000":
                // Manejo de errores de validación para campos duplicados o inválidos
                if (message.contains("Correo electrónico ya existe")) {
                    error = "El correo electrónico introducido ya existe";
                } else if (message.contains("DUI ya existe")) {
                    error = "El DUI introducido ya existe";
                } else if (message.contains("Nombre de usuario ya existe")) {
                    error = "El nombre de usuario introducido ya existe";
                } else if (message.contains("El usuario no existe")) {
                    error = "El usuario no existe";
                } else if (message.contains("Formato de correo electrónico no válido")) {
                    error = "El formato del correo electrónico no es válido";
                } else {
                    error = "Error con alguno de estos campos: correo, DUI, nombre de usuario";
                }
                break;
            case "23000":
                // Manejo de errores por claves duplicadas o restricciones de claves foráneas
                if (message.matches(".*Duplicate entry .* for key '(.+)'")) {
                    // Extrae el nombre de la columna duplicada
                    String colName = message.replaceAll(".*Duplicate entry .* for key '(.*)'", "$1");
                    error = "Uno de los datos ya se encuentra registrado en el sistema, en el campo: " + colName
                            + ". Recuerda no duplicar datos.";
                } else if (message.contains("Cannot add or update a child row: a foreign key constraint fails")) {
                    error = "No se puede agregar o actualizar el registro porque falla la restricción de clave foránea. Verifica que el valor exista en la tabla referenciada.";
                } else if (message.contains("Cannot delete or update a parent row: a foreign key constraint fails")) {
                    error = "Por seguridad no puedes eliminar o actualizar el registro porque está siendo utilizado por otra tabla. Verifica donde más lo utilizas.";
                } else {
                    error = "Uno de los datos ya se encuentra registrado en el sistema o hay un conflicto de integridad de datos. Revisa los datos ingresados.";
                }
                break;
            default:
                // Si no se encuentra un código específico, mantén el error original.
                break;
        }
    }
}
