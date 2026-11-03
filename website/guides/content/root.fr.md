# TianshanOS

Ce guide couvre les fonctions de routine dans la partie I et l'accès au terminal, les commandes à distance, l'automatisation et la sauvegarde de la configuration dans la partie II. Les opérations Root peuvent affecter le périphérique et les hôtes distants ; vérifiez les tâches cibles et actives avant de continuer. Consultez le Guide de sécurité séparé pour la gestion de la sécurité.

Version couverte : 0.6.4. Révisé le 3 novembre 2026.

Utilisez les commandes affichées sur votre appareil. Certains nécessitent un matériel ou une configuration spécifique. Sur un ordinateur, passez la souris sur un bouton icône pour voir son nom. Sur un téléphone, faites glisser votre doigt dans un large tableau pour afficher ses autres colonnes.

## Partie I : Fonctions de routine

### 1. Pour commencer

#### Ouvrez le WebUI

1. Ouvrez l'interface Web de l'appareil (WebUI) à l'aide de l'adresse fournie par votre administrateur.
2. Sélectionnez « Connexion » dans le coin supérieur droit.
3. Saisissez `root` et le mot de passe root fourni avec l'appareil.
4. Sélectionnez « Connexion ». Après une connexion réussie, le nom d'utilisateur actuel apparaît dans le coin supérieur droit.

La connexion avec le mot de passe par défaut ouvre un « rappel de sécurité ». Saisissez le mot de passe actuel, puis saisissez le nouveau mot de passe deux fois et sélectionnez « Modifier maintenant ». Les deux entrées de nouveau mot de passe doivent correspondre. Sélectionnez « Plus tard » pour fermer le rappel.

Lorsque vous avez terminé, sélectionnez « Déconnexion » dans le coin supérieur droit. Vous devrez vous reconnecter pour utiliser l'appareil.

Si l’accès est refusé, vérifiez le compte. Si la session a expiré, reconnectez-vous, puis vérifiez le résultat de l’opération précédente. Se reconnecter ne relance pas la tâche. Ne répétez pas aussitôt un envoi de fichier, une suppression ou une mise à jour.

#### Changer de langue

Sélectionnez le bouton de langue en haut de la page, puis choisissez chinois ou anglais. Le contenu de la page et les étiquettes de contrôle changent immédiatement.

#### Navigation dans les pages

Les utilisateurs root peuvent accéder à ces pages :

- “System” : affichez l'état de l'appareil, les modules de contrôle, les ventilateurs et les voyants, et ouvrez la mise à jour OTA.
- “Network” : vérifiez l'état Ethernet et les clients DHCP, configurez le WiFi et gérez le transfert NAT.
- “Files” : gérez les fichiers sur la carte SD et SPIFFS.
- “Terminal” : exécutez les commandes du périphérique et affichez les journaux système.
- “Commands” : gérez et exécutez les commandes SSH à distance.
- “Automation” : configurez les tâches et enregistrez une sauvegarde d'urgence.
- “Security” : ouvrez la page de gestion de la sécurité distincte. Consultez le Guide de sécurité pour obtenir des instructions.

### 2. État du système et opérations de routine

Sélectionnez « Système » dans la navigation supérieure.

#### Afficher l'état des ressources et des services

« Ressources de la puce de gestion » affiche l'utilisation du processeur, de la DRAM et de la PSRAM sur la puce de gestion. Ces lectures n'indiquent pas l'utilisation des ressources sur l'ordinateur d’inférence ou l'ordinateur d’applications.

- Sélectionnez « Détails » pour afficher la mémoire totale, utilisée et libre ainsi que d'autres informations sur la mémoire.
- Les valeurs marquées « estimées » dans les détails de la mémoire sont uniquement à titre de référence. Si un avertissement apparaît, conservez les informations de la page et suivez ses instructions.
- « Services » affiche le nombre de services en cours d'exécution et le total. Sélectionnez-le pour afficher l’état et l’étape de démarrage de chaque service.
- Si un service signale un problème, actualisez son état. Pour le redémarrer, suivez « Redémarrer un service » ci-dessous.

#### Afficher les informations sur le système et l'alimentation

« Vue d’ensemble du système » affiche la puce, la version du micrologiciel, celle d’ESP-IDF et la durée de fonctionnement. Pour l’usage courant, vérifiez la version du micrologiciel. ESP-IDF est le cadre logiciel utilisé par l’appareil.

Le côté droit de la carte affiche la tension d'entrée, la tension interne, le courant, la puissance et l'état de protection.

Les paramètres système tels que la mise en réseau, les ventilateurs, la température et l'éclairage sont enregistrés dans l'appareil. L'insertion d'une ancienne carte SD ne les restaure pas. La configuration de l'automatisation est gérée séparément ; sa sauvegarde d'urgence n'est pas une sauvegarde complète de l'appareil.

L'interrupteur à côté de l'état de protection active ou désactive la protection basse tension. Lorsqu'il est activé, l'appareil utilise les tensions et les délais enregistrés pour s'arrêter à basse tension et redémarrer une fois l'alimentation rétablie.

#### Afficher le réseau et l'heure

« Réseau et heure » affiche Ethernet, WiFi, l'adresse IP, l'heure actuelle, l'état de synchronisation, la source horaire et le fuseau horaire.

- Sélectionnez « Sync Time » pour copier l'heure actuelle du navigateur sur l'appareil.
- Sélectionnez « Fuseau horaire », choisissez un préréglage ou entrez un paramètre de fuseau horaire pris en charge, puis enregistrez.
- Sélectionnez « OTA Update » pour ouvrir la page de mise à jour du micrologiciel.

#### Opérations avancées

##### Redémarrer TianshanOS

Un redémarrage interrompt temporairement la WebUI et la gestion des appareils. Terminez les opérations actives, puis sélectionnez « Redémarrer » et confirmez. Attendez que l'appareil soit récupéré, puis rouvrez WebUI.

##### Redémarrer un service

Le redémarrage d'un service interrompt temporairement la fonction qu'il fournit. Ouvrez « État du service », recherchez le service concerné et sélectionnez « Redémarrer » sur cette ligne. Vérifiez à nouveau son état une fois l'opération terminée.

##### Modifier les paramètres d'arrêt

Ces paramètres contrôlent le moment où l'appareil s'éteint après une chute de tension et le moment où il redémarre après le rétablissement de l'alimentation. Utilisez des valeurs qui correspondent aux besoins en énergie de votre appareil.

Sélectionnez « Paramètres d'arrêt » pour modifier :

- « Seuil de basse tension » : démarre le compte à rebours d'arrêt en dessous de cette tension.
- « Seuil de tension de récupération » : démarre la récupération au-dessus de cette tension.
- « Compte à rebours d'arrêt » : définit le délai avant l'arrêt après la détection d'une basse tension.
- « Temps de maintien de la récupération » : définit le temps d'attente utilisé pour confirmer une récupération de puissance stable.
- « Fan Stop Delay » : définit le délai avant l'arrêt des ventilateurs après l'arrêt.

Enregistrez le formulaire pour appliquer les paramètres de protection mis à jour.

<!-- operational-note -->
Après avoir ouvert « Paramètres d'arrêt », attendez que les paramètres actuels se chargent. Si la page indique qu'elle affiche les paramètres par défaut, ne les traitez pas comme les paramètres actuels de l'appareil. Vérifiez les tensions et les temps d'attente avant de sauvegarder. Vous pouvez annuler pendant le chargement.

##### Changer la cible supérieure USB

Le changement de cible USB peut déconnecter temporairement un périphérique connecté. Confirmez l'objectif et terminez le travail actif avant de continuer.

Les appareils prenant en charge la commutation USB affichent un bouton « USB ». Chaque clic fait basculer le port USB supérieur vers la cible suivante : ESP, ordinateur d’inférence, puis ordinateur d’applications. « Déconnecté » signifie qu'aucune cible n'est connectée. Vérifiez la cible affichée sur le bouton et le message de la page pour confirmer le résultat.

### 3. Panneau de périphérique

Le « Panneau des périphériques » se trouve sur la page « Système ». Il contient des commandes d'alimentation de module, des actions rapides et des widgets de données.

#### Contrôler l'ordinateur d’inférence et l'ordinateur d’applications

« Ordinateur d’inférence » remplace l’ancien libellé AGX ; « Ordinateur d’applications » remplace LPMU. Les identifiants et commandes peuvent toujours utiliser `agx` et `lpmu`. Ne renommez pas ces identifiants vous-même.

Enregistrez le travail sur le module et terminez son processus d'arrêt normal avant de couper l'alimentation. Une mise hors tension forcée peut entraîner la perte de données non enregistrées.

- « Alimentation de l’ordinateur d’inférence » indique l’état du contrôle d’alimentation. Sélectionnez ce bouton pour allumer ou éteindre l’ordinateur, puis attendez la confirmation.
- Dans « Alimentation de l’ordinateur d’applications », « Accessible par le réseau » et « Inaccessible par le réseau » indiquent si une connexion réseau est possible. Si la vérification échoue, l’état de l’alimentation reste inconnu. Ces résultats ne suffisent pas à savoir si l’ordinateur est allumé ou éteint.
- La sélection du bouton Ordinateur d’applications déclenche la même action que l’appui sur son bouton d’alimentation physique. Attendez le contrôle et le résultat affiché. Si le résultat est inconnu, vérifiez l'ordinateur et le réseau avant d'appuyer à nouveau sur le bouton.

#### Utiliser des actions rapides

Un utilisateur root configure les cartes d’actions rapides. Leur affichage et l’autorisation de lancer une tâche sont deux réglages distincts. Une carte visible ne permet pas toujours de lancer sa tâche.

1. Lisez le nom et la description de la carte pour identifier la tâche.
2. Sélectionnez « Démarrer » ou la carte et lisez le résultat. Ne le redémarrez pas pendant le traitement.
3. Un message exécuté ou mis en file d'attente nécessite toujours une vérification réelle des résultats sur le périphérique ou la tâche cible. Si un état de service est affiché, distinguez « Processus en cours d'exécution » de « Prêt ». Une carte comportant plusieurs tâches peut afficher « Certaines tâches ne sont pas prêtes ».

Les cartes avec des tâches en arrière-plan à distance proposent également « Afficher le journal » et « Arrêter ». Ouvrez les journaux pour examiner les tâches associées. Si plusieurs enregistrements apparaissent, choisissez par nom de tâche et hôte d'origine. Vérifiez la cible avant de l'arrêter, attendez le résultat, puis vérifiez qu'elle s'est arrêtée. La fermeture du journal ou l'arrêt des mises à jour du journal n'arrête pas la tâche.

« Historique d’exécution » contient aussi des tâches lancées auparavant. Leur présence ne prouve pas qu’elles sont toujours actives. Sélectionnez « Vérifier l’état distant » si nécessaire. Ouvrez l’historique depuis la carte concernée, Système ou Automatisation (chapitre 11). Si une commande est indisponible ou si le résultat reste incertain, consultez l’historique et les journaux système.

Si la tâche ne peut pas démarrer, suivez le motif affiché. N’appuyez pas plusieurs fois sur Démarrer :

- Règle désactivée ou déclenchement manuel non autorisé : vérifiez les paramètres de la règle sur “Automation” (Chapitre 12). Une carte visible ne constitue pas une autorisation de l'exécuter.
- Une tâche ou une opération en arrière-plan est en cours : Attendez son résultat. Ne le redémarrez pas.
- Un enregistrement d'exécution existe déjà pour la tâche : vérifiez l'état et les journaux de la tâche d'origine au lieu de la redémarrer. S'il doit se terminer, arrêtez-le et vérifiez-le. Cochez « Historique d’exécution » et les journaux système si vous ne parvenez pas à le résoudre.
- Configuration non chargée, élément requis manquant ou automatisation en pause : vérifiez la configuration et son état d’activation sur “Automation” (chapitres 12 et 13).

