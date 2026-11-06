# Modèles de réponse

Ces champs se trouvent dans `data`. Traitez le statut HTTP et `code` selon les [règles communes](conventions.md). Les champs dépendent de l’état de l’appareil, de son initialisation et du rôle. Conservez un état inconnu lorsqu’un champ manque ; ne le remplacez pas par `0` ou `false`.

## température

| Champ | Interprétation |
| --- | --- |
| `temperature_c` / `temperature_01c` | Celsius / dixièmes de degré; la même mesure |
| `valid` | Indique si la valeur est utilisable ; `false` ne doit pas être interprété comme une température normale |
| `source` / `active_source` / `preferred_source` | Source de cette mesure / source effective / source préférée, selon l’API |
| `timestamp_ms` / `last_update_ms` | Millisecondes depuis le démarrage de l'appareil, pas l'heure Unix |
| `stale` / `age_ms` | État périmé / ancienneté en millisecondes ; `null` peut signifier qu’aucune mise à jour n’a encore eu lieu |
| `partial_stale` / `valid_count` / `stale_count` | Échec partiel d’une liaison multivariable ; ne vérifiez pas uniquement sa moyenne |

L’implémentation limite les valeurs de température valides. Les données peuvent provenir de capteurs locaux, de la télémétrie de calcul, de variables ou de tests manuels. Une valeur manuelle ne prouve pas la température physique.

## Ventilateur

`fan.status` avec `id` renvoie un ventilateur ; sans `id`, il renvoie `fans` et `temperature`/`temp_valid`/`temp_source`.

| Champ | Type, unité ou signification |
| --- | --- |
| `id` / `mode` | Numéro du ventilateur / `off`, `manual`, `auto`, `curve` |
| `duty_valid` / `duty` | Validité de la sortie / commande réelle connue en pourcentage ; une commande inconnue vaut `null` |
| `target_duty` | Pourcentage de sortie cible ; peut différer de la commande réelle |
| `rpm` | Tours par minute ; tenez compte de la présence d’un capteur de vitesse et des défauts |
| `enabled` / `running` / `fault` | Activé / en cours / défaut ; `running` peut être `null` si l’état d’exécution est inconnu |
| `temperature` | Température de régulation pertinente, Celsius |
| `control_temperature` / `guard_temperature` / `predicted_temperature` | Températures de régulation, de protection et prévisionnelle, en degrés Celsius |
| `slope_c_per_min` | Variation de température en degrés Celsius par minute |
| `auto_state` / `guard_active` / `temp_stale` | Étape du contrôle automatique, protection active, température périmée |
| `controller_gain` / `cooling_response` | Valeurs de diagnostic, et non des régimes en RPM ou des températures |

`applied` et `persisted` distinguent l’application de l’enregistrement. Demander `50` % ne prouve pas qu’une sortie physique de `50` % est valide.

## Puissance

`power.status` regroupe la tension, les mesures de la puce, la protection et les statistiques. Consultez les API `power.voltage`, `power.chip` et `power.protection.status` pour le détail.

| Champ | Unité ou signification |
| --- | --- |
| `voltage_v` / `current_a` / `power_w` | V / A / W |
| `voltage_mv` | mV; convertir avant de comparer à V |
| `valid` / `crc_valid` | Validité des données / intégrité de communication ; vérifiez les deux pour les mesures de la puce |
| `timestamp_ms` | Millisecondes depuis le démarrage |
| `state` / `countdown_remaining_sec` | Étape de protection / compte à rebours en secondes |
| `initialized` / `running` | Initialisation terminée / exécution de la protection |

`device.power.status` renvoie les lignes d’alimentation avec `voltage_mv`/`current_ma`/`power_mw` et `total_power_mw`. La télémétrie de calcul peut aussi utiliser des mW ; respectez l’unité de chaque champ.

## résultat de configuration

Les écritures de configuration et la sélection de source renvoient des indicateurs d’état ; ils ne sont pas tous présents dans chaque réponse.

| Champ | Signification |
| --- | --- |
| `active_version` | Version actuelle de la configuration ; utilisez la nouvelle valeur renvoyée pour l’écriture suivante |
| `source` | Source de configuration active |
| `loaded` / `configured` / `enabled` / `paused` | Chargé / configuré / activé / suspendu : des états distincts |
| `saved` / `uncertain` | Enregistrement terminé / résultat incertain |
| `load_error` / `internal_error` | Erreur de configuration active ou de sauvegarde interne |
| `sd_available` / `internal_exists` / `internal_valid` | SD disponible / sauvegarde interne présente / sauvegarde valide |
| `comparison_known` / `backup_matches` | Comparaison possible / sauvegarde correspondante ; un résultat inconnu n’est pas une correspondance |
| `awaiting_sd_choice` | Une sélection SD est nécessaire |
| `internal_saved_at` | Informations sur l’heure d’enregistrement de la sauvegarde interne |
| `collection` / `id` / `dependency` | Emplacement dans une collection, un objet ou une dépendance |
| `impact` | Références et exécutions affectées par la suppression ou le remplacement |

