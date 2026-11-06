# API : GPIO

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [gpio.info](#gpioinfo) | Obtenez des informations sur les broches GPIO |
| [gpio.list](#gpiolist) | Lister toutes les broches GPIO contrôlables |
| [gpio.set](#gpioset) | Définir le niveau GPIO |
| [gpio.toggle](#gpiotoggle) | Basculer le niveau GPIO |

<a id="gpioinfo"></a>

## gpio.info

Obtenez des informations sur les broches GPIO

**Méthodes**: GET / POST
**Voie**: `/api/v1/gpio/info`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `pin` | integer | pin ou name requis | Numéro GPIO autorisé fourni par gpio.list. | Aucune |
| `name` | string | pin ou name requis | Nom de broche fourni par gpio.list. | Aucune |

### Exemple de requête

```json
{
  "name": "AGX_RESET"
}
```

### Réponse et confirmation de fin

data.gpio/name/description/level/default/modified.

<a id="gpiolist"></a>

## gpio.list

Lister toutes les broches GPIO contrôlables

**Méthodes**: GET / POST
**Voie**: `/api/v1/gpio/list`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.count/pins ; éléments gpio/name/description/level/default/modified.

### Notes d'utilisation

Maintenance avancée limitée aux broches autorisées ; ne permet pas un accès GPIO arbitraire.

<a id="gpioset"></a>

## gpio.set

Définir le niveau GPIO

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/gpio/set`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `pin` | integer | pin ou name requis | Numéro GPIO autorisé fourni par gpio.list. | Aucune |
| `name` | string | pin ou name requis | Nom de broche fourni par gpio.list. | Aucune |
| `level` | integer | Obligatoire | 0 ou 1. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "name": "AGX_RESET",
  "level": 0
}
```

### Réponse et confirmation de fin

data.gpio/name/level.

### Notes d'utilisation

Les broches peuvent commander la réinitialisation, l’arrêt forcé ou le routage USB. Vérifiez d’abord leur fonction physique.

<a id="gpiotoggle"></a>

## gpio.toggle

Basculer le niveau GPIO

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/gpio/toggle`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `pin` | integer | pin ou name requis | Numéro GPIO autorisé fourni par gpio.list. | Aucune |
| `name` | string | pin ou name requis | Nom de broche fourni par gpio.list. | Aucune |

### Exemple de requête

```json
{
  "name": "AGX_RESET"
}
```

### Réponse et confirmation de fin

data.gpio/name/previous/level.

### Notes d'utilisation

Répète la bascule toggle. Ne répétez pas l’opération sans vérification après l’expiration d’un délai réseau.
