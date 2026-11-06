# API : Alimentation et protection

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [power.chip](#powerchip) | Lire les données de la puce de mesure électrique |
| [power.debug](#powerdebug) | Définir le mode de débogage |
| [power.interval.set](#powerintervalset) | Définir l’intervalle d’échantillonnage |
| [power.monitor.start](#powermonitorstart) | Démarrer la surveillance électrique |
| [power.monitor.stop](#powermonitorstop) | Arrêter la surveillance électrique |
| [power.protection.config](#powerprotectionconfig) | Lire la configuration de protection de tension |
| [power.protection.set](#powerprotectionset) | Configurer la protection de tension |
| [power.protection.status](#powerprotectionstatus) | Lire l’état de protection de tension |
| [power.stats](#powerstats) | Lire les statistiques de surveillance |
| [power.stats.reset](#powerstatsreset) | Réinitialiser les statistiques de surveillance |
| [power.status](#powerstatus) | Lire l’état de surveillance électrique |
| [power.threshold.set](#powerthresholdset) | Régler les seuils de tension |
| [power.voltage](#powervoltage) | Lire la tension actuelle |

<a id="powerchip"></a>

## power.chip

Lire les données de la puce de mesure électrique

**Méthodes**: GET / POST
**Voie**: `/api/v1/power/chip`
**Accès minimum**: Public

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.voltage_v/current_a/power_w/valid/crc_valid/timestamp_ms/raw_data. N’utilisez que des valeurs valides dont l’intégrité a été vérifiée.

<a id="powerdebug"></a>

## power.debug

Définir le mode de débogage

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/power/debug`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `enable` | boolean | Obligatoire | Activer la sortie de débogage. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "enable": false
}
```

### Réponse et confirmation de fin

data.debug_enabled.

<a id="powerintervalset"></a>

## power.interval.set

Définir l’intervalle d’échantillonnage

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/power/interval/set`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `interval_ms` | integer | Obligatoire | Intervalle d’échantillonnage en millisecondes ; l’appareil rejette les valeurs inférieures à la plage prise en charge. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "interval_ms": 1000
}
```

### Réponse et confirmation de fin

data.interval_ms.

<a id="powermonitorstart"></a>

## power.monitor.start

Démarrer la surveillance électrique

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/power/monitor/start`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.running.

### Notes d'utilisation

Arrêter l’échantillonnage affecte les mises à jour suivantes. Vérifiez aussi les données nécessaires à la protection.

<a id="powermonitorstop"></a>

## power.monitor.stop

Arrêter la surveillance électrique

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/power/monitor/stop`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.running.

### Notes d'utilisation

Arrêter l’échantillonnage affecte les mises à jour suivantes. Vérifiez aussi les données nécessaires à la protection.

<a id="powerprotectionconfig"></a>

## power.protection.config

Lire la configuration de protection de tension

**Méthodes**: GET / POST
**Voie**: `/api/v1/power/protection/config`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.low_voltage_threshold/recovery_voltage_threshold (V), shutdown_delay_sec/recovery_hold_sec/fan_stop_delay_sec (secondes) et valeurs par défaut.

<a id="powerprotectionset"></a>

## power.protection.set

Configurer la protection de tension

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/power/protection/set`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `enable` | boolean | Facultatif | Démarrer ou arrêter la protection ; fournir ce champ enregistre toujours son état d’activation. | Sans changement |
| `low_threshold` | number | Facultatif | Seuil de basse tension en V. | Sans changement |
| `recovery_threshold` | number | Facultatif | Seuil de rétablissement en V. | Sans changement |
| `shutdown_delay` | integer | Facultatif | Délai d’arrêt en cas de tension basse, en secondes. | Sans changement |
| `recovery_hold` | integer | Facultatif | Durée de maintien requise pour le rétablissement, en secondes. | Sans changement |
| `fan_stop_delay` | integer | Facultatif | Délai d’arrêt du ventilateur après l’arrêt de l’ordinateur, en secondes. | Sans changement |
| `persist` | boolean | Facultatif | true enregistre les changements de paramètres seuls ; les changements d’activation sont enregistrés automatiquement. | false |

### Exemple de requête

```json
{
  "persist": true
}
```

### Réponse et confirmation de fin

data.low_threshold_v/recovery_threshold_v/running/persisted.

### Notes d'utilisation

Modifie la protection et l’arrêt automatique. Une application partielle peut avoir lieu avant un échec ; relisez la configuration et l’état.

<a id="powerprotectionstatus"></a>

## power.protection.status

Lire l’état de protection de tension

**Méthodes**: GET / POST
**Voie**: `/api/v1/power/protection/status`
**Accès minimum**: Public

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.initialized/running/state/current_voltage_v/countdown_remaining_sec/recovery_timer_sec/protection_count/uptime_ms ; devices contient agx_powered/lpmu_powered/agx_connected.

### Notes d'utilisation

initialized=false ne prouve pas qu’une protection est active.

<a id="powerstats"></a>

## power.stats

Lire les statistiques de surveillance

**Méthodes**: GET / POST
**Voie**: `/api/v1/power/stats`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.voltage_samples/power_chip_packets/crc_errors/timeout_errors/threshold_violations/avg_voltage_v/avg_current_a/avg_power_w/uptime_ms.

<a id="powerstatsreset"></a>

## power.stats.reset

Réinitialiser les statistiques de surveillance

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/power/stats/reset`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.reset.

### Notes d'utilisation

Réinitialise les statistiques, pas l'étalonnage des capteurs.

<a id="powerstatus"></a>

## power.status

Lire l’état de surveillance électrique

**Méthodes**: GET / POST
**Voie**: `/api/v1/power/status`
**Accès minimum**: Public

### Paramètres

Aucun paramètre fonctionnel.

Consultez le [modèle de données commun](../response-models.md#power).

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.voltage ; power_chip contient voltage_v/current_a/power_w/valid/crc_valid ; protection, stats et monitoring_active décrivent la protection, les agrégats et l’échantillonnage.

<a id="powerthresholdset"></a>

## power.threshold.set

Régler les seuils de tension

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/power/threshold/set`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `min_v` | number | Obligatoire | Tension minimale en V. | Aucune valeur par défaut |
| `max_v` | number | Obligatoire | Tension maximale en V; supérieure au minimum. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "min_v": 12,
  "max_v": 24
}
```

### Réponse et confirmation de fin

data.min_v/max_v.

### Notes d'utilisation

Les seuils de surveillance et la politique de protection sont distincts ; utilisez power.protection.set pour la protection.

<a id="powervoltage"></a>

## power.voltage

Lire la tension actuelle

**Méthodes**: GET / POST
**Voie**: `/api/v1/power/voltage`
**Accès minimum**: Public

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `now` | boolean | Facultatif | true lance un échantillonnage immédiat ; false lit la dernière valeur. | false |

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.voltage_v (V)/voltage_mv (mV)/adc_raw/timestamp_ms.
