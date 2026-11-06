# API : Transfert réseau

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [nat.disable](#natdisable) | Désactiver la passerelle NAT |
| [nat.enable](#natenable) | Activer la passerelle NAT |
| [nat.save](#natsave) | Enregistrer la configuration de NAT |
| [nat.status](#natstatus) | Obtenir le statut de passerelle NAT |

<a id="natdisable"></a>

## nat.disable

Désactiver la passerelle NAT

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/nat/disable`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.success.

### Notes d'utilisation

L’activation nécessite une connexion Wi-Fi STA. Enregistrez les modifications d’exécution avec nat.save.

<a id="natenable"></a>

## nat.enable

Activer la passerelle NAT

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/nat/enable`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.success.

### Notes d'utilisation

L’activation nécessite une connexion Wi-Fi STA. Enregistrez les modifications d’exécution avec nat.save.

<a id="natsave"></a>

## nat.save

Enregistrer la configuration de NAT

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/nat/save`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.success.

### Notes d'utilisation

L’activation nécessite une connexion Wi-Fi STA. Enregistrez les modifications d’exécution avec nat.save.

<a id="natstatus"></a>

## nat.status

Obtenir le statut de passerelle NAT

**Méthodes**: GET / POST
**Voie**: `/api/v1/nat/status`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.enabled/state/wifi_connected/eth_up.

### Notes d'utilisation

L’activation nécessite une connexion Wi-Fi STA. Enregistrez les modifications d’exécution avec nat.save.
