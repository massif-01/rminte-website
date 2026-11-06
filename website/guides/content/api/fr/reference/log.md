# API : Journaux

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [log.capture](#logcapture) | Activer ou désactiver la collecte ESP_LOG |
| [log.clear](#logclear) | Vider le tampon des journaux |
| [log.list](#loglist) | Obtenez les entrées de journal avec filtrage |
| [log.setLevel](#logsetlevel) | Définir le niveau de journalisation |
| [log.stats](#logstats) | Lire les statistiques du système de journalisation |

<a id="logcapture"></a>

## log.capture

Activer ou désactiver la collecte ESP_LOG

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/log/capture`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `enable` | boolean | Obligatoire | Enregistrer les journaux système dans le tampon des journaux. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "enable": true
}
```

### Réponse et confirmation de fin

data.capturing.

<a id="logclear"></a>

## log.clear

Vider le tampon des journaux

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/log/clear`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.cleared. Les journaux de mémoire antérieurs ne peuvent plus être lus à partir de ce tampon.

<a id="loglist"></a>

## log.list

Obtenez les entrées de journal avec filtrage

**Méthodes**: GET / POST
**Voie**: `/api/v1/log/list`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `offset` | integer | Facultatif | Décalage initial dans ce résultat de recherche. | 0 |
| `limit` | integer | Facultatif | Limite du nombre d’éléments renvoyés, de 1 à 200. | 50 |
| `level` | integer | Facultatif | Niveau exact de journalisation de 1 à 5 ; ne pas combiner avec les filtres de plage. | Tous |
| `minLevel` | integer | Facultatif | Niveau minimal de journalisation. | ERROR |
| `maxLevel` | integer | Facultatif | Niveau maximal de journalisation. | VERBOSE |
| `tag` | string | Facultatif | Filtre par sous-chaîne du nom de module. | Aucune |
| `keyword` | string | Facultatif | Mot-clé du message. | Aucune |

### Exemple de requête

```json
{
  "limit": 50
}
```

### Réponse et confirmation de fin

data.logs/total/offset/returned/bufferCapacity/bufferCount. Les éléments contiennent timestamp (millisecondes depuis le démarrage), level/levelName/tag/message/task.

### Notes d'utilisation

L’historique en mémoire est limité. offset s’applique au résultat de recherche sélectionné, et non à une archive illimitée.

<a id="logsetlevel"></a>

## log.setLevel

Définir le niveau de journalisation

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/log/setLevel`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `level` | integer / string | Obligatoire | Entier de 0 à 5 ou nom de niveau tel que error/warn/info/debug/verbose. | Aucune valeur par défaut |
| `tag` | string | Facultatif | Module spécifique ; omettre pour un réglage global. | Mondial |

### Exemple de requête

```json
{
  "level": 3
}
```

### Réponse et confirmation de fin

data.level est le nom du niveau ; tag est inclus pour une modification propre à un module.

<a id="logstats"></a>

## log.stats

Lire les statistiques du système de journalisation

**Méthodes**: GET / POST
**Voie**: `/api/v1/log/stats`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

Statistiques du tampon et de la collecte des journaux, indiquant la capacité et l’état actuel de l’enregistrement.
