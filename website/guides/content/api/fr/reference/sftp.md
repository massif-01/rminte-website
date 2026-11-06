# API : Fichiers distants

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [sftp.get](#sftpget) | Télécharger le fichier via SFTP |
| [sftp.ls](#sftpls) | Lister le contenu d’un répertoire distant par SFTP |
| [sftp.mkdir](#sftpmkdir) | Créer un répertoire distant via SFTP |
| [sftp.put](#sftpput) | Envoyer un fichier par SFTP |
| [sftp.rm](#sftprm) | Supprimer le fichier distant via SFTP |
| [sftp.stat](#sftpstat) | Lire les informations d’un fichier distant par SFTP |

<a id="sftpget"></a>

## sftp.get

Télécharger le fichier via SFTP

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/sftp/get`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatoire | Adresse de l’hôte SSH. | Aucune valeur par défaut |
| `user` | string | Obligatoire | Nom d'utilisateur distant. | Aucune valeur par défaut |
| `port` | integer | Facultatif | Port 1-65535. | 22 |
| `password` | string | Autre mode d’authentification | Mot de passe de cette connexion distante, et non du compte TianshanOS. | Aucune |
| `keyid` | string | Autre mode d’authentification | Identifiant d’une clé privée SSH enregistrée sur l’appareil. | Aucune |
| `keypath` | string | Autre mode d’authentification accepté pour un appel immédiat | Chemin de la clé privée sur l’appareil ; sa prise en charge varie selon l’interface. | Aucune |
| `remote` | string | Obligatoire | Chemin absolu du fichier distant. | Aucune valeur par défaut |
| `local` | string | Obligatoire | Chemin absolu d’un fichier local sur l’appareil. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "remote": "/tmp/example.txt",
  "local": "/sdcard/example.txt"
}
```

### Réponse et confirmation de fin

data.remote/local/success ; écrit un fichier local sur l’appareil.

### Notes d'utilisation

Nécessite une authentification et une relation de confiance vérifiée avec l’hôte distant. Un échec n’entraîne pas l’acceptation automatique d’une empreinte. get est soumis aux restrictions d’écriture locale ; put envoie le contenu local vers l’hôte distant.

<a id="sftpls"></a>

## sftp.ls

Lister le contenu d’un répertoire distant par SFTP

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/sftp/ls`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatoire | Adresse de l’hôte SSH. | Aucune valeur par défaut |
| `user` | string | Obligatoire | Nom d'utilisateur distant. | Aucune valeur par défaut |
| `port` | integer | Facultatif | Port 1-65535. | 22 |
| `password` | string | Autre mode d’authentification | Mot de passe de cette connexion distante, et non du compte TianshanOS. | Aucune |
| `keyid` | string | Autre mode d’authentification | Identifiant d’une clé privée SSH enregistrée sur l’appareil. | Aucune |
| `keypath` | string | Autre mode d’authentification accepté pour un appel immédiat | Chemin de la clé privée sur l’appareil ; sa prise en charge varie selon l’interface. | Aucune |
| `path` | string | Obligatoire | Chemin du répertoire ou du fichier distant. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### Réponse et confirmation de fin

data.path/files ; éléments name/size/is_dir/mtime/permissions.

### Notes d'utilisation

Nécessite une authentification et une relation de confiance vérifiée avec l’hôte distant. Un échec n’entraîne pas l’acceptation automatique d’une empreinte. get est soumis aux restrictions d’écriture locale ; put envoie le contenu local vers l’hôte distant.

<a id="sftpmkdir"></a>

## sftp.mkdir

Créer un répertoire distant via SFTP

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/sftp/mkdir`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatoire | Adresse de l’hôte SSH. | Aucune valeur par défaut |
| `user` | string | Obligatoire | Nom d'utilisateur distant. | Aucune valeur par défaut |
| `port` | integer | Facultatif | Port 1-65535. | 22 |
| `password` | string | Autre mode d’authentification | Mot de passe de cette connexion distante, et non du compte TianshanOS. | Aucune |
| `keyid` | string | Autre mode d’authentification | Identifiant d’une clé privée SSH enregistrée sur l’appareil. | Aucune |
| `keypath` | string | Autre mode d’authentification accepté pour un appel immédiat | Chemin de la clé privée sur l’appareil ; sa prise en charge varie selon l’interface. | Aucune |
| `path` | string | Obligatoire | Chemin du répertoire ou du fichier distant. | Aucune valeur par défaut |
| `mode` | integer | Facultatif | Bits de permissions sous forme d’entier JSON décimal ; la valeur octale 0755 correspond à 493 en décimal. | 493 |

### Exemple de requête

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### Réponse et confirmation de fin

data.path/created.

### Notes d'utilisation

Nécessite une authentification et une relation de confiance vérifiée avec l’hôte distant. Un échec n’entraîne pas l’acceptation automatique d’une empreinte. get est soumis aux restrictions d’écriture locale ; put envoie le contenu local vers l’hôte distant.

<a id="sftpput"></a>

## sftp.put

Envoyer un fichier par SFTP

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/sftp/put`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatoire | Adresse de l’hôte SSH. | Aucune valeur par défaut |
| `user` | string | Obligatoire | Nom d'utilisateur distant. | Aucune valeur par défaut |
| `port` | integer | Facultatif | Port 1-65535. | 22 |
| `password` | string | Autre mode d’authentification | Mot de passe de cette connexion distante, et non du compte TianshanOS. | Aucune |
| `keyid` | string | Autre mode d’authentification | Identifiant d’une clé privée SSH enregistrée sur l’appareil. | Aucune |
| `keypath` | string | Autre mode d’authentification accepté pour un appel immédiat | Chemin de la clé privée sur l’appareil ; sa prise en charge varie selon l’interface. | Aucune |
| `remote` | string | Obligatoire | Chemin absolu du fichier distant. | Aucune valeur par défaut |
| `local` | string | Obligatoire | Chemin absolu d’un fichier local sur l’appareil. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "remote": "/tmp/example.txt",
  "local": "/sdcard/example.txt"
}
```

### Réponse et confirmation de fin

data.remote/local/success; écrit un fichier distant.

### Notes d'utilisation

Nécessite une authentification et une relation de confiance vérifiée avec l’hôte distant. Un échec n’entraîne pas l’acceptation automatique d’une empreinte. get est soumis aux restrictions d’écriture locale ; put envoie le contenu local vers l’hôte distant.

<a id="sftprm"></a>

## sftp.rm

Supprimer le fichier distant via SFTP

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/sftp/rm`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatoire | Adresse de l’hôte SSH. | Aucune valeur par défaut |
| `user` | string | Obligatoire | Nom d'utilisateur distant. | Aucune valeur par défaut |
| `port` | integer | Facultatif | Port 1-65535. | 22 |
| `password` | string | Autre mode d’authentification | Mot de passe de cette connexion distante, et non du compte TianshanOS. | Aucune |
| `keyid` | string | Autre mode d’authentification | Identifiant d’une clé privée SSH enregistrée sur l’appareil. | Aucune |
| `keypath` | string | Autre mode d’authentification accepté pour un appel immédiat | Chemin de la clé privée sur l’appareil ; sa prise en charge varie selon l’interface. | Aucune |
| `path` | string | Obligatoire | Chemin du répertoire ou du fichier distant. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### Réponse et confirmation de fin

data.path/deleted.

### Notes d'utilisation

Nécessite une authentification et une relation de confiance vérifiée avec l’hôte distant. Un échec n’entraîne pas l’acceptation automatique d’une empreinte. get est soumis aux restrictions d’écriture locale ; put envoie le contenu local vers l’hôte distant.

<a id="sftpstat"></a>

## sftp.stat

Lire les informations d’un fichier distant par SFTP

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/sftp/stat`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatoire | Adresse de l’hôte SSH. | Aucune valeur par défaut |
| `user` | string | Obligatoire | Nom d'utilisateur distant. | Aucune valeur par défaut |
| `port` | integer | Facultatif | Port 1-65535. | 22 |
| `password` | string | Autre mode d’authentification | Mot de passe de cette connexion distante, et non du compte TianshanOS. | Aucune |
| `keyid` | string | Autre mode d’authentification | Identifiant d’une clé privée SSH enregistrée sur l’appareil. | Aucune |
| `keypath` | string | Autre mode d’authentification accepté pour un appel immédiat | Chemin de la clé privée sur l’appareil ; sa prise en charge varie selon l’interface. | Aucune |
| `path` | string | Obligatoire | Chemin du répertoire ou du fichier distant. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### Réponse et confirmation de fin

data.path/size/is_dir/is_link/uid/gid/permissions/atime/mtime.

### Notes d'utilisation

Nécessite une authentification et une relation de confiance vérifiée avec l’hôte distant. Un échec n’entraîne pas l’acceptation automatique d’une empreinte. get est soumis aux restrictions d’écriture locale ; put envoie le contenu local vers l’hôte distant.
