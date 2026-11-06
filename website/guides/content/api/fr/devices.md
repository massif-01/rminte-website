# Appareils et nomenclature

TianshanOS gère son contrôleur et les ordinateurs connectés. Identifiez la cible avant d’appeler une API : leurs états décrivent des éléments différents.

| Nom présenté à l’utilisateur | Identifiant API | Objet |
| --- | --- | --- |
| Contrôleur de gestion | system.* | Version de TianshanOS, mémoire, tâches et redémarrage du contrôleur |
| Ordinateur d'inférence | device:"agx" | État et commande de l’alimentation, réinitialisation ; monitor.* fournit la télémétrie des ressources de calcul |
| Ordinateur d’applications | device:"lpmu" | État et commande de l’alimentation, réinitialisation et configuration de l’accès au réseau amont |
| Ventilateurs de refroidissement | fan.* et identifiant id numérique | Régime en RPM, mode de régulation, courbe de température et limites de sortie |
| Éclairage tactile, éclairage de carte et écran matriciel | touch, board, matrix | Couleurs, effets, images, codes QR et texte |
| Stockage local | /sdcard/... et autres chemins pris en charge | Fichiers, paquets de configuration et supports de mise à jour pris en charge |
| Hôte distant | id/host d’un hôte SSH enregistré | Commandes de serveur ou processus gérés ; ne désigne pas nécessairement l’un des ordinateurs intégrés |

Utilisez exactement agx et lpmu comme identifiants API. Par exemple, l’ordinateur d’applications reste désigné par `{"device":"lpmu"}`.

## Interpréter correctement les mesures

- La **commande du ventilateur** indique le pourcentage de sortie, de 0 à 100. RPM correspond à la vitesse de rotation. Une commande inconnue peut être null ; vérifiez aussi duty_valid.
- La **source de température** peut être un capteur local, la télémétrie d’un ordinateur, une variable ou une valeur de test saisie manuellement. Vérifiez la source, le champ valid et l’horodatage.
- **power_good** est un indicateur matériel d’alimentation. Il ne prouve pas que le système d’exploitation ou l’application est prêt.
- La **cible USB** sélectionne le chemin USB partagé. Son changement peut interrompre les échanges sur le chemin précédent.
- **run_id** identifie une exécution de service distant géré. La présence d’un enregistrement ne prouve pas que le processus fonctionne encore ; vérifiez son état.
- Les **informations de suivi de l’opération** comprennent son identifiant et les données d’authentification nécessaires pour consulter son résultat. Conservez l’ensemble de ces informations, et non uniquement un nom d’affichage.

## Trois étapes de confirmation

1. L’API accepte la requête, par exemple en renvoyant started:true.
2. L'action de l'appareil ou le processus distant atteint l'état demandé.
3. L’application est prête à l’emploi, par exemple lorsqu’un contrôle de bon fonctionnement réussit.

Vérifiez l’étape requise pour votre tâche. Redémarrer le contrôleur, alimenter un ordinateur et lancer son application sont des opérations distinctes.
