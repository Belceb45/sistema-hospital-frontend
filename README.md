# Portal de Pacientes - Frontend (Interfaz de Usuario)

Interfaz moderna desarrollada en **React** para que los pacientes gestionen sus citas, consulten resultados de laboratorio y actualicen su historial médico.

## 🛠️ Tecnologías
* **React 19.1**
* **Vite** (o Create React App): Herramienta de construcción y desarrollo.
* **Fetch API**: Utilizada para el consumo de la API REST del backend de forma nativa.
* **Tailwind CSS** (opcional): Estilizado responsivo de la interfaz.

## 📂 Archivos Incluidos
* `src/`: Componentes, Hooks, lógica de peticiones con `fetch` y vistas del Dashboard.
* `public/`: Archivos estáticos e index.html.
* `package.json`: Definición de scripts y dependencias del proyecto.

## 🚀 Instalación y Configuración
1. **Instalar Dependencias**:
   - Abre una terminal en esta carpeta y ejecuta:
     ```bash
     npm install
     ```
2. **Configuración de la API**:
   - El sistema consume endpoints desde `http://localhost:8080`. 
   - Las peticiones se realizan mediante `fetch()`, gestionando los encabezados (Headers) para el envío de Tokens JWT.
3. **Ejecución**:
   - Inicia el servidor de desarrollo:
     ```bash
     npm run dev
     ```
   - Abre en tu navegador la dirección indicada por la terminal (usualmente `http://localhost:5173`).

## 📋 Funcionalidades Principales
* **Autenticación**: Login híbrido con validación de formato para CURP o Número de Expediente.
* **Dashboard**: Panel principal con acceso rápido a "Mis Citas", "Resultados" y Perfil.
* **Reglas de Negocio**: 
    - Validación de antecedentes médicos obligatorios antes de agendar.
    - Restricción de tiempo para cancelación y reagendamiento de citas.
* **Resultados**: Visualización y descarga de estudios de laboratorio en formato PDF.