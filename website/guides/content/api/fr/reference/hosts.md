# API : Empreintes des hôtes SSH

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [hosts.clear](#hostsclear) | Effacer tous les hôtes connus |
| [hosts.info](#hostsinfo) | Lire les informations d’un hôte connu |
| [hosts.list](#hostslist) | Lister tous les hôtes SSH connus |
| [hosts.remove](#hostsremove) | Supprimer un hôte connu |
| [hosts.update](#hostsupdate) | Forcer la mise à jour de l’empreinte d’un hôte |

<a id="hostsclear"></a>

## hosts.clear

Effacer tous les hôtes connus

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/hosts/clear`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.cleared.

### Notes d'utilisation

Modifie les vérifications de confiance SSH/SFTP ultérieures ; ne supprime pas les définitions de connexion aux hôtes enregistrées.

<a id="hostsinfo"></a>

## hosts.info

Lire les informations d’un hôte connu

**Méthodes**: GET / POST
**Voie**: `/api/v1/hosts/info`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatoire | Adresse distante; les enregistrements de confiance correspondent à l'adresse et au port. | Aucune valeur par défaut |
| `port` | integer | Facultatif | Port SSH de 1 à 65535. | 22 |

### Exemple de requête

```json
{
  "host": "192.0.2.20",
  "port": 22
}
```

### Réponse et confirmation de fin

data.host/port/type/fingerprint/added.

<a id="hostslist"></a>

## hosts.list

Lister tous les hôtes SSH connus

**Méthodes**: GET / POST
**Voie**: `/api/v1/hosts/list`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.hosts/count ; éléments host/port/type/fingerprint/added.

<a id="hostsremove"></a>

## hosts.remove

Supprimer un hôte connu

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/hosts/remove`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatoire | Adresse distante; les enregistrements de confiance correspondent à l'adresse et au port. | Aucune valeur par défaut |
| `port` | integer | Facultatif | Port SSH de 1 à 65535. | 22 |

### Exemple de requête

```json
{
  "host": "192.0.2.20"
}
```

### Réponse et confirmation de fin

data.host/port/removed.

### Notes d'utilisation

Supprimer une relation de confiance ne révoque pas les utilisateurs ou les clés distants. Vérifiez à nouveau l’identité avant la prochaine connexion.

<a id="hostsupdate"></a>

## hosts.update

Forcer la mise à jour de l’empreinte d’un hôte

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/hosts/update`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatoire | Adresse distante; les enregistrements de confiance correspondent à l'adresse et au port. | Aucune valeur par défaut |
| `port` | integer | Facultatif | Port SSH de 1 à 65535. | 22 |

### Exemple de requête

```json
{
  "host": "192.0.2.20"
}
```

### Réponse et confirmation de fin

data.host/port/updated/message.

### Notes d'utilisation

Se connecte à l’hôte distant et met à jour la confiance. Vérifiez d’abord son identité par un moyen indépendant.
