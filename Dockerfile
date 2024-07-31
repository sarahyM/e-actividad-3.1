# Utiliza la imagen oficial de MySQL
FROM mysql:8.0

# Establece las variables de entorno para la configuración de MySQL
ENV MYSQL_ROOT_PASSWORD=root_password
ENV MYSQL_DATABASE=my_database
ENV MYSQL_USER=my_user
ENV MYSQL_PASSWORD=my_password

# Exponemos el puerto 3306 para conectarnos a MySQL
EXPOSE 3306

# Copia un archivo de inicialización si lo tienes (opcional)
# COPY ./init.sql /docker-entrypoint-initdb.d/

# Comando para iniciar MySQL
CMD ["mysqld"]
