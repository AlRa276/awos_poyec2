# Endpoints de Auth y Users

## Auth

### 1. Registrar usuario

- Método: `POST`
- Ruta: `/api/v1/auth/register`
- Descripción: Crea un nuevo usuario en la base de datos.
- Ejemplo de entrada:

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```

- Ejemplo de salida (éxito, 201):

```json
{
  "code": 201,
  "message": "CREATED",
  "detail": "",
  "data": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "createdAt": "2026-07-16T12:30:00.000Z",
    "updatedAt": "2026-07-16T12:30:00.000Z"
  }
}
```

- Ejemplo de salida (error, 409):

```json
{
  "code": 409,
  "message": "CONFLICT",
  "detail": "El correo ya está registrado"
}
```

### 2. Iniciar sesión

- Método: `POST`
- Ruta: `/api/v1/auth/login`
- Descripción: Valida las credenciales y devuelve un token de sesión.
- Ejemplo de entrada:

```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

- Ejemplo de salida (éxito, 200):

```json
{
  "code": 200,
  "message": "OK",
  "detail": "",
  "data": {
    "usuario": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "createdAt": "2026-07-16T12:30:00.000Z",
      "updatedAt": "2026-07-16T12:30:00.000Z"
    }
  }
}
```

- Ejemplo de salida (error, 401):

```json
{
  "code": 401,
  "message": "UNAUTHORIZED",
  "detail": "Credenciales inválidas"
}
```

- Nota: En caso de éxito, el servidor también guarda una cookie `token` de forma segura.

### 3. Cerrar sesión

- Método: `POST`
- Ruta: `/api/v1/auth/logout`
- Descripción: Revoca el token actual y cierra la sesión del usuario.
- Ejemplo de entrada:

```json
{}
```

- Ejemplo de salida (éxito, 200):

```json
{
  "code": 200,
  "message": "OK",
  "detail": "",
  "data": {
    "message": "Sesión cerrada"
  }
}
```

- Ejemplo de salida (error, 401):

```json
{
  "code": 401,
  "message": "UNAUTHORIZED",
  "detail": "No autorizado"
}
```

## Users

### 4. Actualizar usuario

- Método: `PUT`
- Ruta: `/api/v1/users/:id`
- Descripción: Actualiza los datos del usuario autenticado, siempre que sea el propietario del recurso.
- Ejemplo de entrada:

```json
{
  "name": "Juan Actualizado",
  "email": "nuevo@example.com",
  "password": "nueva123"
}
```

- Ejemplo de salida (éxito, 200):

```json
{
  "code": 200,
  "message": "OK",
  "detail": "",
  "data": {
    "id": 1,
    "name": "Juan Actualizado",
    "email": "nuevo@example.com",
    "createdAt": "2026-07-16T12:30:00.000Z",
    "updatedAt": "2026-07-16T12:45:00.000Z"
  }
}
```

- Ejemplo de salida (error, 403):

```json
{
  "code": 403,
  "message": "FORBIDDEN",
  "detail": "No tienes permiso para editar este usuario"
}
```

### 5. Eliminar usuario

- Método: `DELETE`
- Ruta: `/api/v1/users/:id`
- Descripción: Elimina al usuario autenticado si es el propietario del recurso.
- Ejemplo de entrada:

```json
{}
```

- Ejemplo de salida (éxito, 200):

```json
{
  "code": 200,
  "message": "OK",
  "detail": "",
  "data": {
    "message": "Usuario eliminado"
  }
}
```

- Ejemplo de salida (error, 403):

```json
{
  "code": 403,
  "message": "FORBIDDEN",
  "detail": "No tienes permiso para eliminar este usuario"
}
```

## Ciudades

### 6. Crear ciudad

- Método: `POST`
- Ruta: `/api/v1/ciudades`
- Descripción: Crea una nueva ciudad asociada al usuario autenticado.
- Ejemplo de entrada:

```json
{
  "nombre": "Guadalajara",
  "estado": "Jalisco",
  "codigoPais": "MX",
  "codigoPostal": "44100"
}
```

- Ejemplo de salida (éxito, 201):

