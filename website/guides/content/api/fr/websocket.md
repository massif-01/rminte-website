# WebSocket

Connectez-vous à `ws://10.10.99.97/ws` en remplaçant l’adresse par l’IP de votre appareil. Ce canal fournit la télémétrie, les journaux, les commandes du contrôleur et le Shell SSH interactif. Une connexion réussie n’autorise pas, à elle seule, l’utilisation des fonctions privées.

## S’authentifier et s’abonner

Obtenez un token par connexion HTTP, puis envoyez :

```json
{"type":"auth","token":"YOUR_TOKEN"}
```

Attendez auth_ok ; un échec renvoie auth_error. Les sujets de télémétrie ordinaires sont actuellement publics, mais l’authentification reste utile pour les fonctions protégées. Elle ne peut pas faire passer une session READ au rôle ROOT.

```json
{"type":"subscribe","topic":"fan.status","params":{"interval":5000}}
```

Accusé de réception réussi :

```json
{"type":"subscribed","topic":"fan.status","success":true}
```

Exemple de structure de réponse data :

```json
{"type":"data","topic":"fan.status","timestamp":123,"data":{"fans":[]}}
```

timestamp est exprimé en **secondes depuis le démarrage** ; les mesures HTTP et les journaux peuvent utiliser des millisecondes. Un abonnement confirmé ne prouve pas que la première mesure est arrivée. Si les mises à jour s’arrêtent, vérifiez l’état du canal et de la source, puis relisez les données par HTTP si nécessaire.

## Sujets

| Thème | Intervalle d’affichage par défaut / minimal | Contenu |
| --- | --- | --- |
| system.dashboard | 1000 ms | cpu/memory/info/network/power/fan/services; les sections non disponibles peuvent être omises |
| system.info | 5000 ms | Informations sur le contrôleur |
| system.memory | 5000 ms | Mémoire du contrôleur |
| system.cpu | 1000 ms | Processeur du contrôleur |
| network.status | 5000 ms | État du réseau |
| power.status | 5000 ms | État d’alimentation |
| fan.status | 5000 ms | Ventilateurs |
| service.list | 5000 ms | Services du contrôleur |
| device.status | Déclenché par les événements, 2000 ms par défaut | Événements d’état des ordinateurs, et non un instantané complet périodique |
| ota.progress | Déclenché par les événements, 1000 ms par défaut | Progression globale de l’appareil ; vérifiez la progression HTTP et la version après redémarrage |
| config.pack.validated | Déclenché par les événements, 0 par défaut | Validation d’un paquet envoyé, et non application de la configuration |

params.interval est un entier positif ou nul exprimé en millisecondes. Les huit premiers sujets périodiques refusent 0 et appliquent leur intervalle minimal si la valeur demandée est inférieure. Un intervalle ne transforme pas les trois derniers sujets événementiels en sujets interrogés périodiquement. Un nouvel abonnement au même sujet sur une connexion met à jour l’abonnement existant ; il ne crée pas de file d’historique.

Pour vous désabonner, envoyez `{"type":"unsubscribe","topic":"fan.status"}` et vérifiez unsubscribed/success. `{"type":"ping"}` reçoit pong en réponse. Pong ne confirme ni l’autorisation de la session ni le bon fonctionnement de la télémétrie.

## Registres

Nécessite ADMIN ou un niveau supérieur. Authentifiez-vous, puis envoyez log_subscribe. L’historique nécessite également ADMIN.

| Type sortant | Champs | Result/effect |
| --- | --- | --- |
| log_subscribe | minLevel, VERBOSE par défaut | log_subscribed/minLevel, puis type=log |
| log_set_level | minLevel | Modifie le filtre de cette connexion, et non les niveaux de sortie de tous les modules |
| log_get_history | limit vaut 500 par défaut ; minLevel vaut ERROR ; maxLevel vaut VERBOSE | log_history avec logs/total, limité par la capacité tampon |
| log_unsubscribe | Aucune | Arrête le flux de journaux de cette connexion |

Les journaux contiennent timestamp en millisecondes depuis le démarrage, level, levelName, tag, message et task. Les niveaux 0 à 5 sont NONE/ERROR/WARN/INFO/DEBUG/VERBOSE. La conservation est limitée ; une reconnexion ne rejoue pas automatiquement l’historique.

## Terminal de commande du contrôleur

Ce terminal commande le contrôleur de gestion, et non le système Linux des deux ordinateurs. ROOT est nécessaire ; les commandes peuvent modifier le matériel ou la configuration.

