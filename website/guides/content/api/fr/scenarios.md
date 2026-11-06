# Exemples par tâche

Les exemples utilisent TS_BASE et TS_TOKEN du [démarrage rapide](quickstart.md). Remplacez les adresses, identifiants d’objets, versions de configuration et informations de suivi par les valeurs réelles. Les exemples de commande ont des effets réels : exécutez uniquement la tâche voulue.

## Surveiller l'appareil

Intégrez les températures, le refroidissement, l’alimentation et l’état des ordinateurs à votre système de surveillance. Connectez-vous pour accéder aux fonctions READ ; certaines vues d’ensemble sont publiques.

```sh
curl -H "Authorization: Bearer $TS_TOKEN" "$TS_BASE/api/v1/temp/read"
curl -H "Authorization: Bearer $TS_TOKEN" "$TS_BASE/api/v1/fan/status"
curl -H "Authorization: Bearer $TS_TOKEN" "$TS_BASE/api/v1/power/status"
curl -H "Authorization: Bearer $TS_TOKEN" "$TS_BASE/api/v1/device/status?device=agx"
```

Conservez valid pour la température, duty_valid pour les ventilateurs, valid/crc_valid pour l’alimentation et les heures de dernière mise à jour. Signalez explicitement les états invalides ou déconnectés. duty est un pourcentage et rpm une vitesse de rotation. state=on d’un ordinateur ne prouve pas que l’application est prête. Consultez les [modèles de réponse](response-models.md).

Une surveillance réussie fournit des mesures valides qui continuent à s’actualiser. Utilisez WebSocket pour un tableau de bord continu. En cas de température invalide, vérifiez temp.sources ; pour la télémétrie de calcul, vérifiez monitor.status. Ne remplacez pas les valeurs manquantes par zéro. L’exemple Python fourni se limite à la connexion, aux lectures et à la déconnexion.

## Contrôler un ordinateur

ADMIN est nécessaire. Lisez d’abord device.status pour identifier agx ou lpmu et connaître son état actuel. Après expiration d’un délai, préférez une action explicite on/off à la répétition de toggle.

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"device":"agx","action":"on"}' \
  "$TS_BASE/api/v1/device/power"
```

Appelez ensuite GET device.status et vérifiez state/power_good. Confirmez la disponibilité de l’application sur l’ordinateur cible ou avec une interface de contrôle de bon fonctionnement. Pour un arrêt normal, utilisez off. force_off/reset interrompent le travail et peuvent faire perdre des données ; planifiez d’abord la maintenance du système cible.

Pour changer la destination USB, envoyez POST device.usb.set avec `{"target":"agx"}`, puis consultez GET device.usb.status. Les autres destinations sont esp32/lpmu/disconnect. La connexion par l’ancienne voie peut être interrompue pendant le changement ; cela ne suffit pas à conclure à une défaillance de l’appareil.

Après expiration du délai, consultez l’état avant de réessayer. Conservez l’état d’erreur, l’indication d’alimentation et les détails si la cible n’atteint pas l’état attendu.

## Régler les LED et les ventilateurs

Les opérations LED courantes nécessitent ADMIN. Utilisez GET led.list pour obtenir le nom d’un périphérique, puis appliquez-lui une couleur :

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"device":"board","color":"#00A0FF"}' \
  "$TS_BASE/api/v1/led/fill"
```

Relisez led.list. Pour retrouver l’affichage après redémarrage, envoyez séparément POST led.save avec `{"device":"board"}` et vérifiez saved. L’affichage et l’enregistrement des réglages de démarrage sont deux étapes distinctes.

Pour les ventilateurs, lisez d’abord fan.status/config. N’envoyez POST fan.set avec `{"id":0,"duty":50}` qu’après avoir obtenu l’identifiant réel du ventilateur. fan.mode sélectionne off/manual/auto/curve. Les droits concernant la courbe, les limites et l’enregistrement figurent dans la [référence des ventilateurs](reference/fan.md).

Après modification de la sortie, vérifiez duty_valid/duty/target_duty, la température et les défauts. Après un réglage manuel temporaire, rétablissez le mode de régulation souhaité.

## Gérer les tâches distantes

Utilisez ssh.exec/exec_stream pour une commande ponctuelle ; pour un service géré dans la durée, utilisez une commande SSH enregistrée et son enregistrement d’exécution. L’exécution d’une commande libre nécessite ROOT ; le démarrage d’un service géré existant nécessite au moins ADMIN.

Avant le démarrage, vérifiez l’accès réseau, l’empreinte de l’hôte et la présence d’un hôte enregistré référençant une clé SSH valide. Pour une empreinte inconnue ou modifiée, utilisez ssh.test et des informations de confiance pour vérifier l’identité ; n’effacez pas la confiance et n’acceptez pas automatiquement l’empreinte.

