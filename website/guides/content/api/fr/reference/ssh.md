# API : Connexions et commandes SSH

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [ssh.cancel](#sshcancel) | Annuler une session d’exécution SSH en cours |
| [ssh.commands.add](#sshcommandsadd) | Ajouter ou modifier une configuration de commande SSH |
| [ssh.commands.export](#sshcommandsexport) | Exporter une configuration de commande SSH au format .tscfg |
| [ssh.commands.get](#sshcommandsget) | Lire une configuration de commande SSH par identifiant |
| [ssh.commands.import](#sshcommandsimport) | Importer une configuration de commande SSH depuis un fichier .tscfg |
| [ssh.commands.list](#sshcommandslist) | Lister toutes les configurations de commandes SSH |
| [ssh.commands.remove](#sshcommandsremove) | Supprimer une configuration de commande SSH |
| [ssh.commands.update](#sshcommandsupdate) | Modifier une configuration de commandes SSH existante |
| [ssh.copyid](#sshcopyid) | Déployer la clé publique vers le serveur distant |
| [ssh.exec](#sshexec) | Exécuter la commande distante via SSH |
| [ssh.exec_status](#sshexec_status) | Lire son résultat SSH en cours ou le plus récent |
| [ssh.exec_stream](#sshexec_stream) | Exécuter la commande distante avec sortie en streaming via WebSocket |
| [ssh.hosts.add](#sshhostsadd) | Ajouter une configuration d’hôte SSH |
| [ssh.hosts.export](#sshhostsexport) | Exporter une configuration d’hôte SSH au format .tscfg |
| [ssh.hosts.get](#sshhostsget) | Lire une configuration d’hôte SSH par identifiant |
| [ssh.hosts.import](#sshhostsimport) | Importer une configuration d’hôte SSH depuis un fichier .tscfg |
| [ssh.hosts.list](#sshhostslist) | Lister toutes les configurations d’hôtes SSH |
| [ssh.hosts.remove](#sshhostsremove) | Supprimer une configuration d’hôte SSH |
| [ssh.hosts.update](#sshhostsupdate) | Modifier une configuration d’hôtes SSH existante |
| [ssh.keygen](#sshkeygen) | Générer une paire de clés SSH |
| [ssh.revoke](#sshrevoke) | Révoquer une clé publique déployée en la retirant du serveur distant |
| [ssh.services.start](#sshservicesstart) | Démarrer un service géré enregistré |
| [ssh.test](#sshtest) | Tester une connexion SSH |

<a id="sshcancel"></a>

## ssh.cancel

Annuler une session d’exécution SSH en cours

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ssh/cancel`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `session_id` | integer | Obligatoire | Identifiant d’exécution renvoyé par ssh.exec_stream. | Aucune valeur par défaut |
| `boot_id` | string | Facultatif | Fourni avec result_key, doit correspondre aux informations de suivi du démarrage. La session de connexion initiatrice peut omettre les deux. | Aucune valeur par défaut |
| `result_key` | string | Facultatif | Clé confidentielle de suivi de l’opération, fournie avec boot_id. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "session_id": 1
}
```

### Réponse et confirmation de fin

data.cancelled=true accepte la demande d’annulation ; continuez à consulter l’état final.

### Notes d'utilisation

Nécessite la session de connexion initiatrice ; une autre session root ne peut pas annuler cette exécution. Les informations de suivi fournies sont encore vérifiées comme une paire complète correspondante. cancelled accuse uniquement réception de la demande ; exec_status nécessite toujours les informations de suivi complètes.

<a id="sshcommandsadd"></a>

## ssh.commands.add

Ajouter ou modifier une configuration de commande SSH

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ssh/commands/add`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../configuration-models.md#ssh-commands).

### Exemple de requête

```json
{
  "id": "example-command",
  "host_id": "example-host",
  "name": "Read OS",
  "command": "uname -a",
  "timeout_sec": 30,
  "enabled": true,
  "service_mode": false,
  "active_version": "CURRENT_VERSION"
}
```

### Réponse et confirmation de fin

Résultat de configuration contenant active_version/source/loaded/configured/enabled/paused/saved/uncertain et l’emplacement de l’erreur. Consultez le modèle complet de résultat de configuration.

### Notes d'utilisation

L’ajout nécessite un identifiant inutilisé ; la modification nécessite un objet existant. Consultez les exemples complets des modèles.

<a id="sshcommandsexport"></a>

## ssh.commands.export

Exporter une configuration de commande SSH au format .tscfg

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ssh/commands/export`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `recipient_cert` | string | Facultatif | Certificat PEM du destinataire ; en cas d’omission, le paquet est chiffré pour cet appareil. | Certificat de cet appareil |
| `include_host` | boolean | Facultatif | Inclure la définition d'hôte dépendant dans l'exportation. | false |

Consultez le [modèle de données commun](../configuration-models.md#ssh-commands).

### Exemple de requête

```json
{
  "id": "example"
}
```

### Réponse et confirmation de fin

data.tscfg/filename. L’exportation dépend aussi de l’identité Developer de l’appareil et des données du destinataire.

### Notes d'utilisation

Le client enregistre le texte du paquet reçu. Celui-ci ne devient pas automatiquement la configuration active d’un autre appareil.

<a id="sshcommandsget"></a>

## ssh.commands.get

Lire une configuration de commande SSH par identifiant

**Méthodes**: GET / POST
**Voie**: `/api/v1/ssh/commands/get`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../configuration-models.md#ssh-commands).

### Exemple de requête

```json
{
  "id": "example"
}
```

### Réponse et confirmation de fin

Une commande SSH et active_version ; certains champs sont filtrés pour les rôles inférieurs à ADMIN.

<a id="sshcommandsimport"></a>

## ssh.commands.import

Importer une configuration de commande SSH depuis un fichier .tscfg

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ssh/commands/import`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `tscfg` | string | Obligatoire | Texte JSON complet du paquet, transmis sous forme de chaîne. | Aucune valeur par défaut |
| `preview` | boolean | Facultatif | Prévisualiser uniquement lorsque la valeur est true. | false |
| `active_version` | string | Obligatoire pour l’application | Version de configuration actuelle. | L’aperçu peut utiliser la version actuelle |
| `overwrite` | boolean | Facultatif | Permettre de remplacer un objet existant par un contenu différent. | false |
| `expected_credential` | integer | Obligatoire pour l’application | credential_generation renvoyé par l’aperçu. | Aucune |
| `expected_digest` | string | Obligatoire pour l’application | package_digest renvoyé par l’aperçu. | Aucune |

Consultez le [modèle de données commun](../configuration-models.md#ssh-commands).

### Exemple de requête

```json
{
  "tscfg": "PACKAGE_JSON_TEXT",
  "preview": true
}
```

### Réponse et confirmation de fin

Modèle de résultat de configuration. L’aperçu ajoute valid/items/exists/unchanged/package_digest/credential_generation ; l’application ajoute imported/overwritten/restart_required.

### Notes d'utilisation

Prévisualisez d’abord, puis appliquez le même paquet avec son empreinte, la version des données d’authentification et la version de configuration. Recommencez l’aperçu si les conditions changent.

<a id="sshcommandslist"></a>

## ssh.commands.list

Lister toutes les configurations de commandes SSH

**Méthodes**: GET / POST
**Voie**: `/api/v1/ssh/commands/list`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `offset` | integer | Facultatif | Décalage de retour non négatif. | 0 |
| `limit` | integer | Facultatif | Nombre d’éléments à renvoyer ; omettre ce paramètre ne demande pas de troncature. | Tous |
| `host_id` | string | Facultatif | Filtrer par l'identifiant de l'hôte enregistré. | Tous |

Consultez le [modèle de données commun](../configuration-models.md#ssh-commands).

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.commands/count/total/active_version/load_error/paused ; les rôles inférieurs à ADMIN reçoivent des métadonnées restreintes.

<a id="sshcommandsremove"></a>

## ssh.commands.remove

Supprimer une configuration de commande SSH

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ssh/commands/remove`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |
| `preview` | boolean | Facultatif | true prévisualise l’impact ; false effectue la suppression. | false |
| `replacement_id` | string | Facultatif | Identifiant de l’objet de remplacement pour les références dépendantes. | Aucune |
| `mode` | string | Facultatif | cascade demande un traitement en cascade ; choisissez une seule stratégie sans combiner force et remplacement. | Suppression ordinaire |
| `force` | boolean | Facultatif | Forcer la suppression d’un objet référencé uniquement après avoir prévisualisé son impact. | false |
| `pause_automation` | boolean | Facultatif | Suspendre l’automatisation avant l’opération. | false |

Consultez le [modèle de données commun](../configuration-models.md#ssh-commands).

### Exemple de requête

```json
{
  "id": "example",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### Réponse et confirmation de fin

Modèle de résultat de configuration, accompagné de impact décrivant les références affectées.

### Notes d'utilisation

Supprimer les définitions locales n’arrête pas automatiquement les programmes distants et ne révoque pas les clés publiques.

<a id="sshcommandsupdate"></a>

## ssh.commands.update

Modifier une configuration de commandes SSH existante

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ssh/commands/update`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../configuration-models.md#ssh-commands).

### Exemple de requête

```json
{
  "id": "example-command",
  "host_id": "example-host",
  "name": "Read OS",
  "command": "uname -a",
  "timeout_sec": 30,
  "enabled": true,
  "service_mode": false,
  "active_version": "CURRENT_VERSION"
}
```

### Réponse et confirmation de fin

Résultat de configuration contenant active_version/source/loaded/configured/enabled/paused/saved/uncertain et l’emplacement de l’erreur. Consultez le modèle complet de résultat de configuration.

### Notes d'utilisation

L’ajout nécessite un identifiant inutilisé ; la modification nécessite un objet existant. Consultez les exemples complets des modèles.

<a id="sshcopyid"></a>

## ssh.copyid

Déployer la clé publique vers le serveur distant

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ssh/copyid`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatoire | Adresse distante. | Aucune valeur par défaut |
| `user` | string | Obligatoire | Compte distant. | Aucune valeur par défaut |
| `port` | integer | Facultatif | Port SSH. | 22 |
| `password` | string | Obligatoire | Mot de passe pour cette authentification à distance. | Aucune valeur par défaut |
| `keyid` | string | Obligatoire | Identifiant de la clé locale dont la clé publique est déployée ou révoquée. | Aucune valeur par défaut |
| `trust_new` | boolean | Facultatif | N’acceptez un nouvel hôte qu’après une vérification indépendante. | false |
| `accept_changed` | boolean | Facultatif | N’acceptez une empreinte d’hôte modifiée qu’après vérification. | false |
| `confirmed_fingerprint` | string | Facultatif | Empreinte vérifiée correspondant à l'hôte confirmé. | Aucune |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |
| `verify` | boolean | Facultatif | Vérifier après le déploiement. | true |

### Exemple de requête

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "password": "REMOTE_PASSWORD",
  "keyid": "example-key",
  "active_version": "CURRENT_VERSION"
}
```

### Réponse et confirmation de fin

data.deployed/verified/registered/registration_error, host_id et détails de l’hôte et de la clé. Vérifiez séparément le déploiement distant et l’enregistrement local.

### Notes d'utilisation

Le déploiement distant peut réussir alors que l’enregistrement local échoue. Ne relancez pas immédiatement l’installation.

<a id="sshexec"></a>

## ssh.exec

Exécuter la commande distante via SSH

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ssh/exec`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatoire | Adresse de l’hôte SSH. | Aucune valeur par défaut |
| `user` | string | Obligatoire | Nom d'utilisateur distant. | Aucune valeur par défaut |
| `port` | integer | Facultatif | Port 1-65535. | 22 |
| `password` | string | Autre mode d’authentification | Mot de passe de cette connexion distante, et non du compte TianshanOS. | Aucune |
| `keyid` | string | Autre mode d’authentification | Identifiant d’une clé privée SSH enregistrée sur l’appareil. | Aucune |
| `keypath` | string | Autre mode d’authentification accepté pour un appel immédiat | Chemin de la clé privée sur l’appareil ; sa prise en charge varie selon l’interface. | Aucune |
| `command` | string | Obligatoire | Texte de la commande distante. | Aucune valeur par défaut |
| `timeout_ms` | integer | Facultatif | Délai de connexion et d’exécution, en millisecondes. | SSH par défaut |
| `trust_new` | boolean | Facultatif | N’acceptez un nouvel hôte qu’après une vérification indépendante. | false |
| `accept_changed` | boolean | Facultatif | N’acceptez une empreinte d’hôte modifiée qu’après vérification. | false |
| `confirmed_fingerprint` | string | Facultatif | Empreinte vérifiée correspondant à l'hôte confirmé. | Aucune |

### Exemple de requête

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "command": "uname -a"
}
```

### Réponse et confirmation de fin

data.stdout/stderr/exit_code/host_status/fingerprint. Vérifiez le code de sortie et la sortie de l'application.

### Notes d'utilisation

Une empreinte inconnue ou modifiée renvoie des informations de confirmation. Vérifiez-la avant de l’accepter. Un code de sortie distant non nul n’implique pas nécessairement un code non nul au premier niveau.

<a id="sshexec_status"></a>

## ssh.exec_status

Lire son résultat SSH en cours ou le plus récent

**Méthodes**: GET / POST
**Voie**: `/api/v1/ssh/exec_status`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `session_id` | integer | Obligatoire | Identifiant d’exécution renvoyé par ssh.exec_stream. | Aucune valeur par défaut |
| `boot_id` | string | Obligatoire | Identifiant de démarrage hexadécimal de 32 caractères, fourni dans les informations de suivi. | Aucune valeur par défaut |
| `result_key` | string | Obligatoire | Donnée d’authentification hexadécimale de 32 caractères permettant de consulter le résultat, fournie dans les informations de suivi. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "session_id": 1,
  "boot_id": "00000000000000000000000000000000",
  "result_key": "00000000000000000000000000000000"
}
```

### Réponse et confirmation de fin

data suit le format de résultat WebSocket : ssh_exec_running pendant l’exécution, puis ssh_exec_done/cancelled/error à la fin. Vérifiez status/exit_code/success et si la sortie est complète.

### Notes d'utilisation

Nécessite la session initiatrice et les bonnes informations de suivi. Les exemples remplis de zéros montrent seulement le format ; utilisez la réponse réelle du démarrage. La consultation ne relance pas la commande.

<a id="sshexec_stream"></a>

## ssh.exec_stream

Exécuter la commande distante avec sortie en streaming via WebSocket

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ssh/exec_stream`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatoire | Adresse de l’hôte SSH. | Aucune valeur par défaut |
| `user` | string | Obligatoire | Nom d'utilisateur distant. | Aucune valeur par défaut |
| `port` | integer | Facultatif | Port 1-65535. | 22 |
| `password` | string | Autre mode d’authentification | Mot de passe de cette connexion distante, et non du compte TianshanOS. | Aucune |
| `keyid` | string | Autre mode d’authentification | Identifiant d’une clé privée SSH enregistrée sur l’appareil. | Aucune |
| `command` | string | Obligatoire | Texte de la commande. | Aucune valeur par défaut |
| `expect_pattern` | string | Facultatif | Motif indiquant une réussite. | Sans changement |
| `fail_pattern` | string | Facultatif | Motif indiquant un échec. | Sans changement |
| `extract_pattern` | string | Facultatif | Motif d’extraction de la sortie. | Sans changement |
| `var_name` | string | Facultatif | Préfixe de la variable de résultat. | Sans changement |
| `timeout` | integer | Facultatif | Valeur en millisecondes ici, contrairement à timeout_sec des commandes enregistrées. | Délai d'exécution par défaut |
| `collect_output` | boolean | Facultatif | Conserver la sortie collectée. | true |
| `max_output_size` | integer | Facultatif | Limite de collecte de la sortie, en octets. | Valeur par défaut du périphérique |
| `stop_on_match` | boolean | Facultatif | Arrêter après une correspondance. | false |
| `command_id` | string | Paire facultative avec command_instance | Identifiant de la commande enregistrée associée. | Aucune |
| `command_instance` | string | Paire facultative avec command_id | Identifiant hexadécimal en minuscules de 16 caractères, correspondant au champ runtime_instance de la liste. | Aucune |

### Exemple de requête

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "command": "uname -a",
  "collect_output": true
}
```

### Réponse et confirmation de fin

data.session_id/boot_id/result_key. Conservez les informations de suivi avant de lire les résultats WebSocket ou d’interroger ssh.exec_status.

### Notes d'utilisation

Emplacement de flux exclusif. L’authentification générique par keypath n’est pas disponible ici. Vérifiez l’appartenance de l’exécution, son état final et si la sortie est complète.

<a id="sshhostsadd"></a>

## ssh.hosts.add

Ajouter une configuration d’hôte SSH

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ssh/hosts/add`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../configuration-models.md#ssh-hosts).

### Exemple de requête

```json
{
  "id": "example-host",
  "host": "192.0.2.20",
  "port": 22,
  "username": "YOUR_USER",
  "auth_type": "key",
  "keyid": "example-key",
  "enabled": true,
  "active_version": "CURRENT_VERSION"
}
```

### Réponse et confirmation de fin

Résultat de configuration contenant active_version/source/loaded/configured/enabled/paused/saved/uncertain et l’emplacement de l’erreur. Consultez le modèle complet de résultat de configuration.

### Notes d'utilisation

L’ajout nécessite un identifiant inutilisé ; la modification nécessite un objet existant. Consultez les exemples complets des modèles.

<a id="sshhostsexport"></a>

## ssh.hosts.export

Exporter une configuration d’hôte SSH au format .tscfg

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ssh/hosts/export`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `recipient_cert` | string | Facultatif | Certificat PEM du destinataire ; en cas d’omission, le paquet est chiffré pour cet appareil. | Certificat de cet appareil |

Consultez le [modèle de données commun](../configuration-models.md#ssh-hosts).

### Exemple de requête

```json
{
  "id": "example"
}
```

### Réponse et confirmation de fin

data.tscfg/filename. L’exportation dépend aussi de l’identité Developer de l’appareil et des données du destinataire.

### Notes d'utilisation

Le client enregistre le texte du paquet reçu. Celui-ci ne devient pas automatiquement la configuration active d’un autre appareil.

<a id="sshhostsget"></a>

## ssh.hosts.get

Lire une configuration d’hôte SSH par identifiant

**Méthodes**: GET / POST
**Voie**: `/api/v1/ssh/hosts/get`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../configuration-models.md#ssh-hosts).

### Exemple de requête

```json
{
  "id": "example"
}
```

### Réponse et confirmation de fin

Un hôte et active_version ; certains champs sont filtrés pour les rôles inférieurs à ADMIN.

<a id="sshhostsimport"></a>

## ssh.hosts.import

Importer une configuration d’hôte SSH depuis un fichier .tscfg

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ssh/hosts/import`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `tscfg` | string | Obligatoire | Texte JSON complet du paquet, transmis sous forme de chaîne. | Aucune valeur par défaut |
| `preview` | boolean | Facultatif | Prévisualiser uniquement lorsque la valeur est true. | false |
| `active_version` | string | Obligatoire pour l’application | Version de configuration actuelle. | L’aperçu peut utiliser la version actuelle |
| `overwrite` | boolean | Facultatif | Permettre de remplacer un objet existant par un contenu différent. | false |
| `expected_credential` | integer | Obligatoire pour l’application | credential_generation renvoyé par l’aperçu. | Aucune |
| `expected_digest` | string | Obligatoire pour l’application | package_digest renvoyé par l’aperçu. | Aucune |

Consultez le [modèle de données commun](../configuration-models.md#ssh-hosts).

### Exemple de requête

```json
{
  "tscfg": "PACKAGE_JSON_TEXT",
  "preview": true
}
```

### Réponse et confirmation de fin

Modèle de résultat de configuration. L’aperçu ajoute valid/items/exists/unchanged/package_digest/credential_generation ; l’application ajoute imported/overwritten/restart_required.

### Notes d'utilisation

Prévisualisez d’abord, puis appliquez le même paquet avec son empreinte, la version des données d’authentification et la version de configuration. Recommencez l’aperçu si les conditions changent.

<a id="sshhostslist"></a>

## ssh.hosts.list

Lister toutes les configurations d’hôtes SSH

**Méthodes**: GET / POST
**Voie**: `/api/v1/ssh/hosts/list`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `offset` | integer | Facultatif | Décalage de retour non négatif. | 0 |
| `limit` | integer | Facultatif | Nombre d’éléments à renvoyer ; omettre ce paramètre ne demande pas de troncature. | Tous |

Consultez le [modèle de données commun](../configuration-models.md#ssh-hosts).

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.hosts/count/total/active_version/load_error/paused ; les rôles inférieurs à ADMIN reçoivent des métadonnées restreintes.

<a id="sshhostsremove"></a>

## ssh.hosts.remove

Supprimer une configuration d’hôte SSH

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ssh/hosts/remove`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |
| `preview` | boolean | Facultatif | true prévisualise l’impact ; false effectue la suppression. | false |
| `replacement_id` | string | Facultatif | Identifiant de l’objet de remplacement pour les références dépendantes. | Aucune |
| `mode` | string | Facultatif | cascade demande un traitement en cascade ; choisissez une seule stratégie sans combiner force et remplacement. | Suppression ordinaire |
| `force` | boolean | Facultatif | Forcer la suppression d’un objet référencé uniquement après avoir prévisualisé son impact. | false |
| `pause_automation` | boolean | Facultatif | Suspendre l’automatisation avant l’opération. | false |

Consultez le [modèle de données commun](../configuration-models.md#ssh-hosts).

### Exemple de requête

```json
{
  "id": "example",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### Réponse et confirmation de fin

Modèle de résultat de configuration, accompagné de impact décrivant les références affectées.

### Notes d'utilisation

Supprimer les définitions locales n’arrête pas automatiquement les programmes distants et ne révoque pas les clés publiques.

<a id="sshhostsupdate"></a>

## ssh.hosts.update

Modifier une configuration d’hôtes SSH existante

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ssh/hosts/update`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../configuration-models.md#ssh-hosts).

### Exemple de requête

```json
{
  "id": "example-host",
  "host": "192.0.2.20",
  "port": 22,
  "username": "YOUR_USER",
  "auth_type": "key",
  "keyid": "example-key",
  "enabled": true,
  "active_version": "CURRENT_VERSION"
}
```

### Réponse et confirmation de fin

Résultat de configuration contenant active_version/source/loaded/configured/enabled/paused/saved/uncertain et l’emplacement de l’erreur. Consultez le modèle complet de résultat de configuration.

### Notes d'utilisation

L’ajout nécessite un identifiant inutilisé ; la modification nécessite un objet existant. Consultez les exemples complets des modèles.

<a id="sshkeygen"></a>

## ssh.keygen

Générer une paire de clés SSH

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ssh/keygen`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant de la clé. | Aucune valeur par défaut |
| `type` | string | Facultatif | Type de clé accepté par cette interface, par exemple rsa2048/rsa4096/ec256/ec384. | rsa2048 |
| `comment` | string | Facultatif | Commentaire de la clé publique. | Vide |

### Exemple de requête

```json
{
  "id": "example-key",
  "type": "ec256"
}
```

### Réponse et confirmation de fin

data.id/type/public_key.

### Notes d'utilisation

Préférez key.generate pour les nouvelles intégrations ; les paramètres pris en charge diffèrent.

<a id="sshrevoke"></a>

## ssh.revoke

Révoquer une clé publique déployée en la retirant du serveur distant

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ssh/revoke`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `host` | string | Obligatoire | Adresse distante. | Aucune valeur par défaut |
| `user` | string | Obligatoire | Compte distant. | Aucune valeur par défaut |
| `port` | integer | Facultatif | Port SSH. | 22 |
| `password` | string | Obligatoire | Mot de passe pour cette authentification à distance. | Aucune valeur par défaut |
| `keyid` | string | Obligatoire | Identifiant de la clé locale dont la clé publique est déployée ou révoquée. | Aucune valeur par défaut |
| `trust_new` | boolean | Facultatif | N’acceptez un nouvel hôte qu’après une vérification indépendante. | false |
| `accept_changed` | boolean | Facultatif | N’acceptez une empreinte d’hôte modifiée qu’après vérification. | false |
| `confirmed_fingerprint` | string | Facultatif | Empreinte vérifiée correspondant à l'hôte confirmé. | Aucune |

### Exemple de requête

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "password": "REMOTE_PASSWORD",
  "keyid": "example-key"
}
```

### Réponse et confirmation de fin

data.revoked/found/removed_count et détails de l’opération distante.

### Notes d'utilisation

Supprime uniquement la clé publique indiquée, et non les clés locales, les définitions d’hôtes ou les processus distants.

<a id="sshservicesstart"></a>

## ssh.services.start

Démarrer un service géré enregistré

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ssh/services/start`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `command_id` | string | Obligatoire | Identifiant d’une commande enregistrée configurée comme service géré. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "command_id": "example-service",
  "active_version": "CURRENT_VERSION"
}
```

### Réponse et confirmation de fin

data.operation_id/run_id ; vérifiez avec automation.services.status.

### Notes d'utilisation

Utilise la configuration enregistrée. Même après réussite de l’appel, distinguez le processus en cours d’exécution de l’application prête à l’emploi.

<a id="sshtest"></a>

## ssh.test

Tester une connexion SSH

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ssh/test`
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
| `trust_new` | boolean | Facultatif | N’acceptez un nouvel hôte qu’après une vérification indépendante. | false |
| `accept_changed` | boolean | Facultatif | N’acceptez une empreinte d’hôte modifiée qu’après vérification. | false |
| `confirmed_fingerprint` | string | Facultatif | Empreinte vérifiée correspondant à l'hôte confirmé. | Aucune |

### Exemple de requête

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key"
}
```

### Réponse et confirmation de fin

data.success/host/port/user/host_status/fingerprint ; un échec de connexion peut inclure stage/reason/error et des empreintes.

### Notes d'utilisation

Vérifie les conditions de connexion et d’authentification, et non le bon fonctionnement de toutes les commandes ou de tous les services distants.