Si la page signale un démarrage automatique ou une nouvelle tentative d'attente, laissez-la continuer. Les échecs de démarrage temporaires sont réessayés toutes les 30 secondes pendant 6 minutes maximum. Un démarrage non confirmé est vérifié avant un autre lancement. Une exécution manuelle ayant échoué n’est pas automatiquement répétée. Une fois l'attente terminée, vérifiez l'appareil et le réseau comme indiqué avant de décider si vous souhaitez sélectionner « Démarrer ».

<!-- operational-note -->
Après avoir déclenché une action, attendez quelques secondes avant d’en lancer une autre. La fermeture de la page, la suppression d'une carte ou le redémarrage de TianshanOS n'arrêtent pas les services en arrière-plan sur les hôtes distants. Pour maintenir un service arrêté, désactivez toute règle automatique susceptible de le relancer sur Automation.

Appuyez et maintenez une carte jusqu'à ce que l'indicateur de réorganisation apparaisse, puis faites-la glisser pour modifier l'ordre d'affichage.

Si aucune carte n’apparaît, lisez l’explication. Attendez si la configuration est en cours de chargement. Si le chargement échoue, conservez la raison et vérifiez “System Logs” sur le terminal. Si aucune action rapide n'est configurée, sélectionnez “Open Automation” et vérifiez le paramètre “Show on panel” des règles.

<!-- operational-note -->
La modification ou l'importation d'une règle met à jour la configuration actuelle ; un redémarrage n'est pas nécessaire pour changer de règle. Si la tâche d'une carte a été modifiée, examinez ses conditions, ses actions et ses cibles avant de l'exécuter.

Ne redémarrez pas un appareil fournissant des services actifs uniquement pour restaurer une carte.

#### Gérer les widgets de données

Les widgets de données affichent et actualisent les données de l’appareil dans le « Panneau des appareils ».

1. Sélectionnez « Gestionnaire de widgets ».
2. Choisissez un intervalle d'actualisation ou désactivez l'actualisation automatique.
3. Ajoutez un widget prédéfini ou choisissez un style de composant et une source de données proposés par la page.
4. Modifiez son étiquette, son style d'affichage et son unité selon vos besoins, puis enregistrez.

Les widgets existants peuvent être modifiés, supprimés et réorganisés. Vous pouvez également sélectionner une carte de widget pour la modifier. Appuyez longuement sur un widget, puis faites-le glisser vers une nouvelle position.

« Petit », « Moyen » et « Grand » utilisent une, deux et trois colonnes ; ils s'intègrent dans des écrans plus étroits. Lors de la modification d'une icône, saisissez son nom en utilisant l'exemple sur la page. Chaque valeur d'un widget à double valeur possède son propre paramètre de données. Vérifiez que les deux sources sont correctes et que les données sont mises à jour.

« Échec du chargement des widgets de données » ne signifie pas qu'aucune configuration n'existe. Résolvez la cause et relisez-la. Si l'enregistrement échoue ou si son résultat n'est pas confirmé, conservez le contenu actuel et vérifiez le message. Voir vos modifications sur la page ne confirme pas qu’elles ont été enregistrées.

### 4. Gestion des ventilateurs

<!-- operational-note -->
« Contrôle du ventilateur » se trouve sur la page « Système ». Les cartes de ventilateur montrent les ventilateurs fournis par votre appareil. Vérifiez le numéro du ventilateur avant de modifier une courbe.

#### Afficher l'état du ventilateur

La barre d’état affiche « Température effective » et « Sortie actuelle ». Le grand pourcentage indique le réglage de régulation confirmé par l’appareil, pas la vitesse mesurée. RPM indique le nombre de tours par minute mesuré et reste masqué sans mesure valide. Si le grand affichage indique `--`, la sortie actuelle n’est pas confirmée.

Lorsque vous déplacez le curseur manuel, la valeur à côté indique le réglage que vous allez demander. Le grand pourcentage indique toujours la sortie actuelle. Relâchez le curseur, puis vérifiez le message et la valeur actualisée. Si la demande et la sortie actuelle diffèrent, ne considérez pas le réglage comme appliqué.

Le mode intelligent affiche son état : « Mode intelligent », « Suivi de la courbe », protection ou température non valide. Il affiche aussi la température de référence de sécurité, la température prévue dans 45 secondes et la vitesse de variation de la température.

Si la température devient invalide, vérifier que sa source est toujours à jour. L'appareil passe en contrôle de protection contre la perte de température. Sélectionnez « TTI » pour une explication du contrôle thermique intelligent.

Utilisez le bouton d'actualisation dans l'en-tête de section pour récupérer l'état actuel. Si le réglage échoue ou si la sortie n'est pas confirmée, vérifiez l'appareil avant de décider de réessayer.

#### Sélectionnez un mode de fonctionnement

| Mode | Objectif |
| --- | --- |
| « Désactivé » | Arrête le ventilateur. |
| « Manuel » | Utilise un pourcentage de contrôle fixe défini avec le curseur 0-100%. |
| « Courbe » | Suit la courbe configurée entre la température et le pourcentage de contrôle. |
| « Intelligent » | Utilise la courbe de base, les tendances de température et les ajustements passés pour contrôler le refroidissement. Utilise un contrôle de protection en cas de besoin. |

L'arrêt d'un ventilateur ou le réglage d'une valeur manuelle basse réduit le refroidissement. Vérifiez d’abord la charge et la température et continuez à les surveiller. Le curseur est disponible uniquement en mode manuel lorsque la sortie actuelle est confirmée.

#### Configurer une courbe de ventilateur

Sélectionnez « Courbe » dans l'en-tête de la section Contrôle du ventilateur pour ouvrir « Gestion des courbes de ventilateur ». Le bouton « Courbe » à l’intérieur d’une carte change uniquement le mode de fonctionnement.

1. Sous « Ventilateur », choisissez le nombre à ajuster et vérifiez-le par rapport à la page Système.
2. Sous « Liaison des variables de température », ajoutez des variables de température et attribuez des poids.
3. Sélectionnez « Relier ». La source de température est partagée par les ventilateurs en modes Courbe et Intelligent, donc sa modification affecte les ventilateurs utilisant cette source.
4. Ajoutez ou modifiez des « nœuds de courbe ». Chaque courbe nécessite au moins des nœuds 2 et prend en charge jusqu'à 10.
5. Définissez la « Vitesse minimale » et la « Vitesse maximale » comme pourcentages de contrôle. Le minimum ne doit pas dépasser le maximum.
6. Réglez « Hystérésis de température » et « Intervalle minimum ». L’hystérésis accepte 0-20°C et limite les réglages fréquents dus à de petites variations de température. L’intervalle accepte 500-30000 ms. 1000 ms correspondent à 1 seconde.
7. Sélectionnez « Enregistrer la courbe ». Après une sauvegarde réussie, le ventilateur sélectionné passe en mode Courbe. Pour utiliser le contrôle thermique intelligent, revenez à la carte et sélectionnez « Smart ».

Si l'enregistrement échoue, lisez le message et vérifiez l'état actuel avant de réessayer. Après avoir dissocié les variables de température, vérifiez également la température effective et l’état du ventilateur.

<!-- operational-note -->
Après avoir ouvert les paramètres ou choisi un autre ventilateur, attendez que ses paramètres actuels se chargent. Si la page indique qu'elle affiche les valeurs par défaut ou une version antérieure, ces valeurs ne confirment pas les paramètres actuels de l'appareil. Vérifiez-les avant de les enregistrer. Vérifiez également les résultats de lecture et d'enregistrement pour les liaisons de température.

Si le message indique que les paramètres du ventilateur ont été appliqués mais pas entièrement enregistrés, le réglage actuel est peut-être déjà en vigueur. Un redémarrage peut restaurer les paramètres antérieurs. Vérifiez l'état réel du ventilateur, confirmez que le stockage de l'appareil est disponible, puis enregistrez à nouveau. Ne redémarrez pas l'appareil uniquement pour tester si la sauvegarde a fonctionné.

#### Importer et exporter une courbe

- Sélectionnez « Importer Config » et choisissez un fichier de courbe JSON. JSON est le format de fichier utilisé pour stocker les données de courbe. Passez en revue les nœuds, les limites et le numéro de ventilateur, puis sélectionnez « Enregistrer la courbe » pour les appliquer.
- Sélectionnez « Exporter la configuration » pour télécharger la courbe actuelle. La page tente également d'enregistrer une copie sous `/sdcard/config` sur la carte SD. Vérifiez séparément le téléchargement du navigateur et le résultat de la carte SD rapporté.

#### Utiliser une température de test

Une température de test remplace temporairement la source normale et affecte le contrôle Curve ou Smart. Surveillez le ventilateur et l’appareil tout au long du test.

1. Entrez 0-100°C sous « Test Temp ».
2. Sélectionnez « Test » et observez la sortie actuelle, l'état et la réponse du ventilateur.
3. À la fin du test, sélectionnez « Effacer le test ». Vérifiez que la température effective provient à nouveau de sa source habituelle.

### 5. Gestion des LED

« LED Control » se trouve sur la page « Système » et affiche les LED fournies par l'appareil. Les fonctionnalités disponibles varient selon les LED.

#### Contrôles de routine

- Utilisez le bouton ampoule situé en bas d'une carte pour allumer ou éteindre la LED.
- Utilisez les curseurs de luminosité, de teinte et de saturation. La luminosité contrôle la luminosité de la lumière ; la teinte choisit la couleur ; la saturation se déplace entre le blanc et la couleur. La saturation à 0 donne une lumière blanche. Les changements de teinte et de saturation sont appliqués lorsque vous relâchez le curseur.
- Utilisez le bouton d'animation pour ouvrir les « Paramètres LED ». Sélectionnez une animation sous « Animation programmatique », puis utilisez son contrôle de lecture ou d'arrêt.
- Sélectionnez l'icône de sauvegarde en bas à droite de la carte pour enregistrer la configuration actuelle des LED.
- Sélectionnez « All Off » pour éteindre toutes les LED et vérifier le résultat rapporté. Si certains échouent, vérifiez ces appareils.

#### Fonctionnalités avancées de la matrice LED

Les cartes de la matrice proposent des icônes pour les fonctions disponibles. Ouvrez une fonction, puis changez de groupe dans « Paramètres LED » :

- « Animation programmatique » : sélectionnez et exécutez une animation.
- « Image/Code QR » : Choisissez une image ou un code QR sous « Type » dans la carte, puis sélectionnez une image de la carte SD ou saisissez le contenu QR.
- « Affichage du texte » : définissez le texte, la police, l'alignement, le défilement, le premier plan et l'arrière-plan.
- « Filtre de post-traitement » : Choisissez un filtre et des paramètres, puis appliquez-le ou arrêtez-le.
- « Correction des couleurs » : ajustez l'affichage et utilisez les commandes de réinitialisation, d'importation ou d'exportation disponibles.

Vérifiez la lumière réelle ou l'affichage matriciel après avoir appliqué une modification. Utilisez uniquement les fonctionnalités affichées. Si un paramètre échoue, suivez le message pour vérifier l’état du fichier, de l’entrée ou du périphérique.

