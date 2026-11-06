# Transfert de fichiers et d’images

Les fichiers ordinaires et les images APP/WWW utilisent des routes binaires dédiées. Le corps contient les octets originaux du fichier ; une réponse réussie ne contient pas nécessairement code. Ces routes sont distinctes des 277 noms logiques d’API.

## Fichiers ordinaires

| Itinéraire | Method/access | Demande et résultat |
| --- | --- | --- |
| /api/v1/file/download | GET, READ; ADMIN pour les chemins sensibles | Chemin absolu dans les paramètres de l’URL ; la réponse contient les octets d’un fichier, et non un répertoire |
| /api/v1/file/upload | POST, ADMIN | Chemin de destination dans les paramètres de l’URL, octets d’origine dans le corps ; la réussite renvoie path/size/status=uploaded |

Les envois HTTP sont limités aux fichiers ordinaires validés sous `/sdcard/`. Les autres opérations, comme storage.rename/delete, ont un périmètre de chemins différent ; elles n’autorisent pas les envois HTTP vers `/spiffs/` ou `/www/`. La lecture des configurations sensibles et des clés privées nécessite ADMIN. Les répertoires d’automatisation gérés, alias, sauvegardes et fichiers temporaires restent protégés ; modifiez-les avec les API de configuration des objets.

Les téléversements sont limités à 16 MiB, avec un délai de réception de 300 secondes. La mémoire, l’espace libre et l’état du stockage imposent aussi des limites. Fournissez un fichier complet et non vide. Des requêtes successives n’ajoutent pas de fragments au fichier. Le téléversement remplace le fichier de destination existant : sauvegardez d’abord le contenu à conserver. Appliquez l’encodage URL aux chemins une seule fois.

Configurez TS_BASE et TS_TOKEN avant l’exécution :

```sh
curl --connect-timeout 5 --max-time 330 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/octet-stream' \
  --data-binary @example.txt \
  "$TS_BASE/api/v1/file/upload?path=/sdcard/example.txt"

curl --connect-timeout 5 --max-time 60 \
  -H "Authorization: Bearer $TS_TOKEN" \
  --get --data-urlencode 'path=/sdcard/example.txt' \
  "$TS_BASE/api/v1/file/download" -o downloaded-example.txt
```

L’envoi d’un fichier .tscfg ajoute les informations config_pack.valid/reason/signature. uploaded signifie que le fichier a été enregistré, et non qu’il est fiable ou appliqué. Prévisualisez puis appliquez le paquet avec l’importation propre à l’objet ; config.pack.apply n’applique pas de configuration générique. Les paquets de données ordinaires et les paquets de règles contenant des commandes ont des contrôles d’usage de signature différents ; la validation ordinaire ne remplace pas celle de l’importation de règles.

En cas de file_replace_uncertain ou de perte de connexion, vérifiez les métadonnées du fichier et téléchargez son contenu avant de réessayer.

## Préparer les images

Récupérez une image APP complète et le fichier www.bin correspondant au matériel, aux partitions et à la version du micrologiciel. Une image WWW n’est pas un fichier HTML isolé. Sauvegardez la configuration, prévoyez une alimentation stable et une plage de maintenance, puis préparez un moyen de récupération.

Les téléchargements acceptent HTTP et HTTPS. HTTPS utilise par défaut les autorités de confiance du système. skip_verify est une option de téléchargement ; elle ne corrige ni une image endommagée ou incompatible ni un manque de capacité. Conservez normalement false. Les API actuelles de démarrage n’acceptent pas de paramètre cert_pem pour une autorité privée.

## Choisir une méthode de transfert

| Méthode | API | Besoins |
| --- | --- | --- |
| Téléchargement par l’appareil | ota.start_url / ota.www.start | L’appareil peut joindre le serveur des images ; vérifiez le réseau et le stockage |
| SD file | ota.start_file / ota.www.start_sdcard | Carte SD montée avec les fichiers image complets |
| Envoi par le client | Routes binaires dédiées ci-dessous | Le client dispose des fichiers complets ; l’appareil dispose d’une carte SD inscriptible pour les fichiers intermédiaires et le cache de récupération |

