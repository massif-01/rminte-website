# API : Wi-Fi

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [wifi.connect](#wificonnect) | Se connecter à un réseau Wi-Fi |
| [wifi.disconnect](#wifidisconnect) | Se déconnecter du Wi-Fi |
| [wifi.scan](#wifiscan) | Rechercher les réseaux Wi-Fi |
| [wifi.status](#wifistatus) | Obtenir l'état WiFi |

<a id="wificonnect"></a>

## wifi.connect

Se connecter à un réseau Wi-Fi

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/wifi/connect`
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

<a id="wifidisconnect"></a>

## wifi.disconnect

Se déconnecter du Wi-Fi

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/wifi/disconnect`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.disconnected. L’accès de gestion peut également être interrompu.

<a id="wifiscan"></a>

## wifi.scan

Rechercher les réseaux Wi-Fi

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/wifi/scan`
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

<a id="wifistatus"></a>

## wifi.status

Obtenir l'état WiFi

**Méthodes**: GET / POST
**Voie**: `/api/v1/wifi/status`
**Accès minimum**: Public

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.ap/sta avec state/has_ip et ip si disponible ; STA peut ajouter gateway/rssi. La structure diffère de network.status.
