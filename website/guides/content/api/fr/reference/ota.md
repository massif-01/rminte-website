# API : Mise à jour et récupération

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [ota.abort](#otaabort) | Demander l'annulation de la mise à jour du firmware |
| [ota.partitions](#otapartitions) | Inspecter les partitions de mise à jour |
| [ota.progress](#otaprogress) | Lire la progression de la mise à jour du micrologiciel |
| [ota.rollback](#otarollback) | Revenir à la version précédente du micrologiciel |
| [ota.server.get](#otaserverget) | Lire la configuration du serveur de mise à jour |
| [ota.server.set](#otaserverset) | Définir la configuration du serveur de mise à jour |
| [ota.start_file](#otastart_file) | Démarrer la mise à jour du micrologiciel depuis la carte SD |
| [ota.start_url](#otastart_url) | Démarrer la mise à jour du micrologiciel depuis une URL |
| [ota.status](#otastatus) | Lire l’état de la mise à jour du micrologiciel |
| [ota.test_connection](#otatest_connection) | Tester une URL de mise à jour |
| [ota.upgrade_file](#otaupgrade_file) | Alias de compatibilité de ota.start_file |
| [ota.upgrade_url](#otaupgrade_url) | Alias de compatibilité de ota.start_url |
| [ota.upload_abort](#otaupload_abort) | Annuler le contrôle d’envoi du micrologiciel |
| [ota.upload_begin](#otaupload_begin) | Commencer le contrôle d’envoi du micrologiciel |
| [ota.upload_end](#otaupload_end) | Terminer le contrôle d’envoi du micrologiciel |
| [ota.validate](#otavalidate) | Confirmer le bon fonctionnement du micrologiciel en cours d’exécution |
| [ota.version](#otaversion) | Lire la version du micrologiciel |
| [ota.www.abort](#otawwwabort) | Demander l'annulation de la mise à jour de WWW |
| [ota.www.progress](#otawwwprogress) | Lire la progression de la mise à jour WWW |
| [ota.www.start](#otawwwstart) | Démarrer la mise à jour WWW à partir d'une URL |
| [ota.www.start_sdcard](#otawwwstart_sdcard) | Démarrer la mise à jour WWW depuis la carte SD |

<a id="otaabort"></a>

## ota.abort

Demander l'annulation de la mise à jour du firmware

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ota/abort`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.aborted=true ; consultez la progression correspondante pour confirmer l’état.

### Notes d'utilisation

Agit sur la mise à jour en cours, et non sur une tâche privée. Ne lancez pas immédiatement une autre mise à jour tant que l’état reste incertain.

<a id="otapartitions"></a>

## ota.partitions

Inspecter les partitions de mise à jour

**Méthodes**: GET / POST
**Voie**: `/api/v1/ota/partitions`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.running/next contiennent chacun label/address/size/is_bootable ; les partitions amorçables incluent version/project. can_rollback est également présent.

<a id="otaprogress"></a>

## ota.progress

Lire la progression de la mise à jour du micrologiciel

**Méthodes**: GET / POST
**Voie**: `/api/v1/ota/progress`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

Consultez le [modèle de données commun](../response-models.md#ota).

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.state/percent/total_size/received_size/message. state vaut idle/checking/downloading/verifying/writing/pending_reboot/error.

### Notes d'utilisation

Il s’agit de la progression globale de l’appareil, et non du résultat d’une tâche propre à une session. Interrogez-la après le démarrage. Une progression de 100 % ne prouve pas à elle seule que l’appareil exécute la nouvelle version.

<a id="otarollback"></a>

## ota.rollback

Revenir à la version précédente du micrologiciel

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ota/rollback`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

Consultez le [modèle de données commun](../response-models.md#ota).

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

Tente de sélectionner la partition de retour arrière puis de redémarrer ; la connexion peut se fermer avant la réponse. Si une réponse est renvoyée, elle contient data.rolling_back=true.

### Notes d'utilisation

Vérifiez d’abord ota.partitions.can_rollback. Après le retour arrière, reconnectez-vous et vérifiez la compatibilité de la version et de la configuration. no_reboot n’est pas pris en charge.

<a id="otaserverget"></a>

## ota.server.get

Lire la configuration du serveur de mise à jour

**Méthodes**: GET / POST
**Voie**: `/api/v1/ota/server/get`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

ADMIN peut lire data.url/configured ; les rôles inférieurs reçoivent uniquement configured.

<a id="otaserverset"></a>

## ota.server.set

Définir la configuration du serveur de mise à jour

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ota/server/set`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `url` | string | Obligatoire | URL du serveur de mise à jour, 255 caractères au maximum ; une chaîne vide l’efface. | Aucune valeur par défaut |
| `save` | boolean | Facultatif | Enregistrer durablement l’adresse du serveur. | false |

### Exemple de requête

```json
{
  "url": "http://updates.example.com/firmware.bin",
  "save": true
}
```

### Réponse et confirmation de fin

data.url/saved.

### Notes d'utilisation

Définir l’adresse ne lance pas de mise à jour. L’URL WWW peut être déduite de cette adresse.

<a id="otastart_file"></a>

## ota.start_file

Démarrer la mise à jour du micrologiciel depuis la carte SD

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ota/start_file`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `file` | string | file ou path requis | Chemin absolu du fichier de micrologiciel ; préférez le paramètre file. | Aucune valeur par défaut |
| `path` | string | Facultatif | Alias du paramètre file. | Non fourni |
| `auto_reboot` | boolean | Facultatif | Redémarrer automatiquement à la fin de la mise à jour du micrologiciel. | true |
| `no_reboot` | boolean | Facultatif | Alias inverse de auto_reboot; le remplace lorsqu'il est fourni. | Ne pas remplacer |
| `allow_downgrade` | boolean | Facultatif | Autorise une version plus ancienne ; la validation des images reste applicable. | false |
| `skip_verify` | boolean | Facultatif | Option de compatibilité pour les fichiers SD. Aucune connexion TLS n’est utilisée ; cette option ne contourne pas les contrôles d’intégrité complète du micrologiciel. | false |

Consultez le [modèle de données commun](../response-models.md#ota).

### Exemple de requête

```json
{
  "file": "/sdcard/firmware.bin",
  "no_reboot": true
}
```

### Réponse et confirmation de fin

data.started/path.

### Notes d'utilisation

La réussite du démarrage signifie que la demande a commencé. Lisez ota.progress et vérifiez ota.status après redémarrage. Utilisez une image complète adaptée au matériel et à son organisation des partitions.

<a id="otastart_url"></a>

## ota.start_url

Démarrer la mise à jour du micrologiciel depuis une URL

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ota/start_url`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `url` | string | Obligatoire | URL HTTP ou HTTPS de l’image complète du micrologiciel, 2048 octets au maximum. | Aucune valeur par défaut |
| `auto_reboot` | boolean | Facultatif | Redémarrer automatiquement à la fin de la mise à jour du micrologiciel. | true |
| `no_reboot` | boolean | Facultatif | Alias inverse de auto_reboot; le remplace lorsqu'il est fourni. | Ne pas remplacer |
| `allow_downgrade` | boolean | Facultatif | Autorise une version plus ancienne ; la validation des images reste applicable. | false |
| `skip_verify` | boolean | Facultatif | Demande un assouplissement des contrôles du serveur HTTPS, selon les réglages TLS du micrologiciel ; la connexion peut encore échouer. Les contrôles d’intégrité complète de l’image restent actifs. Conservez normalement false. | false |

Consultez le [modèle de données commun](../response-models.md#ota).

### Exemple de requête

```json
{
  "url": "http://updates.example.com/firmware.bin",
  "no_reboot": true
}
```

### Réponse et confirmation de fin

data.started/url.

### Notes d'utilisation

La réussite du démarrage signifie que la demande a commencé. Lisez ota.progress et vérifiez ota.status après redémarrage. Utilisez une image complète adaptée au matériel et à son organisation des partitions.

<a id="otastatus"></a>

## ota.status

Lire l’état de la mise à jour du micrologiciel

**Méthodes**: GET / POST
**Voie**: `/api/v1/ota/status`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.state/running/next/pending_verify ; rollback_timeout en attente de vérification. Les partitions contiennent label/address/size et les informations de version disponibles.

### Notes d'utilisation

size est en octets. Après l’écriture, redémarrez et confirmez la version en cours d’exécution.

<a id="otatest_connection"></a>

## ota.test_connection

Tester une URL de mise à jour

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ota/test_connection`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `url` | string | Obligatoire | URL du fichier de mise à jour à tester. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "url": "http://updates.example.com/firmware.bin"
}
```

### Réponse et confirmation de fin

data contient success et les diagnostics de connexion.

### Notes d'utilisation

Effectue une requête réseau réelle. Une connexion réussie ne prouve pas que l’image peut être installée.

<a id="otaupgrade_file"></a>

## ota.upgrade_file

Alias de compatibilité de ota.start_file

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ota/upgrade_file`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `file` | string | file ou path requis | Chemin absolu du fichier de micrologiciel ; préférez le paramètre file. | Aucune valeur par défaut |
| `path` | string | Facultatif | Alias du paramètre file. | Non fourni |
| `auto_reboot` | boolean | Facultatif | Redémarrer automatiquement à la fin de la mise à jour du micrologiciel. | true |
| `no_reboot` | boolean | Facultatif | Alias inverse de auto_reboot; le remplace lorsqu'il est fourni. | Ne pas remplacer |
| `allow_downgrade` | boolean | Facultatif | Autorise une version plus ancienne ; la validation des images reste applicable. | false |
| `skip_verify` | boolean | Facultatif | Option de compatibilité pour les fichiers SD. Aucune connexion TLS n’est utilisée ; cette option ne contourne pas les contrôles d’intégrité complète du micrologiciel. | false |

Consultez le [modèle de données commun](../response-models.md#ota).

### Exemple de requête

```json
{
  "file": "/sdcard/firmware.bin",
  "no_reboot": true
}
```

### Réponse et confirmation de fin

data.started/path.

### Notes d'utilisation

Alias de compatibilité ayant les mêmes paramètres, droits et résultats que ota.start_file.

<a id="otaupgrade_url"></a>

## ota.upgrade_url

Alias de compatibilité de ota.start_url

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ota/upgrade_url`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `url` | string | Obligatoire | URL HTTP ou HTTPS de l’image complète du micrologiciel, 2048 octets au maximum. | Aucune valeur par défaut |
| `auto_reboot` | boolean | Facultatif | Redémarrer automatiquement à la fin de la mise à jour du micrologiciel. | true |
| `no_reboot` | boolean | Facultatif | Alias inverse de auto_reboot; le remplace lorsqu'il est fourni. | Ne pas remplacer |
| `allow_downgrade` | boolean | Facultatif | Autorise une version plus ancienne ; la validation des images reste applicable. | false |
| `skip_verify` | boolean | Facultatif | Demande un assouplissement des contrôles du serveur HTTPS, selon les réglages TLS du micrologiciel ; la connexion peut encore échouer. Les contrôles d’intégrité complète de l’image restent actifs. Conservez normalement false. | false |

Consultez le [modèle de données commun](../response-models.md#ota).

### Exemple de requête

```json
{
  "url": "http://updates.example.com/firmware.bin",
  "no_reboot": true
}
```

### Réponse et confirmation de fin

data.started/url.

### Notes d'utilisation

Alias de compatibilité ayant les mêmes paramètres, droits et résultats que ota.start_url.

<a id="otaupload_abort"></a>

## ota.upload_abort

Annuler le contrôle d’envoi du micrologiciel

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ota/upload_abort`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.aborted.

<a id="otaupload_begin"></a>

## ota.upload_begin

Commencer le contrôle d’envoi du micrologiciel

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ota/upload_begin`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `size` | integer | Obligatoire | Taille totale du micrologiciel, en octets, strictement positive et limitée aussi par la partition cible. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "size": 1048576
}
```

### Réponse et confirmation de fin

data.ready/expected_size.

### Notes d'utilisation

Cette interface contrôle un envoi. Aucune API publique upload_write n’est fournie pour les données ; begin/end seuls ne peuvent donc pas transférer le micrologiciel. Les intégrations ordinaires doivent utiliser la route binaire d’envoi du fichier complet.

<a id="otaupload_end"></a>

## ota.upload_end

Terminer le contrôle d’envoi du micrologiciel

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ota/upload_end`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `auto_reboot` | boolean | Facultatif | Redémarrer automatiquement à la fin de l’opération. | true |

### Exemple de requête

```json
{
  "auto_reboot": false
}
```

### Réponse et confirmation de fin

data.completed/reboot_pending.

### Notes d'utilisation

Nécessite un envoi actif dont toutes les données ont été reçues. Échoue si aucun envoi n’est actif.

<a id="otavalidate"></a>

## ota.validate

Confirmer le bon fonctionnement du micrologiciel en cours d’exécution

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ota/validate`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.validated.

### Notes d'utilisation

La confirmation modifie l’état du retour arrière. Vérifiez d’abord la version en cours d’exécution et le bon fonctionnement de l’application.

<a id="otaversion"></a>

## ota.version

Lire la version du micrologiciel

**Méthodes**: GET / POST
**Voie**: `/api/v1/ota/version`
**Accès minimum**: Public

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.version/project/compile_date/compile_time/idf_version.

<a id="otawwwabort"></a>

## ota.www.abort

Demander l'annulation de la mise à jour de WWW

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ota/www/abort`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.aborted=true ; consultez la progression correspondante pour confirmer l’état.

### Notes d'utilisation

Agit sur la mise à jour en cours, et non sur une tâche privée. Ne lancez pas immédiatement une autre mise à jour tant que l’état reste incertain.

<a id="otawwwprogress"></a>

## ota.www.progress

Lire la progression de la mise à jour WWW

**Méthodes**: GET / POST
**Voie**: `/api/v1/ota/www/progress`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

Consultez le [modèle de données commun](../response-models.md#ota).

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.state/percent/total/received/message/running. La fin de l’opération est indiquée par state=completed et running=false.

### Notes d'utilisation

Il s’agit de la progression globale de l’appareil, et non du résultat d’une tâche propre à une session. Interrogez-la après le démarrage. Une progression de 100 % ne prouve pas à elle seule que l’appareil exécute la nouvelle version.

<a id="otawwwstart"></a>

## ota.www.start

Démarrer la mise à jour WWW à partir d'une URL

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ota/www/start`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `url` | string | Facultatif | URL HTTP ou HTTPS de www.bin. Limitez l’URL complète à 255 octets ; une valeur plus longue risque de ne pas être conservée intégralement. | Déduit du serveur de mise à jour configuré |
| `skip_verify` | boolean | Facultatif | Demande un assouplissement des contrôles du serveur HTTPS, selon les réglages TLS du micrologiciel ; la connexion peut encore échouer. Les contrôles d’intégrité complète de l’image restent actifs. Conservez normalement false. | false |

Consultez le [modèle de données commun](../response-models.md#ota).

### Exemple de requête

```json
{
  "url": "http://updates.example.com/www.bin"
}
```

### Réponse et confirmation de fin

data.status=started/url.

### Notes d'utilisation

Utilisez le fichier www.bin complet correspondant au micrologiciel, et non un fichier HTML isolé. Lisez ensuite ota.www.progress.

<a id="otawwwstart_sdcard"></a>

## ota.www.start_sdcard

Démarrer la mise à jour WWW depuis la carte SD

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ota/www/start_sdcard`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `file` | string | Obligatoire | Chemin absolu du fichier image WWW. Limitez-le à 255 octets ; une valeur plus longue risque de ne pas être conservée intégralement. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../response-models.md#ota).

### Exemple de requête

```json
{
  "file": "/sdcard/www.bin"
}
```

### Réponse et confirmation de fin

data.status=started/file.