| Itinéraire | Method/access | Options et résultat de réussite |
| --- | --- | --- |
| /api/v1/ota/firmware | POST, ADMIN | Corps APP complet ; auto_reboot vaut true par défaut dans les paramètres de l’URL ; status=success, size, message, reboot_pending, auto_reboot_requested |
| /api/v1/ota/www | POST, ADMIN | Corps www.bin complet ; status=success, size, message ; aucun redémarrage automatique |

Les deux routes acceptent au maximum 16 MiB avec un délai de réception de 300 secondes, selon la capacité de la partition cible et la mémoire. Les en-têtes du micrologiciel et l’intégrité complète de l’installation sont contrôlés. Un envoi réussi enregistre les fichiers de récupération SD et un manifeste dont la récupération automatique est désactivée ; la validation de l’application après redémarrage reste une étape distincte.

Cet exemple désactive le redémarrage automatique afin de vérifier d’abord le résultat dans le processus de maintenance :

```sh
curl --connect-timeout 5 --max-time 600 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/octet-stream' \
  --data-binary @firmware.bin \
  "$TS_BASE/api/v1/ota/firmware?auto_reboot=false"
```

firmware.bin est un nom de fichier côté client ; remplacez-le par l’image complète du micrologiciel. Cette requête écrit sur l’appareil. Avec auto_reboot=true, un redémarrage est demandé environ 2 secondes après une réponse réussie et la connexion peut être interrompue.

## Vérifier la progression et la fin de l’opération

Après un lancement depuis une URL ou la carte SD, lisez ota.progress, ou ota.www.progress pour WWW. La progression est globale à l’appareil et n’a pas d’informations de suivi privées par session. Coordonnez les mises à jour dans un seul processus de maintenance pour éviter les démarrages simultanés ou l’annulation d’une autre mise à jour.

```sh
curl --connect-timeout 5 --max-time 15 \
  -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/ota/progress"
```

La progression APP contient state/percent/received_size/total_size/message. WWW utilise received/total et ajoute running. pending_reboot indique qu’un redémarrage est nécessaire ; error indique un échec. Une progression de 100 % ne prouve pas à elle seule que la nouvelle version fonctionne. Pour annuler, envoyez un objet vide par POST à ota.abort ou ota.www.abort, puis confirmez l’état avant de recommencer.

Pour un envoi binaire, utilisez la réponse HTTP sans supposer que la progression globale identifie cette requête. HTTP409 avec status=partial, error=recovery_cache_failed et flash_written=true signifie que la Flash a été écrite, mais que le cache de récupération SD n’a pas été entièrement enregistré. Vérifiez les partitions et fichiers de récupération. Une réponse perdue ne prouve pas non plus qu’aucune écriture n’a eu lieu.

Après installation du micrologiciel, redémarrez comme prévu, reconnectez-vous, vérifiez ota.status/partitions et le bon fonctionnement de l’application. ota.validate confirme le micrologiciel actuel ; appelez cette interface après les contrôles de bon fonctionnement.

## Retour arrière et récupération depuis la carte SD

Vérifiez ota.partitions.can_rollback avant d’appeler ota.rollback. Le retour arrière peut redémarrer immédiatement l’appareil. Reconnectez-vous et vérifiez la version, la compatibilité de la configuration et l’état de l’application.

La récupération SD utilise TianShanOS.bin, www.bin et manifest.json sous `/sdcard/recovery/`. armed détermine si la récupération est activée ; force contrôle la comparaison de version. La présence des fichiers ne prouve pas que la récupération est activée. Suivez la procédure de l’éditeur : la récupération affecte un démarrage ultérieur et le stockage persistant ; le seul envoi des fichiers ne prouve pas sa réussite.

Aucune API de préparation, d’état ou d’autorisation de récupération n’est exposée. N’inventez pas de routes et ne considérez pas ota.upload_begin/end/abort comme un protocole complet de transfert par segments. Les intégrations ordinaires doivent utiliser les routes binaires ci-dessus.