### 6. Gestion du réseau

<!-- operational-note -->
Sélectionnez « Réseau » dans la navigation supérieure pour ouvrir « Paramètres réseau ». La modification des paramètres du mode réseau, du point d'accès ou de NAT peut interrompre la connexion WebUI actuelle. Avant d'enregistrer, assurez-vous que vous pouvez vous reconnecter via la nouvelle adresse réseau.

#### Afficher l'état du réseau

Le haut de la page affiche l'état d'Ethernet, du client WiFi et du point d'accès WiFi. Ouvrez le panneau associé pour afficher l'adresse IP, le masque de sous-réseau, la passerelle, DNS, l'adresse MAC, SSID, le signal et le nombre d'appareils connectés lorsqu'ils sont disponibles.

Le panneau Ethernet affiche les informations actuelles sur la liaison et l'adresse. Il ne fournit pas de contrôles d'édition d'adresse.

#### Sélectionnez un mode Wi-Fi

| Mode | Objectif |
| --- | --- |
| « Désactivé » | Désactive WiFi. |
| «Gare (STA)» | Connecte l'appareil à un réseau WiFi existant. |
| « Point d'accès (AP) » | Permet à l'appareil de fournir un point d'accès WiFi. |
| « STA+AP » | Se connecte à un réseau WiFi existant tout en gardant le point d'accès de l'appareil disponible. |

Après avoir choisi un mode, attendez que la page actualise l'état. La connexion sans fil actuelle peut être interrompue pendant le changement.

#### Connectez-vous au Wi-Fi

1. Réglez le mode WiFi sur « Station (STA) » ou « STA+AP ».
2. Sous « Station », sélectionnez « Scan ».
3. Choisissez un réseau dans la liste. La liste affiche SSID, la force du signal, le canal et le type d'authentification.
4. Saisissez le mot de passe et confirmez. Laissez le mot de passe vide pour un réseau ouvert.
5. Attendez que l'état passe à « Connecté », puis confirmez la nouvelle adresse IP.

Sélectionnez « Déconnecter » pour mettre fin à la connexion client WiFi actuelle.

#### Configurer le point d'accès WiFi

1. Réglez le mode WiFi sur « Access Point (AP) » ou « STA+AP ».
2. Sous « Hotspot », sélectionnez « Config ».
3. Entrez le SSID. Un mot de passe vide crée un point d'accès ouvert ; un point d'accès protégé nécessite au moins des caractères 8.
4. Sélectionnez un canal et activez « Masquer SSID » si nécessaire.
5. Sélectionnez « Appliquer » et attendez que l'état du point d'accès soit mis à jour.

Sélectionnez « Appareils » pour afficher les clients actuellement connectés au point d'accès.

#### Définir le nom d'hôte

Entrez un nouveau nom dans la section « Nom d'hôte » sous « Services réseau », puis sélectionnez « Définir ». La page affiche le nom d'hôte actuel après sa mise à jour.

#### Afficher les clients DHCP

DHCP attribue automatiquement des adresses réseau aux appareils connectés. Sélectionnez « Clients », choisissez « WiFi AP » ou « Ethernet » et affichez les baux en cours. Utilisez le bouton Actualiser pour recharger la liste.

#### Opérations réseau avancées

##### Configurer la passerelle NAT

NAT transmet le trafic réseau entre les interfaces réseau de l'appareil. Activez ou désactivez NAT, puis sélectionnez « Enregistrer » pour conserver le paramètre. Vérifiez ensuite l'état du WiFi et d'Ethernet.

##### Accéder au réseau en amont via l'ordinateur d’applications

Cette opération utilise l'ordinateur d’applications configuré pour configurer l'accès au réseau. Sur le système, basculez d’abord USB sur « Ordinateur d’applications » et vérifiez les câbles réseau. Son hôte SSH doit utiliser l'authentification par clé et disposer d'une empreinte d'hôte vérifiée. Vérifiez les paramètres d'hôte, de clé et d'empreinte à l'aide du Guide de sécurité.

Obtenez le mot de passe sudo du compte SSH sur cet hôte. Ce mot de passe autorise les modifications du système et peut différer du mot de passe WebUI.

1. Sous « Accès au réseau en amont », sélectionnez « Accès via l'ordinateur d’applications ».
2. Entrez le mot de passe sudo de l'ordinateur d’applications et sélectionnez le bouton d'accès. Le mot de passe est utilisé uniquement pour cette exécution et n'est pas enregistré ; saisissez-le à nouveau pour une exécution ultérieure.
3. Attendez la fin de l'opération. Ne le redémarrez pas pendant le traitement.
4. L'accès est confirmé uniquement lorsque le résultat indique à la fois une connexion Internet et une configuration réseau terminée.
5. Après avoir fermé la fenêtre de résultats, sélectionnez « Afficher le résultat » pour l'ouvrir à nouveau. En cas d'échec ou si le résultat n'est pas confirmé, lisez la raison et l'étape de l'échec. Développez « Journal d'exécution » pour plus de détails. Vérifiez le mot de passe pour une erreur de mot de passe, ou le câblage et le réseau en amont si aucune connexion Internet n'est trouvée.

Si l'empreinte de l'hôte n'est pas confirmée ou a changé, vérifiez d'abord l'identité de l'hôte sur Sécurité. Ne réessayez pas d’accéder et n’ignorez pas la vérification. La sortie du script distant peut rester dans sa langue d'origine ; conservez-le pour enquête si nécessaire.

Un échec de demande d'état ne signifie pas que le script s'est arrêté. Utilisez le contrôle « Actualiser l'état » disponible pour vérifier l'exécution en cours avant de décider de réessayer.

### 7. Gestion des fichiers

Sélectionnez « Fichiers » dans la navigation supérieure pour ouvrir le « Gestionnaire de fichiers ».

La carte SD est un stockage amovible et SPIFFS est un stockage de fichiers interne à l'appareil. Sélectionnez « Carte SD » ou « SPIFFS » pour changer d'emplacement. Le chemin en haut montre votre dossier actuel. Sélectionnez un nom de dossier dans le chemin pour y revenir.

#### Parcourir et gérer les fichiers

- Sélectionnez un nom de dossier pour l'ouvrir.
- Sélectionnez le bouton de téléchargement à côté d'un fichier pour l'enregistrer à l'emplacement de téléchargement du navigateur.
- Sélectionnez le bouton Renommer, saisissez un nouveau nom et confirmez.
- Sélectionnez « Nouveau dossier », saisissez un nom de dossier et créez-le.
- Sélectionnez le bouton d'actualisation pour recharger le répertoire actuel et l'état de stockage.

L’envoi, la suppression, le renommage de fichiers, la création de dossiers et le montage ou démontage de la carte SD exigent une session valide. Lire et télécharger des fichiers protégés d’Automatisation exige aussi les droits root. Vérifiez que la session root est valide et utilisez les pages de configuration. Ne changez pas de chemin ou d’entrée pour contourner les permissions.

#### Envoyer des fichiers

Les fichiers peuvent être envoyés uniquement sur la carte SD, pas dans SPIFFS. Vérifiez d’abord que la carte SD est montée.

1. Sélectionnez « Carte SD » et ouvrez le dossier où vous souhaitez envoyer les fichiers.
2. Sélectionnez « Envoyer des fichiers ».
3. Sélectionnez un ou plusieurs fichiers, ou faites-les glisser dans la zone d’envoi.
4. Vérifiez la liste des fichiers à envoyer et retirez ceux dont vous n’avez pas besoin.
5. Sélectionnez « Envoyer » et attendez la confirmation pour chaque fichier.

L’envoi d’un paquet `.tscfg` ouvre les étapes de vérification et d’application. Cette page de fichiers n’applique pas encore les réglages du paquet. Un envoi ou une vérification réussi ne signifie pas que les réglages sont actifs.

Importez les paquets de règles depuis « Automatisation », selon le chapitre 12. Un simple envoi de fichiers ne remplace pas l’importation de règles. Pour l’origine et la signature des autres paquets, consultez le Guide de sécurité.

#### Opérations par lots

Après avoir sélectionné des fichiers ou des dossiers, la barre d'outils batch apparaît.

- « Téléchargement par lots » télécharge les fichiers sélectionnés, sans inclure les dossiers.
- « Suppression par lots » supprime les fichiers et dossiers sélectionnés.
- « Effacer la sélection » efface la sélection actuelle.

#### Supprimer un fichier ou un dossier

La suppression ne peut pas être annulée dans l’interface Web. Supprimer un dossier supprime aussi son contenu. Vérifiez le nom et le chemin avant de choisir « Supprimer » ou « Suppression par lots » et de confirmer.

Les fichiers gérés par Automation sont protégés. Le téléchargement ou l'écrasement de fichiers dans `/sdcard/config/automation`, ou la suppression ou le renommage de ce dossier ou d'un parent le contenant, peuvent être refusés. Si le message indique que Automation gère le fichier, utilisez “Configuration & backup” sur Automation ou la liste appropriée. N'utilisez pas Terminal pour contourner la restriction.

#### Monter et démonter la carte SD

Le démontage de la carte SD rend ses fichiers indisponibles jusqu’au prochain montage. Terminez les envois, les téléchargements et les autres opérations sur les fichiers avant de sélectionner « Démonter SD ».

Le démontage ou le remplacement de la carte peut faire basculer Automation vers sa configuration d'urgence interne. Cette copie est peut-être plus ancienne et les règles automatiques activées peuvent toujours s'exécuter. Sans copie utilisable, Automation peut être indisponible. Passez en revue la configuration et les tâches d'urgence avant le démontage (Chapitre 13). Les images, polices et journaux basés sur des cartes deviennent indisponibles.

Lorsque la carte SD n'est pas montée, la page affiche « Mount SD ». Sélectionnez-le, attendez que l'état passe à « Monté », puis ouvrez à nouveau le répertoire de la carte SD.

Le montage de la carte ne signifie pas que l'Automatisme a basculé dans sa configuration. Après avoir réinséré une carte, choisissez la configuration à utiliser comme décrit au chapitre 13. Rien n'est écrasé ou fusionné automatiquement.

### 8. Mises à jour OTA

Sur la page « Système », sélectionnez « Mise à jour OTA » dans la section « Réseau et heure » pour ouvrir « Mise à niveau du micrologiciel ».

<!-- operational-note -->
L'appareil redémarre lors d'une mise à jour, déconnectant temporairement l'interface Web. Enregistrez le travail actif et maintenez la alimentation de l’appareil stable avant de commencer. N'éteignez pas l'appareil tant que la progression de la mise à jour est incomplète.

#### Première mise à niveau d'une ancienne version vers 0.6.3

La première mise à niveau à partir d'une ancienne configuration de stockage, telle que la version 0.6.2, nécessite un package USB/série correspondant approuvé par le fournisseur. L’envoi du micrologiciel ou de WebUI seul ne suffit pas pour effectuer cette mise à niveau. Demandez à l'administrateur de l'appareil ou au fournisseur de suivre les instructions du package. N'effacez pas l'intégralité du flash et n'utilisez pas une ancienne table de partition.

Enregistrez les fichiers importants avant la mise à niveau. L'outil correspondant préserve les clés et la carte SD ; cela n'efface pas la configuration sur la carte. Le premier démarrage peut toujours lire ou migrer la configuration existante. La livraison au client suit la procédure « effacer l'ancienne configuration et configurer à nouveau ». L'administrateur de l'appareil ou le fournisseur doit suivre les instructions de livraison. N'effacez pas l'intégralité du flash vous-même et ne traitez pas les fichiers conservés comme une configuration terminée.

