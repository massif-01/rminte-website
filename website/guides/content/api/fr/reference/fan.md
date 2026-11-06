# API : Ventilateurs

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [fan.config](#fanconfig) | Obtenir la configuration du ventilateur, y compris la courbe |
| [fan.curve](#fancurve) | Définir la courbe de température du ventilateur |
| [fan.enable](#fanenable) | Activer ou désactiver un ventilateur |
| [fan.limits](#fanlimits) | Définir les limites minimale et maximale de commande du ventilateur |
| [fan.mode](#fanmode) | Régler le mode de fonctionnement du ventilateur |
| [fan.save](#fansave) | Enregistrer la configuration du ventilateur sur NVS |
| [fan.set](#fanset) | Définir la vitesse du ventilateur en mode manuel |
| [fan.status](#fanstatus) | Obtenir le statut de ventilateur |

<a id="fanconfig"></a>

## fan.config

Obtenir la configuration du ventilateur, y compris la courbe

**Méthodes**: GET / POST
**Voie**: `/api/v1/fan/config`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | integer | Facultatif | Identifiant du ventilateur ; récupérez-le d’abord avec fan.status. | Tous si le paramètre est omis |

### Exemple de requête

```json
{
  "id": 0
}
```

### Réponse et confirmation de fin

Configuration d’un ou de tous les ventilateurs : id/mode/min_duty/max_duty/invert_pwm/hysteresis/min_interval/curve. Les points de courbe utilisent temp (Celsius) et duty (pourcentage).

<a id="fancurve"></a>

## fan.curve

Définir la courbe de température du ventilateur

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/fan/curve`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | integer | Obligatoire | ID du ventilateur dans la plage prise en charge de l'appareil. | Aucune valeur par défaut |
| `curve` | array | Obligatoire | Au maximum 10 points {temp:Celsius,duty:percent}, par températures croissantes ; duty doit être compris entre 0 et 100. | Aucune valeur par défaut |
| `hysteresis` | number | Facultatif | Hystérésis de température, de 0 à 20 degrés Celsius. | Valeur actuelle |
| `min_interval` | integer | Facultatif | Intervalle de réglage minimal, entier 100-60000 millisecondes. | Valeur actuelle |

### Exemple de requête

```json
{
  "id": 0,
  "curve": [
    {
      "temp": 30,
      "duty": 30
    },
    {
      "temp": 60,
      "duty": 80
    }
  ],
  "hysteresis": 3,
  "min_interval": 2000
}
```

### Réponse et confirmation de fin

data.id/points/applied/persisted.

### Notes d'utilisation

La configuration de la courbe et le mode de régulation sont distincts. Relisez la configuration, puis sélectionnez le mode curve si nécessaire.

<a id="fanenable"></a>

## fan.enable

Activer ou désactiver un ventilateur

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/fan/enable`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | integer | Obligatoire | ID du ventilateur dans la plage prise en charge de l'appareil. | Aucune valeur par défaut |
| `enable` | boolean | Obligatoire | true active ; false désactive. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "id": 0,
  "enable": true
}
```

### Réponse et confirmation de fin

data.id/enabled.

### Notes d'utilisation

La désactivation peut réduire le refroidissement. Vérifiez séparément la température et la protection.

<a id="fanlimits"></a>

## fan.limits

Définir les limites minimale et maximale de commande du ventilateur

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/fan/limits`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | integer | Obligatoire | ID du ventilateur dans la plage prise en charge de l'appareil. | Aucune valeur par défaut |
| `min_duty` | integer | Facultatif | Commande minimale, de 0 à 100 %, ne dépassant pas le maximum. | Valeur actuelle |
| `max_duty` | integer | Facultatif | Commande maximale, de 0 à 100 %. | Valeur actuelle |

### Exemple de requête

```json
{
  "id": 0,
  "min_duty": 20,
  "max_duty": 100
}
```

### Réponse et confirmation de fin

data.id/min_duty/max_duty/applied/persisted.

<a id="fanmode"></a>

## fan.mode

Régler le mode de fonctionnement du ventilateur

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/fan/mode`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | integer | Obligatoire | ID du ventilateur dans la plage prise en charge de l'appareil. | Aucune valeur par défaut |
| `mode` | string | Obligatoire | off/manual/auto/curve. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "id": 0,
  "mode": "auto"
}
```

### Réponse et confirmation de fin

data.id/mode/applied/persisted. Distinguez l’application à l’exécution de l’échec d’enregistrement.

<a id="fansave"></a>

## fan.save

Enregistrer la configuration du ventilateur sur NVS

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/fan/save`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | integer | Facultatif | Identifiant du ventilateur. | Tous les ventilateurs |

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.status/persisted. Vérifiez les détails d’un échec ; ne supposez pas que le réglage est conservé après redémarrage.

<a id="fanset"></a>

## fan.set

Définir la vitesse du ventilateur en mode manuel

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/fan/set`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | integer | Obligatoire | ID du ventilateur dans la plage prise en charge de l'appareil. | Aucune valeur par défaut |
| `duty` | integer | Obligatoire | Commande demandée, de 0 à 100 %. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../response-models.md#fan).

### Exemple de requête

```json
{
  "id": 0,
  "duty": 50
}
```

### Réponse et confirmation de fin

État du ventilateur après application ; vérifiez duty_valid/duty/target_duty/mode.

### Notes d'utilisation

Modifie le refroidissement. Effectuez ce changement en connaissance de cause, puis relisez les valeurs de sortie réelle et demandée.

<a id="fanstatus"></a>

## fan.status

Obtenir le statut de ventilateur

**Méthodes**: GET / POST
**Voie**: `/api/v1/fan/status`
**Accès minimum**: Public

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | integer | Facultatif | Identifiant du ventilateur ; récupérez-le d’abord avec fan.status. | Tous si le paramètre est omis |

Consultez le [modèle de données commun](../response-models.md#fan).

### Exemple de requête

```json
{
  "id": 0
}
```

### Réponse et confirmation de fin

Si id est fourni, data représente un ventilateur ; sinon, la réponse contient data.fans et temperature/temp_valid/temp_source. Consultez le modèle de réponse des ventilateurs.
