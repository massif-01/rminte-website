# API: Diseño del panel de supervisión

[Índice completo](README.md) | [Reglas comunes](../conventions.md) | [Solución de problemas](../troubleshooting.md)

Los ejemplos son cuerpos JSON enviados por POST y contienen valores de ejemplo. Salvo que se indique lo contrario, las descripciones de respuesta se refieren a data.

| API | Propósito |
| --- | --- |
| [ui.widgets.get](#uiwidgetsget) | Consultar la configuración de widgets de datos |
| [ui.widgets.set](#uiwidgetsset) | Guardar la configuración de widgets de datos |

<a id="uiwidgetsget"></a>

## ui.widgets.get

Consultar la configuración de widgets de datos

**Métodos**: GET / POST
**Ruta**: `/api/v1/ui/widgets/get`
**Acceso mínimo**: READ

### Parámetros

Sin parámetros de operación.

### Ejemplo de solicitud

```json
{}
```

### Respuesta y conclusión

data.widgets/refresh_interval/source; el diseño se guarda en la configuración del dispositivo.

<a id="uiwidgetsset"></a>

## ui.widgets.set

Guardar la configuración de widgets de datos

**Métodos**: POST / PUT / DELETE
**Ruta**: `/api/v1/ui/widgets/set`
**Acceso mínimo**: ADMIN

### Parámetros

| Campo | Tipo | Requisito | Significado | Si se omite |
| --- | --- | --- | --- | --- |
| `widgets` | array | Obligatorio | Array de configuración de widgets; consulta el modelo de widgets. | Sin valor predeterminado |
| `refresh_interval` | integer | Opcional | Intervalo de actualización en milisegundos. | 5000 |

Consulta el [modelo de datos](../configuration-models.md#monitoring-widgets) común.

### Ejemplo de solicitud

```json
{
  "widgets": [],
  "refresh_interval": 5000
}
```

### Respuesta y conclusión

data.nvs_saved. Vuelve a consultar la distribución con ui.widgets.get.

### Notas de uso

La configuración serializada se limita a 4000 bytes.