Gardez l'alimentation connectée pendant la mise à niveau et le premier démarrage. Ensuite, vérifiez la connexion, la mise en réseau, les ventilateurs, l'éclairage, les hôtes SSH et les règles d'automatisation. Passez en revue les règles avant de tester une tâche qui contrôle l’alimentation, redémarre un appareil ou exécute des commandes à distance.

Le package correspondant met à jour les deux emplacements d’application. Ne présumez pas que l’autre emplacement contient toujours l’ancienne version. Si le mot de passe root est perdu, utilisez uniquement une méthode de récupération confirmée par le fournisseur pour correspondre à la mise en page 0.6.3. Ne flashez pas une ancienne image de réinitialisation de mot de passe.

Les méthodes de mise à jour Web ci-dessous s'appliquent uniquement aux versions que l'éditeur a approuvées pour OTA. Ils ne remplacent pas la première mise à niveau de la mise en page.

#### Rechercher des mises à jour à partir d'un serveur OTA

1. Consultez la « version actuelle ». Deux installations 0.6.3 peuvent être des versions de révision différentes. Vérifiez la version complète, la durée de construction et les instructions de l'éditeur plutôt que seulement les trois premiers chiffres.
2. Saisissez l'adresse du serveur OTA fournie par un administrateur ou un éditeur.
3. Sélectionnez “Save” puis sélectionnez “Check Update”.
4. La page signale “Update Available” “Already up to date” une ancienne version du serveur ou une erreur.
5. Confirmez la version cible, puis sélectionnez “Upgrade Now” ou le contrôle de mise à niveau affiché sur la page.
6. Attendez la fin du téléchargement, de l'installation et du redémarrage. Pour annuler, utilisez le bouton “Abort” lorsqu'il est disponible. Toutes les étapes ne prennent pas en charge l'annulation.
7. Attendez la page pour confirmer le firmware après la mise à niveau. Reconnectez-vous au WebUI et vérifiez le “Current Version” et l'état de l'appareil.

“Upgrade Progress” affiche l'étape actuelle dans sa propre section. Une lecture à 100 % ou un message indiquant que les fichiers ont été écrits ne confirme pas un redémarrage et une vérification de version terminés. Si le résultat n'est pas confirmé ou si le micrologiciel en cours d'exécution diffère de la cible, conservez le message et vérifiez la version actuelle. Ne répétez pas la mise à niveau sans vérifier. Vérifiez les journaux système et contactez le fournisseur si nécessaire.

Lorsque “Also upgrade www” est activé, le micrologiciel et WebUI sont mis à jour en séquence. Utilisez le micrologiciel correspondant et les ressources WebUI de la même version. Si l'ancienne interface reste après la mise à niveau, actualisez de force le navigateur et vérifiez à nouveau la version et la page.

#### Mise à niveau manuelle

Développez « Mise à niveau manuelle » et choisissez l'une de ces méthodes :

- « Mise à niveau à partir de l'URL » : saisissez l'URL du micrologiciel, définissez « Mise à niveau également www » conformément aux instructions de publication, puis sélectionnez « Mise à niveau ». Ici, www fait référence aux ressources de l’interface Web de l’appareil.
- « Mise à niveau depuis la carte SD » : saisissez un chemin de micrologiciel tel que `/sdcard/firmware.bin`. Si « Mettre également à niveau www » est activé, assurez-vous que `www.bin` de la même version se trouve dans ce répertoire.

Pour une mise à niveau à partir d'une URL, « Ignorer la vérification du certificat » ignore la vérification du certificat du serveur HTTPS. Cela supprime la vérification du certificat utilisée pour confirmer l’identité du serveur de téléchargement. Laissez-le décoché pour les mises à jour de routine. Si vous voyez une erreur de certificat, demandez à votre administrateur de vérifier l'adresse du serveur et le certificat.

#### Gestion des partitions et restauration

« Gestion des partitions » affiche la partition en cours d'exécution et les autres partitions disponibles.

- « Mark Valid » confirme la version en cours d'exécution et désactive la protection automatique contre la restauration pour cette version. Utilisez-le après avoir confirmé que la version actuelle fonctionne correctement.
- « Revenir à cette version » sélectionne une autre version amorçable et passe par un redémarrage. La restauration interrompt les services actuels. Confirmez d'abord la version cible et la compatibilité des données.

Une fois l'opération et le redémarrage terminés, rouvrez l'interface utilisateur Web et vérifiez la version actuelle et l'état de l'appareil.

La version 0.6.3 modifie le stockage de la configuration et la disposition des partitions de périphérique. Ne revenez pas directement à un ancien firmware incompatible. Si une rétrogradation est nécessaire, demandez au fournisseur de l'appareil de confirmer une procédure complète de récupération du micrologiciel, de la configuration et de la configuration.

La restauration ne restaure pas l'ancien format de configuration et ne garantit pas que les anciennes règles fonctionneront.

### 9. Entrée de gestion de la sécurité

Sélectionnez « Sécurité » dans la navigation supérieure pour ouvrir la gestion de la sécurité. Utilisez le Guide de sécurité TianshanOS pour les clés SSH, les hôtes distants, les empreintes d'hôte connu, les certificats HTTPS, les packages de configuration et la gestion des comptes. Ces procédures ne sont pas répétées ici.

#### Opérations ayant échoué ou non confirmées

Un champ d'erreur rouge vous indique ce qu'il faut corriger. Corrigez-le, puis enregistrez. Une marque d'erreur effacée ne confirme pas une sauvegarde réussie ; vérifiez le message et la liste.

Identifiez l’opération qui a échoué, puis lisez le motif et l’étape suivante. Si le message ne donne aucun motif, ne le devinez pas.

Sélectionnez “Details” lorsque disponible. Sélectionnez “Hide” pour masquer les détails. Si un bouton × s'affiche, sélectionnez-le pour ignorer le message. Pour des vérifications plus approfondies, conservez une trace du message et des détails, puis ouvrez “System Logs” sur le terminal pour enquêter.

Si un message ou ses détails sont longs, faites défiler cette zone pour lire l'intégralité du contenu avant de décider quoi faire ensuite.

Si le résultat n’est pas confirmé, actualisez et vérifiez l’état de l’appareil, du fichier ou de la tâche. Un délai expiré ou une déconnexion ne signifie pas que l’opération n’a pas été exécutée. Ne répétez pas aussitôt une opération d’alimentation, de suppression, de lancement de tâche ou de mise à jour. Si le résultat reste inconnu, ouvrez « Journaux système » dans Terminal pour vérifier la cause.

Vérifiez séparément les résultats de lots réussis, échoués et non confirmés. Confirmez les fichiers enregistrés dans la liste de téléchargement du navigateur.

## Partie II : Fonctions réservées à root

### 10. Journaux du terminal et du système

« Terminal » s'affiche uniquement pour root. Il peut exécuter directement les commandes de la console de l'appareil et afficher les journaux de l'appareil. Une commande peut changer l'état de l'appareil immédiatement. Confirmez sa source, ses paramètres et son impact avant de le saisir.

#### Se connecter et utiliser le terminal

1. Sélectionnez « Terminal » dans la navigation supérieure.
2. Attendez « Connecté à l'appareil » et l'invite `tianshan>`.
3. Entrez `help` pour afficher les commandes fournies par le micrologiciel actuel.
4. Entrez une commande et appuyez sur Entrée. Attendez la fin de sa sortie et l'invite de retour.

Les commandes ne sont pas exécutées tant que la page affiche « Non connecté à l’appareil ». Après une coupure, attendez le message de reconnexion avant de renvoyer une commande pour éviter de l’exécuter deux fois.

Si une autre session de terminal est en cours d'utilisation, fermez d'abord le terminal d'origine. Si les connexions sont pleines, attendez la reconnexion plutôt que d’ouvrir d’autres onglets. Après une connexion expirée, reconnectez-vous et attendez que le Terminal confirme la connexion.

Pendant qu'une commande est active, attendez qu'elle soit terminée ou demandez un arrêt. Si la page indique qu'elle attend que la tâche se termine en toute sécurité, l'arrêt est toujours en cours. Attendez l'invite avant de saisir une autre commande. Si la sortie est incomplète, vérifiez le résultat de la tâche et les journaux système séparément. Une sortie manquante n’est pas une raison pour réexécuter la commande.

Le terminal propose ces commandes au clavier :

| Commande | Objectif |
| --- | --- |
| Ctrl+C | Efface l'entrée actuelle et demande une interruption. La commande doit prendre en charge l'interruption pour qu'elle s'arrête. |
| Ctrl+L | Effacer l'écran. |
| ↑ / ↓ | Parcourir l'historique des commandes à partir de la session de page en cours. |
| ← / → | Déplace le curseur dans l'entrée actuelle. |

« Effacer » en haut de la page efface uniquement l'affichage. Il n'annule pas les commandes déjà exécutées. « Déconnecter » met fin à la connexion actuelle du terminal.

#### Ouvrir un shell SSH distant

Un shell SSH envoie les entrées clavier ultérieures à un hôte distant. Confirmez l'adresse cible, l'utilisateur et la méthode d'authentification, puis effectuez la préparation SSH décrite dans le Guide de sécurité avant de vous connecter. Si le terminal Web nécessite une vérification de l'hôte, vérifiez et confirmez l'empreinte sur Sécurité avant de vous reconnecter. Ne répondez pas à une confirmation dans une console série ou sur le terminal d'une autre personne en son nom.

1. Entrez `ssh --help` pour afficher les options de la commande SSH.
2. Entrez `ssh --host <host> --user <user> --shell`, en remplaçant chaque espace réservé, y compris ses crochets angulaires, par la valeur réelle. Pour spécifier un port, ajoutez `--port <port>` avant --shell.
3. Attendez la confirmation de la connexion à distance avant de saisir des commandes à distance.
4. Appuyez sur Ctrl+\ pour quitter le shell SSH et revenir à l'invite tianshan>.

Ne saisissez pas d'informations d'identification en texte clair lorsque le terminal est partagé, enregistré ou consulté par une autre personne.

#### Afficher les journaux système

Sélectionnez « Journaux système » en haut du terminal pour ouvrir la fenêtre du journal.

- « Niveau » définit le niveau minimum affiché. Utilisez ERROR, WARN+, INFO+ ou DEBUG+ pour affiner la sortie.
- « TAG » filtre par source de journal.
- « Recherche » filtre les journaux actuels par mot-clé.
- « Défilement automatique » suit les nouvelles entrées du journal lorsqu'il est activé.
- Le bouton Actualiser recharge les journaux historiques.
- Le bouton Effacer efface uniquement les journaux actuellement affichés dans la fenêtre.

Si le filtrage ne produit aucune sortie, effacez d'abord TAG et Search, puis modifiez le niveau. La fermeture de la fenêtre du journal n'arrête pas les services de l'appareil.

#### Vérifiez où l'automatisation est enregistrée

Pour une vérification de ligne de commande, entrez `auto --config status` pour afficher l'emplacement de configuration actuel et l'état de la sauvegarde. Utilisez `auto --help` pour les options disponibles. L'ancienne option `config --sync` a été supprimée. Utilisez les étapes Web du chapitre 13 pour la sauvegarde et la récupération de routine.

### 11. Gérer et exécuter des commandes à distance

« Commandes » enregistre des commandes SSH réutilisables et les exécute sur l’hôte distant choisi. Les hôtes et leurs données d’authentification se gèrent dans « Sécurité ». Consultez le guide de sécurité pour ces étapes.

