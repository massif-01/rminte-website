# API : Température

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [temp.bind](#tempbind) | Lier une température à une variable système ou supprimer cette liaison |
| [temp.manual](#tempmanual) | Lire ou modifier le mode de température manuelle |
| [temp.read](#tempread) | Lire la température actuelle |
| [temp.select](#tempselect) | Lire ou modifier la source de température préférée |
| [temp.sources](#tempsources) | Lire les informations de toutes les sources de température |
| [temp.status](#tempstatus) | Obtenir l'état du système de température |

<a id="tempbind"></a>

## temp.bind

Lier une température à une variable système ou supprimer cette liaison

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/temp/bind`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `variables` | array | Facultatif | Au maximum 8 éléments {name,weight} ; un tableau vide supprime les liaisons multivariables. | Sans changement |
| `variable` | string / null | Facultatif | Ancienne liaison à une seule variable ; null ou une chaîne vide la supprime. | Sans changement |

### Exemple de requête

```json
{
  "variables": [
    {
      "name": "compute.temperature",
      "weight": 1
    }
  ]
}
```

### Réponse et confirmation de fin

data.bound_variables, état de liaison, nombres et poids valides, weighted_temp_c, partial_stale/valid. Les valeurs de variables non autorisées sont filtrées.

### Notes d'utilisation

Les variables doivent exister et contenir des températures numériques. ADMIN peut consulter les liaisons en omettant les champs de liaison ; fournir variables ou variable pour modifier ou effacer les liaisons nécessite ROOT.

<a id="tempmanual"></a>

## temp.manual

Lire ou modifier le mode de température manuelle

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/temp/manual`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `enable` | boolean | Facultatif | Activer ou désactiver le mode de température manuelle. | Sans changement |
| `temperature_c` | number | Facultatif | Celsius, -50,0 à 150,0. | Sans changement |
| `temperature` | number | Facultatif | Alias de temperature_c ; envoyez de préférence un seul champ de température. | Sans changement |
| `temperature_01c` | integer | Facultatif | Dixièmes de degré Celsius, de -500 à 1500 ; utilisé si aucun champ en degrés Celsius n’est fourni. | Sans changement |

### Exemple de requête

```json
{
  "enable": true,
  "temperature_c": 45
}
```

### Réponse et confirmation de fin

data.manual_mode/current_temp_c/current_temp_01c/active_source.

### Notes d'utilisation

Modifie la température d’entrée utilisée pour la régulation. Après le test, désactivez explicitement le mode manuel et relisez l’état.

<a id="tempread"></a>

## temp.read

Lire la température actuelle

**Méthodes**: GET / POST
**Voie**: `/api/v1/temp/read`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `source` | string | Facultatif | default/local ou sensor_local/agx ou agx_auto/variable/manual. | Source actuellement active |

Consultez le [modèle de données commun](../response-models.md#temperature).

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.temperature_c/temperature_01c/source/timestamp_ms/valid ; les sources variables peuvent inclure partial_stale et les nombres ou poids des liaisons.

<a id="tempselect"></a>

## temp.select

Lire ou modifier la source de température préférée

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/temp/select`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `source` | string | Facultatif | auto/agx/sensor/variable. | Consultation uniquement |

### Exemple de requête

```json
{
  "source": "auto"
}
```

### Réponse et confirmation de fin

data.preferred_source/active_source/temperature_c/valid.

<a id="tempsources"></a>

## temp.sources

Lire les informations de toutes les sources de température

**Méthodes**: GET / POST
**Voie**: `/api/v1/temp/sources`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

Température et validité actuelles, avec les sources. Les éléments comprennent name/type/active/valid/stale/last_value_c/last_value_01c/last_update_ms/age_ms/update_count.

### Notes d'utilisation

age_ms=null indique qu’aucune heure de mise à jour exploitable n’est disponible. Les sources variables signalent aussi les échecs partiels et les nombres ou poids valides.

<a id="tempstatus"></a>

## temp.status

Obtenir l'état du système de température

**Méthodes**: GET / POST
**Voie**: `/api/v1/temp/status`
**Accès minimum**: Public

### Paramètres

Aucun paramètre fonctionnel.

Consultez le [modèle de données commun](../response-models.md#temperature).

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.initialized/manual_mode/active_source/preferred_source/temperature_c/temperature_01c/timestamp_ms/valid, éventuellement bound_variable.