`package_digest` et `credential_generation` de l’aperçu sont des conditions d’application, et non une autorisation globale réutilisable. `restart_required:false` ne remplace pas les contrôles `loaded`/`enabled` ou d’état d’exécution.

## variable

Les variables comprennent les champs suivants ; certains peuvent être absents de la réponse :

| Champs | Contenu |
| --- | --- |
| `name`, `type`, `value_type` | Nom et type |
| `value` | Valeur, si elle est incluse dans la réponse |
| `source_id` | Identifiant de la source |
| `persistent`, `readonly`, `flags` | Persistance, lecture seule et indicateurs |
| `last_change_ms`, `last_update_ms`, `age_ms`, `stale` | Informations sur les changements, les mises à jour et l’ancienneté |

`variables.list` utilise `include_value` pour inclure les valeurs et `include_meta` pour inclure les métadonnées. L’absence du champ `value` ne signifie pas que sa valeur est `null`.

## certificat

`cert.status` indique séparément :

- `has_private_key`, `has_certificate` et `has_ca_chain`.
- Les informations du certificat.
- L’état du service de diagnostic HTTPS distinct.

La validité du certificat peut dépendre de `time_ready` ; un état indéterminé ne signifie pas que le certificat est valide.

L’identité installée, celle chargée par le service de diagnostic HTTPS distinct et la confiance du client de diagnostic doivent être vérifiées séparément. Examinez l’état du service après installation. Les API de gestion restent sur HTTP ; leurs rôles Bearer sont distincts des rôles des certificats mTLS.

## couleur

Les composantes RGB vont de `0` à `255`. Les API de couleur directe acceptent :

- Les chaînes prises en charge.
- Les objets contenant les composantes `r`, `g` et `b`.
- L’entier décimal équivalent à `0xRRGGBB`.

JSON n’accepte pas les littéraux numériques hexadécimaux. `led.color.hsv` utilise `h` de `0` à `359` degrés et `s` et `v` de `0` à `255`, et non des pourcentages.

La correction des couleurs est un objet structuré comme suit :

| Champ | Champs de l’objet imbriqué |
| --- | --- |
| `enabled` | Indicateur de l’objet principal |
| `white_point` | `enabled`, `red_scale`, `green_scale`, `blue_scale` |
| `gamma` | `enabled`, `gamma` |
| `brightness`, `saturation` | Chaque objet contient `enabled` et `factor` |

Les facteurs vont de `0` à `2` et `gamma` de `0.1` à `4`. Envoyez les objets imbriqués lorsque vous les modifiez. La luminosité du périphérique, de `0` à `255`, et un facteur de correction ont des unités différentes.

## ota

Après un lancement depuis une URL ou la carte SD, lisez `ota.progress`. L’état est global à l’appareil, sans informations de suivi privées par session.

| Mise à jour | Champs de progression | Comment vérifier la fin de l’opération |
| --- | --- | --- |
| APP | `state`, `percent`, `total_size`, `received_size`, `message` | `pending_reboot` indique qu’un redémarrage est nécessaire |
| WWW | `state`, `percent`, `total`, `received`, `message`, `running` | `state=completed` et `running=false` |

Une progression de `100` % ne prouve pas à elle seule que la nouvelle `version` fonctionne.

Les partitions indiquent `label`, `address` et `size`, leur capacité d’amorçage et les informations `version`/`project` disponibles. `can_rollback` indique si un retour arrière est actuellement possible. `aborted` accuse réception de l’appel d’annulation ; continuez à vérifier la progression et l’état réel.

Les envois binaires utilisent un format de réponse distinct. HTTP409 avec `status=partial`, `error=recovery_cache_failed` et `flash_written=true` signifie que la mémoire Flash a été écrite, mais que le cache de récupération SD n’a pas été entièrement enregistré. Vérifiez les partitions et fichiers de récupération avant de réessayer.

## réseau

Ces champs distinguent l’existence d’une interface, sa liaison physique, son état demandé et son état réel :

| Champ | Interprétation |
| --- | --- |
| `interface_present` d’Ethernet | Indique l’existence de l’interface |
| `link_up` d’Ethernet | Indique l’état du lien physique |
| `config_error`, `config_error_name` | Signalent les erreurs d’application de configuration |
| `running` du DHCP | État réel |
| `want_running` d’Ethernet | État demandé |
| `restore_error` | Erreur de restauration de la configuration |
| `apply_error` | Erreur d’application de la configuration |
| `resume_error` | Erreur de reprise du service |

Un câble branché ne prouve pas que la configuration IP a réussi. Zéro dans les champs d’erreur indique que l’étape n’a signalé aucune erreur. Vérifiez l’état de l’interface et du lien avant de décider si le service doit fonctionner.