#### Vérifiez l'empreinte digitale de l'hôte avant de vous connecter

L’empreinte aide à identifier l’hôte auquel vous vous connectez. Ces étapes concernent les tests d’hôtes SSH dans la page Web « Sécurité », pas la confirmation de SSH Shell dans Terminal. Si le message indique une empreinte non enregistrée ou modifiée, ne répétez pas la commande. Ouvrez « Sécurité », trouvez l’hôte SSH et sélectionnez « Tester ».

Lors de la première connexion, la boîte de dialogue affiche l’adresse et l’empreinte de l’hôte. Comparez-les avec l’administrateur par un canal fiable. Sélectionnez « Faire confiance et se connecter » uniquement après avoir confirmé leur correspondance.

Si l’empreinte a changé, la boîte de dialogue affiche l’ancienne et l’actuelle, avec « Annuler » sélectionné par défaut. Une réinstallation peut modifier l’empreinte, mais le changement peut aussi signaler un autre hôte ou une usurpation.

Vérifiez l’adresse et confirmez la cause du changement par un canal fiable. Si vous ne pouvez pas la confirmer, sélectionnez « Annuler ». Ne supprimez pas l’ancienne empreinte pour contourner la vérification. Sélectionnez « Mettre à jour la clé de l’hôte » seulement après avoir confirmé la fiabilité de la nouvelle empreinte.

#### Sélectionnez un hôte et affichez les commandes

1. Sélectionnez « Commandes » dans la navigation supérieure.
2. Choisissez un hôte actuellement affiché sous « Sélectionner un hôte ».
3. Consultez ses éléments enregistrés sous « Liste de commandes ».

Le texte de la commande est réduit par défaut. Sélectionnez « Afficher la commande » pour voir toutes ses lignes, ou « Masquer la commande » pour la réduire. Développer le texte ne l'exécute pas.

Les « commandes orphelines » n'ont pas d'hôte utilisable et ne peuvent pas s'exécuter. Préparez un hôte valide, modifiez la commande, choisissez cet hôte et examinez le contenu. Activez-le et enregistrez-le uniquement lorsque l'exécution est autorisée. Vérifiez les modèles et les règles qui l'utilisent. Une nouvelle commande portant le même nom n'est pas nécessaire simplement pour la reconnecter à un hôte.

Pour changer l’adresse, le port, le compte ou la clé d’un hôte, utilisez son bouton d’édition dans la liste SSH de Sécurité. Le Guide de sécurité donne la procédure. Les changements concernent les connexions futures ; les tâches déjà lancées conservent les données d’origine dans leur historique d’exécution. Avant de supprimer une clé, consultez les hôtes et l’historique associés. La suppression ne termine pas les tâches distantes, mais peut empêcher cet appareil de les vérifier ou de les arrêter.

#### Créer ou modifier une commande

<!-- operational-note -->
Une commande enregistrée s'exécute sur un hôte distant. Vérifiez la commande et les autorisations requises sur cet hôte avant de l'enregistrer. Faites particulièrement attention aux commandes qui suppriment des données, arrêtent ou redémarrent un hôte ou écrasent des fichiers.

1. Sélectionnez un hôte, puis sélectionnez « Nouvelle commande ». Utilisez le bouton Modifier sur une commande existante pour la modifier.
2. Saisissez un « ID de commande » unique, tel que `model.v1` . N'utilisez pas de sauts de ligne, de caractères de contrôle, de barres obliques ou uniquement `.` ou `..` . Il peut contenir jusqu'à 31 lettres ou chiffres anglais ; Le chinois et certains autres caractères utilisent plus d'espace. Suivez le message de longueur du champ.
3. Saisissez « Nom de la commande » et « Commande ». Placez chaque commande sur une ligne distincte lorsque vous utilisez plusieurs lignes.
4. Ajoutez une description et choisissez une icône ou une image sur la carte SD si nécessaire.
5. Vérifiez l’hôte, l’état d’activation, le mode d’exécution et les options de correspondance de sortie, puis sélectionnez « Enregistrer ». Créer un identifiant déjà utilisé produit une erreur sans écraser la commande existante. Pour la modifier, utilisez son bouton d’édition.

Le nom vous aide à reconnaître une commande ; L'automatisation utilise son identifiant pour le trouver. Vous ne pouvez pas modifier l'ID d'une commande existante. Pour utiliser un nouvel ID, créez une commande et mettez à jour les modèles et les sources qui l'utilisent.

#### Exécuter une commande et examiner le résultat

1. Sélectionnez le contrôle d'exécution sur une carte de commande.
2. Regardez la sortie et l'état sous « Résultat de l'exécution ».
3. Lorsque « Annuler » s'affiche, utilisez-le pour demander l'interruption de la session en cours. Vérifiez l'état et la sortie pour confirmer s'ils se sont arrêtés. Les opérations à distance terminées ne sont pas annulées.
4. Sélectionnez « Effacer » pour supprimer l'affichage du résultat actuel.

« Effacer » n’annule pas ce qui a déjà été exécuté sur l’hôte distant. Le classement en réussite ou en échec, le contenu extrait et l’état final dépendent des critères configurés pour la commande.

La page vérifie le résultat de cette exécution sans réexécuter la commande. Si la vérification automatique des résultats s'interrompt, rouvrez les commandes dans le même onglet du navigateur pour continuer la vérification. La déconnexion, le redémarrage de l'appareil ou un résultat qui n'est plus conservé peuvent empêcher la récupération. Vérifiez l'état distant réel avant de décider de l'exécuter à nouveau.

Distinguez le résultat de sortie de la commande, la correspondance des conditions et l'exhaustivité du journal. « Exécution terminée avec le code de sortie confirmé 0 » confirme une sortie normale. Une sortie collectée incomplète peut toujours laisser la correspondance et l’extraction non confirmées. Une sortie de journal manquante sur la page ne signifie pas que la commande à distance a échoué. Suivez le message pour vérifier la sortie d'origine et l'hôte cible.

#### Configurer la correspondance des résultats

La correspondance des résultats convertit la sortie distante en un état plus facile à utiliser.

- « Correspondance attendue » : marque le résultat comme réussi lorsque la sortie contient le texte configuré.
- « Fail Match » : marque l'échec du résultat lorsque la sortie contient le texte configuré.
- « Extraire l'expression régulière » : utilise un groupe de capture `(.*)` pour enregistrer la sortie sélectionnée.
- « Arrêter en cas de correspondance » : demande la fin d'une commande continue après une correspondance de résultat configuré. Vérifiez également l'état final.
- « Timeout (s) » : définit le temps d'attente pour une correspondance, en secondes. Cela s'applique uniquement lorsqu'un modèle de réussite ou d'échec est défini ou que « Arrêt en cas de correspondance » est activé.
- « Nom de la variable » : enregistre l'état et la sortie extraite pour une utilisation sur la page Automatisation.

Choisissez un texte de réussite et d'échec stable et spécifique. Un texte large peut produire des correspondances incorrectes. Exécutez la commande une fois et examinez les « Résultats de correspondance » avant d'utiliser ses variables dans une règle.

Lorsque Automation fait référence à cette commande SSH ordinaire, elle utilise également les paramètres de correspondance, d'extraction et d'arrêt à la correspondance enregistrés. Une correspondance déjà trouvée pourra être retenue lorsque le délai d'exécution sera atteint. Une correspondance ou l'absence de délai d'attente ne prouve pas que le processus distant est terminé. Vérifiez également le code de sortie et l’état réel.

#### Utiliser l'exécution en arrière-plan et le mode service

nohup signifie qu'une commande continue de s'exécuter en arrière-plan de l'hôte distant après la fermeture de la connexion SSH. La fermeture de WebUI n'arrête pas une tâche en arrière-plan.

Les exécutions en arrière-plan nécessitent une authentification par clé SSH. Déployez la clé publique sur “Security” puis sélectionnez l'hôte associé. N'enregistrez pas les mots de passe en texte brut dans les commandes en arrière-plan. La même clé doit rester disponible pour arrêter ou vérifier la tâche d'origine.

Après avoir activé « Exécuter en arrière-plan (nohup) » et lancé la commande, ouvrez « Historique d’exécution » dans Commandes. Le bouton réservé à root dans Système et celui d’Automatisation ouvrent la même liste. Elle contient aussi des tâches antérieures : leur présence ne prouve pas qu’elles tournent encore. Le lancement d’une tâche vérifie aussi les enregistrements antérieurs associés.

1. Recherchez la tâche d'origine par son nom, son utilisateur, son adresse hôte et son port.
2. Sélectionnez “Verify remote state” pour vérifier cette exécution sur l'hôte d'origine.“Refresh” lit uniquement les enregistrements connus ; cela ne remplace pas la vérification.
3. Sélectionnez “View Log” pour lire les 100 dernières lignes de l'hôte d'origine. Sélectionnez “Follow log” pour les mises à jour.“Stop following” arrête uniquement les mises à jour des pages.
4. Pour terminer la tâche, sélectionnez “Stop” sur sa fiche et validez. Attendez le résultat, puis vérifiez qu'il s'est arrêté. Ne le redémarrez pas sans vérifier.

Après un redémarrage, les anciens enregistrements affichent « Non vérifié ». « État distant non confirmé » signifie que l’on ne sait pas encore si la tâche est arrêtée ou en cours. « Dernier résultat » indique le dernier état confirmé et ne garantit pas l’état actuel.

Un échec de lecture ne signifie pas que le journal est vide ou que le processus est terminé. Vérifiez la connexion hôte d'origine, le chemin du journal et la clé SSH. Vérifiez à nouveau après avoir résolu le problème ; ne redémarrez pas une tâche simplement parce que sa vérification d'état a échoué.

Si le journal ne se trouve plus sur l'hôte d'origine, l'hôte a peut-être redémarré ou les fichiers temporaires ont peut-être été effacés. Cela diffère d'un journal vide et ne prouve pas que la tâche n'a jamais été exécutée. Vérifiez l'état distant ou demandez à l'administrateur hôte de vérifier.

La suppression d'une commande, la modification de sa configuration d'hôte ou le changement de configuration d'automatisation ne met pas fin à un processus distant. Gérez la tâche d'origine à partir de « Historique d’exécution ». La recréation d'une commande avec le même nom ou ID ne reprend pas la tâche d'origine. Conservez toute clé encore nécessaire pour le contrôler.

« Mode service » surveille une tâche en arrière-plan jusqu’à sa disponibilité. Renseignez « Critère de disponibilité » et « Nom de variable ». Ajustez si nécessaire le critère d’échec et les délais :
- « Ready match » : marque le service prêt lorsque le texte configuré apparaît. Utilisez `|` pour séparer plusieurs modèles.
- « Fail Match » : marque l'échec du service lorsque le texte configuré apparaît.
- « Délai d'expiration (s) prêt » : définit l'attente la plus longue pour l'état prêt, en secondes.
- « Intervalle de vérification (ms) » : définit la fréquence à laquelle le journal est vérifié, en millisecondes ; 1000 ms correspond à une seconde.
- « Nom de la variable » : stocke les états tels que la vérification, la préparation et le délai d'attente.

<!-- operational-note -->
Les tâches en mode service peuvent être en cours de démarrage, de vérification, d'arrêt ou non confirmées. Attendez le résultat final une fois la demande acceptée. Si un enregistrement d'exécution en arrière-plan existe déjà, vérifiez cette exécution d'origine et confirmez qu'elle est terminée avant de recommencer. Une règle automatique activée peut redémarrer le service. Désactivez d’abord cette règle si le service doit rester arrêté.

