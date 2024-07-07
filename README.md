# Sistema Bancario

El Sistema Bancario Social cumple los objetivos, proporcionando una solución robusta y eficiente para gestionar préstamos, ahorros y cooperativas. MySQL y Workbench aseguran un manejo eficiente de datos, y la interfaz en HTML y CSS ofrece una experiencia fácil de usar. Las vistas del sistema y sus funcionalidades CRUD, basado en un sistema de sesiones con roles, permiten realizar todas las operaciones necesarias de manera efectiva, segun el rol de quien ha iniciado sesion.


# Base de datos MySQL 

Debes tener instalado MySQL y ejecutar el Scrip que se encuentra en el archivo ---> sistema_bancario.sql

## Instalación

```Abre la consola y escribe:
*git clone https://github.com/Norlysc/ProyectoSistemaBancario.git
*luego posicionate en la carpeta del proyecto con cd
*npm run dev 
*valida el puerto 3001

## Archivos de configuración

- **.env:** Este archivo contiene variables de entorno sensibles como la información de conexión a la base de datos, claves API y otras credenciales. No debe incluirse en el control de versiones.

**Formato del archivo .env:**

Cada variable de entorno debe estar en formato clave-valor, separadas por un signo igual (`=`) Por ejemplo:
DB_HOST= 'localhost'
DB_USER= 'root'
DB_PASSWORD= 'pasword'
DB_NAME= 'dbname'
DB_PORT= 'port'
SECRET_KEY= 'secretkey'
SALT_KEY= 'number'
