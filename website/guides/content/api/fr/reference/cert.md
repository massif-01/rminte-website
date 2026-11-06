# API : Certificats de l’appareil

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [cert.delete](#certdelete) | Supprimer toutes les données d’authentification PKI |
| [cert.generate_csr](#certgenerate_csr) | Générer une demande de signature de certificat |
| [cert.generate_keypair](#certgenerate_keypair) | Générer la paire de clés ECDSA P-256 |
| [cert.get_certificate](#certget_certificate) | Lire le certificat de l’appareil au format PEM |
| [cert.install](#certinstall) | Installer le certificat signé |
| [cert.install_ca](#certinstall_ca) | Installer la chaîne de certificats CA |
| [cert.status](#certstatus) | Lire le certificat et l'état du service de diagnostic |

<a id="certdelete"></a>

## cert.delete

Supprimer toutes les données d’authentification PKI

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/cert/delete`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `confirm` | boolean | Obligatoire | La valeur explicite true confirme la suppression des données PKI locales. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "confirm": true
}
```

### Réponse et confirmation de fin

data.success/message.

### Notes d'utilisation

Peut modifier l’identité du service de diagnostic HTTPS distinct ou rétablir son certificat initial. Ne révoque pas le certificat auprès de son émetteur.

<a id="certgenerate_csr"></a>

## cert.generate_csr

Générer une demande de signature de certificat

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/cert/generate_csr`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `device_id` | string | Facultatif | Identifiant de l’appareil pour le sujet du certificat. | Identifiant d’appareil défini à la compilation |
| `organization` | string | Facultatif | Nom de l'organisation. | RMinte |
| `org_unit` | string | Facultatif | Unité organisationnelle. | Device |

### Exemple de requête

```json
{
  "device_id": "YOUR_DEVICE_ID",
  "organization": "YOUR_ORG",
  "org_unit": "Device"
}
```

### Réponse et confirmation de fin

data.success/csr_pem. Transmettez le CSR à un émetteur de confiance ; il ne contient aucune clé privée.

<a id="certgenerate_keypair"></a>

## cert.generate_keypair

Générer la paire de clés ECDSA P-256

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/cert/generate_keypair`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `force` | boolean | Facultatif | Demander une nouvelle génération lorsque les données d’identité existent déjà. | false |

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.success/message.

### Notes d'utilisation

Le remplacement de la clé d’identité peut rendre le certificat existant incompatible. Planifiez d’abord une intervention de maintenance. Cette clé n’est pas une clé SSH des API key.*.

<a id="certget_certificate"></a>

## cert.get_certificate

Lire le certificat de l’appareil au format PEM

**Méthodes**: GET / POST
**Voie**: `/api/v1/cert/get_certificate`
**Accès minimum**: Public

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.cert_pem est le certificat PEM de l’appareil, sans clé privée.

<a id="certinstall"></a>

## cert.install

Installer le certificat signé

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/cert/install`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `cert_pem` | string | Obligatoire | Certificat PEM, au plus 3999 octets de contenu; doit correspondre à la clé privée de l'appareil existant. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "cert_pem": "-----BEGIN CERTIFICATE-----\nYOUR_CERTIFICATE\n-----END CERTIFICATE-----"
}
```

### Réponse et confirmation de fin

data.success/message/cert_info avec subject_cn/issuer_cn/not_before/not_after/validity/time_ready et les renseignements relatifs à l'expiration.

### Notes d'utilisation

Vérifiez séparément le stockage du certificat, sa validité et son chargement par le service de diagnostic HTTPS distinct. Les API de gestion restent sur HTTP80. Lisez cert.status après installation.

<a id="certinstall_ca"></a>

## cert.install_ca

Installer la chaîne de certificats CA

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/cert/install_ca`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `ca_pem` | string | Obligatoire | Chaîne de certificats d’autorité de confiance au format PEM ; soumise aux contrôles d’analyse et de capacité. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "ca_pem": "-----BEGIN CERTIFICATE-----\nYOUR_CA_CERTIFICATE\n-----END CERTIFICATE-----"
}
```

### Réponse et confirmation de fin

data.success/message.

### Notes d'utilisation

Les certificats d’autorité modifient les relations de confiance. N’installez que des chaînes vérifiées par l’administrateur.

<a id="certstatus"></a>

## cert.status

Lire le certificat et l'état du service de diagnostic

**Méthodes**: GET / POST
**Voie**: `/api/v1/cert/status`
**Accès minimum**: Public

### Paramètres

Aucun paramètre fonctionnel.

Consultez le [modèle de données commun](../response-models.md#certificate).

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.has_private_key/has_certificate/has_ca_chain, les informations du certificat, time_ready/validity/blocked_by et l’état d’exécution du service de diagnostic HTTPS distinct sont indiqués séparément. Consultez le modèle de réponse des certificats.
