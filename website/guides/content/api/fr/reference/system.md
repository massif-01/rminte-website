# API : État du contrôleur

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [system.apis](#systemapis) | Lister toutes les API enregistrées |
| [system.cpu](#systemcpu) | Lire les statistiques des cœurs du processeur |
| [system.info](#systeminfo) | Obtenir des informations sur le système |
| [system.log.level](#systemloglevel) | Lire ou modifier le niveau de journalisation |
| [system.memory](#systemmemory) | Obtenir des informations sur la mémoire |
| [system.memory_detail](#systemmemory_detail) | Obtenez une analyse de mémoire détaillée |
| [system.reboot](#systemreboot) | Redémarrer le système |
| [system.tasks](#systemtasks) | Obtenir la liste des tâches |

<a id="systemapis"></a>

## system.apis

Lister toutes les API enregistrées

**Méthodes**: GET / POST
**Voie**: `/api/v1/system/apis`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.apis est un tableau de noms avec total ; d’anciens indicateurs de présence de surveillance peuvent aussi apparaître.

### Notes d'utilisation

Une liste de noms ne remplace pas la documentation des paramètres et des droits d’accès.

<a id="systemcpu"></a>

## system.cpu

Lire les statistiques des cœurs du processeur

**Méthodes**: GET / POST
**Voie**: `/api/v1/system/cpu`
**Accès minimum**: Public

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.total_usage/cores ; chaque cœur inclut id/usage. Ces mesures concernent le contrôleur, et non l’ordinateur d’inférence.

<a id="systeminfo"></a>

## system.info

Obtenir des informations sur le système

**Méthodes**: GET / POST
**Voie**: `/api/v1/system/info`
**Accès minimum**: Public

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.app contient name/version/idf_version/compile_time/compile_date ; chip contient model/cores/revision/features ; flash_size est en octets et uptime_ms en millisecondes.

<a id="systemloglevel"></a>

## system.log.level

Lire ou modifier le niveau de journalisation

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/system/log/level`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `level` | integer | Facultatif | 0=NONE,1=ERROR,2=WARN,3=INFO,4=DEBUG,5=VERBOSE. | Sans changement |
| `tag` | string | Facultatif | Modifier uniquement le niveau de journalisation de ce module ; en cas d’omission, tous les modules sont concernés. | Mondial |

### Exemple de requête

```json
{
  "level": 3
}
```

### Réponse et confirmation de fin

data.status ; une modification inclut aussi level/tag.

### Notes d'utilisation

Destiné aux diagnostics temporaires ; l’écriture persistante des journaux dans des fichiers n’est pas garantie.

<a id="systemmemory"></a>

## system.memory

Obtenir des informations sur la mémoire

**Méthodes**: GET / POST
**Voie**: `/api/v1/system/memory`
**Accès minimum**: Public

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.free_heap/min_free_heap sont en octets. internal et psram, si disponible, contiennent total/free/allocated/largest_block, tous en octets.

<a id="systemmemory_detail"></a>

## system.memory_detail

Obtenez une analyse de mémoire détaillée

**Méthodes**: GET / POST
**Voie**: `/api/v1/system/memory_detail`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

Groupes de diagnostic data.dram/psram/iram/dma/static/rtc/nvs/tasks/history/tips. total/free/used fournissent les statistiques de mémoire ; stack_allocation_estimated signale une estimation.

### Notes d'utilisation

Les estimations d’un instantané de diagnostic ne constituent ni une répartition physique exacte de la mémoire ni une preuve de fuite.

<a id="systemreboot"></a>

## system.reboot

Redémarrer le système

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/system/reboot`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `delay` | integer | Facultatif | Délai en millisecondes, limité au final à la plage 100–10000. | 500 |

### Exemple de requête

```json
{
  "delay": 500
}
```

### Réponse et confirmation de fin

data.status=rebooting, delay_ms et waiting_for_maintenance=false. Le redémarrage est demandé après ce délai ; cette API n’attend pas la fin d’une mise à jour.

### Notes d'utilisation

Interrompt l’accès de gestion. Enregistrez les réglages nécessaires, attendez le rétablissement du service et reconnectez-vous.

<a id="systemtasks"></a>

## system.tasks

Obtenir la liste des tâches

**Méthodes**: GET / POST
**Voie**: `/api/v1/system/tasks`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.tasks/count ; les tâches contiennent name/state/priority/core/stack_hwm. stack_hwm est un indicateur natif de marge de pile, et non la mémoire libre totale.