#### Commandes d'importation et d'exportation

- Utilisez le bouton d'exportation d'une commande pour l'exporter et, une fois sélectionné, inclure sa configuration d'hôte dépendante.
- Sélectionnez “Import Command”, choisissez un package de configuration `.tscfg`, prévisualisez son contenu et décidez s'il faut écraser la configuration existante.

L'importation peut inclure un hôte distant et remplacer la configuration par le même ID. Vérifiez la commande, l'hôte et les remplacements dans l'aperçu avant de confirmer. L'enregistrement met à jour la configuration actuelle sans redémarrage. Les processus distants existants ne s'arrêtent pas et ne sont pas déplacés vers le nouvel hôte.

Les nouvelles importations vérifient la source, la signature, l'autorisation de signature et le périphérique cible. Une exportation réussie ne garantit pas une importation ultérieure. Un certificat d'appareil destiné uniquement à HTTPS peut ne pas avoir l'autorisation de signer des packages de configuration. Demandez au fournisseur de configuration de résoudre ce problème ; ne désactivez pas la vérification.

#### Vérifiez l'impact avant de supprimer une commande

Après avoir sélectionné Supprimer, examinez les modèles et règles liés. Choisissez une commande de remplacement disponible ou dissociez la configuration concernée et désactivez ses règles. Voir le chapitre 12 pour les étapes. La suppression modifie uniquement la configuration utilisée ; il ne met pas à jour l'autre copie d'urgence.

La suppression de la configuration et l'arrêt d'un service distant sont des opérations distinctes. La suppression n’arrête pas le service et n’annule pas les opérations terminées. Pour terminer une tâche à distance, arrêtez-la depuis « Historique d’exécution » et confirmez le résultat.

### 12. Gestion de l'automatisation

« Automation » connecte les données et les opérations dans des flux de travail reproductibles. Créez des sources de données et des modèles d'action, puis utilisez des règles pour décider quand les exécuter.

```text
Automatique : source de données → variable → évaluation des règles → actions
Manuel : action rapide de la page Système → actions
```

Les sources lisent les données, les variables contiennent des valeurs, les règles évaluent les conditions et les modèles définissent les tâches. Afficher une règle sur le panneau et autoriser l'exécution manuelle sont des paramètres distincts. Des règles automatiques peuvent également apparaître sur le panneau.

#### Afficher et contrôler le moteur d'automatisation

Le haut de la page affiche l'état du moteur, le nombre de règles, de variables et de sources, le nombre de déclencheurs et le temps d'exécution.

| Contrôle | Effet |
| --- | --- |
| “Start” | Démarre un moteur arrêté. Les règles activées s'exécutent uniquement si la configuration actuelle permet l'exécution. |
| “Pause” | Suspend toute évaluation automatique ultérieure. Les actions existantes peuvent se poursuivre. Pour reprendre la page, arrêtez le moteur, puis démarrez-le. |
| “Stop” | Tente d'arrêter les vérifications des règles, la lecture des données et la planification d'actions ultérieures, tout en conservant la configuration. Attendez la confirmation ; un timeout ne signifie pas que le moteur s'est arrêté. |
| “Reload” | Lit à nouveau la configuration à partir de l'emplacement utilisé. Enregistrez les modifications et vérifiez le résultat. Une pause de configuration existante reste en place. |

Vérifiez si le refroidissement, les alertes ou d'autres tâches en cours dépendent de l'automatisation. L'arrêt du moteur n'arrête pas un processus en arrière-plan distant. Arrêtez les tâches distantes depuis « Historique d’exécution » et confirmez le résultat.

“Disable automation” sous “Configuration & backup” est distinct de la commande “Pause” du moteur. Si la configuration est en pause, vérifiez-la avant de sélectionner “Enable automation”. Le redémarrage de l'appareil, le rechargement ou l'arrêt et le démarrage du moteur n'effacent pas cette pause de configuration. Voir le chapitre 13.

#### Créez un flux de travail d'automatisation minimal

1. Créez une source et utilisez son test pour vérifier la connexion et les champs sélectionnés.
2. Activez-le, puis utilisez l'icône « Afficher les variables » de la ligne pour vérifier les valeurs et mettre à jour les heures.
3. Créez un modèle, vérifiez ses paramètres et sélectionnez « Test ». Les tests exécutent l’action immédiatement ; confirmez que l'appareil et l'hôte peuvent l'accepter.
4. Créez une règle avec « Activer immédiatement » désactivé. Définissez les conditions, le temps de recharge, l'ordre d'action, les délais et la répétition.
5. Réglez « Afficher sur le panneau » et « Autoriser le déclenchement manuel » selon vos besoins.
6. Enregistrez, puis activez la règle. Vérifiez les variables, le nombre de déclencheurs et les résultats réels.

#### Gérer les sources de données

Sélectionnez « Ajouter » sous « Sources de données » et choisissez un type : Type

| Type | Objectif |
| --- | --- |
| «API REST» | Lit périodiquement les données d'une adresse HTTP. |
| « WebSocket » | Reçoit les données transmises via une connexion persistante. |
| « Socket. IO » | Reçoit les événements d'un service Socket. IO. |
| « Variable de commande » | Lit les résultats d'une commande à distance configurée. |

1. Saisissez un identifiant unique, une étiquette d'affichage et les informations de connexion requises.
2. Utilisez le test pour vérifier la connexion. Obtenez les adresses, les détails d'authentification et les informations de champ auprès du fournisseur de données.
3. Pour les trois premiers types, sélectionnez les champs de la réponse au test. Laisser un nom d’événement Socket. IO vide permet au test de tenter la découverte d’événements.
4. Pour une variable de commande, sélectionnez l'hôte et une commande avec un nom de variable configuré, puis définissez l'intervalle d'interrogation.
5. Vérifiez le commutateur d'activation dans le formulaire, enregistrez et utilisez “View Variables” sur sa ligne pour vérifier le résultat.

Les lignes source fournissent un commutateur d'activation, une visionneuse de variables, des contrôles de modification, d'exportation et de suppression. Vérifiez quelles règles utilisent une source avant de la désactiver ou de la supprimer, afin de ne pas perturber leurs tâches.

Pour modifier une source existante, sélectionnez son bouton d'édition. Vérifiez l'adresse, l'authentification, l'intervalle de collecte et l'état d'activation, puis enregistrez. Les mappages de champs existants restent en place. Utilisez ensuite « Afficher les variables » pour vérifier la source, les valeurs et les heures de mise à jour. Les intervalles dans la fenêtre d'édition sont en secondes, avec jusqu'à trois décimales. La création d'un ID en double n'écrase pas la source existante.

REST collecte les données avec la méthode GET ou POST enregistrée. WebSocket reçoit les données envoyées par le serveur ; Socket.IO utilise l’événement et l’adresse configurés. Après le test, vérifiez que les données continuent de se mettre à jour. Une source « Variable de commande » lit uniquement l’état existant et ne lance aucune commande. Exécutez la commande séparément pour obtenir un nouveau résultat.

Importer et exporter des packages de configuration. Prévisualisez les ID, les types et les remplacements avant l’importation, et suivez le Guide de sécurité pour connaître les exigences en matière de source et de confiance.

#### Afficher les variables

Sélectionnez l'icône « Afficher les variables » en forme d'œil sur une ligne source. La fenêtre affiche les noms, les types, les valeurs et les heures de mise à jour. Les variables de la commande à distance peuvent également être visualisées à partir du contrôle des variables de la commande.

- Confirmez les noms et la source, et vérifiez que les valeurs et les types correspondent aux comparaisons de la règle.
- Vérifiez si les heures de mise à jour correspondent à la fréquence de données attendue.
- Si aucune donnée n'est disponible, vérifiez que la source est activée, puis testez la connexion et les champs. Pour les variables de commande, vérifiez également le résultat de l’exécution de la commande.

#### Gérer les variables utilisateur

Sélectionnez « Variables utilisateur » sur Automation pour afficher les variables et les valeurs initiales que vous avez enregistrées. Cette liste ne contient pas les données collectées en direct par l'appareil.

1. Recherchez la variable et sélectionnez son icône de suppression.
2. Passez en revue les sources, modèles et règles concernés. Suivez la page pour supprimer ou gérer leurs liens.
3. Après confirmation, relisez la liste. Vérifiez l’état d’activation des configurations associées et leurs résultats d’exécution. Supprimer une définition initiale ne revient pas à effacer toutes les données en temps réel.

#### Créer et tester des modèles d'action

Sélectionnez « Ajouter » sous « Modèles d'action » et choisissez un type de tâche :

| Type | Objectif |
| --- | --- |
| « Commande CLI » | Exécute une commande de console de périphérique locale. |
| « Commande SSH » | Exécute une commande à distance enregistrée sur la page Commandes. |
| « Contrôle LED » | Contrôle les couleurs, les effets ou le contenu des LED. |
| « Journal » | Écrit un message au niveau sélectionné. |
| « Définir la variable » | Attribue une valeur à une variable d'automatisation. |
| « Webhook » | L'option reste visible, mais l'exécution de l'action n'est pas implémentée. Il ne peut actuellement pas envoyer de demande. |

Entrez un ID unique, un nom et les paramètres spécifiques au type. Définissez un délai ou une « exécution asynchrone » si nécessaire. Une action asynchrone se poursuit en arrière-plan ; vérifiez son résultat final via les journaux, les variables ou le périphérique cible.

- CLI : saisissez la commande. Vous pouvez ajouter une variable de résultat et un délai d’expiration.
- SSH : choisissez un hôte et une commande configurés, puis vérifiez l'aperçu.
- LED : choisissez l’appareil et une opération prise en charge pour la couleur, l’effet, la luminosité, le texte, l’image, le code QR ou le filtre.
- Journal : choisissez le niveau et le message. Le message peut faire référence à des variables.
- Définir la variable : saisissez le nom et la valeur de la variable.
- Webhook : actuellement indisponible. Choisissez plutôt une action prise en charge. Les packages de règles contenant des actions Webhook ne peuvent pas non plus être importés.

“Test” exécute l'action. Vérifiez l'effet des opérations d'alimentation, de redémarrage, de commande à distance ou de demande externe avant de procéder au test. Un message en file d'attente signifie que la tâche a été acceptée et non qu'elle a réussi. Vérifiez également les journaux système et le périphérique cible.

Après l'édition, enregistrez et vérifiez les paramètres. Si l’enregistrement échoue, conservez le brouillon et corrigez le problème signalé. Les importations peuvent remplacer les modèles ; examinez l’impact de la suppression avant d’en supprimer un. Si une image ou une police est manquante, insérez la carte SD originale ou sélectionnez une ressource disponible. La sauvegarde d'urgence ne sauvegarde pas ces fichiers.

#### Supprimer la configuration et gérer ses liens

La suppression d'une règle, d'un modèle, d'une commande SSH, d'un hôte, d'une source ou d'une variable utilisateur peut affecter d'autres configurations. Enregistrez d'abord une sauvegarde d'urgence si vous en avez besoin. La suppression ne peut pas être annulée à partir de la page.

1. Sélectionnez Supprimer dans la liste correspondante. Vérifiez le nom de la cible et les éléments concernés.
2. Confirmez la suppression s'il n'y a aucun lien. Sinon, choisissez un remplacement disponible ou “Unlink and disable affected rules”.
3. Actualisez ensuite la liste. Confirmez la suppression et vérifiez les modèles liés, les règles et les états d'activation.

