# API : Heure

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [time.force_sync](#timeforce_sync) | Forcer la synchronisation NTP |
| [time.info](#timeinfo) | Obtenir des informations sur la synchronisation du temps |
| [time.set_ntp](#timeset_ntp) | Définir le serveur NTP |
| [time.set_timezone](#timeset_timezone) | Régler le fuseau horaire |
| [time.sync](#timesync) | Synchroniser l'heure depuis le navigateur |

<a id="timeforce_sync"></a>

## time.force_sync

Forcer la synchronisation NTP

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/time/force_sync`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.syncing/message. Vérifiez la synchronisation effective avec time.info.

<a id="timeinfo"></a>

## time.info

Obtenir des informations sur la synchronisation du temps

**Méthodes**: GET / POST
**Voie**: `/api/v1/time/info`
**Accès minimum**: Public

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.timestamp (secondes Unix), timestamp_ms, datetime/timezone et source/sync_status/synced/last_sync/sync_count/ntp_server.

<a id="timeset_ntp"></a>

## time.set_ntp

Définir le serveur NTP

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/time/set_ntp`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `server` | string | Obligatoire | Nom ou adresse du serveur NTP. | Aucune valeur par défaut |
| `index` | integer | Facultatif | Indice d’emplacement du serveur. | 0 |

### Exemple de requête

```json
{
  "server": "YOUR_NTP_SERVER",
  "index": 0
}
```

### Réponse et confirmation de fin

data.server/index/success.

<a id="timeset_timezone"></a>

## time.set_timezone

Régler le fuseau horaire

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/time/set_timezone`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `timezone` | string | Obligatoire | Chaîne de fuseau horaire POSIX, par exemple CST-8. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "timezone": "CST-8"
}
```

### Réponse et confirmation de fin

data.timezone/local_time/success.

<a id="timesync"></a>

## time.sync

Synchroniser l'heure depuis le navigateur

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/time/sync`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `timestamp_ms` | integer | Obligatoire | Horodatage Unix en millisecondes. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "timestamp_ms": 1793894400000
}
```

### Réponse et confirmation de fin

data.datetime/synced/source.

### Notes d'utilisation

Modifier l’heure système affecte les contrôles de validité des certificats. Relisez ensuite time.info pour confirmer le résultat.
