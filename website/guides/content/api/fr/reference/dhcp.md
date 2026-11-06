# API : Attribution d’adresses

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [dhcp.clients](#dhcpclients) | Lister les clients DHCP |
| [dhcp.start](#dhcpstart) | Démarrer le serveur DHCP |
| [dhcp.status](#dhcpstatus) | Obtenir l'état du serveur DHCP |
| [dhcp.stop](#dhcpstop) | Arrêter le serveur DHCP |

<a id="dhcpclients"></a>

## dhcp.clients

Lister les clients DHCP

**Méthodes**: GET / POST
**Voie**: `/api/v1/dhcp/clients`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `interface` | string | Facultatif | ap/wifi ou eth/ethernet. | Valeur globale pour les consultations ; AP pour le démarrage et l’arrêt |

### Exemple de requête

```json
{
  "interface": "ap"
}
```

### Réponse et confirmation de fin

data.clients/count; les baux incluent mac/ip/hostname/lease_start/lease_expire/is_static.

<a id="dhcpstart"></a>

## dhcp.start

Démarrer le serveur DHCP

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/dhcp/start`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `interface` | string | Facultatif | ap/wifi ou eth/ethernet. | Valeur globale pour les consultations ; AP pour le démarrage et l’arrêt |

### Exemple de requête

```json
{
  "interface": "ap"
}
```

### Réponse et confirmation de fin

data.interface/started.

<a id="dhcpstatus"></a>

## dhcp.status

Obtenir l'état du serveur DHCP

**Méthodes**: GET / POST
**Voie**: `/api/v1/dhcp/status`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `interface` | string | Facultatif | ap/wifi ou eth/ethernet. | Valeur globale pour les consultations ; AP pour le démarrage et l’arrêt |

### Exemple de requête

```json
{
  "interface": "ap"
}
```

### Réponse et confirmation de fin

data.interfaces, ou l’objet d’une interface, contient state/running, pool, gateway/dns/netmask/lease_min et les statistiques. Il inclut aussi interface_present/restore_error/apply_error. eth ajoute want_running/link_up/resume_error ; le code d’erreur 0 signifie qu’aucune erreur n’a été signalée à cette étape.

### Notes d'utilisation

want_running indique l’état demandé, et non l’état d’exécution réel. Vérifiez séparément la présence de l’interface, l’état du lien et les erreurs de rétablissement ; obtenir une adresse ne suffit pas.

<a id="dhcpstop"></a>

## dhcp.stop

Arrêter le serveur DHCP

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/dhcp/stop`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `interface` | string | Facultatif | ap/wifi ou eth/ethernet. | Valeur globale pour les consultations ; AP pour le démarrage et l’arrêt |

### Exemple de requête

```json
{
  "interface": "ap"
}
```

### Réponse et confirmation de fin

data.interface/stopped.
