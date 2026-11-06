# API : Ordinateurs et USB

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [device.fan.set](#devicefanset) | Définir le mode et la commande du ventilateur |
| [device.fan.status](#devicefanstatus) | Obtenir le statut de ventilateur |
| [device.ping](#deviceping) | Tester la connectivité réseau (contrôle de port TCP) |
| [device.power](#devicepower) | Commander l’alimentation du périphérique (on/off/force_off) |
| [device.power.status](#devicepowerstatus) | Lire les mesures électriques |
| [device.reset](#devicereset) | Réinitialiser l'appareil |
| [device.status](#devicestatus) | Obtenir l'état d'alimentation de l'appareil |
| [device.usb.set](#deviceusbset) | Sélectionner la cible du multiplexeur USB |
| [device.usb.status](#deviceusbstatus) | Lire l’état du multiplexeur USB |

<a id="devicefanset"></a>

## device.fan.set

Définir le mode et la commande du ventilateur

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/device/fan/set`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `fan` | integer | Obligatoire | Identifiant du ventilateur. | Aucune valeur par défaut |
| `mode` | string | Facultatif | off/manual/auto/curve ; cette interface de compatibilité possède son propre traitement. | Sans changement |
| `duty` | integer | Facultatif | Commande manuelle, de 0 à 100 %. | Sans changement |

### Exemple de requête

```json
{
  "fan": 0,
  "mode": "manual",
  "duty": 50
}
```

### Réponse et confirmation de fin

data.fan/success.

### Notes d'utilisation

Préférez des appels distincts à fan.mode et fan.set pour les nouvelles intégrations.

<a id="devicefanstatus"></a>

## device.fan.status

Obtenir le statut de ventilateur

**Méthodes**: GET / POST
**Voie**: `/api/v1/device/fan/status`
**Accès minimum**: Public

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `fan` | integer | Facultatif | Identifiant du ventilateur. | Tous |

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.fans ou un ventilateur ; le champ de compatibilité temp suit le modèle de cette interface. Préférez fan.status pour les nouvelles intégrations.

<a id="deviceping"></a>

## device.ping

Tester la connectivité réseau (contrôle de port TCP)

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/device/ping`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatoire | Adresse IPv4 ou nom d’hôte de la cible. | Aucune valeur par défaut |
| `timeout` | integer | Facultatif | Délai maximal de la requête, en millisecondes. | 1000 |

### Exemple de requête

```json
{
  "host": "192.0.2.20",
  "timeout": 1000
}
```

### Réponse et confirmation de fin

data.host/reachable ; la réussite peut inclure latency_ms, l’échec error.

### Notes d'utilisation

reachable=false est un résultat de diagnostic, et non la preuve que l’API n’a pas été exécutée.

<a id="devicepower"></a>

## device.power

Commander l’alimentation du périphérique (on/off/force_off)

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/device/power`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `device` | string | Facultatif | Ordinateur cible : agx=inférence, lpmu=application. | agx |
| `action` | string | Obligatoire | on/off/toggle/force_off. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "device": "agx",
  "action": "on"
}
```

### Réponse et confirmation de fin

data.device/action/success décrit l’appel de commande. Continuez à lire device.status.

### Notes d'utilisation

force_off peut faire perdre des données non enregistrées ; préférez l’arrêt normal. Répéter toggle inverse à nouveau l’état.

<a id="devicepowerstatus"></a>

## device.power.status

Lire les mesures électriques

**Méthodes**: GET / POST
**Voie**: `/api/v1/device/power/status`
**Accès minimum**: Public

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

Éléments data.rails : name/voltage_mv/current_ma/power_mw ; total_power_mw. Les unités sont mV/mA/mW.

<a id="devicereset"></a>

## device.reset

Réinitialiser l'appareil

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/device/reset`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `device` | string | Facultatif | Ordinateur cible : agx=inférence, lpmu=application. | agx |

### Exemple de requête

```json
{
  "device": "agx"
}
```

### Réponse et confirmation de fin

data.device/reset. Vérifiez ensuite à nouveau l’état de l’ordinateur et de l’application.

### Notes d'utilisation

Interrompt le travail de l’ordinateur cible.

<a id="devicestatus"></a>

## device.status

Obtenir l'état d'alimentation de l'appareil

**Méthodes**: GET / POST
**Voie**: `/api/v1/device/status`
**Accès minimum**: Public

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `device` | string | Facultatif | Ordinateur cible : agx=inférence, lpmu=application. | agx |

### Exemple de requête

```json
{
  "device": "agx"
}
```

### Réponse et confirmation de fin

data.device/state/power_good/uptime_ms/boot_count ; state vaut off/standby/on/booting/error.

### Notes d'utilisation

L’état d’alimentation ne prouve pas que le système d’exploitation ou l’application est prêt.

<a id="deviceusbset"></a>

## device.usb.set

Sélectionner la cible du multiplexeur USB

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/device/usb/set`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `target` | string | Obligatoire | esp32/agx/lpmu/disconnect. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "target": "agx"
}
```

### Réponse et confirmation de fin

data.target/success.

### Notes d'utilisation

Le changement peut interrompre les commandes ou transferts sur le chemin d’origine.

<a id="deviceusbstatus"></a>

## device.usb.status

Lire l’état du multiplexeur USB

**Méthodes**: GET / POST
**Voie**: `/api/v1/device/usb/status`
**Accès minimum**: Public

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.target/configured ; target peut être esp32/agx/lpmu/disconnected.
