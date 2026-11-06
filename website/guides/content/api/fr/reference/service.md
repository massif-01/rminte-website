# API : Services du contrôleur

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [service.list](#servicelist) | Lister tous les services |
| [service.restart](#servicerestart) | Redémarrer un service |
| [service.start](#servicestart) | Démarrer un service |
| [service.status](#servicestatus) | Obtenir le statut de service |
| [service.stop](#servicestop) | Arrêter un service |

<a id="servicelist"></a>

## service.list

Lister tous les services

**Méthodes**: GET / POST
**Voie**: `/api/v1/service/list`
**Accès minimum**: Public

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.total/running/services ; éléments name/state/phase/healthy/start_time_ms/start_duration_ms.

<a id="servicerestart"></a>

## service.restart

Redémarrer un service

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/service/restart`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `name` | string | Obligatoire | Nom du service obtenu auprès de service.list. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "name": "SERVICE_FROM_LIST"
}
```

### Réponse et confirmation de fin

data.name/status.

### Notes d'utilisation

La maintenance peut interrompre le réseau, l’interface Web ou leurs dépendances. Utilisez automation.services pour les applications distantes.

<a id="servicestart"></a>

## service.start

Démarrer un service

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/service/start`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `name` | string | Obligatoire | Nom du service obtenu auprès de service.list. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "name": "SERVICE_FROM_LIST"
}
```

### Réponse et confirmation de fin

data.name/status.

### Notes d'utilisation

La maintenance peut interrompre le réseau, l’interface Web ou leurs dépendances. Utilisez automation.services pour les applications distantes.

<a id="servicestatus"></a>

## service.status

Obtenir le statut de service

**Méthodes**: GET / POST
**Voie**: `/api/v1/service/status`
**Accès minimum**: Public

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `name` | string | Obligatoire | Nom du service obtenu auprès de service.list. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "name": "webui"
}
```

### Réponse et confirmation de fin

data.name/state/phase/healthy/start_time_ms/start_duration_ms.

<a id="servicestop"></a>

## service.stop

Arrêter un service

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/service/stop`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `name` | string | Obligatoire | Nom du service obtenu auprès de service.list. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "name": "SERVICE_FROM_LIST"
}
```

### Réponse et confirmation de fin

data.name/status.

### Notes d'utilisation

La maintenance peut interrompre le réseau, l’interface Web ou leurs dépendances. Utilisez automation.services pour les applications distantes.
