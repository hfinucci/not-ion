# not-ion
Las funcionalidades y los esquemas de las base de datos se pueden ver en la presentación subida.
## Requisitos
* Tener instalado Node
* Tener una instancia de Redis corriendo en el puerto 6379
* Tener una instancia de MongoDB corriendo en el puerto 27017

## Ejecución
Para correr el proyecto:
```bash
npm install
npm run serve
```

Por defecto corre en el puerto 8000.

Para ver la documentación en Swagger, ir a `/docs`.

Todos los endpoints `POST`, `PUT` y `DELETE` requieren de autorización. 
Esta se puede realizar enviando en el header `Authorization: Basic` el email y contraseña del usuario de la forma `email:password` encodeado en Base64. 