# Instrucciones para GitHub Copilot

## Contexto del Proyecto

Esta es una aplicación de recetas construida con **Node.js**, **Express**, **Handlebars** y **SQLite**. La aplicación permite crear, listar, editar y eliminar recetas.

## Stack Tecnológico

- **Backend**: Node.js con Express 5.x
- **Vistas**: Handlebars (express-handlebars)
- **Base de Datos**: SQLite3 con el módulo sqlite
- **Pruebas**: Jest y Supertest
- **Desarrollo**: Nodemon para recarga automática

## Estructura del Proyecto

```
/workspaces/node-recipe-app/
├── src/
│   ├── routes.js          # Manejadores de rutas Express
│   └── database/
│       ├── connection.js  # Configuración de conexión a SQLite
│       ├── index.js       # Exportaciones de módulos de BD
│       ├── schema.js      # Definición de tablas
│       └── seedData.js    # Datos iniciales
├── views/                 # Plantillas Handlebars
├── __tests__/            # Pruebas con Jest
└── public/               # Archivos estáticos (CSS)
```

## Convenciones de Código

### JavaScript
- Usar **async/await** para operaciones asíncronas
- Usar **const** para declaraciones que no se reasignan
- Usar **tabs** para indentación (configuración actual del proyecto)
- Nombres descriptivos para variables y funciones

### Rutas Express
- Usar verbos HTTP apropiados: GET para leer, POST para crear/modificar/eliminar
- Redirigir después de operaciones POST: `res.redirect('/ruta')`
- Renderizar vistas con `res.render('nombre-vista', { datos })`

### Base de Datos
- Usar **queries parametrizadas** para prevenir inyección SQL
- Ejemplo: `db.run('DELETE FROM recipes WHERE id = ?', [recipeId])`
- Siempre obtener la conexión con `await getDbConnection()`

### Handlebars
- Usar helpers personalizados cuando sea necesario (ej: `split`, `newline`)
- Mantener la lógica fuera de las vistas
- Usar formularios HTML con `method="POST"` para operaciones de escritura

## Patrones de Testing

### Configuración de Pruebas
- Usar base de datos de prueba separada (test-database.js)
- Mockear el módulo de base de datos en pruebas
- Inicializar y cerrar la BD en `beforeEach` y `afterEach`

### Estructura de Tests
```javascript
test('descripción del test', async () => {
  // Arrange: preparar datos
  // Act: ejecutar acción
  // Assert: verificar resultado
});
```

### Verificaciones
- Verificar códigos de estado HTTP (200, 302 para redirects)
- Verificar que los datos se persisten en la base de datos
- Incluir casos edge (IDs inexistentes, valores inválidos)

## Buenas Prácticas

1. **Confirmaciones de Usuario**: Usar `confirm()` JavaScript para acciones destructivas (eliminar)
2. **Validación**: Requerir campos obligatorios en formularios con `required`
3. **Seguridad**: Nunca interpolar directamente valores de usuario en queries SQL
4. **Accesibilidad**: Usar labels apropiados en formularios
5. **Separación de Responsabilidades**: 
   - Rutas: lógica de negocio
   - Vistas: presentación
   - Base de datos: persistencia

## Scripts Disponibles

- `npm start`: Iniciar aplicación en producción
- `npm run dev`: Iniciar con nodemon (recarga automática)
- `npm test`: Ejecutar todas las pruebas
- `npm run test:watch`: Ejecutar pruebas en modo watch

## Datos de Ejemplo

La aplicación incluye 3 recetas de ejemplo:
- Spaghetti Carbonara
- Chocolate Chip Cookies
- Caesar Salad

Los ingredientes y métodos usan `\n` para separar líneas.

## Consideraciones Especiales

- La aplicación crea la base de datos automáticamente en el primer inicio
- Los seed data incluyen lógica de migración para formatear datos antiguos
- El puerto por defecto es 3000
- Las vistas usan un layout principal en `views/layouts/main.hbs`

## Cuando Agregues Nuevas Funcionalidades

1. ✅ Implementar la ruta en `src/routes.js`
2. ✅ Actualizar/crear las vistas necesarias en `views/`
3. ✅ Agregar pruebas en `__tests__/routes.test.js`
4. ✅ Ejecutar `npm test` para verificar que todo funciona
5. ✅ Considerar actualizaciones del schema si afecta la BD

## Idioma

- Mensajes al usuario: **Español**
- Código y comentarios: **Inglés** (convención del proyecto)
- Documentación: **Español** (para este archivo)
