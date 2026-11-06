# API : Clés SSH

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [key.delete](#keydelete) | Supprimer une clé |
| [key.export](#keyexport) | Exporter une clé publique |
| [key.exportPrivate](#keyexportprivate) | Exporter une clé privée, uniquement si elle est exportable |
| [key.generate](#keygenerate) | Générer une nouvelle clé |
| [key.info](#keyinfo) | Lire les informations d’une clé |
| [key.list](#keylist) | Lister toutes les clés enregistrées |

<a id="keydelete"></a>

## key.delete

Supprimer une clé

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/key/delete`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant de la clé locale. | Aucune valeur par défaut |
| `preview` | boolean | Facultatif | true prévisualise les hôtes et exécutions associés ; false effectue la suppression. | false |

### Exemple de requête

```json
{
  "id": "example-key",
  "preview": true
}
```

### Réponse et confirmation de fin

Aperçu : data.hosts/runs/complete. Suppression : data.id/deleted.

### Notes d'utilisation

N’arrête pas les processus distants et ne retire pas les clés publiques de authorized_keys. La suppression peut empêcher la vérification ou l’arrêt d’une exécution existante.

<a id="keyexport"></a>

## key.export

Exporter une clé publique

**Méthodes**: GET / POST
**Voie**: `/api/v1/key/export`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant de la clé locale. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "id": "example-key"
}
```

### Réponse et confirmation de fin

data.id/type/public_key/comment ; public_key est un texte OpenSSH.

### Notes d'utilisation

La lecture de clés cachées nécessite le rôle approprié.

<a id="keyexportprivate"></a>

## key.exportPrivate

Exporter une clé privée, uniquement si elle est exportable

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/key/exportPrivate`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant de la clé locale. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "id": "example-key"
}
```

### Réponse et confirmation de fin

data.id/type/private_key/comment/warning.

### Notes d'utilisation

Nécessite ADMIN et exportable=true ; les clés ne sont pas exportables par défaut. Traitez la réponse comme une donnée secrète, et non comme du contenu de journal ordinaire.

<a id="keygenerate"></a>

## key.generate

Générer une nouvelle clé

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/key/generate`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant de la clé locale. | Aucune valeur par défaut |
| `type` | string | Facultatif | rsa2048/rsa4096/ec256/ecdsa/ec384. | rsa2048 |
| `comment` | string | Facultatif | Commentaire de la clé publique. | Vide |
| `alias` | string | Facultatif | Nom d’affichage. | Vide |
| `hidden` | boolean | Facultatif | Masquer la clé. | false |
| `exportable` | boolean | Facultatif | Autoriser l’exportation ultérieure de la clé privée. | false |
| `request_id` | string | Facultatif | Valeur facultative de corrélation des requêtes, inférieure à 32 octets, limitée aux caractères alphanumériques et au trait d’union. | Aucune |

### Exemple de requête

```json
{
  "id": "example-key",
  "type": "ec256",
  "exportable": false
}
```

### Réponse et confirmation de fin

data.generated/id/type ; un échec peut inclure failed_stage/esp_error/cleanup_complete/cleanup_error.

### Notes d'utilisation

Vérifiez generated. Un identifiant existant ou un échec de génération produit une erreur ; les clés ne sont pas remplacées automatiquement.

<a id="keyinfo"></a>

## key.info

Lire les informations d’une clé

**Méthodes**: GET / POST
**Voie**: `/api/v1/key/info`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant de la clé locale. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "id": "example-key"
}
```

### Réponse et confirmation de fin

data.id/type/type_desc/comment/alias/created/last_used/has_public_key/exportable/hidden.

<a id="keylist"></a>

## key.list

Lister toutes les clés enregistrées

**Méthodes**: GET / POST
**Voie**: `/api/v1/key/list`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.keys/count/max_keys ; métadonnées id/type/type_desc/comment/alias/created/last_used/has_pubkey/exportable/hidden.

### Notes d'utilisation

Les rôles inférieurs à ADMIN reçoivent uniquement les métadonnées de clés autorisées. Les listes ne contiennent aucune clé privée.