La dissociation d'un modèle supprimé supprime son action des règles concernées et désactive ces règles. La suppression d'une commande SSH laisse les modèles liés comme brouillons désactivés avec la référence de commande effacée ; les règles concernées sont dissociées et désactivées. Avant de choisir un remplaçant, vérifiez sa cible, son action et ses données, pas seulement un nom similaire. Si le remplaçant ne peut pas fournir les données requises, la configuration associée peut être désactivée et conservée pour modification.

Lors de la suppression d'un hôte, examinez également les commandes et les sources concernées. Une commande sans hôte ne peut pas s'exécuter. Modifiez-le pour choisir un hôte valide, puis vérifiez les modèles et les règles associés avant de l'activer. La suppression de la configuration de l'hôte local est différente de la révocation d'une clé publique distante ; consultez le Guide de sécurité.

Après la suppression, la page signale les éléments supprimés, désactivés et réassociés séparément. Vérifiez la liste actuelle. La gestion des liens ne signifie pas que tous les éléments associés ont été supprimés ou sont prêts à être exécutés.

#### Utiliser Forcer la suppression si nécessaire

Si la suppression normale ne peut pas aboutir, sélectionnez “Force delete”, lisez les explications, puis confirmez. L’élément est supprimé, les liens identifiables sont retirés et les règles concernées sont désactivées. Les services distants en arrière-plan ne sont pas arrêtés.

Si toute l’étendue des conséquences ne peut pas être déterminée, la page vous demande de cocher “I agree to pause automation and continue deleting”. L’automatisation reste en pause après la suppression. Vérifiez et corrigez la configuration restante, puis sélectionnez “Enable automation” dans “Configuration & backup”. Un redémarrage ne réactive pas l’automatisation.

Si la configuration change pendant la confirmation, sélectionnez “Review deletion impact”, examinez la nouvelle liste et confirmez à nouveau. La suppression forcée ne peut pas garantir son exécution si l’écriture dans le stockage échoue. Vérifiez à nouveau la liste : la disparition d’une carte ne prouve pas que la suppression a été enregistrée.

#### Créer une règle

1. Sélectionnez « Ajouter » sous « Règles » et entrez un identifiant, un nom et une icône uniques.
2. Sélectionnez “Logic” : AND exige que toutes les conditions soient remplies ; OR exige qu’au moins une condition soit remplie.
3. Définit le temps de recharge pour les déclencheurs automatiques. Les valeurs sont en ms ; 1000 ms correspond à une seconde.
4. Ajoutez des conditions et choisissez une variable, une comparaison et une valeur. Les comparaisons incluent égal, différent, supérieur à, supérieur ou égal, inférieur à, inférieur ou égal, valeur modifiée et contient. Faites correspondre le type de valeur à la variable.
5. Ajoutez des modèles et définissez les délais d'action, la répétition et les conditions au niveau de l'action.
6. Définissez « Afficher sur le panneau » et « Autoriser le déclenchement manuel ». Le premier contrôle la visibilité de la carte sur le système ; le second contrôle l’exécution manuelle.
7. Vérifiez, enregistrez, puis activez la règle. Laissez « Activer immédiatement » désactivé lors de la configuration pour la première fois.

L'enregistrement, l'activation ou la désactivation d'une règle met à jour la configuration actuelle sans redémarrage. Si l'automatisation est suspendue, l'enregistrement ne la reprend pas. Actualisez la liste et vérifiez le résultat. Mettez à jour la sauvegarde d'urgence après des modifications importantes, comme décrit au chapitre 13.

Les échecs temporaires de démarrage automatique sont réessayés toutes les 30 secondes pendant une durée maximale de 360 secondes. Un résultat non confirmé est vérifié avant un autre lancement. Les tentatives de cette tentative continuent à partir de l'étape de démarrage en arrière-plan inachevée ; les étapes précédentes terminées ne sont pas répétées. Si la page indique qu'elle a arrêté d'essayer ou que l'attente est terminée, suivez le message avant de décider de démarrer manuellement. Les échecs manuels ne sont pas automatiquement réessayés.

Modifier la configuration associée permet de réessayer après un échec. Après un succès, le délai normal entre déclenchements reste applicable. Ce délai limite les déclenchements automatiques, mais ce n’est pas le seul élément à vérifier après un échec.

<!-- operational-note -->
Vous pouvez enregistrer jusqu'à 64 règles. Cela ne garantit pas que 64 tâches puissent être exécutées simultanément. La longueur des commandes et le nombre de conditions et d'actions affectent également le stockage et la mémoire. Si la capacité est insuffisante, supprimez la configuration inutile ou réduisez son contenu avant de l'enregistrer.

<!-- operational-note -->
Faites correspondre la valeur au type sélectionné. Pour un nombre, saisissez une valeur spécifique, pas l'infini ou NaN (un nombre non valide). Saisissez du texte, un booléen (vrai ou faux) ou null pour les autres types. N'entrez pas un objet ou un tableau JSON entier. Si la page signale une erreur, vérifiez la variable, la comparaison et la valeur avant de réenregistrer.

#### Configurer les conditions de répétition et d'action

| Mode | Signification |
| --- | --- |
| « Une fois » | S'exécute une fois par déclencheur. |
| « Répéter en étant vrai » | Se répète tant que la condition de l'action est respectée, jusqu'à 100 fois par exécution. |
| « Nombre fixe » | Se répète pour le nombre et l'intervalle configurés, en vérifiant la condition d'action avant chaque exécution. |

Les conditions d'action sont distinctes des conditions de déclenchement de règle. Sans condition d'action, « Répéter tant que vrai » continue jusqu'à la limite par exécution. La règle peut déclencher une autre exécution ultérieurement.

La désactivation d'une règle empêche de nouveaux déclencheurs ; une course déjà commencée peut continuer. Pour arrêter de programmer des actions ultérieures, sélectionnez la commande « Stop » du moteur et attendez la confirmation. Vérifiez séparément les actions déjà envoyées et les processus distants. Les opérations terminées ne sont pas annulées.

#### Créer une action rapide

« Déclenchement manuel uniquement », « Afficher sur le panneau » et « Autoriser le déclenchement manuel » contrôlent si une règle s'exécute uniquement manuellement, si sa carte est visible et si les utilisateurs peuvent l'exécuter.

1. Saisissez l'ID, le nom et l'icône, puis activez « Déclenchement manuel uniquement ». Une telle règle ne nécessite aucune condition de déclenchement automatique.
2. Ajoutez des modèles et examinez les retards, les répétitions et les conditions d'action.
3. Activez « Afficher sur le panneau » et « Autoriser le déclenchement manuel », puis enregistrez et activez la règle.
4. Revenez au panneau des périphériques système. Vérifiez le nom et l'état de la carte, exécutez-la une fois et examinez le résultat.

Les règles automatiques peuvent aussi figurer sur le panneau. Afficher une carte ne rend pas sa règle exclusivement manuelle. Une règle désactivée peut rester visible sans pouvoir démarrer. Choisissez un nom qui explique l’effet de l’action. Pour les tâches SSH en arrière-plan, admin peut consulter les journaux et arrêter la tâche depuis la carte ; les changements de configuration restent réservés à root. Root peut aussi consulter les journaux, vérifier l’état et arrêter les services depuis « Historique d’exécution ».

#### Importer un package de configuration de règles

Importez des packages de règles sur Automation, et non via le “Verify Only” de Security ou le téléchargement de fichiers. Ce contrôle vérifie le signataire, le périphérique cible et la configuration requise. Vérifiez chaque package via son propre contrôle d'importation ; le résultat d'un autre package ne s'applique pas.

Avant d'importer, préparez :

- Confirmez si la carte SD ou la configuration d'urgence interne est utilisée et qu'elle peut être enregistrée. Voir le chapitre 13.
- L'appareil dispose d'un certificat valide, de sa clé privée correspondante et d'une chaîne d'autorité de certification ; son heure est vérifiée. Une chaîne d'autorité de certification vérifie l'origine des certificats. Consultez le Guide de sécurité pour connaître les étapes d'installation.
- L'administrateur de déploiement a sélectionné un signataire de confiance. La connexion Root ou l'installation de certificats HTTPS ne complète pas ce paramètre. Demandez à l'administrateur de déploiement de le configurer s'il est manquant.
- Les modèles, commandes et hôtes de la règle sont prêts. Import ne les installe pas pour vous. Ajoutez d'abord toute configuration manquante. Si la règle est activée, vérifiez également l'état d'activation de la configuration qu'elle utilise.

L'enregistrement d'une importation met à jour la configuration actuelle sans redémarrage. Avant de confirmer, vérifiez l'état d'activation, les conditions, les actions et les cibles, et confirmez que l'exécution est sûre. Une pause de configuration existante reste en place. Pour empêcher l'exécution, désactivez d'abord Automation ou demandez au fournisseur une version désactivée.

1. Sélectionnez l'icône d'importation sous “Rules” pour ouvrir “Import Rule Configuration” puis choisissez le fichier `.tscfg`. La vérification démarre et la page affiche un aperçu.
2. Attendez “Signing trust, target device and rule content verified”. Vérifiez le nom, l'ID de la règle et “Rule summary”. Développez “View rule content” pour examiner les conditions, les actions, les cibles et l'état d'activation ; ne vous fiez pas au nom du fichier.
3. Si le même identifiant existe, vérifiez ce qui sera remplacé. Sélectionnez “Overwrite existing configuration” uniquement si vous avez l'intention de le remplacer. Si le fichier, les informations d'identification ou la configuration changent après l'aperçu, sélectionnez “Check package again”. Fermer et rouvrez l'éditeur si la page vous le demande, puis vérifiez à nouveau.
4. Sélectionnez “Confirm Import” et attendez le résultat de l'enregistrement. Vérifiez la liste des règles, l'état d'activation et les variables requises. Une sauvegarde réussie ne prouve pas une exécution réussie de la tâche.
5. Si la règle permet une vérification manuelle sécurisée, exécutez-la une fois et vérifiez le périphérique ou l'hôte. Pour les autres règles, surveillez les journaux et les résultats après un déclenchement normal. Pour effacer une pause de configuration, examinez la configuration avant de sélectionner “Enable automation”.

Les règles importées peuvent être modifiées, activées, désactivées et supprimées. Vérifiez la configuration actuelle après les modifications et mettez à jour la sauvegarde d'urgence si nécessaire. Une importation ultérieure nécessite toujours une vérification de signature ; l'autorisation de modifier localement ne la contourne pas.

Un certificat destiné uniquement au HTTPS peut ne pas autoriser la signature de configuration. Une exportation locale réussie peut toujours être rejetée à l'importation. Demandez au fournisseur de résoudre le problème lié à l'objectif du certificat ; ne désactivez pas la vérification et ne répétez pas l’importation.

Les imports et les modifications n’annulent pas les actions terminées et n’arrêtent pas les processus distants en arrière-plan. Arrêtez ces tâches séparément depuis « Historique d’exécution », puis confirmez le résultat.

#### Si l'importation ne se termine pas

##### Échec de la vérification

