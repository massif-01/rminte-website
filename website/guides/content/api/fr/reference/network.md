# API : Réseau

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [network.eth.status](#networkethstatus) | Obtenez l'état Ethernet |
| [network.hostname](#networkhostname) | Lire ou modifier le nom d’hôte |
| [network.status](#networkstatus) | Obtenir l'état général du réseau |
| [network.wifi.ap.config](#networkwifiapconfig) | Configurer le point d’accès Wi-Fi |
| [network.wifi.ap.stations](#networkwifiapstations) | Lire la liste des stations connectées au point d’accès |
| [network.wifi.connect](#networkwificonnect) | Se connecter à un réseau Wi-Fi |
| [network.wifi.disconnect](#networkwifidisconnect) | Se déconnecter du Wi-Fi |
| [network.wifi.mode](#networkwifimode) | Lire ou modifier le mode Wi-Fi |
| [network.wifi.scan](#networkwifiscan) | Rechercher les réseaux Wi-Fi |

<a id="networkethstatus"></a>

## network.eth.status

Obtenez l'état Ethernet

**Méthodes**: GET / POST
**Voie**: `/api/v1/network/eth/status`
**Accès minimum**: Public

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.status/link_up, config_error/config_error_name/interface_present, IP/netmask/gateway/dns1/dns2 si disponibles et statistiques d’émission et de réception.

<a id="networkhostname"></a>

## network.hostname

Lire ou modifier le nom d’hôte

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/network/hostname`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `hostname` | string | Facultatif | Nouveau nom d'hôte de l'appareil. | Consultation uniquement |

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.hostname.

### Notes d'utilisation

Peut modifier les adresses d’accès et la correspondance des noms de certificat. Les clients doivent vérifier l’adresse réelle.

<a id="networkstatus"></a>

## network.status

Obtenir l'état général du réseau

**Méthodes**: GET / POST
**Voie**: `/api/v1/network/status`
**Accès minimum**: Public

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.hostname/wifi_mode, ethernet, wifi_sta et wifi_ap. ethernet comprend aussi config_error/config_error_name/interface_present. Les champs d’adresse IP et de passerelle dépendent de l’état de la connexion.

<a id="networkwifiapconfig"></a>

## network.wifi.ap.config

Configurer le point d’accès Wi-Fi

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/network/wifi/ap/config`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `ssid` | string | Obligatoire | SSID du point d’accès. | Aucune valeur par défaut |
| `password` | string | Facultatif | Mot de passe du point d’accès ; une valeur absente ou vide crée un point d’accès ouvert. | Chaîne vide |
| `channel` | integer | Facultatif | Canal du point d’accès. | Valeur initiale de l’implémentation |
| `hidden` | boolean | Facultatif | Masquer le SSID. | false |

### Exemple de requête

```json
{
  "ssid": "TianShanOS",
  "password": "REPLACE_WITH_STRONG_PASSWORD",
  "channel": 6,
  "hidden": false
}
```

### Réponse et confirmation de fin

data.ssid/auth/channel/hidden/configured.

### Notes d'utilisation

Changer le point d'accès peut affecter la connectivité actuelle.

<a id="networkwifiapstations"></a>

## network.wifi.ap.stations

Lire la liste des stations connectées au point d’accès

**Méthodes**: GET / POST
**Voie**: `/api/v1/network/wifi/ap/stations`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.count/stations avec les clients associés et les informations de signal disponibles.

<a id="networkwificonnect"></a>

## network.wifi.connect

Se connecter à un réseau Wi-Fi

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/network/wifi/connect`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `ssid` | string | Obligatoire | SSID du réseau cible. | Aucune valeur par défaut |
| `password` | string | Facultatif | Mot de passe réseau. | Chaîne vide |

### Exemple de requête

```json
{
  "ssid": "YOUR_SSID",
  "password": "YOUR_WIFI_PASSWORD"
}
```

### Réponse et confirmation de fin

data.ssid/connecting. Consultez l’état Wi-Fi jusqu’à l’obtention d’une adresse.

### Notes d'utilisation

Peut modifier la connexion réseau active ; prévoyez un autre moyen d’accès.

<a id="networkwifidisconnect"></a>

## network.wifi.disconnect

Se déconnecter du Wi-Fi

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/network/wifi/disconnect`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.disconnected. L’accès de gestion peut également être interrompu.

<a id="networkwifimode"></a>

## network.wifi.mode

Lire ou modifier le mode Wi-Fi

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/network/wifi/mode`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `mode` | string | Facultatif | off/sta/ap/apsta. | Consultation uniquement |

### Exemple de requête

```json
{
  "mode": "apsta"
}
```

### Réponse et confirmation de fin

data.mode.

### Notes d'utilisation

sta se connecte à un réseau ; ap propose un point d’accès. Le changement peut interrompre l’accès de gestion.

<a id="networkwifiscan"></a>

## network.wifi.scan

Rechercher les réseaux Wi-Fi

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/network/wifi/scan`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.count/networks ; éléments ssid/rssi/channel/auth, avec bssid en plus pour wifi.scan. RSSI est exprimé en dBm.

### Notes d'utilisation

Lance une recherche réelle. Les deux interfaces exigent les mêmes droits, mais leurs textes et champs d’authentification diffèrent.
