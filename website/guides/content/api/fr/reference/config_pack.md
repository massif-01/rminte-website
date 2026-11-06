# API : Paquets de configuration

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [config.pack.apply](#configpackapply) | Application de configuration générique non prise en charge |
| [config.pack.content](#configpackcontent) | Déchiffrer le paquet de configuration importé et en lire le contenu |
| [config.pack.export](#configpackexport) | Exporter la configuration sous forme de .tscfg chiffré |
| [config.pack.export_cert](#configpackexport_cert) | Exporter le certificat de l’appareil pour le chiffrement |
| [config.pack.import](#configpackimport) | Valider sur place un fichier .tscfg envoyé |
| [config.pack.info](#configpackinfo) | Lire les informations système des paquets de configuration |
| [config.pack.list](#configpacklist) | Lister les fichiers .tscfg dans le répertoire |
| [config.pack.verify](#configpackverify) | Vérifier la signature d’un paquet .tscfg |

<a id="configpackapply"></a>

## config.pack.apply

Application de configuration générique non prise en charge

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/config/pack/apply`
**Accès minimum**: ADMIN

**Opération non prise en charge.** Le nom est conservé pour rejeter explicitement les anciens appels.

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `path` | string | Obligatoire | Chemin absolu sur l’appareil ; la configuration gérée et les fichiers sensibles sont soumis à des restrictions supplémentaires. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "path": "/sdcard/example.tscfg"
}
```

### Réponse et confirmation de fin

data.success=false avec result_code/reason indiquant une opération non prise en charge. Aucune configuration n’est appliquée, même si code=0 au premier niveau.

### Notes d'utilisation

L’application générique n’est pas prise en charge. Utilisez la procédure d’importation propre à l’objet.

<a id="configpackcontent"></a>

## config.pack.content

Déchiffrer le paquet de configuration importé et en lire le contenu

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/config/pack/content`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `name` | string | Obligatoire | Nom du paquet utilisé dans son stockage. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "name": "example"
}
```

### Réponse et confirmation de fin

data.name/content/content_raw ; content est structuré lorsque son contenu JSON peut être analysé.

### Notes d'utilisation

Lectures réservées aux administrateurs de confiance. Ne consignez pas les secrets de configuration dans les journaux publics.

<a id="configpackexport"></a>

## config.pack.export

Exporter la configuration sous forme de .tscfg chiffré

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/config/pack/export`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `name` | string | Obligatoire | Nom du paquet. | Aucune valeur par défaut |
| `content` | object / string | Obligatoire | Contenu de configuration à chiffrer ; doit pouvoir être encodé en JSON. | Aucune valeur par défaut |
| `recipient_cert` | string | Obligatoire | Certificat PEM de l’appareil destinataire. | Aucune valeur par défaut |
| `description` | string | Facultatif | Description du paquet. | Vide |
| `save_path` | string | Facultatif | Chemin d’enregistrement SD facultatif. | Ne pas enregistrer de fichier sur l’appareil |

### Exemple de requête

```json
{
  "name": "example",
  "content": {
    "example": true
  },
  "recipient_cert": "RECIPIENT_CERTIFICATE_PEM"
}
```

### Réponse et confirmation de fin

data.tscfg/filename/size ; l’enregistrement réussi d’un fichier demandé inclut aussi saved_path.

### Notes d'utilisation

Nécessite la capacité locale d’exportation Developer. Le destinataire doit encore valider le paquet et l’importer explicitement.

<a id="configpackexport_cert"></a>

## config.pack.export_cert

Exporter le certificat de l’appareil pour le chiffrement

**Méthodes**: GET / POST
**Voie**: `/api/v1/config/pack/export_cert`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.certificate/fingerprint/cn : données publiques pour chiffrer à destination de cet appareil, et non une clé privée.

<a id="configpackimport"></a>

## config.pack.import

Valider sur place un fichier .tscfg envoyé

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/config/pack/import`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `content` | string | content ou path requis | Texte JSON brut du paquet, et non un contenu Base64 arbitraire. | Aucune valeur par défaut |
| `path` | string | content ou path requis | Chemin absolu, sur l’appareil, d’un paquet déjà envoyé. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "path": "/sdcard/example.tscfg"
}
```

### Réponse et confirmation de fin

En cas de réussite, data contient valid/result_code/result_message/reason/path/saved_path, name/description/source_file/target_device/created_at et signature. Un paquet invalide produit une erreur de traitement.

### Notes d'utilisation

content peut enregistrer un paquet vérifié dans le stockage des paquets ; path le valide sur place. Aucune de ces options n’applique une configuration de gestion. Utilisez l’importation propre à l’objet concerné.

<a id="configpackinfo"></a>

## config.pack.info

Lire les informations système des paquets de configuration

**Méthodes**: GET / POST
**Voie**: `/api/v1/config/pack/info`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.can_export/device_type/cert_fingerprint/cert_cn/cert_ou/pack_version/algorithm.

<a id="configpacklist"></a>

## config.pack.list

Lister les fichiers .tscfg dans le répertoire

**Méthodes**: GET / POST
**Voie**: `/api/v1/config/pack/list`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `path` | string | Facultatif | Chemin absolu du répertoire. | /sdcard/config |

### Exemple de requête

```json
{
  "path": "/sdcard/config"
}
```

### Réponse et confirmation de fin

data.files/count ; éléments name/path/size/mtime/valid et informations disponibles sur l’émetteur.

<a id="configpackverify"></a>

## config.pack.verify

Vérifier la signature d’un paquet .tscfg

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/config/pack/verify`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `content` | string | content ou path requis | Texte JSON brut du paquet, et non un contenu Base64 arbitraire. | Aucune valeur par défaut |
| `path` | string | content ou path requis | Chemin absolu, sur l’appareil, d’un paquet déjà envoyé. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "path": "/sdcard/example.tscfg"
}
```

### Réponse et confirmation de fin

data.valid/result_code/result_message/reason/signature. signature contient valid/is_official/signer_cn/signer_ou/signed_at.

### Notes d'utilisation

Vérifiez les champs imbriqués valid/reason. La validation générique ne prouve pas qu’une configuration a été importée.
