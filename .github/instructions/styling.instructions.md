# Instrucciones de Estilo y CSS

## Paleta de Colores del Proyecto

### Colores Principales
- **Azul primario**: `#3498db` - Botones principales, elementos interactivos
- **Azul oscuro**: `#2c3e50` - Header, footer, títulos
- **Azul hover**: `#2980b9` - Estado hover de botones primarios
- **Gris secundario**: `#95a5a6` - Botones secundarios
- **Gris texto**: `#7f8c8d` - Texto secundario, descripciones
- **Rojo peligro**: `#e74c3c` - Botones de eliminar, mensajes de error
- **Fondo claro**: `#f8f9fa` - Fondo de la página
- **Blanco**: `#ffffff` - Tarjetas, formularios, contenido

### Colores de Soporte
- **Gris borde**: `#ddd` - Bordes de inputs
- **Gris claro**: `#ecf0f1` - Separadores, bordes sutiles
- **Hover secundario**: `#7f8c8d` - Hover de botones secundarios
- **Hover peligro**: `#c0392b` - Hover de botones de eliminar
- **Hover navegación**: `#34495e` - Hover de links en navegación

## Estructura de Layout

### Contenedor Principal
- Ancho máximo: `1200px`
- Centrado con `margin: 0 auto`
- Padding lateral: `2rem` (1rem en móvil)

### Espaciado
- Margen entre secciones: `2rem`
- Padding de tarjetas: `2rem` (1.5rem en cards pequeños)
- Gap entre elementos flex/grid: `1rem` - `2rem`

## Componentes de UI

### Botones (`.btn`)
```css
padding: 0.5rem 1rem
border-radius: 4px
font-size: 1rem
transition: background-color 0.3s
```

**Variantes disponibles:**
- `.btn-primary` - Azul (`#3498db`)
- `.btn-secondary` - Gris (`#95a5a6`)
- `.btn-danger` - Rojo (`#e74c3c`)
- `.btn-sm` - Versión pequeña con padding reducido

### Tarjetas (`.recipe-card`)
```css
background: white
padding: 1.5rem
border-radius: 8px
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)
transition: transform 0.2s
```

- Hover: `transform: translateY(-2px)`

### Formularios

**Grupos de formulario (`.form-group`):**
- Margen inferior: `1rem`
- Labels en negrita, color `#2c3e50`
- Inputs con border `1px solid #ddd`
- Border radius: `4px`
- Padding: `0.5rem`

**Acciones de formulario (`.form-actions`):**
- Display flex con gap de `1rem`
- Se usa para agrupar botones de envío y cancelación

### Navegación

**Header:**
- Background: `#2c3e50`
- Color texto: `white`
- Box shadow: `0 2px 4px rgba(0, 0, 0, 0.1)`
- Padding vertical: `1rem`

**Links de navegación:**
- Color: `white`
- Hover: background `#34495e`
- Padding: `0.5rem 1rem`
- Border radius: `4px`

## Sistema de Grid

### Grid de Recetas (`.recipes-grid`)
```css
display: grid
grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))
gap: 1.5rem
```

### Grid de Features (`.home-features`)
```css
display: grid
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))
gap: 2rem
```

## Elementos Específicos

### Pasos de Instrucciones (`.instruction-step`)
- Display flex con step number circular
- Step number: círculo azul (`#3498db`) de `1.5rem`
- Margen derecho del número: `1rem`

### Ingredientes (`.ingredient`)
- Padding vertical: `0.5rem`
- Border bottom: `1px solid #ecf0f1`
- Último elemento sin borde

### Secciones de Receta (`.recipe-section`)
- Margen inferior: `2rem`
- Títulos h2 con borde inferior de `2px solid #ecf0f1`

## Responsive Design

### Breakpoint Principal: `768px`

**Cambios en móvil:**
- Navegación: `flex-direction: column`
- Header de receta: elementos en columna
- Padding principal: `0 1rem` (reducido)
- Título home: `2rem` (reducido de 3rem)

## Tipografía

### Fuente Principal
```css
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
line-height: 1.6
```

### Tamaños de Fuente
- Título principal (home): `3rem` (2rem en móvil)
- H1: heredado con color `#2c3e50`
- Navegación título: `1.5rem`
- Texto descripción: `1.2rem`
- Texto normal: `1rem`
- Texto pequeño (preview): `0.9rem`
- Step number: `0.8rem`

## Efectos y Transiciones

### Transiciones Estándar
- Botones: `background-color 0.3s`
- Tarjetas: `transform 0.2s`

### Sombras
- Tarjetas/contenido: `0 2px 4px rgba(0, 0, 0, 0.1)`
- Header: `0 2px 4px rgba(0, 0, 0, 0.1)`

### Hover Effects
- Botones: cambio de color de fondo
- Tarjetas: elevación con `translateY(-2px)`
- Links de navegación: cambio de background

## Convenciones de Nombres de Clase

### Patrón BEM Simplificado
- **Contenedores**: `.home-container`, `.recipes-container`, `.recipe-container`
- **Headers**: `.home-header`, `.recipes-header`, `.recipe-header`
- **Acciones**: `.home-actions`, `.recipe-actions`, `.form-actions`
- **Elementos específicos**: `.recipe-card`, `.recipe-section`, `.ingredient`, etc.

### Modificadores
- Tamaño: `.btn-sm`
- Variante: `.btn-primary`, `.btn-secondary`, `.btn-danger`
- Estado: se maneja con pseudo-clases (`:hover`)

## Buenas Prácticas

1. **Consistencia**: Usar las clases existentes antes de crear nuevas
2. **Espaciado**: Mantener el sistema de espaciado basado en `rem`
3. **Colores**: Usar siempre la paleta definida
4. **Responsive**: Probar en breakpoint de 768px
5. **Accesibilidad**: Mantener contraste adecuado para texto
6. **Semántica**: Usar etiquetas HTML apropiadas antes de depender solo de CSS

## Integración con Handlebars

Al agregar nuevos elementos en las vistas `.hbs`, seguir estos patrones:

```handlebars
<!-- Contenedor principal -->
<div class="nombre-container">
  <!-- Header de sección -->
  <div class="nombre-header">
    <h1>Título</h1>
    <div class="nombre-actions">
      <button class="btn btn-primary">Acción</button>
    </div>
  </div>
  
  <!-- Contenido -->
  <div class="nombre-content">
    <!-- Contenido aquí -->
  </div>
</div>
```

## Clases de Utilidad Disponibles

No hay clases de utilidad tipo Tailwind. El proyecto usa CSS tradicional con clases semánticas. Si necesitas agregar estilos nuevos, agrega una clase semántica en `public/style.css`.
