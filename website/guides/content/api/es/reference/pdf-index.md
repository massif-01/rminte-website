# Índice completo de API

Este índice incluye los 277 nombres registrados. Selecciona un nombre para ir a la entrada correspondiente. Cada entrada indica los métodos permitidos, los permisos mínimos, los parámetros y cómo comprobar que la operación ha terminado.

Envía los ejemplos de la referencia como JSON mediante POST. Guarda el ejemplo en request.json, sustituye los valores de ejemplo y utiliza la ruta indicada. Las llamadas públicas pueden omitir Authorization.

```sh
curl --connect-timeout 5 --max-time 60 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' --data-binary @request.json \
  "$TS_BASE/api/v1/PATH_FROM_REFERENCE"
```

Las operaciones de escritura tienen efectos reales. Obtén primero las versiones, los identificadores de objetos, los certificados o los archivos de la versión que sean necesarios. Usa GET solo en las API que lo permitan de forma explícita; para parámetros complejos, envía JSON mediante POST.

## Buscar por nombre

Los permisos indicados son los mínimos necesarios para acceder a cada API. También se aplican los requisitos del recurso, la sesión y la función. Las API que siguen registradas pero no son compatibles se identifican en la referencia.