| Type sortant | Champs | Résultat |
| --- | --- | --- |
| terminal_start | token | Associe et demande le terminal ; connected inclut prompt ; un terminal occupé renvoie terminal_busy/retry_after |
| terminal_input | data : chaîne complète de commande | Messages output/data, puis done avec code/output_incomplete/stopped |
| terminal_interrupt | Aucune | Demande l’interruption ; command_stopping peut précéder done |
| terminal_stop | Aucune | Libère le terminal de cette connexion ; n’annule pas les effets externes |

Un seul propriétaire peut utiliser le terminal à la fois. Ne prenez pas le contrôle d’un terminal actif. Une sortie manquante ne prouve pas à elle seule un échec d’exécution. Pour une première intégration, préférez les API HTTP d’état structuré à l’analyse de la sortie du terminal.

## Shell SSH interactif

ROOT est nécessaire. ssh_connect transmet le token et associe la connexion. Vérifiez d’abord les empreintes distantes ; ce Shell ne propose pas d’option d’acceptation automatique des empreintes inconnues.

| Type sortant | Champs | Résultat |
| --- | --- | --- |
| ssh_connect | token, host, user ; port facultatif, 22 par défaut, et password pour cette connexion distante | ssh_status connecting/connected/error ; cette interface utilise une authentification par mot de passe |
| ssh_input | data | Écrit du texte ; incluez explicitement les sauts de ligne nécessaires |
| ssh_resize | width, height | Entiers de 1 à 65535 pour les colonnes et lignes du terminal |
| ssh_signal | signal | Envoie un signal pris en charge ; les demandes non prises en charge échouent |
| ssh_disconnect | Aucune | Déconnecte le Shell de cette connexion ; observez le dernier ssh_status |

La sortie utilise ssh_output/data et l’état ssh_status/status/message. Une connexion ne commande que son propre Shell. Après l’échec d’une commande de contrôle ou une déconnexion, ne renvoyez pas automatiquement la saisie : l’hôte distant peut l’avoir reçue.

## Exécution SSH avec sortie en flux, lancée par HTTP

ssh.exec_stream démarre par HTTP et renvoie session_id/boot_id/result_key. Il est distinct du Shell interactif. Authentifiez la connexion WebSocket avant de démarrer pour ne pas manquer les premiers événements. Les événements privés sont transmis uniquement aux connexions autorisées pour la session à l’origine de l’exécution.

| Type entrant | Champs et interprétation |
| --- | --- |
| ssh_exec_start | session_id, commande et motifs ; opération démarrée, non terminée |
| ssh_exec_output | session_id, output_offset, output_length, is_stderr, data_b64 |
| ssh_exec_match | session_id, expect_matched/fail_matched, éventuellement extracted/is_final |
| ssh_exec_running | Réponse d’opération en cours, obtenue par consultation de l’état HTTP |
| ssh_exec_done | session_id, execution_status, exit_code, status/success et résultats de correspondance |
| ssh_exec_cancelled | session_id, execution_status ; l’annulation ne prouve pas que le processus distant est terminé |
| ssh_exec_error | session_id, error, éventuellement stage/detail |

Décodez data_b64 en octets, vérifiez output_length et utilisez output_offset pour détecter les manques et doublons. Décodez l’UTF-8 de façon continue entre les trames : un caractère peut s’étendre sur plusieurs messages.

Les résultats du terminal peuvent inclure output_bytes/output_incomplete/collection_truncated/conditions_complete. **La fin d’exécution, la correspondance des conditions et l’exhaustivité de la sortie sont distinctes.** exit_code=0 peut coexister avec une sortie manquante ; une vérification de conditions incomplète n’est pas un résultat positif. Après une déconnexion, interrogez ssh.exec_status avec les informations de suivi ; cet appel ne relance pas la commande et ne garantit pas toute la sortie historique.

## Capacité et reconnexion

Cette version autorise huit clients WebSocket et 32 abonnements à des sujets pour l’ensemble du service. Les grandes trames, clients lents, tâches exclusives ou arrêts peuvent entraîner un rejet. L’entrée doit respecter le protocole JSON texte et ne pas dépasser 64 KiB ; n’utilisez pas la fragmentation pour envoyer des fichiers. Les limites de profondeur JSON s’appliquent également.

Reconnectez-vous après un délai, authentifiez-vous à nouveau et rétablissez les abonnements. Ne répétez pas automatiquement terminal_input, ssh_input ou les commandes HTTP. Affichez l’ancienneté de la dernière mesure et l’état périmé ou déconnecté pour ne pas présenter d’anciennes valeurs comme actuelles.

L’exemple subscribe.js fourni fonctionne dans un navigateur pouvant joindre l’appareil, sans bibliothèque tierce.