| Message ou problème | Étape suivante |
| --- | --- |
| Signature root non sélectionnée, signataire non fiable ou signataire non autorisé | Demandez à l'administrateur de déploiement ou au fournisseur de configuration de vérifier la source de signature et les autorisations du certificat. Ne remplacez pas le “Verify Only” de Security et ne désactivez pas la vérification. |
| Le package cible un autre appareil | Demandez au fournisseur de l'exporter à l'aide du certificat de cet appareil ; ne changez pas le nom à l’intérieur du package. Organisez des packages de remplacement correspondants avant de modifier également le certificat de cet appareil. |
| L'heure de l'appareil n'est pas vérifiée | Vérifiez et synchronisez l'heure sous “Network & Time” sur le système, puis vérifiez à nouveau le fichier. |
| Chargement de la configuration | Attendez la fin, puis vérifiez à nouveau le package. |
| La configuration n'a pas pu être chargée | Vérifiez les journaux système, résolvez la cause et restaurez la configuration avant de vérifier à nouveau. |
| Configuration requise manquante | Ajoutez le modèle, la commande ou l'hôte nommé par la page, puis vérifiez à nouveau. |
| Configuration requise désactivée | Vérifiez s'il doit être activé. Une fois que l'exécution est sûre, activez-la et vérifiez à nouveau. |
| Action non prise en charge | Demandez au fournisseur de modifier le paquet. L’importation de packages de règles rejette actuellement les actions Webhook ; leur présence dans le sélecteur de modèle ne signifie pas que le package peut être importé. |
| Fichier, informations d'identification ou configuration modifiés après l'aperçu | Sélectionnez “Check package again”. Rouvrez l'éditeur ou sélectionnez le fichier comme indiqué, puis vérifiez et confirmez. |

##### Enregistrement incomplet

| Message ou problème | Étape suivante |
| --- | --- |
| Stockage actuel indisponible ou plein | Vérifiez l'emplacement dans “Configuration & backup”. Résolvez le problème de stockage ou réduisez le contenu inutile, puis vérifiez à nouveau. |
| La configuration actuelle ou l'emplacement de sauvegarde ont été modifiés | Conservez et copiez le brouillon. Rouvrez l'éditeur, vérifiez la dernière configuration et soumettez-la à nouveau. Ne continuez pas à sélectionner Enregistrer. |
| Résultat de sauvegarde non confirmé | Actualisez et vérifiez le contenu de la règle et activez l'état. Si ce n’est toujours pas clair, inspectez les journaux système. Conservez l’emballage d’origine et ne répétez pas l’importation. |

Une variable de condition sans échantillon ne signifie pas nécessairement une configuration manquante ; vérifiez quand il sera mis à jour. Si la configuration ne peut pas être lue, conservez les fichiers d'origine et vérifiez les journaux système. N'écrasez pas le contenu endommagé comme s'il était vide.

#### Maintenir les règles et la configuration

- L'exécution manuelle nécessite une règle activée qui autorise les déclencheurs manuels, sans qu'aucune exécution de la même règle ne soit déjà en cours. Il contourne les conditions de déclenchement automatique et le temps de recharge, mais applique toujours les conditions d'action, les délais et la répétition.
- La désactivation n'annule pas les actions terminées. La suppression ne peut pas être annulée à partir de la page.
- Avant de modifier des sources, des modèles ou des commandes, vérifiez quelles règles les utilisent. Les modifications de configuration n'arrêtent pas les tâches distantes existantes. Vérifiez et arrêtez ces tâches séparément si nécessaire.
- Importez chaque package via sa liste appropriée et examinez l'aperçu. Consultez le Guide de sécurité pour connaître les procédures complètes de signature et de compte.
- Si l’enregistrement échoue, lisez le message et conservez le brouillon. Si l'enregistrement a réussi mais que l'actualisation a échoué, actualisez et vérifiez la liste avant de créer un autre élément.

### 13. Configuration et sauvegarde

<!-- operational-note -->
Sélectionnez “Configuration & backup” sur Automatisation. Vérifiez “Currently using” avant d'enregistrer, de restaurer ou de choisir une configuration. Examinez d’abord tout effet sur le refroidissement, les alertes ou les tâches à distance.

Lors de l'utilisation de la carte SD, recherchez « Enregistrer la configuration actuelle » et « Restaurer la configuration enregistrée » dans le groupe de sauvegarde d'urgence. Suivez les étapes ci-dessous pour sélectionner « Enregistrer la sauvegarde d'urgence » ou « Restaurer la sauvegarde d'urgence ». Le groupe « Carte SD et automatisation » contient les contrôles de carte et les contrôles d'activation de l'automatisation. L’enregistrement d’une copie ne change pas de configuration.

#### Distinguer les trois types de contenu

| Contenu | Comment il est enregistré |
| --- | --- |
| Paramètres du système tels que la mise en réseau, les ventilateurs, la température et l'éclairage | Enregistré à l'intérieur de l'appareil. Une restauration de sauvegarde Automation ne les modifie pas. |
| Configuration actuelle de l'automatisation | Les ajouts, modifications et suppressions sont transférés sur la carte SD lors d'une utilisation normale du SD, ou vers le stockage interne en mode d'urgence. |
| Sauvegarde d'urgence interne | Lors de l'utilisation de la carte SD, elle se met à jour uniquement lorsque vous sélectionnez “Save emergency backup”. Les modifications en mode d'urgence mettent directement à jour cette configuration interne. |

La sauvegarde d'urgence enregistre ensemble les règles, les modèles d'action, les commandes SSH, les hôtes associés, les sources et les définitions initiales des variables utilisateur. Il n'enregistre pas les clés privées, les images, les polices, les journaux ou les états d'exécution à distance. Les paramètres de l'hôte mémorisent uniquement la clé à utiliser ; la clé elle-même n'est pas copiée.

Il ne s'agit pas d'une sauvegarde complète de l'appareil. Conservez les fichiers et les clés importants grâce à leurs propres méthodes de sauvegarde. Une restauration ne signifie pas que les services distants se sont arrêtés ou que tous les fichiers nécessaires à une règle sont disponibles.

#### Enregistrer une sauvegarde d'urgence

1. Confirmez que “Currently using” affiche “SD card configuration”, puis examinez les règles et tâches actuelles.
2. Sélectionnez “Save emergency backup” et attendez la fin.
3. Vérifiez “Last internal save” et “Backup status”. “Includes the current changes” signifie que la copie interne correspond à la configuration actuelle.

La sauvegarde remplace la sauvegarde d'urgence précédente. Les modifications ultérieures de la carte SD ne la mettent pas à jour. S'il n'inclut pas les dernières modifications, examinez le contenu actuel avant de décider de l'enregistrer à nouveau.

Lors de l'utilisation de “Internal emergency configuration”, les modifications sont enregistrées en interne. Vous n'avez pas besoin de sélectionner à nouveau “Save emergency backup”.

#### Restaurer une sauvegarde d'urgence

Une restauration remplace la configuration actuelle de la carte SD par la copie interne, qui peut être plus ancienne. Exportez d’abord toute configuration actuelle et tous les fichiers dont vous avez besoin. N'enregistrez pas d'abord une sauvegarde d'urgence ; cela écraserait l'ancienne copie que vous avez l'intention de restaurer.

1. Lors de l'utilisation de la configuration de la carte SD, sélectionnez “Restore emergency backup”.
2. Vérifiez les éléments ajoutés, modifiés et supprimés et vérifiez si l'automatisation restera en pause.
3. Confirmez et attendez la fin. Les listes sont mises à jour sans redémarrage de l'appareil.
4. Vérifiez les règles, les hôtes, les variables, les états d'activation et les résultats des tâches. S'il est toujours en pause, examinez la configuration avant de sélectionner “Enable automation”.

Une restauration ne modifie pas le réseau, les ventilateurs ou les clés. Cela ne met pas fin à l’exécution de services à distance. Gérez-les depuis « Historique d’exécution » si nécessaire.

#### Lorsqu'aucune carte SD utilisable n'est disponible

S'il existe une configuration interne utilisable, l'appareil y bascule. Les règles automatiques activées suivent toujours leurs conditions ; les règles manuelles nécessitent toujours un clic. La copie interne est peut-être plus ancienne, alors vérifiez quelles tâches peuvent être exécutées avant un changement planifié.

Le mode d'urgence permet les ajouts, les modifications et les suppressions. Les sauvegardes vont directement dans le stockage interne. S’il n’existe aucune configuration interne utilisable, lisez d’abord la raison. Vous pouvez commencer avec une nouvelle configuration valide, mais n'écrasez pas les fichiers endommagés comme s'ils étaient vides.

La mise en réseau, les ventilateurs et autres paramètres système se chargent toujours à partir du stockage interne. La configuration d'urgence ne restaure pas les images, les polices ou les journaux de la carte SD. Insérez la carte originale ou sélectionnez les fichiers disponibles s'il manque des ressources. Une carte manquante ne signifie pas que toutes les fonctions s'arrêtent ou que chaque tâche peut continuer.

#### Choisissez une configuration après avoir réinséré la carte

Insérez une carte SD utilisable et sélectionnez “Check SD card”, puis examinez les deux choix ci-dessous. L'insertion ne change ni ne fusionne les configurations. Fermez le panneau pour continuer à utiliser la configuration interne. Le redémarrage ne fait pas le choix à votre place.

| Bouton | Que se passe-t-il |
| --- | --- |
| “Use SD card configuration” | Lit et passe à la configuration de la carte. La configuration interne est conservée et non copiée sur la carte. |
| “Save current configuration to SD card and use it” | Remplace la configuration de la carte par la configuration interne actuelle, puis passe à la carte. L'ancienne configuration de la carte est écrasée. |

1. Vérifiez l'emplacement actuel et décidez quelle configuration conserver.
2. Sélectionnez le bouton approprié et consultez l'avis de remplacement et d'état d'activation. Avant d'écrire sur la carte, vérifiez les éléments ajoutés, modifiés et supprimés.
3. Confirmez et attendez. Vérifiez que “Currently using” affiche “SD card configuration”, puis examinez les listes et les résultats des tâches.

La configuration de la carte manquante ou vide n'est pas automatiquement remplie à partir de la mémoire interne. Confirmez qu'une configuration vide correspond à ce que vous souhaitez avant de la choisir. Si la carte ou la configuration change après l'aperçu, vérifiez à nouveau comme indiqué ; ne réutilisez pas l’ancienne confirmation.

#### Distinguer les résultats d'enregistrement, de commutation et d'exécution

| Message ou situation | Étape suivante |
| --- | --- |
| Enregistré sur la carte SD, mais non commuté | La configuration interne est toujours utilisée. Sélectionnez “Use SD card configuration” pour terminer la commutation. N'écrasez plus la carte. |
| Configuration enregistrée, automatisation toujours en pause | Vérifiez la configuration, puis sélectionnez “Enable automation”. Ne l’enregistrez pas à nouveau et ne comptez pas sur un redémarrage pour lever la pause. |
| Suppression non enregistrée, Automatisation en pause | Vérifiez si la cible est toujours présente et si le stockage est disponible. Réparez et examinez la configuration avant de décider de l'activer ou non. |
| Résultat de sauvegarde non confirmé | Relisez l'emplacement et le contenu. Vérifiez les journaux système si nécessaire. Ne soumettez pas à nouveau la même modification sans vérifier. |
| L'entrée actuelle diffère de la dernière configuration | Copiez tout brouillon dont vous avez besoin avant de fermer et de rouvrir l'éditeur. Consultez le dernier contenu et saisissez vos modifications. La page ne fusionne pas les brouillons pour vous. |

Après un changement, une restauration ou un enregistrement réussi, vérifiez si les tâches sont autorisées à s'exécuter et si elles se terminent. Une pause de configuration reste en place ; vérifiez et sélectionnez “Enable automation” pour reprendre. Une pause provoquée par “Disable automation” ou une suppression forcée n'est pas effacée par le redémarrage ou le changement de configuration.