```json
{
  "code": 201,
  "message": "CREATED",
  "detail": "Ciudad \"Guadalajara\" creada correctamente",
  "data": {
    "id": 1,
    "idUsuario": 1,
    "nombre": "Guadalajara",
    "estado": "Jalisco",
    "codigoPais": "MX",
    "codigoPostal": "44100",
    "createdAt": "2026-07-16T12:30:00.000Z",
    "updatedAt": "2026-07-16T12:30:00.000Z"
  }
}
```

- Ejemplo de salida (error, 401):

```json
{
  "code": 401,
  "message": "UNAUTHORIZED",
  "detail": "No autorizado"
}
```

### 7. Listar ciudades del usuario

- Método: `GET`
- Ruta: `/api/v1/ciudades`
- Descripción: Devuelve todas las ciudades asociadas al usuario autenticado.
- Ejemplo de entrada:

```json
{}
```

- Ejemplo de salida (éxito, 200):

```json
{
  "code": 200,
  "message": "OK",
  "detail": "Se encontraron 1 ciudad(es)",
  "data": [
    {
      "id": 1,
      "idUsuario": 1,
      "nombre": "Guadalajara",
      "estado": "Jalisco",
      "codigoPais": "MX",
      "codigoPostal": "44100",
      "createdAt": "2026-07-16T12:30:00.000Z",
      "updatedAt": "2026-07-16T12:30:00.000Z"
    }
  ]
}
```

- Ejemplo de salida (error, 401):

```json
{
  "code": 401,
  "message": "UNAUTHORIZED",
  "detail": "No autorizado"
}
```

### 8. Obtener una ciudad

- Método: `GET`
- Ruta: `/api/v1/ciudades/:id`
- Descripción: Devuelve una ciudad específica si pertenece al usuario autenticado.
- Ejemplo de entrada:

```json
{}
```

- Ejemplo de salida (éxito, 200):

```json
{
  "code": 200,
  "message": "OK",
  "detail": "Ciudad encontrada",
  "data": {
    "id": 1,
    "idUsuario": 1,
    "nombre": "Guadalajara",
    "estado": "Jalisco",
    "codigoPais": "MX",
    "codigoPostal": "44100",
    "createdAt": "2026-07-16T12:30:00.000Z",
    "updatedAt": "2026-07-16T12:30:00.000Z"
  }
}
```

- Ejemplo de salida (error, 403):

```json
{
  "code": 403,
  "message": "FORBIDDEN",
  "detail": "No tienes permiso sobre esta ciudad"
}
```

### 9. Actualizar ciudad

- Método: `PUT`
- Ruta: `/api/v1/ciudades/:id`
- Descripción: Actualiza una ciudad existente si pertenece al usuario autenticado.
- Ejemplo de entrada:

```json
{
  "nombre": "Zapopan",
  "estado": "Jalisco",
  "codigoPais": "MX",
  "codigoPostal": "45100"
}
```

- Ejemplo de salida (éxito, 200):

```json
{
  "code": 200,
  "message": "OK",
  "detail": "Ciudad \"Zapopan\" actualizada correctamente",
  "data": {
    "id": 1,
    "idUsuario": 1,
    "nombre": "Zapopan",
    "estado": "Jalisco",
    "codigoPais": "MX",
    "codigoPostal": "45100",
    "createdAt": "2026-07-16T12:30:00.000Z",
    "updatedAt": "2026-07-16T12:45:00.000Z"
  }
}
```

- Ejemplo de salida (error, 403):

```json
{
  "code": 403,
  "message": "FORBIDDEN",
  "detail": "No tienes permiso sobre esta ciudad"
}
```

### 10. Eliminar ciudad

- Método: `DELETE`
- Ruta: `/api/v1/ciudades/:id`
- Descripción: Elimina una ciudad existente si pertenece al usuario autenticado.
- Ejemplo de entrada:

```json
{}
```

- Ejemplo de salida (éxito, 200):

```json
{
  "code": 200,
  "message": "OK",
  "detail": "Se eliminó la ciudad con id 1",
  "data": null
}
```

- Ejemplo de salida (error, 403):

```json
{
  "code": 403,
  "message": "FORBIDDEN",
  "detail": "No tienes permiso sobre esta ciudad"
}
```

## Notas generales

- Los endpoints protegidos requieren un token en el encabezado `Authorization: Bearer <token>` o una cookie `token` válida.
- En caso de error, la API responde con un JSON con los campos `code`, `message` y `detail`.