1. Avec root, lisez ssh.hosts et ssh.commands. Vérifiez l’hôte, la commande, service_mode et le motif de disponibilité. Consultez les [modèles de configuration](configuration-models.md).
2. Lisez la dernière valeur active_version, puis démarrez le service enregistré :

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"command_id":"YOUR_SERVICE_COMMAND_ID","active_version":"CURRENT_VERSION"}' \
  "$TS_BASE/api/v1/ssh/services/start"
```

3. Conservez run_id et operation_id. Envoyez POST automation.services.status avec `{"run_id":"YOUR_RUN_ID","verify":true}`. Vérifiez operation_phase, busy et state. verify se connecte à l’hôte d’origine ; ce n’est pas une simple lecture du cache local.
4. Vérifiez le bon fonctionnement et la disponibilité de l’application. Pour l’arrêter, envoyez POST automation.services.stop avec le run_id d’origine et continuez à consulter l’état.

Un run_id n’indique pas que le service est prêt ; last_known correspond à une observation antérieure. Supprimer une configuration ou une clé locale n’arrête pas les processus distants. Utilisez l’identité d’exécution d’origine plutôt que de tenter d’identifier un processus par son nom.

Pour une exécution ponctuelle avec sortie en flux, authentifiez WebSocket avant d’envoyer POST ssh.exec_stream. Conservez toutes les informations de suivi et utilisez ssh.exec_status après une interruption. Ne relancez jamais une commande dans le seul but de récupérer une sortie manquante. Consultez [SSH en flux](websocket.md#http-started-streaming-ssh) pour l’exécution, les correspondances de motifs et l’exhaustivité de la sortie.

## Configurer l'automatisation

Le principe est d’acquérir des données, de les associer à des variables, puis d’exécuter une action lorsque les conditions sont satisfaites. Avec root, lisez d’abord automation.status/config.status. Résolvez les problèmes de chargement, d’activation, de suspension ou de sélection de source SD avant de modifier la configuration.

Commencez par une variable utilisateur sauvegardée :

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/automation/config/status"
```

Utilisez sa valeur active_version dans la requête suivante :

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"name":"example.temperature","value":42.5,"active_version":"CURRENT_VERSION"}' \
  "$TS_BASE/api/v1/automation/variables/set"
```

Avec root, lisez automation.variables.get pour confirmer value, readonly et source_id. Conservez la nouvelle valeur active_version. Créez une règle enabled:false à partir du [modèle de règle](configuration-models.md#automation-rules) ; utilisez une action de journalisation avant d’ajouter des commandes d’alimentation ou d’exécution distante.

Ajoutez une source de données réelle uniquement si nécessaire. Vérifiez l’arrivée des données, la mise à jour des variables et leur ancienneté avant d’activer la règle. L’enregistrement d’une définition, l’activation de la configuration, le démarrage du moteur et l’exécution des actions sont des états distincts ; saved:true ne suffit pas.

Après un conflit, actualisez puis fusionnez les données. Prévisualisez l’impact des suppressions. Prévisualisez puis appliquez la sélection SD ou de sauvegarde. Respectez les résultats de suspension ou d’occupation plutôt que d’écraser les fichiers gérés.

## Assurer la maintenance de l’appareil

Choisissez un objectif de maintenance à la fois afin que ses effets puissent être vérifiés.

| Objectif | Séquence | Achèvement |
| --- | --- | --- |
| Sauvegarder un objet | Exporter avec le rôle requis par l’objet, conserver le fichier tscfg, puis prévisualiser tout import ultérieur | Paquet complet conservé et vérifiable ; l’exportation n’est pas une restauration |
| Enregistrer un fichier | Envoyer, vérifier les attributs, télécharger puis comparer | Chemin, longueur et octets attendus |
| Mettre à jour le micrologiciel et WWW | Vérifier la correspondance des images, transférer, lire la progression globale, confirmer l’état et redémarrer si nécessaire | Identité et version d’exécution correctes, application fonctionnelle |
| Modifier la configuration réseau | Noter les anciens paramètres d’accès et de configuration, modifier, enregistrer puis se reconnecter | L’accès de gestion et le réseau de la cible fonctionnent tous deux |
| Modifier un mot de passe | change_password, nouvelle connexion, mise à jour des sessions clientes | Les nouveaux identifiants fonctionnent ; les anciennes sessions ne sont plus supposées valides |
| Installer le certificat d'identité | Vérifier la correspondance CSR/clé, installer, puis vérifier cert.status et la confiance côté client | Certificats et clés corrects, identité effectivement chargée et connexion client vérifiée |

Consultez [Transferts et mises à jour](transfers.md) pour les requêtes complètes et les limites de capacité. cert.* gère l’identité de l’appareil, key.* les clés SSH et hosts.* les empreintes distantes. Après un échec, déterminez les étapes ayant pris effet avant de réessayer ou de récupérer.
