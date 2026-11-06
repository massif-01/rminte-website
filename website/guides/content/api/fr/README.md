# Guide de l’API TianshanOS

Reliez vos scripts et systèmes à l’appareil pour surveiller son état, piloter ses ordinateurs, recevoir des informations en temps réel, exécuter des tâches à distance et gérer la configuration ainsi que les mises à jour. Ce guide suppose des connaissances en HTTP, JSON et administration de serveurs. Aucune connaissance des circuits électroniques ou du micrologiciel n’est nécessaire.

Ce guide est basé sur **TianshanOS 0.6.4**.

## Choisir une tâche

| Tâche | Point de départ |
| --- | --- |
| Effectuer un premier appel API | [Démarrer rapidement](quickstart.md) |
| Identifier le contrôleur et les deux ordinateurs | [Dispositifs et noms](devices.md) |
| Surveiller les températures, les ventilateurs, l’alimentation et les ordinateurs | [Surveillance](scenarios.md#monitor-the-device) |
| Commander l’alimentation ou changer la connexion USB | [Contrôle de l'appareil](scenarios.md#control-a-computer) |
| Démarrer un service distant et vérifier son état | [Tâches à distance](scenarios.md#manage-remote-tasks) |
| Configurer les variables, sources, actions et règles | [Automatisation](scenarios.md#configure-automation) et [Modèles de configuration](configuration-models.md) |
| Transférer des fichiers ou mettre à jour le micrologiciel | [Entretien](scenarios.md#maintain-the-device) et [Transferts](transfers.md) |
| Recevoir l’état et les résultats en temps réel | [WebSocket](websocket.md) |
| Consulter une API | [Référence complète](reference/README.md) |
| Résoudre un problème ou maintenir une intégration en service | [Dépannage](troubleshooting.md) et [Opérations](operations.md) |

## Parcours de lecture

Commencez par une requête en lecture seule dans le guide de démarrage. Suivez ensuite le scénario correspondant à votre tâche, y compris les vérifications du résultat et les étapes de récupération. Consultez la référence pour connaître le détail des paramètres.

Les comptes admin/root et le mot de passe initial rm01 documentés sont les valeurs par défaut du produit. Les autres adresses, noms de fichiers, tokens et réponses servent d’exemples. Utilisez l’adresse et le mot de passe actuels d’un appareil que vous gérez. Les exemples ne contiennent ni tokens privés, ni mots de passe modifiés, ni enregistrements d’activité réels.

La référence couvre 277 noms enregistrés dans 28 groupes fonctionnels, dont config.pack.apply, conservé mais incapable d’appliquer une configuration générique. Les routes dédiées aux fichiers et images ainsi que les messages WebSocket ont leurs propres chapitres. Un nom enregistré ne garantit pas que le matériel, le stockage, les identifiants ou le service distant nécessaires sont prêts.
