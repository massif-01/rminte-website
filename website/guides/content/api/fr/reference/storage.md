# API : Fichiers de l’appareil

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [storage.delete](#storagedelete) | Supprimer le fichier ou le répertoire |
| [storage.info](#storageinfo) | Obtenez des informations sur le fichier |
| [storage.list](#storagelist) | Lister le contenu d’un répertoire |
| [storage.mkdir](#storagemkdir) | Créer un répertoire |
| [storage.mount](#storagemount) | Monter la carte SD |
| [storage.read](#storageread) | Lire le contenu du fichier |
| [storage.rename](#storagerename) | Renommer ou déplacer un fichier |
| [storage.status](#storagestatus) | Obtenir le statut de stockage |
| [storage.unmount](#storageunmount) | Démonter la carte SD |

<a id="storagedelete"></a>

## storage.delete

Supprimer le fichier ou le répertoire

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/storage/delete`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `path` | string | Obligatoire | Chemin absolu sur l’appareil ; la configuration gérée et les fichiers sensibles sont soumis à des restrictions supplémentaires. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "path": "/sdcard/example.txt"
}
```

### Réponse et confirmation de fin

data.deleted contient le chemin supprimé.

### Notes d'utilisation

Autorise les chemins acceptés sous /sdcard/, /spiffs/ et /www/. Les répertoires peuvent être supprimés récursivement ; la configuration gérée et les racines de stockage restent protégées.

<a id="storageinfo"></a>

## storage.info

Obtenez des informations sur le fichier

**Méthodes**: GET / POST
**Voie**: `/api/v1/storage/info`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `path` | string | Obligatoire | Chemin absolu sur l’appareil ; la configuration gérée et les fichiers sensibles sont soumis à des restrictions supplémentaires. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "path": "/sdcard/example.txt"
}
```

### Réponse et confirmation de fin

data.path/name/type/size/modified. modified est un horodatage Unix du système de fichiers, en secondes.

<a id="storagelist"></a>

## storage.list

Lister le contenu d’un répertoire

**Méthodes**: GET / POST
**Voie**: `/api/v1/storage/list`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `path` | string | Facultatif | Chemin absolu du répertoire. | /sdcard |
| `recursive` | boolean | Facultatif | La récursivité n’est pas implémentée ; même true ne liste que ce répertoire. Préférez omettre le paramètre. | false |

### Exemple de requête

```json
{
  "path": "/sdcard"
}
```

### Réponse et confirmation de fin

data.path/entries avec name/type/size, etc. Lister un répertoire sensible nécessite ADMIN.

<a id="storagemkdir"></a>

## storage.mkdir

Créer un répertoire

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/storage/mkdir`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `path` | string | Obligatoire | Chemin absolu sur l’appareil ; la configuration gérée et les fichiers sensibles sont soumis à des restrictions supplémentaires. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "path": "/sdcard/example"
}
```

### Réponse et confirmation de fin

data.created contient le chemin du répertoire.

<a id="storagemount"></a>

## storage.mount

Monter la carte SD

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/storage/mount`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.status ; le montage inclut aussi path.

### Notes d'utilisation

Affecte les opérations utilisant la carte SD. Terminez les opérations sur les fichiers et les mises à jour avant de la démonter.

<a id="storageread"></a>

## storage.read

Lire le contenu du fichier

**Méthodes**: GET / POST
**Voie**: `/api/v1/storage/read`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `path` | string | Obligatoire | Chemin absolu sur l’appareil ; la configuration gérée et les fichiers sensibles sont soumis à des restrictions supplémentaires. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "path": "/sdcard/example.txt"
}
```

### Réponse et confirmation de fin

data.path/size/type/content ; content est du JSON analysé pour type=json et une chaîne pour type=text.

### Notes d'utilisation

Fichier de 8192 octets au maximum. Les chemins sensibles nécessitent ADMIN. Utilisez la route de téléchargement dédiée pour les fichiers binaires ou volumineux.

<a id="storagerename"></a>

## storage.rename

Renommer ou déplacer un fichier

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/storage/rename`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `from` | string | Obligatoire | Chemin absolu original. | Aucune valeur par défaut |
| `to` | string | Obligatoire | Chemin de destination absolu. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "from": "/sdcard/example.txt",
  "to": "/sdcard/renamed.txt"
}
```

### Réponse et confirmation de fin

data.from/to.

### Notes d'utilisation

Les deux chemins doivent se trouver dans un emplacement autorisé sous /sdcard/, /spiffs/ ou /www/ et passer les contrôles des chemins gérés. Le système de fichiers et l’état du montage peuvent encore limiter le déplacement.

<a id="storagestatus"></a>

## storage.status

Obtenir le statut de stockage

**Méthodes**: GET / POST
**Voie**: `/api/v1/storage/status`
**Accès minimum**: Public

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.sd/spiffs avec mounted et path si disponible.

<a id="storageunmount"></a>

## storage.unmount

Démonter la carte SD

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/storage/unmount`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.status ; le montage inclut aussi path.

### Notes d'utilisation

Affecte les opérations utilisant la carte SD. Terminez les opérations sur les fichiers et les mises à jour avant de la démonter.
