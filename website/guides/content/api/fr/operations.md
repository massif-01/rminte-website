# Maintenir une intégration en service

## Gérer l'état de connexion

Conservez une session par processus client et réutilisez-la pour les requêtes. Planifiez son renouvellement à partir de expires_in ; reconnectez-vous après un échec d’authentification avéré plutôt qu’à chaque interrogation. Les scripts et navigateurs partagent huit emplacements de session. Quand ils sont tous occupés, une nouvelle connexion peut invalider une ancienne session du même compte.

Dans cette version, les sessions ordinaires expirent après 86400 secondes. Un redémarrage, une déconnexion, un changement de mot de passe ou une révocation imposent une nouvelle authentification. Traitez les tokens comme des données d’authentification opaques ; ne tentez pas d’en analyser ou d’en construire le contenu.

## Choisir entre interrogation périodique et abonnement

Utilisez HTTP pour les lectures ponctuelles et WebSocket pour un tableau de bord affiché en continu. Abonnez-vous uniquement aux sujets nécessaires et désabonnez-vous lorsque vous quittez une vue. Les intervalles d’affichage ne modifient ni la fréquence d’échantillonnage du matériel ni la période de régulation des ventilateurs.

Après une déconnexion, reconnectez-vous, authentifiez-vous et rétablissez les abonnements. Ne répétez pas automatiquement les commandes d’alimentation, les exécutions SSH ou les mises à jour. La retransmission des journaux et de la télémétrie perdus pendant la déconnexion n’est pas garantie.

## Suivre une opération

SSH en flux utilise session_id+boot_id+result_key ; le session_id d’exécution est distinct du session_id de connexion. OTA utilise une progression globale à l’appareil, sans informations de suivi privées par opération.

La consultation d’un résultat SSH nécessite les informations de suivi complètes et la session de connexion qui a lancé l’exécution. L’annulation peut utiliser uniquement le session_id d’exécution provenant de cette même connexion. Ne partagez pas ces informations. Si un redémarrage, un remplacement ou la durée de conservation rendent le résultat indisponible, vérifiez l’état distant. Coordonnez le démarrage, l’annulation et le suivi OTA dans un seul processus de maintenance : l’état global ne représente pas une tâche privée exclusive.

## Délais et nouvelles tentatives

Définissez séparément les délais de connexion et d’exécution. Les recherches, diagnostics réseau, commandes distantes et mises à jour peuvent prendre plus de temps qu’une lecture habituelle. L’expiration du délai HTTP n’annule pas le traitement côté serveur.

Pour réessayer une requête de lecture, limitez le nombre d’appels simultanés et augmentez le délai d’attente. Si le résultat d’une écriture est incertain, vérifiez d’abord l’état ; ne la répétez que si vous savez qu’elle n’a pas démarré et qu’elle reste nécessaire. Préférez une opération qui précise l’état souhaité à toggle.

## Modifications de configuration

Lisez active_version avant une écriture et actualisez les données après un conflit. Les règles peuvent aussi exiger expected_revision. Ne remplacez pas des objets complets à partir d’une liste filtrée.

Consignez la version de l’application, la date et l’heure de compilation et les fonctions utilisées par l’intégration. Des versions portant la même chaîne peuvent correspondre à des compilations corrigées différentes. Après une mise à jour, vérifiez les changements de méthodes, rôles, champs et interfaces dépréciées.

## Journal d’exploitation

Consignez l’heure, la cible, le type d’opération, le code de traitement, une brève raison et les identifiants d’opération non secrets. Si nécessaire, conservez les données d’authentification des résultats dans un stockage à accès contrôlé. Les journaux ordinaires ne doivent contenir ni Authorization, ni corps de connexion, ni clés privées, ni secrets de paquets.
