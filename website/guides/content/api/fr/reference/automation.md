# API : Automatisation et services gérés

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [automation.action.stats](#automationactionstats) | Obtenir des statistiques sur l'exécution des actions |
| [automation.action.stats.reset](#automationactionstatsreset) | Réinitialiser les statistiques d'action |
| [automation.actions.add](#automationactionsadd) | Créer un nouveau modèle d'action |
| [automation.actions.delete](#automationactionsdelete) | Supprimer un modèle d'action |
| [automation.actions.execute](#automationactionsexecute) | Exécuter un modèle d'action |
| [automation.actions.export](#automationactionsexport) | Exporter un modèle d’action en paquet de configuration (.tscfg) |
| [automation.actions.get](#automationactionsget) | Obtenir le modèle d'action par ID |
| [automation.actions.import](#automationactionsimport) | Importer un modèle d’action depuis un paquet de configuration |
| [automation.actions.list](#automationactionslist) | Lister tous les modèles d’action |
| [automation.actions.update](#automationactionsupdate) | Mettre à jour un modèle d'action existant |
| [automation.config.apply](#automationconfigapply) | Appliquer le choix de restauration ou de source confirmé |
| [automation.config.backup](#automationconfigbackup) | Enregistrer la configuration d'urgence complète |
| [automation.config.enable](#automationconfigenable) | Activer ou suspendre explicitement la configuration actuelle |
| [automation.config.preview](#automationconfigpreview) | Prévisualiser un choix de restauration ou de source de configuration |
| [automation.config.refresh](#automationconfigrefresh) | Vérifiez la carte SD une fois sans changer le choix de l'utilisateur |
| [automation.config.status](#automationconfigstatus) | État actuel de stockage et de sauvegarde de l'automatisation |
| [automation.pause](#automationpause) | Suspendre le moteur d’automatisation |
| [automation.proxy.fetch](#automationproxyfetch) | Effectuer une requête vers une API REST externe via le proxy |
| [automation.proxy.socketio_test](#automationproxysocketio_test) | Tester une connexion Socket.IO, protocole v4 |
| [automation.proxy.websocket_test](#automationproxywebsocket_test) | Tester la connexion WebSocket |
| [automation.reload](#automationreload) | Recharger la configuration |
| [automation.resume](#automationresume) | Reprendre le moteur d'automatisation |
| [automation.rules.add](#automationrulesadd) | Ajouter une nouvelle règle |
| [automation.rules.delete](#automationrulesdelete) | Supprimer une règle |
| [automation.rules.disable](#automationrulesdisable) | Désactiver une règle |
| [automation.rules.enable](#automationrulesenable) | Activer une règle |
| [automation.rules.export](#automationrulesexport) | Exporter une règle en paquet de configuration (.tscfg) |
| [automation.rules.get](#automationrulesget) | Obtenez les détails de la règle par ID |
| [automation.rules.import](#automationrulesimport) | Importer une règle depuis un paquet de configuration |
| [automation.rules.list](#automationruleslist) | Lister toutes les règles |
| [automation.rules.trigger](#automationrulestrigger) | Déclencher manuellement une règle |
| [automation.rules.update](#automationrulesupdate) | Modifier une règle avec sa révision attendue |
| [automation.services.list](#automationserviceslist) | Lister les commandes indépendantes de services distants |
| [automation.services.status](#automationservicesstatus) | Confirmer l'état du processus distant géré |
| [automation.services.stop](#automationservicesstop) | Arrêter le processus distant géré vérifié |
| [automation.sources.add](#automationsourcesadd) | Ajouter une nouvelle source de données |
| [automation.sources.add_mapping](#automationsourcesadd_mapping) | Ajouter une correspondance de champ à une source de données existante |
| [automation.sources.delete](#automationsourcesdelete) | Supprimer une source de données |
| [automation.sources.disable](#automationsourcesdisable) | Désactiver une source de données |
| [automation.sources.enable](#automationsourcesenable) | Activer une source de données |
| [automation.sources.export](#automationsourcesexport) | Exporter une source de données en paquet de configuration (.tscfg) |
| [automation.sources.import](#automationsourcesimport) | Importer une source de données depuis un paquet de configuration |
| [automation.sources.list](#automationsourceslist) | Lister toutes les sources de données |
| [automation.sources.remove_mapping](#automationsourcesremove_mapping) | Supprimer une correspondance de champ dans une source de données |
| [automation.sources.update](#automationsourcesupdate) | Mettre à jour une source de données existante |
| [automation.start](#automationstart) | Démarrer le moteur d’automatisation |
| [automation.status](#automationstatus) | Obtenir l'état du moteur d'automatisation |
| [automation.stop](#automationstop) | Arrêter le moteur d’automatisation |
| [automation.test.device](#automationtestdevice) | Tester une action de commande de périphérique |
| [automation.test.gpio](#automationtestgpio) | Tester une action GPIO |
| [automation.test.led](#automationtestled) | Tester une action LED |
| [automation.test.ssh](#automationtestssh) | Tester l’exécution d’une commande SSH |
| [automation.variables.delete](#automationvariablesdelete) | Supprimer une variable utilisateur enregistrée |
| [automation.variables.get](#automationvariablesget) | Obtenez une valeur variable |
| [automation.variables.list](#automationvariableslist) | Lister toutes les variables |
| [automation.variables.set](#automationvariablesset) | Définir la valeur d’une variable |

<a id="automationactionstats"></a>

## automation.action.stats

Obtenir des statistiques sur l'exécution des actions

**Méthodes**: GET / POST
**Voie**: `/api/v1/automation/action/stats`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

Statistiques actuelles d’exécution du gestionnaire d’actions, et non un journal d’audit persistant.

<a id="automationactionstatsreset"></a>

## automation.action.stats.reset

Réinitialiser les statistiques d'action

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/action/stats/reset`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

code=0 indique que la requête de réinitialisation a réussi.

<a id="automationactionsadd"></a>

## automation.actions.add

Créer un nouveau modèle d'action

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/actions/add`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../configuration-models.md#action-templates).

### Exemple de requête

```json
{
  "id": "example-action",
  "name": "Record a message",
  "enabled": true,
  "type": "log",
  "log": {
    "level": 3,
    "message": "Example action"
  },
  "active_version": "CURRENT_VERSION"
}
```

### Réponse et confirmation de fin

Résultat de configuration contenant active_version/source/loaded/configured/enabled/paused/saved/uncertain et l’emplacement de l’erreur. Consultez le modèle complet de résultat de configuration.

### Notes d'utilisation

L’ajout nécessite un identifiant inutilisé ; la modification nécessite un objet existant. Consultez les exemples complets des modèles.

<a id="automationactionsdelete"></a>

## automation.actions.delete

Supprimer un modèle d'action

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/actions/delete`
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

Consultez le [modèle de données commun](../configuration-models.md#action-templates).

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

<a id="automationactionsexecute"></a>

## automation.actions.execute

Exécuter un modèle d'action

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/actions/execute`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../configuration-models.md#action-templates).

### Exemple de requête

```json
{
  "id": "example-action",
  "active_version": "CURRENT_VERSION"
}
```

### Réponse et confirmation de fin

data.async/status/duration_ms et résultats d’exécution ; les sorties privées sont filtrées pour les rôles inférieurs à ADMIN.

### Notes d'utilisation

Exécute les actions réelles du modèle sur le matériel ou sur l’hôte distant. Pour un modèle asynchrone, continuez à vérifier le résultat sur la cible.

<a id="automationactionsexport"></a>

## automation.actions.export

Exporter un modèle d’action en paquet de configuration (.tscfg)

**Méthodes**: POST
**Voie**: `/api/v1/automation/actions/export`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `recipient_cert` | string | Facultatif | Certificat PEM du destinataire ; en cas d’omission, le paquet est chiffré pour cet appareil. | Certificat de cet appareil |

Consultez le [modèle de données commun](../configuration-models.md#action-templates).

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

<a id="automationactionsget"></a>

## automation.actions.get

Obtenir le modèle d'action par ID

**Méthodes**: GET / POST
**Voie**: `/api/v1/automation/actions/get`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../configuration-models.md#action-templates).

### Exemple de requête

```json
{
  "id": "example"
}
```

### Réponse et confirmation de fin

Un modèle d’action et active_version ; certains champs sont filtrés pour les rôles inférieurs à ADMIN.

<a id="automationactionsimport"></a>

## automation.actions.import

Importer un modèle d’action depuis un paquet de configuration

**Méthodes**: POST
**Voie**: `/api/v1/automation/actions/import`
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

Consultez le [modèle de données commun](../configuration-models.md#action-templates).

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

<a id="automationactionslist"></a>

## automation.actions.list

Lister tous les modèles d’action

**Méthodes**: GET / POST
**Voie**: `/api/v1/automation/actions/list`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `offset` | integer | Facultatif | Décalage de retour non négatif. | 0 |
| `limit` | integer | Facultatif | Nombre d’éléments à renvoyer ; omettre ce paramètre ne demande pas de troncature. | Tous |

Consultez le [modèle de données commun](../configuration-models.md#action-templates).

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.templates/count/total/active_version/load_error/paused ; les rôles inférieurs à ADMIN reçoivent des métadonnées restreintes.

<a id="automationactionsupdate"></a>

## automation.actions.update

Mettre à jour un modèle d'action existant

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/actions/update`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../configuration-models.md#action-templates).

### Exemple de requête

```json
{
  "id": "example-action",
  "name": "Record a message",
  "enabled": true,
  "type": "log",
  "log": {
    "level": 3,
    "message": "Example action"
  },
  "active_version": "CURRENT_VERSION"
}
```

### Réponse et confirmation de fin

Résultat de configuration contenant active_version/source/loaded/configured/enabled/paused/saved/uncertain et l’emplacement de l’erreur. Consultez le modèle complet de résultat de configuration.

### Notes d'utilisation

L’ajout nécessite un identifiant inutilisé ; la modification nécessite un objet existant. Consultez les exemples complets des modèles.

<a id="automationconfigapply"></a>

## automation.config.apply

Appliquer le choix de restauration ou de source confirmé

**Méthodes**: POST
**Voie**: `/api/v1/automation/config/apply`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `operation` | string | Obligatoire | La même opération sélectionnée lors de l'aperçu. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |
| `target_version` | string | Obligatoire | Version cible renvoyée par l’aperçu. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../response-models.md#config-result).

### Exemple de requête

```json
{
  "operation": "use_sd",
  "active_version": "CURRENT_VERSION",
  "target_version": "PREVIEW_TARGET_VERSION"
}
```

### Réponse et confirmation de fin

Résultat de configuration contenant active_version/source/loaded/configured/enabled/paused/saved/uncertain et l’emplacement de l’erreur. Consultez le modèle complet de résultat de configuration.

### Notes d'utilisation

La sélection ou la récupération peut remplacer l’ensemble des hôtes, commandes, règles, variables et sources. Prévisualisez l’opération et conservez d’abord les données saisies.

<a id="automationconfigbackup"></a>

## automation.config.backup

Enregistrer la configuration d'urgence complète

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/config/backup`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../response-models.md#config-result).

### Exemple de requête

```json
{
  "active_version": "CURRENT_VERSION"
}
```

### Réponse et confirmation de fin

Résultat de configuration contenant active_version/source/loaded/configured/enabled/paused/saved/uncertain et l’emplacement de l’erreur. Consultez le modèle complet de résultat de configuration.

<a id="automationconfigenable"></a>

## automation.config.enable

Activer ou suspendre explicitement la configuration actuelle

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/config/enable`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |
| `enabled` | boolean | Obligatoire | true active la configuration actuelle ; false la suspend. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../response-models.md#config-result).

### Exemple de requête

```json
{
  "active_version": "CURRENT_VERSION",
  "enabled": false
}
```

### Réponse et confirmation de fin

Résultat de configuration contenant active_version/source/loaded/configured/enabled/paused/saved/uncertain et l’emplacement de l’erreur. Consultez le modèle complet de résultat de configuration.

<a id="automationconfigpreview"></a>

## automation.config.preview

Prévisualiser un choix de restauration ou de source de configuration

**Méthodes**: POST
**Voie**: `/api/v1/automation/config/preview`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `operation` | string | Obligatoire | use_sd/save_to_sd/restore_internal. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../response-models.md#config-result).

### Exemple de requête

```json
{
  "operation": "use_sd"
}
```

### Réponse et confirmation de fin

Prévisualiser les différences, les versions actuelle et cible et les conditions de sélection. L’application doit utiliser les versions renvoyées.

### Notes d'utilisation

La sélection ou la récupération peut remplacer l’ensemble des hôtes, commandes, règles, variables et sources. Prévisualisez l’opération et conservez d’abord les données saisies.

<a id="automationconfigrefresh"></a>

## automation.config.refresh

Vérifiez la carte SD une fois sans changer le choix de l'utilisateur

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/config/refresh`
**Accès minimum**: ROOT

### Paramètres

Aucun paramètre fonctionnel.

Consultez le [modèle de données commun](../response-models.md#config-result).

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

Résultat de configuration contenant active_version/source/loaded/configured/enabled/paused/saved/uncertain et l’emplacement de l’erreur. Consultez le modèle complet de résultat de configuration.

<a id="automationconfigstatus"></a>

## automation.config.status

État actuel de stockage et de sauvegarde de l'automatisation

**Méthodes**: GET / POST
**Voie**: `/api/v1/automation/config/status`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

Consultez le [modèle de données commun](../response-models.md#config-result).

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

Résultat de configuration contenant active_version/source/loaded/configured/enabled/paused/saved/uncertain et l’emplacement de l’erreur. Consultez le modèle complet de résultat de configuration.

<a id="automationpause"></a>

## automation.pause

Suspendre le moteur d’automatisation

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/pause`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

code=0/message indique une réussite. Lisez automation.status pour vérifier l’état d’exécution.

### Notes d'utilisation

L’état du moteur, les actions non terminées ou le stockage peuvent entraîner le rejet d’une requête. L’expiration du délai d’arrêt ne prouve pas que toutes les actions sont terminées.

<a id="automationproxyfetch"></a>

## automation.proxy.fetch

Effectuer une requête vers une API REST externe via le proxy

**Méthodes**: POST
**Voie**: `/api/v1/automation/proxy/fetch`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `url` | string | Obligatoire | Destination HTTP(S) ou adresse d’une API locale prise en charge. | Aucune valeur par défaut |
| `method` | string | Facultatif | Accepte GET/POST/PUT/DELETE ; aucun paramètre générique dans le corps de la requête. | GET |
| `headers` | object | Facultatif | En-têtes de requête dont les valeurs sont des chaînes ; ne consignez pas les identifiants dans les journaux ordinaires. | Aucune |
| `timeout` | integer | Facultatif | Délai maximal total de la requête, en millisecondes. | 15000 |
| `cert_pem` | string | Facultatif | Certificats d’autorité privée, 16384 octets au maximum. | Confiance du système |
| `skip_verify` | boolean | Facultatif | Paramètre de compatibilité : seule la valeur false est acceptée ; true est rejeté. | false |

### Exemple de requête

```json
{
  "url": "https://example.com/status",
  "method": "GET"
}
```

### Réponse et confirmation de fin

data.status/content_length/body ; les résultats d’une API locale sont imbriqués dans body, dont le champ code doit aussi être vérifié.

### Notes d'utilisation

Le transfert vers une API locale conserve la session actuelle et les droits de la destination. Les requêtes HTTP(S) externes nécessitent ROOT. Des limites de durée, de taille et de ressources réseau s’appliquent : ce proxy n’offre pas un accès illimité.

<a id="automationproxysocketio_test"></a>

## automation.proxy.socketio_test

Tester une connexion Socket.IO, protocole v4

**Méthodes**: POST
**Voie**: `/api/v1/automation/proxy/socketio_test`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `url` | string | Obligatoire | Adresse d’un serveur Socket.IO v4. | Aucune valeur par défaut |
| `event` | string | Facultatif | Nom de l'événement cible. | Premier événement |
| `timeout_ms` | integer | Facultatif | Délai d’attente de connexion et d’événement, en millisecondes. | 10000 |
| `json_path` | string | Facultatif | Chemin d’extraction des données de l’événement. | Données complètes |

### Exemple de requête

```json
{
  "url": "https://example.com",
  "event": "status"
}
```

### Réponse et confirmation de fin

data.connected/sid/event/data, éventuellement value/path/path_error/error.

### Notes d'utilisation

Utilise Socket.IO, et non WebSocket seul ; se connecte à un service distant réel.

<a id="automationproxywebsocket_test"></a>

## automation.proxy.websocket_test

Tester la connexion WebSocket

**Méthodes**: POST
**Voie**: `/api/v1/automation/proxy/websocket_test`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `uri` | string | Obligatoire | Destination ws:// ou wss://. | Aucune valeur par défaut |
| `timeout_ms` | integer | Facultatif | Délai d’attente de connexion et de réception des données, en millisecondes. | 10000 |
| `subscribe` | string | Facultatif | Texte d'abonnement à envoyer après la connexion. | Ne rien envoyer |
| `json_path` | string | Facultatif | Chemin d’extraction JSON dans la réponse. | Message complet |

### Exemple de requête

```json
{
  "uri": "wss://example.com/events",
  "timeout_ms": 10000
}
```

### Réponse et confirmation de fin

data.connected/message, éventuellement value/path/path_error/error.

### Notes d'utilisation

Établit une connexion et peut envoyer du texte. Un test ne constitue pas un abonnement permanent.

<a id="automationreload"></a>

## automation.reload

Recharger la configuration

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/reload`
**Accès minimum**: ROOT

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

Résultat de configuration contenant active_version/source/loaded/configured/enabled/paused/saved/uncertain et l’emplacement de l’erreur. Consultez le modèle complet de résultat de configuration.

### Notes d'utilisation

L’état du moteur, les actions non terminées ou le stockage peuvent entraîner le rejet d’une requête. L’expiration du délai d’arrêt ne prouve pas que toutes les actions sont terminées.

<a id="automationresume"></a>

## automation.resume

Reprendre le moteur d'automatisation

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/resume`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

code=0/message indique une réussite. Lisez automation.status pour vérifier l’état d’exécution.

### Notes d'utilisation

L’état du moteur, les actions non terminées ou le stockage peuvent entraîner le rejet d’une requête. L’expiration du délai d’arrêt ne prouve pas que toutes les actions sont terminées.

<a id="automationrulesadd"></a>

## automation.rules.add

Ajouter une nouvelle règle

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/rules/add`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |
| `expected_revision` | integer | Facultatif | Révision d’origine de la règle ; transmettez la dernière valeur lue pour la mise à jour. | Pas nécessaire pour la création |

Consultez le [modèle de données commun](../configuration-models.md#automation-rules).

### Exemple de requête

```json
{
  "id": "example-rule",
  "name": "Temperature example",
  "enabled": false,
  "logic": "and",
  "conditions": [
    {
      "variable": "example.temperature",
      "operator": "gt",
      "value": 50
    }
  ],
  "actions": [
    {
      "type": "log",
      "level": 3,
      "message": "Temperature high"
    }
  ],
  "cooldown_ms": 10000,
  "active_version": "CURRENT_VERSION"
}
```

### Réponse et confirmation de fin

Résultat de configuration contenant active_version/source/loaded/configured/enabled/paused/saved/uncertain et l’emplacement de l’erreur. Consultez le modèle complet de résultat de configuration.

### Notes d'utilisation

L’enregistrement et le déclenchement sont distincts. Ne remplacez pas des règles complètes à partir de vues filtrées.

<a id="automationrulesdelete"></a>

## automation.rules.delete

Supprimer une règle

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/rules/delete`
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

Consultez le [modèle de données commun](../configuration-models.md#automation-rules).

### Exemple de requête

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### Réponse et confirmation de fin

Modèle de résultat de configuration, éventuellement accompagné de impact.

<a id="automationrulesdisable"></a>

## automation.rules.disable

Désactiver une règle

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/rules/disable`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |
| `expected_revision` | integer | Facultatif | Révision actuelle de la règle. | Recommandation |

Consultez le [modèle de données commun](../configuration-models.md#automation-rules).

### Exemple de requête

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION"
}
```

### Réponse et confirmation de fin

Résultat de configuration contenant active_version/source/loaded/configured/enabled/paused/saved/uncertain et l’emplacement de l’erreur. Consultez le modèle complet de résultat de configuration.

<a id="automationrulesenable"></a>

## automation.rules.enable

Activer une règle

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/rules/enable`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |
| `expected_revision` | integer | Facultatif | Révision actuelle de la règle. | Recommandation |

Consultez le [modèle de données commun](../configuration-models.md#automation-rules).

### Exemple de requête

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION"
}
```

### Réponse et confirmation de fin

Résultat de configuration contenant active_version/source/loaded/configured/enabled/paused/saved/uncertain et l’emplacement de l’erreur. Consultez le modèle complet de résultat de configuration.

<a id="automationrulesexport"></a>

## automation.rules.export

Exporter une règle en paquet de configuration (.tscfg)

**Méthodes**: POST
**Voie**: `/api/v1/automation/rules/export`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `recipient_cert` | string | Facultatif | Certificat PEM du destinataire ; en cas d’omission, le paquet est chiffré pour cet appareil. | Certificat de cet appareil |

Consultez le [modèle de données commun](../configuration-models.md#automation-rules).

### Exemple de requête

```json
{
  "id": "example-rule"
}
```

### Réponse et confirmation de fin

data.tscfg/filename ; le paquet contient les données d’entrée de configuration de la règle.

<a id="automationrulesget"></a>

## automation.rules.get

Obtenez les détails de la règle par ID

**Méthodes**: GET / POST
**Voie**: `/api/v1/automation/rules/get`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../configuration-models.md#automation-rules).

### Exemple de requête

```json
{
  "id": "example-rule"
}
```

### Réponse et confirmation de fin

Définition de la règle, révision actuelle et statistiques d’exécution ; les rôles inférieurs à ADMIN ne reçoivent pas l’intégralité de conditions/actions.

<a id="automationrulesimport"></a>

## automation.rules.import

Importer une règle depuis un paquet de configuration

**Méthodes**: POST
**Voie**: `/api/v1/automation/rules/import`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `tscfg` | string | Obligatoire | Texte JSON du paquet. | Aucune valeur par défaut |
| `preview` | boolean | Facultatif | Mode aperçu ou application. | false |
| `active_version` | string | Obligatoire pour l’application | Version de configuration actuelle. | Aucune valeur par défaut |
| `overwrite` | boolean | Facultatif | Remplacer les règles portant le même identifiant. | false |
| `expected_revision` | integer | Obligatoire pour l’application | Révision de la règle renvoyée par l’aperçu. | Aucune valeur par défaut |
| `expected_generation` | integer | Obligatoire pour l’application | Version de la règle renvoyée par l’aperçu. | Aucune valeur par défaut |
| `credential_generation` | integer | Obligatoire pour l’application | Version du certificat ou des données d’authentification renvoyée par l’aperçu. | Aucune valeur par défaut |
| `package_digest` | string | Obligatoire pour l’application | Empreinte du paquet renvoyée par l’aperçu. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../configuration-models.md#automation-rules).

### Exemple de requête

```json
{
  "tscfg": "PACKAGE_JSON_TEXT",
  "preview": true
}
```

### Réponse et confirmation de fin

Résultats d’aperçu ou d’application, versions et empreintes. L’application confirme que les conditions de l’aperçu sont toujours satisfaites.

### Notes d'utilisation

Objet JSON complet dans le corps uniquement, sans paramètres dans l’URL. Les champs de confirmation diffèrent des autres imports ; n’utilisez pas expected_credential/expected_digest ici.

<a id="automationruleslist"></a>

## automation.rules.list

Lister toutes les règles

**Méthodes**: GET / POST
**Voie**: `/api/v1/automation/rules/list`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

Consultez le [modèle de données commun](../configuration-models.md#automation-rules).

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.rules/count/active_version/loaded/paused/load_error/recovery_required/invalid_items/restart_required. Les entrées comprennent l’identifiant, l’activation, la révision et les statistiques d’exécution. Les informations accessibles aux rôles inférieurs à ADMIN sont limitées.

<a id="automationrulestrigger"></a>

## automation.rules.trigger

Déclencher manuellement une règle

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/rules/trigger`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION"
}
```

### Réponse et confirmation de fin

Résultat du déclenchement ou raison du rejet. Vérifiez l’état de l’action ou du service pour confirmer la fin de l’opération.

### Notes d'utilisation

Produit des effets réels. Le délai de réarmement, la suspension, les conditions ou l’état d’exécution peuvent empêcher le déclenchement.

<a id="automationrulesupdate"></a>

## automation.rules.update

Modifier une règle avec sa révision attendue

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/rules/update`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |
| `expected_revision` | integer | Facultatif | Révision d’origine de la règle ; transmettez la dernière valeur lue pour la mise à jour. | Pas nécessaire pour la création |

Consultez le [modèle de données commun](../configuration-models.md#automation-rules).

### Exemple de requête

```json
{
  "id": "example-rule",
  "name": "Temperature example",
  "enabled": false,
  "logic": "and",
  "conditions": [
    {
      "variable": "example.temperature",
      "operator": "gt",
      "value": 50
    }
  ],
  "actions": [
    {
      "type": "log",
      "level": 3,
      "message": "Temperature high"
    }
  ],
  "cooldown_ms": 10000,
  "active_version": "CURRENT_VERSION"
}
```

### Réponse et confirmation de fin

Résultat de configuration contenant active_version/source/loaded/configured/enabled/paused/saved/uncertain et l’emplacement de l’erreur. Consultez le modèle complet de résultat de configuration.

### Notes d'utilisation

L’enregistrement et le déclenchement sont distincts. Ne remplacez pas des règles complètes à partir de vues filtrées.

<a id="automationserviceslist"></a>

## automation.services.list

Lister les commandes indépendantes de services distants

**Méthodes**: GET / POST
**Voie**: `/api/v1/automation/services/list`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.items avec run_id/command_id/rule_id/source/name/state/current/last_known et état de l'opération.

### Notes d'utilisation

Les enregistrements conservés ne prouvent pas qu’un processus distant existe encore. Demandez explicitement une vérification lorsque nécessaire.

<a id="automationservicesstatus"></a>

## automation.services.status

Confirmer l'état du processus distant géré

**Méthodes**: GET / POST
**Voie**: `/api/v1/automation/services/status`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `run_id` | string | Obligatoire | Identifiant d’exécution provenant de la réponse de démarrage ou de la liste des services. | Aucune valeur par défaut |
| `verify` | boolean | Facultatif | Connectez-vous à l'hôte d'origine pour vérifier l'état. | Traitement propre à chaque opération |

### Exemple de requête

```json
{
  "run_id": "YOUR_RUN_ID",
  "verify": true
}
```

### Réponse et confirmation de fin

data.run_id/state/source/last_known/confirmed_ms/generation/busy,operation_id/operation_phase/operation_kind/operation_reason/operation_error.

### Notes d'utilisation

Continuez à interroger les opérations occupées ou en cours. L’arrêt utilise l’identité vérifiée du processus d’origine, et non une suppression arbitraire fondée sur son nom.

<a id="automationservicesstop"></a>

## automation.services.stop

Arrêter le processus distant géré vérifié

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/services/stop`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `run_id` | string | Obligatoire | Identifiant d’exécution provenant de la réponse de démarrage ou de la liste des services. | Aucune valeur par défaut |
| `verify` | boolean | Facultatif | Connectez-vous à l'hôte d'origine pour vérifier l'état. | Traitement propre à chaque opération |

### Exemple de requête

```json
{
  "run_id": "YOUR_RUN_ID",
  "verify": true
}
```

### Réponse et confirmation de fin

data.run_id/state/source/last_known/confirmed_ms/generation/busy,operation_id/operation_phase/operation_kind/operation_reason/operation_error.

### Notes d'utilisation

Continuez à interroger les opérations occupées ou en cours. L’arrêt utilise l’identité vérifiée du processus d’origine, et non une suppression arbitraire fondée sur son nom.

<a id="automationsourcesadd"></a>

## automation.sources.add

Ajouter une nouvelle source de données

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/sources/add`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../configuration-models.md#data-sources).

### Exemple de requête

```json
{
  "id": "example-source",
  "label": "Temperature",
  "type": "rest",
  "enabled": false,
  "poll_interval_ms": 5000,
  "rest_url": "https://example.com/status",
  "rest_method": "GET",
  "auto_discover": false,
  "mappings": [
    {
      "path": "temperature",
      "var": "compute.temperature"
    }
  ],
  "active_version": "CURRENT_VERSION"
}
```

### Réponse et confirmation de fin

Résultat de configuration contenant active_version/source/loaded/configured/enabled/paused/saved/uncertain et l’emplacement de l’erreur. Consultez le modèle complet de résultat de configuration.

### Notes d'utilisation

L’ajout nécessite un identifiant inutilisé ; la modification nécessite un objet existant. Consultez les exemples complets des modèles.

<a id="automationsourcesadd_mapping"></a>

## automation.sources.add_mapping

Ajouter une correspondance de champ à une source de données existante

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/sources/add_mapping`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |
| `json_path` | string | Obligatoire | Chemin du champ de données à extraire. | Aucune valeur par défaut |
| `var_name` | string | Obligatoire | Nom de la variable de destination. | Aucune valeur par défaut |
| `transform` | string | Facultatif | Expression de transformation facultative. | Aucune |

Consultez le [modèle de données commun](../configuration-models.md#data-sources).

### Exemple de requête

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION",
  "json_path": "temperature",
  "var_name": "compute.temperature"
}
```

### Réponse et confirmation de fin

Modèle de résultat de configuration, accompagné de source_id/mapping_count/mapping_index.

<a id="automationsourcesdelete"></a>

## automation.sources.delete

Supprimer une source de données

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/sources/delete`
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

Consultez le [modèle de données commun](../configuration-models.md#data-sources).

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

<a id="automationsourcesdisable"></a>

## automation.sources.disable

Désactiver une source de données

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/sources/disable`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../configuration-models.md#data-sources).

### Exemple de requête

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION"
}
```

### Réponse et confirmation de fin

Résultat de configuration contenant active_version/source/loaded/configured/enabled/paused/saved/uncertain et l’emplacement de l’erreur. Consultez le modèle complet de résultat de configuration.

<a id="automationsourcesenable"></a>

## automation.sources.enable

Activer une source de données

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/sources/enable`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../configuration-models.md#data-sources).

### Exemple de requête

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION"
}
```

### Réponse et confirmation de fin

Résultat de configuration contenant active_version/source/loaded/configured/enabled/paused/saved/uncertain et l’emplacement de l’erreur. Consultez le modèle complet de résultat de configuration.

<a id="automationsourcesexport"></a>

## automation.sources.export

Exporter une source de données en paquet de configuration (.tscfg)

**Méthodes**: POST
**Voie**: `/api/v1/automation/sources/export`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `recipient_cert` | string | Facultatif | Certificat PEM du destinataire ; en cas d’omission, le paquet est chiffré pour cet appareil. | Certificat de cet appareil |

Consultez le [modèle de données commun](../configuration-models.md#data-sources).

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

<a id="automationsourcesimport"></a>

## automation.sources.import

Importer une source de données depuis un paquet de configuration

**Méthodes**: POST
**Voie**: `/api/v1/automation/sources/import`
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

Consultez le [modèle de données commun](../configuration-models.md#data-sources).

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

<a id="automationsourceslist"></a>

## automation.sources.list

Lister toutes les sources de données

**Méthodes**: GET / POST
**Voie**: `/api/v1/automation/sources/list`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `offset` | integer | Facultatif | Décalage de retour non négatif. | 0 |
| `limit` | integer | Facultatif | Nombre d’éléments à renvoyer ; omettre ce paramètre ne demande pas de troncature. | Tous |

Consultez le [modèle de données commun](../configuration-models.md#data-sources).

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.sources/count/total/active_version/load_error/paused ; les rôles autres que root reçoivent des métadonnées restreintes.

<a id="automationsourcesremove_mapping"></a>

## automation.sources.remove_mapping

Supprimer une correspondance de champ dans une source de données

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/sources/remove_mapping`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |
| `index` | integer | Une autre option de sélection | Indice de mappage non négatif. | Aucune |
| `json_path` | string | Une autre option de sélection | Chemin d’un champ existant. | Aucune |
| `var_name` | string | Une autre option de sélection | Nom de la variable existante. | Aucune |

Consultez le [modèle de données commun](../configuration-models.md#data-sources).

### Exemple de requête

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION",
  "index": 0
}
```

### Réponse et confirmation de fin

Modèle de résultat de configuration, accompagné de source_id/mapping_count.

<a id="automationsourcesupdate"></a>

## automation.sources.update

Mettre à jour une source de données existante

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/sources/update`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `id` | string | Obligatoire | Identifiant stable de l’objet ; conservez l’identifiant existant après lecture. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../configuration-models.md#data-sources).

### Exemple de requête

```json
{
  "id": "example-source",
  "label": "Temperature",
  "type": "rest",
  "enabled": false,
  "poll_interval_ms": 5000,
  "rest_url": "https://example.com/status",
  "rest_method": "GET",
  "auto_discover": false,
  "mappings": [
    {
      "path": "temperature",
      "var": "compute.temperature"
    }
  ],
  "active_version": "CURRENT_VERSION"
}
```

### Réponse et confirmation de fin

Résultat de configuration contenant active_version/source/loaded/configured/enabled/paused/saved/uncertain et l’emplacement de l’erreur. Consultez le modèle complet de résultat de configuration.

### Notes d'utilisation

L’ajout nécessite un identifiant inutilisé ; la modification nécessite un objet existant. Consultez les exemples complets des modèles.

<a id="automationstart"></a>

## automation.start

Démarrer le moteur d’automatisation

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/start`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

code=0/message indique une réussite. Lisez automation.status pour vérifier l’état d’exécution.

### Notes d'utilisation

L’état du moteur, les actions non terminées ou le stockage peuvent entraîner le rejet d’une requête. L’expiration du délai d’arrêt ne prouve pas que toutes les actions sont terminées.

<a id="automationstatus"></a>

## automation.status

Obtenir l'état du moteur d'automatisation

**Méthodes**: GET / POST
**Voie**: `/api/v1/automation/status`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data contient l’état du moteur, les compteurs, la source de configuration et les informations de démarrage automatique, selon l’état du moteur.

<a id="automationstop"></a>

## automation.stop

Arrêter le moteur d’automatisation

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/stop`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

code=0/message indique une réussite. Lisez automation.status pour vérifier l’état d’exécution.

### Notes d'utilisation

L’état du moteur, les actions non terminées ou le stockage peuvent entraîner le rejet d’une requête. L’expiration du délai d’arrêt ne prouve pas que toutes les actions sont terminées.

<a id="automationtestdevice"></a>

## automation.test.device

Tester une action de commande de périphérique

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/test/device`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `device` | string | Obligatoire | agx ou lpmu. | Aucune valeur par défaut |
| `action` | string | Obligatoire | Action d’alimentation ou de réinitialisation prise en charge par la cible. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "device": "agx",
  "action": "on"
}
```

### Réponse et confirmation de fin

code=0/message indique la réussite de l’appel de commande. Relisez ensuite device.status.

### Notes d'utilisation

Commande l’ordinateur cible réel.

<a id="automationtestgpio"></a>

## automation.test.gpio

Tester une action GPIO

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/test/gpio`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `pin` | integer | Obligatoire | Numéro d’une broche prise en charge. | Aucune valeur par défaut |
| `level` | boolean | Obligatoire | true correspond au niveau haut, false au niveau bas. | Aucune valeur par défaut |
| `pulse_ms` | integer | Facultatif | Durée d’impulsion en millisecondes ; 0 signifie qu’aucune impulsion temporisée n’est demandée. | 0 |

### Exemple de requête

```json
{
  "pin": 1,
  "level": false,
  "pulse_ms": 0
}
```

### Réponse et confirmation de fin

code=0/message indique la réussite de l’appel d’action. Lisez séparément l’état de la broche cible.

### Notes d'utilisation

Commande des broches matérielles. Vérifiez d’abord leur fonction.

<a id="automationtestled"></a>

## automation.test.led

Tester une action LED

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/test/led`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `device` | string | Obligatoire | Périphérique LED cible. | Aucune valeur par défaut |
| `index` | integer | Facultatif | Indice LED. | 0 |
| `r` | integer | Facultatif | Composant rouge, 0-255. | 0 |
| `g` | integer | Facultatif | Composante verte, 0-255. | 0 |
| `b` | integer | Facultatif | Composante bleue, 0-255. | 0 |

### Exemple de requête

```json
{
  "device": "board",
  "r": 0,
  "g": 64,
  "b": 128
}
```

### Réponse et confirmation de fin

Résultat de l’exécution de l’action dans data.

### Notes d'utilisation

Malgré la présence de test dans son nom, cette opération modifie l’appareil.

<a id="automationtestssh"></a>

## automation.test.ssh

Tester l’exécution d’une commande SSH

**Méthodes**: POST
**Voie**: `/api/v1/automation/test/ssh`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `host_id` | string | Obligatoire | Identifiant de configuration d’un hôte SSH enregistré. | Aucune valeur par défaut |
| `command` | string | Obligatoire | Commande distante. | Aucune valeur par défaut |
| `timeout_ms` | integer | Facultatif | Délai maximal en millisecondes. | 30000 |

### Exemple de requête

```json
{
  "host_id": "example-host",
  "command": "uname -a",
  "timeout_ms": 30000
}
```

### Réponse et confirmation de fin

Résultat d’exécution distante ; vérifiez le code de sortie et la sortie.

### Notes d'utilisation

Établit une connexion et exécute l’opération ; ne se limite pas à une vérification syntaxique.

<a id="automationvariablesdelete"></a>

## automation.variables.delete

Supprimer une variable utilisateur enregistrée

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/variables/delete`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `name` | string | Obligatoire | Nom de la variable utilisateur. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |
| `preview` | boolean | Facultatif | Prévisualiser uniquement l’impact sur les références. | false |
| `force` | boolean | Facultatif | Demander une suppression forcée après confirmation de l'impact. | false |
| `pause_automation` | boolean | Facultatif | Suspendre l’automatisation avant le traitement. | false |

Consultez le [modèle de données commun](../response-models.md#variable).

### Exemple de requête

```json
{
  "name": "example.temperature",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### Réponse et confirmation de fin

Modèle de résultat de configuration, éventuellement accompagné de impact.

<a id="automationvariablesget"></a>

## automation.variables.get

Obtenez une valeur variable

**Méthodes**: GET / POST
**Voie**: `/api/v1/automation/variables/get`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `name` | string | Obligatoire | Nom complet de la variable. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../response-models.md#variable).

### Exemple de requête

```json
{
  "name": "compute.temperature"
}
```

### Réponse et confirmation de fin

data contient la valeur et le type de la variable, source, readonly et les métadonnées de mise à jour.

<a id="automationvariableslist"></a>

## automation.variables.list

Lister toutes les variables

**Méthodes**: GET / POST
**Voie**: `/api/v1/automation/variables/list`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `configured_only` | boolean | Facultatif | Lister uniquement les définitions de variables utilisateur enregistrées. | false |
| `prefix` | string | Facultatif | Filtre par préfixe du nom de variable. | Aucune |
| `source_id` | string | Facultatif | Filtrer par identifiant de source. | Aucune |
| `include_value` | boolean | Facultatif | Inclure les valeurs des variables. | true |
| `include_meta` | boolean | Facultatif | Inclure les horodatages, source, readonly et les autres métadonnées. | true |

Consultez le [modèle de données commun](../response-models.md#variable).

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.variables/count. include_value contrôle l’inclusion des valeurs ; include_meta celle de time, source, readonly et des métadonnées associées.

<a id="automationvariablesset"></a>

## automation.variables.set

Définir la valeur d’une variable

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/automation/variables/set`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `name` | string | Obligatoire | Nom de la variable utilisateur. | Aucune valeur par défaut |
| `active_version` | string | Obligatoire | Dernière valeur active_version de l’état de configuration ; relisez-la après les modifications. | Aucune valeur par défaut |
| `value` | boolean / number / string / null | Obligatoire | Valeur à enregistrer ; ne remplacez pas les températures numériques par des tableaux ou des objets. | Aucune valeur par défaut |
| `create_only` | boolean | Facultatif | Retourne une valeur existante sans l'écraser. | false |
| `source_id` | string | Facultatif | Identificateur de la source. | user |
| `value_type` | integer | Facultatif | Identifiant de type facultatif ; normalement déduit de value. | Déduit de value |

Consultez le [modèle de données commun](../response-models.md#variable).

### Exemple de requête

```json
{
  "name": "example.temperature",
  "value": 42.5,
  "active_version": "CURRENT_VERSION"
}
```

### Réponse et confirmation de fin

Modèle de résultat de configuration, accompagné de name/created/value.

### Notes d'utilisation

Les variables en lecture seule ou issues de sources système peuvent refuser les modifications. Ce modèle de valeur simplifié ne comprend pas les tableaux et les objets.
