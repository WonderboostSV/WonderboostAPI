import java.util.regex.*;
import java.io.*;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;

public class Validator {

    private String filename;
    private String passwordError;
    private String fileError;
    private String searchValue;
    private String searchError;

    public Validator() {
        this.filename = null;
        this.passwordError = null;
        this.fileError = null;
        this.searchValue = null;
        this.searchError = null;
    }

    // Métodos getter
    public String getPasswordError() {
        return passwordError;
    }

    public String getFilename() {
        return filename;
    }

    public String getFileError() {
        return fileError;
    }

    public String getSearchValue() {
        return searchValue;
    }

    public String getSearchError() {
        return searchError;
    }

    // Validación de formulario (limpiar espacios en blanco)
    public String[] validateForm(String[] fields) {
        for (int i = 0; i < fields.length; i++) {
            fields[i] = fields[i].trim();
        }
        return fields;
    }

    // Validar número natural (entero mayor o igual a 1)
    public boolean validateNaturalNumber(int value) {
        return value >= 1;
    }

    // Validar número positivo (entero mayor o igual a 0)
    public boolean validatePositiveNumber(int value) {
        return value >= 0;
    }

    // Validar archivo de imagen
    public boolean validateImageFile(File file, String mimetype, long fileSize) {
        String[] validTypes = {"image/jpeg", "image/png"};
        if (file != null && mimetype != null && fileSize > 0) {
            boolean isValidType = false;
            for (String type : validTypes) {
                if (mimetype.equals(type)) {
                    isValidType = true;
                    break;
                }
            }
            if (!isValidType) {
                this.fileError = "El tipo de imagen debe ser jpg o png";
                return false;
            }
            if (fileSize > 2097152) {
                this.fileError = "El tamaño de la imagen debe ser menor a 2MB";
                return false;
            } else {
                String extension = mimetype.split("/")[1];
                this.filename = System.currentTimeMillis() + "." + extension;
                return true;
            }
        } else {
            this.fileError = "El archivo no tiene un tipo válido o el tamaño es incorrecto";
            return false;
        }
    }

    // Validar archivo PDF o DOCX
    public static boolean validateFile(File file, long maxSizeMB) {
        try {
            if (file != null && file.exists()) {
                long fileSizeMB = Files.size(file.toPath()) / (1024 * 1024);
                if (fileSizeMB > maxSizeMB) {
                    return false;
                }
                String fileType = Files.probeContentType(file.toPath());
                if (fileType != null && (fileType.equals("application/pdf") || fileType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))) {
                    String extension = file.getName().split("\\.")[1].toLowerCase();
                    if (extension.equals("pdf") || extension.equals("docx")) {
                        return true;
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
    }

    // Validar tipo booleano
    public static boolean validateBoolean(boolean value) {
        return value == true || value == false;
    }

    // Validar cadena de texto con caracteres alfabéticos, dígitos, espacios y signos de puntuación
    public static boolean validateString(String value) {
        return value.matches("^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚ\\s,;:.]+$");
    }

    // Validar array de números
    public static boolean validateNumberArray(int[] value) {
        if (value != null && value.length == 6) {
            for (int item : value) {
                if (item == 0) return false;
            }
            return true;
        }
        return false;
    }

    // Validar una cadena de texto con letras, números, espacios, signos y guiones
    public static boolean validateStringText(String value) {
        return value.matches("^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚ\\s,;\\.-+]+$");
    }

    // Validar texto ortográfico
    public static boolean validateTextOrthographic(String value) {
        return value.matches("^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚ\\s,;\\.\\-+\\/¿?\\)!]*$");
    }

    // Validar cadena alfabética
    public static boolean validateAlphabetic(String value) {
        return value.matches("^[a-zA-ZñÑáÁéÉíÍóÓúÚ\\s]+$");
    }

    // Validar alfanumérico
    public static boolean validateAlphanumeric(String value) {
        return value.matches("^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚ\\s]+$");
    }

    // Validar longitud de cadena
    public static boolean validateLength(String value, int min, int max) {
        return value.length() >= min && value.length() <= max;
    }

    // Validar dinero
    public static boolean validateMoney(String value) {
        return value.matches("^[0-9]+(?:\\.[0-9]{1,2})?$");
    }

    // Validar correo electrónico
    public boolean validateEmail(String value) {
        return value.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    }

    // Validar contraseña
    public boolean validatePassword(String value, String name, String lastname, String birthday, String phone, String email) {
        if (value.length() < 8) {
            this.passwordError = "Clave menor a 8 caracteres";
            return false;
        } else if (value.length() > 72) {
            this.passwordError = "Clave mayor a 72 caracteres";
            return false;
        } else if (value.contains(" ")) {
            this.passwordError = "Clave contiene espacios en blanco";
            return false;
        } else if (!value.matches(".*\\W.*")) {
            this.passwordError = "Clave debe contener al menos un caracter especial";
            return false;
        } else if (!value.matches(".*\\d.*")) {
            this.passwordError = "Clave debe contener al menos un dígito";
            return false;
        } else if (!value.matches(".*[a-z].*")) {
            this.passwordError = "Clave debe contener al menos una letra en minúsculas";
            return false;
        } else if (!value.matches(".*[A-Z].*")) {
            this.passwordError = "Clave debe contener al menos una letra en mayúsculas";
            return false;
        }

        // Validar contra datos sensibles
        String[] sensitiveData = {name, lastname, birthday, phone, email};
        String valueLower = value.toLowerCase();
        for (String data : sensitiveData) {
            if (data != null && data.length() >= 3) {
                for (int i = 0; i <= data.length() - 3; i++) {
                    String substring = data.substring(i, i + 3).toLowerCase();
                    if (valueLower.contains(substring)) {
                        this.passwordError = "Clave contiene parte del dato del usuario: '" + substring + "'";
                        return false;
                    }
                }
            }
        }
        return true;
    }

    // Validar número telefónico
    public boolean validatePhone(String value) {
        return value.matches("^[267][0-9]{3}-[0-9]{4}$");
    }

    // Validar DUI
    public boolean validateDUI(String value) {
        return value.matches("^[0-9]{8}-[0-9]{1}$");
    }

    // Validar fecha
    public static boolean validateDate(String value) {
        String[] dateParts = value.split("-");
        if (dateParts.length != 3) return false;
        int year = Integer.parseInt(dateParts[0]);
        int month = Integer.parseInt(dateParts[1]) - 1;
        int day = Integer.parseInt(dateParts[2]);
        return new java.util.Date(year, month, day).getDate() == day;
    }

    // Validar búsqueda
    public static boolean validateSearch(String value) {
        if (value.trim().isEmpty()) {
            return false;
        } else if (value.trim().split("\\s+").length > 3) {
            return false;
        } else if (validateStringText(value)) {
            return true;
        } else {
            return false;
        }
    }

    // Guardar archivo
    public static boolean saveFile(File file, String path) {
        try {
            Files.move(file.toPath(), Paths.get(path, file.getName()));
            return true;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
    }

    // Eliminar archivo
    public static boolean deleteFile(String filePath) {
        try {
            return Files.deleteIfExists(Paths.get(filePath));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
    }
}
