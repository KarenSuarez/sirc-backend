# sirc-backend

Sistemas de Fidelizacion y Referidos Clarisa CLOUD

## Instalación

1.  Clona el repositorio.
2.  Instala las dependencias:
    ```bash
    npm install
    ```

## Uso

Para iniciar el servidor en modo de desarrollo, ejecuta:

```bash
npm run dev
```

El servidor se iniciará en el puerto 8080.

## Endpoints

### Autenticación

-   **POST /api/auth/register**

    Registra un nuevo usuario.

    **Body:**

    ```json
    {
      "nombre": "John",
      "apellido": "Doe",
      "correo_electronico": "john.doe@example.com",
      "password": "secretpassword",
      "numero_documento_identidad": "123456789",
      "id_tipo_documento": 1,
      "telefono": "1234567890"
    }
    ```

    **Respuesta:**

    ```json
    {
      "message": "¡Usuario registrado exitosamente!"
    }
    ```