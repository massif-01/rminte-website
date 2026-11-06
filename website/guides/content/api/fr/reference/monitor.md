# API : Surveillance des ressources de calcul

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [monitor.config](#monitorconfig) | Lire la configuration de surveillance des ressources de calcul |
| [monitor.data](#monitordata) | Lire les dernières données de télémétrie des ressources de calcul |
| [monitor.set_server](#monitorset_server) | Définir l’adresse IP et le port du serveur de surveillance des ressources de calcul |
| [monitor.start](#monitorstart) | Démarrer la surveillance des ressources de calcul |
| [monitor.status](#monitorstatus) | Lire l’état de surveillance des ressources de calcul |
| [monitor.stop](#monitorstop) | Arrêter la surveillance des ressources de calcul |

<a id="monitorconfig"></a>

## monitor.config

Lire la configuration de surveillance des ressources de calcul

**Méthodes**: GET / POST
**Voie**: `/api/v1/monitor/config`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.server/port/reconnect_ms/heartbeat_timeout_ms/startup_delay_ms/auto_start/update_temp_source.

<a id="monitordata"></a>

## monitor.data

Lire les dernières données de télémétrie des ressources de calcul

**Méthodes**: GET / POST
**Voie**: `/api/v1/monitor/data`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.timestamp ; cpu contient cores/data(id/usage/freq), memory contient ram/swap avec used/total (MB), temperature contient cpu/soc0/soc1/soc2/tj (degrés Celsius), power contient gpu_soc/cpu_cv/sys_5v avec current/average (mW) ; gpu.gr3d_freq_pct.

### Notes d'utilisation

L’absence de données de calcul valides produit une erreur de traitement. Ces mesures proviennent de l’hôte de calcul.

<a id="monitorset_server"></a>

## monitor.set_server

Définir l’adresse IP et le port du serveur de surveillance des ressources de calcul

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/monitor/set_server`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `server` | string | Obligatoire | Adresse du serveur de surveillance. | Aucune valeur par défaut |
| `port` | integer | Facultatif | Port de 1 à 65535 ; en cas d’omission, le pilote utilise ses valeurs par défaut. | 0 sélectionne le traitement par défaut |

### Exemple de requête

```json
{
  "server": "192.0.2.20",
  "port": 58090
}
```

### Réponse et confirmation de fin

data.server/port/saved.

<a id="monitorstart"></a>

## monitor.start

Démarrer la surveillance des ressources de calcul

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/monitor/start`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.started.

<a id="monitorstatus"></a>

## monitor.status

Lire l’état de surveillance des ressources de calcul

**Méthodes**: GET / POST
**Voie**: `/api/v1/monitor/status`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.initialized/running/connection/reconnects/messages/errors/reliability/connected_time_ms; last_error peut apparaître.

<a id="monitorstop"></a>

## monitor.stop

Arrêter la surveillance des ressources de calcul

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/monitor/stop`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.stopped.
