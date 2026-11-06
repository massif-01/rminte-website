# Dépannage

Consignez la méthode, le chemin, le statut HTTP, le code de traitement, la raison et les informations de suivi de l’opération. Ne mettez pas de mots de passe, tokens, clés privées ou en-têtes d’autorisation complets dans les demandes d’assistance.

## Impossible de se connecter

Utilisez l’adresse HTTP actuelle de l’appareil, par exemple http://10.10.99.97. Le port par défaut est 80 ; il n’est pas nécessaire de le préciser. Vérifiez l’adresse, l’accessibilité du réseau et l’état du service WebUI.

Le bon fonctionnement de la page de diagnostic mTLS sur le port 443 ne prouve pas que l’API de gestion fonctionne. Une fois la requête publique system.info opérationnelle, examinez la connexion au compte puis la fonction visée.

## Échec d’authentification ou d’autorisation

HTTP401 signale généralement une session absente, invalide ou expirée ; HTTP403 indique généralement des droits insuffisants. Certains gestionnaires renvoient les erreurs d’autorisation comme des erreurs de traitement dans une réponse HTTP200.

Reconnectez-vous et vérifiez data.level. admin peut utiliser les API de configuration et de maintenance ADMIN ; l’exécution SSH brute, la modification des définitions d’automatisation et certaines opérations de gestion des comptes exigent toujours ROOT. Les mots de passe initiaux sont rm01 ; utilisez le mot de passe actuel s’il a été changé. Un changement de mot de passe révoque les sessions concernées. Attendez la fin du blocage de connexion au lieu de multiplier les tentatives simultanées.

## Températures ou télémétrie manquantes

Consultez temp.sources pour vérifier validité, heure de mise à jour, ancienneté et source. Une entrée de température issue de variables peut être partiellement périmée ; vérifiez les poids et nombres valides. monitor.data dépend d’un service de surveillance sur l’hôte de calcul ; vérifiez sa connexion et son adresse. Un matériel alimenté ne garantit pas l’arrivée de la télémétrie.

## Requête acceptée, opération non terminée

Conservez et consultez les informations de suivi ou l’enregistrement d’exécution. SSH exige l’état final, le code de sortie et une sortie complète ; les services gérés exigent un état vérifié ; OTA exige la progression globale, l’état des partitions et la version en cours d’exécution après redémarrage. started, cancel_requested ou un simple historique ne suffisent pas.

## Configuration modifiée

En cas de configuration_changed ou de conflit de version, relisez l’état actuel et l’objet concerné. Comparez et fusionnez les données non enregistrées avant de soumettre la nouvelle version. Ne vous contentez pas de remplacer le token de version puis de répéter une suppression, une importation ou un remplacement.

## Échec d’enregistrement ou résultat inconnu

Vérifiez applied, persisted, saved, uncertain, result_unknown et la raison. L’état d’exécution peut changer même si l’enregistrement échoue. Relisez-le, puis vérifiez la configuration de démarrage enregistrée ou les sauvegardes selon le cas. Un échec réseau ne prouve pas que la requête est restée sans effet.

## Empreinte SSH modifiée

Arrêtez les nouvelles tentatives automatiques et demandez l’empreinte actuelle à l’administrateur du serveur. Vérifiez les éventuels réinstallation, remplacement ou changement d’attribution d’adresse. N’utilisez les champs de confirmation documentés qu’après vérification. Une même adresse ne garantit pas qu’il s’agit du même hôte.

## Occupé ou capacité atteinte

Réduisez le nombre d’appels simultanés, réutilisez les sessions et fermez les abonnements ou terminaux inutilisés. Vérifiez les opérations en cours. Les tâches ne peuvent pas attendre indéfiniment parce qu’un client continue à réessayer. Attendez la fin de la séquence d’arrêt de votre tâche ; ne prenez pas le contrôle du travail d’une autre connexion.

## Échec d’envoi ou de mise à jour

Vérifiez le rôle, la réception complète de la requête, le chemin, l’état SD, l’espace libre, la taille de la partition cible et la présence d’images complètes adaptées au matériel et à ses partitions. Un fichier envoyé n’est pas nécessairement validé ou installé. Pour SSH, consultez les informations de suivi conservées ; pour OTA, examinez la progression globale et les partitions avant de réessayer, de revenir à la version précédente ou de supprimer les fichiers de récupération.
