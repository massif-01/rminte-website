# Guide d’exploitation de TianshanOS pour root

Les noms des boutons et des rubriques sont conservés en anglais pour vous permettre de les retrouver sur l’appareil. Son interface web est disponible en chinois et en anglais ; changer la langue de ce site ne modifie pas les langues de l’appareil.

Ce guide s’adresse aux opérateurs qui gèrent TianshanOS avec le compte root. La partie I décrit les tâches courantes communes à admin et root. La partie II traite des pages « Terminal », « Commands » et « Automation », réservées à root. Pour la gestion de la sécurité, consultez le Guide de sécurité de TianshanOS.

<!-- operational-note -->

root peut effectuer des opérations à fort impact sur l’appareil, les hôtes distants et les processus d’automatisation. Vérifiez l’appareil actuel, l’hôte cible et les tâches en cours avant de continuer.

Les commandes disponibles dépendent de votre appareil et de sa configuration. Certaines n’apparaissent que si le matériel requis est connecté ou si la fonction a été configurée.

## Partie I : tâches courantes communes à admin et root

## 1. Premiers pas

### Ouvrir l’interface web

1. Ouvrez l’interface web de l’appareil (WebUI) à l’adresse fournie par votre administrateur.
2. Sélectionnez « Login » en haut à droite.
3. Saisissez `root` et le mot de passe root fourni avec l’appareil.
4. Sélectionnez « Login ». Une fois la connexion établie, le nom de l’utilisateur actuel apparaît en haut à droite.

Si le mot de passe par défaut est encore utilisé, le message « Security Reminder » apparaît après la connexion. Saisissez le mot de passe actuel et le nouveau, puis sélectionnez « Change Now ». Les deux saisies du nouveau mot de passe doivent être identiques. « Change Later » ferme le rappel.

Lorsque vous avez terminé, sélectionnez « Logout » en haut à droite. Vous devrez vous reconnecter pour utiliser l’appareil.

### Changer de langue

Sélectionnez le bouton de langue en haut de la page, puis choisissez le chinois ou l’anglais. Le contenu et les libellés des commandes changent aussitôt.

### Naviguer entre les pages

root a accès aux pages suivantes :

- « System » : consulter l’état de l’appareil, commander les modules, les ventilateurs et les LED, et accéder aux mises à jour OTA.
- « Network » : consulter l’état Ethernet et les clients DHCP, configurer le WiFi et gérer le transfert NAT.
- « Files » : gérer les fichiers de la carte SD et de SPIFFS.
- « Terminal » : utiliser la console de l’appareil et consulter les journaux système.
- « Automation » : gérer les sources de données, les variables, les modèles d’action et les règles.
- « Commands » : gérer et exécuter des commandes SSH distantes.
- « Security » : ouvrir la page de gestion de la sécurité. Consultez le Guide de sécurité pour les procédures.

## 2. État du système et opérations courantes

Sélectionnez « System » dans la navigation supérieure.

### Consulter les ressources et les services

« Resource Monitor » indique l’utilisation du CPU, de la DRAM et de la PSRAM. La DRAM et la PSRAM sont les mémoires utilisées par l’appareil pour exécuter les programmes.

- Sélectionnez « Details » pour consulter la mémoire totale, utilisée et libre, ainsi que sa fragmentation.
- Les nombres à côté de « Services » indiquent les services en cours d’exécution et le nombre total de services.
- Sélectionnez « Services » pour consulter l’état, la phase et l’état de santé de chaque service.

Si un service affiche « Failed » ou un état anormal, actualisez d’abord la page pour confirmer sa situation actuelle.

### Consulter les informations système et l’alimentation

« System Overview » indique la puce, la version du firmware, la durée de fonctionnement et la date de compilation. « Power Status » affiche les tensions d’entrée et interne, le courant, la puissance et l’état de la protection.

L’interrupteur à côté de l’état de protection active ou désactive la protection contre les sous-tensions. Lorsqu’elle est activée, une tension d’entrée trop basse déclenche le processus d’arrêt et de reprise configuré.

### Consulter le réseau et l’heure

« Network & Time » affiche Ethernet, le WiFi, l’adresse IP, l’heure actuelle, l’état de synchronisation, la source horaire et le fuseau horaire.

- Sélectionnez « Sync Time » pour copier l’heure actuelle du navigateur sur l’appareil.
- Sélectionnez « Timezone », choisissez un préréglage ou saisissez un réglage de fuseau horaire pris en charge, puis enregistrez.
- Sélectionnez « OTA Update » pour ouvrir la page de mise à jour du firmware.

### Opérations avancées

#### Redémarrer TianshanOS

Un redémarrage interrompt temporairement l’interface web, Terminal, Automation et la gestion de l’appareil. Terminez les opérations en cours avant de sélectionner « Reboot » et de confirmer. La page indique que le système redémarre. Rouvrez l’interface lorsque l’appareil est de nouveau disponible.

#### Redémarrer un service

Le redémarrage d’un service interrompt temporairement la fonction qu’il assure. Ouvrez « Service Status », repérez le service concerné et sélectionnez « Reboot » sur sa ligne. À la fin de l’opération, vérifiez de nouveau son état et son bon fonctionnement.

#### Modifier les réglages d’arrêt

Ces réglages déterminent quand l’appareil s’arrête après une baisse de tension et quand il redémarre après le retour de l’alimentation. Utilisez des valeurs adaptées aux besoins électriques de votre appareil.

Sélectionnez « Shutdown Settings » pour modifier :

- « Low Voltage Threshold » : tension en dessous de laquelle le compte à rebours avant arrêt démarre.
- « Recovery Threshold » : tension au-dessus de laquelle la reprise démarre.
- « Shutdown Countdown » : délai avant arrêt après détection d’une sous-tension.
- « Recovery Stabilization » : délai permettant de confirmer que l’alimentation est redevenue stable.
- « Fan Stop Delay » : délai avant l’arrêt des ventilateurs après l’extinction.

Enregistrez le formulaire pour appliquer les nouveaux réglages de protection.

#### Changer la destination du port USB supérieur

Changer la destination USB peut déconnecter temporairement un appareil raccordé. Vérifiez la destination et terminez le travail en cours avant de continuer.

Lorsque la commutation USB est disponible, chaque clic sur « USB » fait passer le port supérieur à la destination suivante : ESP, AGX, puis LPMU. Le bouton indique la destination actuelle et la page confirme la réussite du changement.

## 3. Panneau de l’appareil

« Device Panel », sur la page « System », regroupe les commandes d’alimentation des modules, les actions rapides et les widgets de données.

### Commander AGX et LPMU

Les boutons AGX et LPMU indiquent l’état actuel. Le vert signale un appareil en marche, le rouge un appareil éteint. Un état d’attente s’affiche pendant la détection.

Un arrêt forcé peut entraîner la perte de données non enregistrées. Enregistrez le travail sur le module et terminez sa procédure d’arrêt normale avant de couper son alimentation.

- Sélectionnez le bouton d’état AGX pour allumer ou éteindre AGX. Attendez le résultat final affiché sur la page.
- Sélectionnez le bouton d’état LPMU pour déclencher la même action que son bouton physique d’alimentation. La page continue de vérifier l’état de LPMU. Si la détection expire, suivez le message affiché et évitez les clics répétés.

### Utiliser les actions rapides

« Quick Actions » affiche les règles d’automatisation configurées comme « Manual Trigger Only ».

1. Sélectionnez une carte pour lancer son action.
2. Patientez pendant que la carte indique un traitement en cours.
3. Les cartes prenant en charge les tâches en arrière-plan affichent un état d’exécution et les commandes « Log » et « Stop ».
4. Sélectionnez « Log » pour consulter la sortie actuelle. Sélectionnez « Stop » pour arrêter une tâche en cours.

<!-- operational-note -->

Une tâche en cours doit être arrêtée avant de pouvoir être relancée. Après avoir déclenché une action, attendez quelques secondes avant d’en lancer une autre.

Maintenez une carte enfoncée jusqu’à l’apparition de l’indicateur de réorganisation, puis faites-la glisser pour modifier l’ordre d’affichage. « No Quick Actions » signifie qu’aucune règle manuelle n’est actuellement configurée. Consultez « Gestion de l’automatisation » dans la partie II pour configurer les règles.

### Gérer les widgets de données

Les widgets affichent en continu les données de l’appareil dans « Device Panel ».

1. Sélectionnez « Widget Manager ».
2. Choisissez un intervalle d’actualisation ou désactivez l’actualisation automatique.
3. Ajoutez un widget prédéfini ou choisissez un style de composant et une source de données proposés par la page.
4. Modifiez son libellé, son style d’affichage et son unité selon vos besoins, puis enregistrez.

Vous pouvez modifier, supprimer et réorganiser les widgets existants. Sélectionner une carte de widget permet aussi de la modifier. Maintenez un widget enfoncé, puis faites-le glisser vers sa nouvelle position.

## 4. Gestion des ventilateurs

« Fan Control » se trouve sur la page « System ». Seuls les ventilateurs actuellement fournis par l’appareil sont affichés.

### Consulter l’état des ventilateurs

La barre d’état affiche « Effective Temp » et « Target Speed ». En modes Auto et Curve, le pourcentage d’une carte de ventilateur correspond à la consigne de commande. En mode Manual, il indique le réglage actuel. La valeur RPM est la vitesse mesurée en tours par minute ; elle n’apparaît que lorsqu’une mesure valide est disponible. Le pourcentage n’est pas une mesure en RPM.

En mode Auto, la carte peut aussi afficher l’état de régulation, une température de référence de sécurité, une prévision de température à 45 secondes et la vitesse de variation de la température. La prévision permet au ventilateur de réagir avant la hausse de température. Si la mesure devient invalide, vérifiez que sa source est toujours actualisée ; l’appareil adopte un réglage de protection du ventilateur. Sélectionnez le bouton d’information de la carte pour en savoir plus sur le mode Auto.

Sélectionnez le bouton d’actualisation en haut à droite pour recharger l’état actuel.

### Choisir un mode de fonctionnement

| Mode | Fonction |
| --- | --- |
| « Off » | Arrête le ventilateur. |
| « Manual » | Applique un pourcentage de commande fixe, réglé avec le curseur de 0-100%. |
| « Auto » | S’appuie sur la courbe du ventilateur et réagit aussi aux tendances de température et aux états de protection. |
| « Curve » | Suit les points température-vitesse configurés. |

<!-- operational-note -->

Arrêter un ventilateur ou choisir une faible vitesse manuelle réduit le refroidissement. Vérifiez la charge et la température de l’appareil avant de changer de mode, puis continuez à surveiller la température.

En mode « Manual », utilisez le curseur « Speed Adjust » pour régler la vitesse. Ce curseur n’est pas disponible dans les autres modes.

### Configurer une courbe de ventilation

Sélectionnez « Curve » dans l’en-tête de Fan Control pour ouvrir « Fan Curve Management ». Le bouton « Curve » d’une carte de ventilateur change son mode de fonctionnement.

1. Dans « Select Fan », choisissez le numéro du ventilateur à régler. Vérifiez-le à l’aide des cartes de la page System.
2. Dans « Bind Temperature Variable », ajoutez une ou plusieurs sources de température et attribuez-leur des pondérations.
3. Sélectionnez la commande de liaison pour appliquer les sources. Elles sont partagées par les ventilateurs en modes Auto et Curve ; toute modification affecte donc tous ceux qui les utilisent.
4. Ajoutez ou modifiez les points dans « Temperature-Speed Curve ». Une courbe exige au moins 2 points et en accepte jusqu’à 10.
5. Réglez « Min Duty Cycle » et « Max Duty Cycle ». Le minimum ne doit pas dépasser le maximum.
6. Réglez « Temperature Hysteresis » et « Min Interval » selon vos besoins. L’hystérésis accepte 0-20°C et l’intervalle minimal, 500-30000 ms.
7. Sélectionnez « Apply Curve ». Les réglages sont enregistrés et le ventilateur sélectionné passe en mode « Curve ».

« Min Duty Cycle » et « Max Duty Cycle » définissent la plage de commande en pourcentage. « Temperature Hysteresis » limite les ajustements fréquents dus à de faibles variations de température. « Min Interval » fixe le délai minimal entre deux ajustements ; 1000 ms correspondent à 1 seconde.

Appliquer une courbe active le mode Curve. Pour continuer à utiliser la régulation automatique, revenez à la carte du ventilateur et sélectionnez « Auto ».

### Importer et exporter une courbe

- Sélectionnez « Import Config » et choisissez un fichier JSON de courbe valide. Vérifiez la courbe et les paramètres chargés, puis sélectionnez « Apply Curve ».
- Sélectionnez « Export Config » pour télécharger la courbe actuelle dans le navigateur. La page tente aussi d’enregistrer une copie dans `/sdcard/config` et indique le résultat de l’écriture sur la carte SD.

### Utiliser une température de test

Une température de test remplace temporairement la source normale et affecte la régulation Auto ou Curve. Surveillez le ventilateur et l’état de l’appareil pendant toute la durée du test.

1. Saisissez une valeur de 0-100°C dans « Test Temp ».
2. Sélectionnez « Test » et observez la vitesse cible et la réponse du ventilateur.
3. Dès la fin du test, sélectionnez « Clear Test » pour rétablir la source normale de température.

## 5. Gestion des LED

« LED Control » se trouve sur la page « System » et n’affiche que les LED actuellement fournies par l’appareil.

### Commandes courantes

- Utilisez l’interrupteur d’une carte pour allumer ou éteindre la LED correspondante.
- Utilisez « Brightness » pour régler la luminosité de l’appareil actuel.
- Sélectionnez une couleur ou une couleur prédéfinie sur les appareils qui prennent en charge ce réglage.
- Choisissez une entrée dans « Effects » pour la lancer et sélectionnez « Stop Effect » pour arrêter l’effet actuel.
- Sélectionnez « Save Config » pour enregistrer les réglages LED actuels.
- Sélectionnez « All Off » pour éteindre toutes les LED affichées sur la page.

Les couleurs, réglages de luminosité et effets disponibles dépendent de la LED. Utilisez les options de la carte et de la boîte de dialogue de réglages correspondantes.

### Fonctions avancées de la matrice LED

Si l’appareil possède une matrice LED, sa boîte de dialogue de réglages peut également proposer :

- « Display Image » : sélectionner et afficher une image de la carte SD.
- « Generate QR » : saisir un contenu et choisir les couleurs et le niveau de correction d’erreurs.
- « Display Text » : saisir du texte et régler la police, l’alignement, la vitesse de défilement, la couleur du texte et celle du fond.
- « Post-processing Filter » : appliquer un filtre proposé par la page ou l’arrêter avec la commande prévue.
- « Color Correction » : ajuster la sortie de la matrice et utiliser les commandes disponibles pour réinitialiser, importer ou exporter les réglages de correction.

Les dimensions de la matrice, les effets et les filtres dépendent de l’appareil. Suivez les commandes affichées dans l’interface web.

## 6. Gestion du réseau

<!-- operational-note -->

Sélectionnez « Network » dans la navigation supérieure pour ouvrir « Network Settings ». Changer le mode réseau, le point d’accès ou les réglages NAT peut interrompre les connexions à l’interface web, à Terminal et à Automation. Avant d’enregistrer, assurez-vous de pouvoir vous reconnecter à la nouvelle adresse réseau.

### Consulter l’état du réseau

Le haut de la page indique l’état d’Ethernet, du client WiFi et du point d’accès WiFi. Ouvrez le panneau correspondant pour consulter, lorsque ces informations sont disponibles, l’adresse IP, le masque de sous-réseau, la passerelle, le DNS, l’adresse MAC, le SSID, le signal et le nombre d’appareils connectés.

Le panneau Ethernet affiche l’état du lien et les adresses actuelles. Il ne permet pas de modifier les adresses.

### Choisir un mode WiFi

| Mode | Fonction |
| --- | --- |
| « Off » | Désactive le WiFi. |
| « Station (STA) » | Connecte l’appareil à un réseau WiFi existant. |
| « Access Point (AP) » | Fait de l’appareil un point d’accès WiFi. |
| « STA+AP » | Connecte l’appareil à un réseau WiFi existant tout en maintenant son point d’accès disponible. |

Après avoir choisi un mode, attendez l’actualisation de l’état sur la page. La connexion sans fil actuelle peut être interrompue pendant le changement.

### Se connecter au WiFi

1. Choisissez le mode « Station (STA) » ou « STA+AP ».
2. Dans « Station », sélectionnez « Scan ».
3. Choisissez un réseau dans la liste, qui indique le SSID, la puissance du signal, le canal et le type d’authentification.
4. Saisissez le mot de passe et confirmez. Laissez ce champ vide pour un réseau ouvert.
5. Attendez l’état « Connected », puis vérifiez la nouvelle adresse IP.

Sélectionnez « Disconnect » pour fermer la connexion actuelle du client WiFi.

### Configurer le point d’accès WiFi

1. Choisissez le mode « Access Point (AP) » ou « STA+AP ».
2. Dans « Hotspot », sélectionnez « Config ».
3. Saisissez le SSID. Un mot de passe vide crée un point d’accès ouvert ; un point d’accès protégé exige au moins 8 caractères.
4. Choisissez un canal et activez « Hidden SSID » si nécessaire.
5. Sélectionnez « Apply » et attendez l’actualisation de l’état du point d’accès.

Sélectionnez « Devices » pour consulter les clients connectés au point d’accès.

### Définir le nom d’hôte

Saisissez un nouveau nom dans « Hostname », sous « Network Services », puis sélectionnez « Set ». La page affiche le nom d’hôte actuel après sa mise à jour.

### Consulter les clients DHCP

DHCP attribue les adresses réseau aux appareils connectés. Sélectionnez « Clients », choisissez « WiFi AP » ou « Ethernet » et consultez les baux actuels. Utilisez le bouton d’actualisation pour recharger la liste.

### Opérations réseau avancées

#### Configurer la passerelle NAT

NAT transfère le trafic entre les interfaces réseau de l’appareil. Activez ou désactivez NAT, puis sélectionnez « Save » pour conserver le réglage. Vérifiez ensuite l’état du WiFi et d’Ethernet.

#### Accéder au réseau amont par LPMU

Lorsque « Upstream Network Access » est affiché, sélectionnez « Access via LPMU ». Attendez que l’état passe de « Processing » à « Success » ou « Failed ». Ne relancez pas l’opération pendant le traitement. En cas d’échec, consultez l’erreur et la sortie affichées sur la page.

## 7. Gestion des fichiers

Sélectionnez « Files » dans la navigation supérieure pour ouvrir « File Manager ».

La carte SD est un support amovible ; SPIFFS est le stockage interne des fichiers de l’appareil. Sélectionnez « SD Card » ou « SPIFFS » pour changer d’emplacement. Le chemin en haut indique le dossier actuel. Sélectionnez le nom d’un dossier dans ce chemin pour y revenir.

### Parcourir et gérer les fichiers

- Sélectionnez le nom d’un dossier pour l’ouvrir.
- Sélectionnez le bouton de téléchargement à côté d’un fichier pour l’enregistrer dans le dossier de téléchargement du navigateur.
- Sélectionnez le bouton de renommage, saisissez le nouveau nom et confirmez.
- Sélectionnez « New Folder », saisissez un nom et créez le dossier.
- Sélectionnez le bouton d’actualisation pour recharger le répertoire et l’état du stockage.

### Envoyer des fichiers

1. Ouvrez le répertoire de destination.
2. Sélectionnez « Upload Files ».
3. Sélectionnez un ou plusieurs fichiers, ou faites-les glisser dans la zone d’envoi.
4. Vérifiez la liste et retirez les fichiers indésirables.
5. Sélectionnez « Upload » et attendez que chaque fichier soit indiqué comme terminé.

L’envoi d’un paquet de configuration `.tscfg` lance son processus de vérification et d’application. Consultez le Guide de sécurité pour les exigences relatives à l’origine, aux signatures et à l’application des paquets.

### Opérations par lot

La barre d’opérations par lot apparaît lorsque vous sélectionnez des fichiers ou des dossiers.

- « Batch Download » télécharge les fichiers sélectionnés, sans inclure les dossiers.
- « Batch Delete » supprime les fichiers et dossiers sélectionnés.
- « Clear Selection » annule la sélection actuelle.

### Supprimer un fichier ou un dossier

La suppression ne peut pas être annulée dans l’interface web. Supprimer un dossier supprime aussi tout son contenu. Vérifiez le nom et le chemin avant de sélectionner « Delete » ou « Batch Delete » et d’accepter la confirmation.

### Monter et démonter la carte SD

Démonter la carte SD rend ses fichiers temporairement indisponibles. Vérifiez qu’aucun envoi, téléchargement ou autre traitement de fichiers n’est en cours, puis sélectionnez « Unmount SD ».

Lorsque la carte n’est pas montée, la page affiche « Mount SD ». Sélectionnez cette commande, attendez l’état « Mounted », puis rouvrez le répertoire de la carte SD.

## 8. Mises à jour OTA

Sur la page « System », sélectionnez « OTA Update » dans « Network & Time » pour ouvrir « Firmware Upgrade ».

<!-- operational-note -->

L’appareil redémarre pendant une mise à jour, ce qui déconnecte temporairement l’interface web, Terminal et Automation. Enregistrez le travail en cours et assurez une alimentation stable avant de commencer. N’éteignez pas l’appareil tant que la mise à jour n’est pas terminée.

### Rechercher une mise à jour sur un serveur OTA

1. Vérifiez « Current Version ».
2. Saisissez l’adresse du serveur OTA fournie par un administrateur ou par l’éditeur du firmware.
3. Sélectionnez « Save », puis « Check Update ».
4. La page affiche « Update Available », « Already up to date », une version plus ancienne sur le serveur ou une erreur.
5. Confirmez la version cible, puis sélectionnez « Upgrade Now » ou la commande de mise à jour affichée.
6. Attendez la fin du téléchargement, de l’installation et du redémarrage. Lorsqu’elle est disponible, la commande « Abort » peut arrêter les étapes qui prennent en charge l’annulation.
7. Reconnectez-vous à l’interface web lorsque l’appareil est de nouveau en ligne et vérifiez « Current Version ».

Lorsque « Include WebUI » est activé, le firmware et l’interface web sont mis à jour l’un après l’autre. Ils doivent provenir de la même version publiée.

### Mise à jour manuelle

Dépliez « Manual Upgrade » et choisissez l’une des méthodes suivantes :

- « Upgrade from URL » : saisissez l’URL du firmware, réglez « Include WebUI » selon les instructions de la version, puis sélectionnez « Upgrade ».
- « Upgrade from SD Card » : saisissez un chemin de firmware tel que `/sdcard/firmware.bin`. Lorsque « Include WebUI » est activé, la page traite aussi le fichier de l’interface web situé dans le même répertoire.

Pour une mise à jour depuis une URL, « Skip Verify » ignore la vérification du certificat du serveur HTTPS. Cela supprime le contrôle qui confirme l’identité du serveur de téléchargement. Laissez cette option décochée pour les mises à jour courantes. Si une erreur de certificat apparaît, demandez à votre administrateur de vérifier l’adresse et le certificat du serveur.

### Gestion des partitions et retour à une version antérieure

« Partition Management » affiche la partition en cours d’exécution et les autres partitions disponibles.

- « Mark Valid » confirme la version en cours et désactive sa protection de retour automatique. Utilisez cette commande après avoir vérifié que la version fonctionne correctement.
- « Rollback to This Version » sélectionne une autre version amorçable et bascule vers celle-ci par un redémarrage. Ce retour interrompt les services actuels. Vérifiez d’abord la version cible et la compatibilité des données.

Une fois l’opération et le redémarrage terminés, rouvrez l’interface web et vérifiez la version actuelle et l’état de l’appareil.

## 9. Accéder à la gestion de la sécurité

Sélectionnez « Security » dans la navigation supérieure pour ouvrir la gestion de la sécurité. Consultez le Guide de sécurité de TianshanOS pour les clés SSH, les hôtes distants, les empreintes d’hôtes connus, les certificats HTTPS, les paquets de configuration et les comptes. Ces procédures ne sont pas reprises ici.

## Partie II : opérations réservées à root

## 10. Terminal et journaux système

« Terminal » n’est affiché que pour root. Il permet d’exécuter les commandes de la console de l’appareil et de consulter ses journaux. Une commande peut modifier immédiatement l’état de l’appareil. Vérifiez son origine, ses paramètres et son impact avant de la saisir.

### Se connecter au terminal et l’utiliser

1. Sélectionnez « Terminal » dans la navigation supérieure.
2. Attendez le message « Connected to device » et l’invite `tianshan>`.
3. Saisissez `help` pour consulter les commandes du firmware actuel.
4. Saisissez une commande et appuyez sur Entrée. Attendez la fin de la sortie et le retour de l’invite.

La saisie n’est pas exécutée tant que la page affiche « Not connected to device ». Après une déconnexion, attendez le message de reconnexion avant de soumettre de nouveau une commande, afin d’éviter une double exécution.

Le terminal prend en charge les commandes clavier suivantes :

| Commande | Fonction |
| --- | --- |
| Ctrl+C | Efface la saisie actuelle et demande une interruption. La commande doit prendre en charge l’interruption pour s’arrêter. |
| Ctrl+L | Efface l’écran. |
| ↑ / ↓ | Parcourt l’historique des commandes de la session actuelle de la page. |
| ← / → | Déplace le curseur dans la saisie actuelle. |

« Clear », en haut de la page, efface uniquement l’affichage. Cela n’annule pas les commandes déjà exécutées. « Disconnect » ferme la connexion actuelle au terminal.

### Ouvrir un shell SSH distant

Un shell SSH envoie les saisies clavier suivantes à un hôte distant. Vérifiez l’adresse cible, l’utilisateur et la méthode d’authentification, puis effectuez la préparation SSH décrite dans le Guide de sécurité avant la connexion.

1. Saisissez `ssh --help` pour consulter les options de la commande SSH.
2. Saisissez `ssh --host <host> --user <user> --shell` en remplaçant chaque paramètre fictif, chevrons compris, par sa valeur réelle. Pour préciser un port, ajoutez `--port <port>` avant --shell.
3. Attendez la confirmation de la connexion distante avant de saisir des commandes distantes.
4. Appuyez sur Ctrl+\ pour quitter le shell SSH et revenir à l’invite tianshan>.

Ne saisissez pas d’éléments d’authentification en clair lorsque le terminal est partagé, enregistré ou visible par une autre personne.

### Consulter les journaux système

Sélectionnez « System Logs » en haut de Terminal pour ouvrir la fenêtre des journaux.

- « Level » fixe le niveau minimal affiché. Utilisez ERROR, WARN+, INFO+ ou DEBUG+ pour restreindre la sortie.
- « TAG » filtre selon la source du journal.
- « Search » filtre les journaux actuels par mot-clé.
- « Auto Scroll » suit les nouvelles entrées lorsqu’il est activé.
- Le bouton d’actualisation recharge les journaux historiques.
- Le bouton d’effacement ne supprime que les journaux actuellement affichés dans la fenêtre.

Si le filtrage ne donne aucun résultat, videz d’abord TAG et Search, puis changez Level. Fermer la fenêtre des journaux n’arrête pas les services de l’appareil.

## 11. Gérer et exécuter des commandes distantes

« Commands » enregistre des commandes SSH réutilisables et les exécute sur un hôte distant sélectionné. Les hôtes et leurs informations d’authentification sont gérés sur la page « Security ». Consultez le Guide de sécurité pour ces procédures.

### Choisir un hôte et consulter ses commandes

1. Sélectionnez « Commands » dans la navigation supérieure.
2. Choisissez un hôte affiché dans « Select Host ».
3. Consultez ses éléments enregistrés dans « Command List ».

Les commandes de « Orphan Commands » font référence à des hôtes qui n’existent plus et ne peuvent pas être exécutées. Supprimez la commande orpheline ou utilisez l’option de liaison à l’importation pour l’associer à un hôte valide.

### Créer ou modifier une commande

<!-- operational-note -->

Une commande enregistrée s’exécute sur un hôte distant. Vérifiez la commande et les autorisations requises sur cet hôte avant de l’enregistrer. Soyez particulièrement attentif aux commandes qui suppriment des données, arrêtent ou redémarrent un hôte, ou écrasent des fichiers.

1. Choisissez un hôte, puis sélectionnez « New Command ». Utilisez le bouton de modification d’une commande existante pour la changer.
2. Saisissez un « Command ID » unique. Il accepte les lettres, chiffres, traits de soulignement et traits d’union, mais ne doit pas commencer ou se terminer par un trait de soulignement ou d’union.
3. Renseignez « Command Name » et « Command ». Si vous utilisez plusieurs lignes, placez une commande par ligne.
4. Ajoutez au besoin une description et une icône ou une image de la carte SD.
5. Vérifiez les options avancées, puis sélectionnez « Save ». Le nom permet de reconnaître la commande ; Automation utilise son ID pour y faire référence. L’ID est en lecture seule lors de la modification d’une commande existante. Pour en utiliser un autre, créez une commande et mettez à jour les modèles d’action ou les sources de données concernés.

### Exécuter une commande et examiner le résultat

1. Sélectionnez la commande d’exécution sur une carte.
2. Observez la sortie et l’état dans « Execution Result ».
3. Lorsque « Cancel » apparaît, utilisez-le pour terminer la session d’exécution actuelle.
4. Sélectionnez « Clear » pour effacer l’affichage du résultat actuel.

« Clear » n’annule pas le travail déjà accompli sur l’hôte distant. La réussite, l’échec, le contenu extrait et l’état final dépendent des réglages de correspondance de la commande.

### Configurer l’analyse du résultat

La recherche de correspondances transforme la sortie distante en un état plus facile à exploiter.

- « Success Pattern » : indique une réussite lorsque la sortie contient le texte configuré.
- « Fail Pattern » : indique un échec lorsque la sortie contient le texte configuré.
- « Extract Pattern » : utilise un groupe de capture `(.*)` pour enregistrer une partie de la sortie.
- « Stop on Match » : termine une commande continue après une correspondance réussie.
- « Timeout » : cesse d’attendre si aucune correspondance n’arrive dans le délai configuré. Ce réglage ne s’applique que si un motif de réussite ou d’échec est défini, ou si « Stop on Match » est activé.
- « Variable Name » : enregistre l’état et la sortie extraite pour les utiliser dans Automation.

Choisissez des textes de réussite et d’échec stables et précis. Des textes trop généraux peuvent produire de fausses correspondances. Exécutez la commande une fois et examinez « Match Results » avant d’utiliser ses variables dans une règle.

### Utiliser l’exécution en arrière-plan et le mode service

nohup permet à une commande de continuer en arrière-plan sur l’hôte distant après la fermeture de la connexion SSH. Fermer l’interface web n’arrête pas une tâche en arrière-plan.

Après avoir activé « Background (nohup) », vous pouvez utiliser :

- « View Log » : consulter le journal actuel de la tâche en arrière-plan.
- « Tail Log » : actualiser le journal en continu.
- « Stop Tail » : arrêter l’actualisation de la page sans arrêter la tâche distante.
- « Check Process » : vérifier si la tâche est toujours en cours.
- « Stop Process » : terminer la tâche correspondante.

« Service Mode (monitor ready state) » surveille une tâche en arrière-plan jusqu’à ce qu’elle soit disponible. Vous devez fournir Ready Pattern et Variable Name. Ajustez au besoin le motif d’échec facultatif et les délais :
- « Ready Pattern » : indique que le service est prêt lorsque le texte configuré apparaît. Utilisez `|` pour séparer plusieurs motifs.
- « Fail Pattern » : indique que le service a échoué lorsque le texte configuré apparaît.
- « Timeout » : fixe l’attente maximale de l’état prêt.
- « Check Interval » : fixe la fréquence de consultation du journal.
- « Variable Name » : enregistre des états tels que checking, ready et timeout.

Stop Tail et Stop Process ont des effets différents. Utilisez « Stop Tail » pour cesser de consulter les mises à jour. N’utilisez « Stop Process » qu’après avoir confirmé que la tâche distante peut être arrêtée.

### Importer et exporter des commandes

- Utilisez le bouton d’exportation d’une commande pour l’exporter et, si l’option est sélectionnée, inclure la configuration de l’hôte dont elle dépend.
- Sélectionnez « Import Command », choisissez un paquet de configuration `.tscfg`, examinez son contenu et décidez s’il faut écraser une configuration existante ou le lier à un hôte affiché sur la page.

L’importation peut écraser un élément portant le même ID et inclure des informations d’hôte distant. Suivez le Guide de sécurité pour évaluer les signatures, la confiance accordée aux certificats et l’origine des paquets. Si la page exige un redémarrage, terminez les tâches de Terminal et d’Automation avant de le planifier.

Avant de supprimer une commande, vérifiez qu’aucune source de données ni aucun modèle d’action d’Automation n’y fait référence. La suppression ne peut pas être annulée sur la page Commands.

## 12. Gestion de l’automatisation

« Automation » relie les données de l’appareil à des opérations répétables. La relation principale est la suivante :

```text
Automatique : Source de données → Variable → Règle → Action
Manuel : Action rapide du système → Action
```

- Une source de données lit des données externes ou de l’appareil.
- Une variable conserve une valeur qui peut être évaluée.
- Une règle décide quand le travail est exécuté.
- Un modèle d’action définit le travail à effectuer.
- Une règle Manual Trigger Only apparaît dans « Quick Actions » sur la page « System ».

### Consulter et commander le moteur d’automatisation

Les cartes d’état indiquent l’état du moteur, les nombres de règles, de variables, de sources de données et de déclenchements, ainsi que la durée de fonctionnement.

| Commande | Effet |
| --- | --- |
| « Start » | Démarre un moteur arrêté et commence à traiter les règles activées. |
| « Pause » | Suspend les prochaines évaluations automatiques. Les actions déjà en cours peuvent continuer. Pour reprendre, sélectionnez « Stop », puis « Start ». |
| « Stop » | Arrête le traitement des règles et l’actualisation des sources de données. La configuration enregistrée est conservée. |
| « Reload » | Recharge la configuration enregistrée du moteur. S’il était en cours d’exécution, il reprend ensuite. Enregistrez d’abord vos modifications. |

<!-- operational-note -->

Avant de changer l’état du moteur, vérifiez si le refroidissement, les alertes ou d’autres tâches en cours dépendent d’Automation. Pause et Stop ne garantissent pas l’arrêt des actions asynchrones en attente ni des processus distants en arrière-plan. Vérifiez ces tâches séparément, puis actualisez l’état du moteur.

### Créer un processus d’automatisation minimal

Pour un nouveau processus, procédez dans cet ordre :

1. Créez une source de données et testez sa connexion avec la commande prévue.
2. Activez la source, confirmez que la valeur nécessaire apparaît dans « Variables » et vérifiez son heure de mise à jour.
3. Créez un modèle d’action, vérifiez ses paramètres et sélectionnez « Test ». Le test exécute immédiatement l’action ; vérifiez d’abord que l’appareil et l’hôte distant peuvent la recevoir.
4. Créez une règle en laissant « Enable immediately » décoché.
5. Vérifiez les conditions, le délai entre déclenchements, l’ordre des actions, les délais et les répétitions.
6. Enregistrez et activez la règle, puis observez les variables, le compteur de déclenchements et le résultat réel.

### Gérer les sources de données

Sélectionnez « Add » dans « Data Sources », puis choisissez un type pris en charge par la page :

| Type | Fonction |
| --- | --- |
| « REST API » | Lit périodiquement les données renvoyées par une adresse HTTP. |
| « WebSocket » | Reçoit des données envoyées sur une connexion persistante. |
| « Socket.IO » | Reçoit les événements d’un service Socket.IO. |
| « Command Variable » | Lit les résultats enregistrés sur la page Commands. |

REST API lit des données par une URL. WebSocket et Socket.IO reçoivent des mises à jour continues. Une Command Variable provient du résultat d’une commande SSH configurée.

1. Saisissez l’ID, le libellé et les informations de connexion exigées par le type de source.
2. Utilisez « Test Connection » ou la commande de test affichée pour ce type.
3. Pour REST API, WebSocket ou Socket.IO, sélectionnez les champs à conserver dans le résultat du test. Si le nom d’événement Socket.IO est vide, le test tente de découvrir un événement envoyé par le service.
4. Pour « Command Variable », sélectionnez un hôte et une commande possédant un Variable Name, puis réglez l’intervalle d’interrogation.
5. Enregistrez et activez la source, puis vérifiez le résultat dans « Variables ».

La liste des sources indique le type, l’état et l’intervalle de mise à jour. Vous pouvez activer ou désactiver une source, consulter ses variables, l’exporter ou la supprimer. La désactivation ou la suppression peut empêcher l’évaluation des règles qui en dépendent. Vérifiez leurs références avant toute suppression.

L’importation et l’exportation des sources utilisent des paquets de configuration. Examinez l’ID, le type et la configuration cible avant l’importation. Vérifiez les dépendances des règles existantes avant d’écraser une source portant le même ID. Suivez le Guide de sécurité pour la confiance accordée aux paquets.

### Consulter les variables

« Variables » affiche les données disponibles pour Automation. Utilisez le champ de recherche pour filtrer par nom.

Vérifiez :

- Que le nom et la source sont ceux attendus.
- Que la valeur actuelle et le type de données conviennent à la comparaison.
- Que l’heure de mise à jour continue de changer.
- Si la page signale des données périmées ou invalides.

Lorsqu’une variable cesse d’être actualisée, vérifiez d’abord que sa source est activée. Utilisez ensuite le test de la source pour vérifier la connexion et le champ sélectionné.

### Créer et tester des modèles d’action

Un modèle d’action définit le travail effectué après le déclenchement d’une règle. Sélectionnez « Add » dans « Action Templates », puis choisissez un type pris en charge :

| Type | Fonction |
| --- | --- |
| « CLI Command » | Exécute une commande locale de la console TianshanOS. |
| « SSH Command » | Exécute une commande distante déjà configurée sur la page Commands. |
| « LED Control » | Commande les LED et les fonctions d’affichage proposées par la page. |
| « Log » | Écrit un message de journal au niveau choisi. |
| « Set Variable » | Écrit une valeur dans une variable d’Automation. |
| « Webhook » | Envoie une requête à une adresse HTTP. |

CLI est une commande locale de l’appareil. SSH Command s’exécute sur un hôte distant. Webhook notifie ou appelle un service externe.

Chaque modèle exige un ID unique. Vous pouvez ajouter un nom d’affichage, une description et un délai d’exécution, et activer « Async execution » si nécessaire. Une action asynchrone continue en arrière-plan après sa soumission. Vérifiez son état ultérieur dans le journal, la variable ou l’appareil cible correspondant.

Chaque type exige aussi :

- CLI Command : une ligne de commande, avec une variable de résultat et un délai maximal facultatifs.
- SSH Command : un hôte et une commande proposés par la page. Vérifiez l’aperçu avant d’enregistrer.
- LED Control : un appareil et les opérations de couleur, d’effet, de luminosité, de texte, d’image, de code QR ou de filtre qu’il prend en charge.
- Log : un niveau et un message. Le message peut faire référence à des variables.
- Set Variable : un nom de variable et une valeur.
- Webhook : une méthode, une URL et le contenu de requête exigé par la page. JSON est le format texte utilisé pour le contenu structuré des requêtes.

« Test » exécute immédiatement l’action. Vérifiez son effet avant de tester des commandes d’alimentation, des redémarrages, des commandes distantes, une sortie LED ou des requêtes externes. N’ajoutez une action à une règle qu’après avoir compris le résultat du test. Avant de supprimer un modèle, vérifiez qu’aucune règle n’y fait référence. L’importation peut écraser une action portant le même ID. Suivez le Guide de sécurité pour les exigences de confiance lors de l’importation ou de l’exportation des paquets.

### Créer une règle

Une règle relie des conditions sur les variables à des modèles d’action.

1. Sélectionnez « Add » dans « Rules ».
2. Saisissez un « Rule ID » unique, un nom et une icône.
3. Choisissez « Logic » :
- AND déclenche la règle lorsque toutes les conditions sont remplies.
- OR la déclenche lorsqu’au moins une condition est remplie.
4. Réglez « Cooldown (ms) » pour limiter la fréquence des déclenchements.
5. Ajoutez des conditions et choisissez une variable, une comparaison et une valeur.
6. Ajoutez un ou plusieurs modèles d’action et les délais nécessaires à leur enchaînement.
7. Vérifiez et enregistrez la règle. Ne l’activez que lorsqu’elle est prête à être exécutée.

Les comparaisons actuelles sont « Equal », « Not Equal », « Greater Than », « Greater or Equal », « Less Than », « Less or Equal », « Value Changed » et « Contains ». Utilisez une valeur de comparaison compatible avec le type de données de la variable.

### Configurer les répétitions et les conditions d’action

Chaque action propose :

- « Once » : une exécution à chaque déclenchement de la règle.
- « Repeat while true » : répétition à l’intervalle configuré tant que la condition propre à l’action est vraie, dans la limite de 100 exécutions par séquence.
- « Fixed count » : répétition selon le nombre et l’intervalle configurés.

La condition d’exécution d’une action est distincte des conditions de déclenchement de la règle. Définissez une condition d’action avant d’utiliser « Repeat while true ». Sans condition, l’action se répète jusqu’à la limite par séquence. La règle peut ensuite déclencher une nouvelle séquence.

Désactiver une règle empêche les futurs déclenchements automatiques ; une séquence de répétition en cours peut continuer. Désactivez d’abord la règle, puis vérifiez les actions actives. Pour une tâche distante en arrière-plan, arrêtez son processus sur la page Commands et confirmez sa fin.

### Créer une action rapide

Lorsque « Manual Trigger Only » est activé, la règle n’exige aucune condition de déclenchement et apparaît sous forme de carte sur « System ».

1. Saisissez l’ID, le nom et l’icône de la règle.
2. Activez « Manual Trigger Only ».
3. Ajoutez les modèles d’action à exécuter.
4. Enregistrez et activez la règle pour faire apparaître sa carte sur System.
5. Revenez à « System », repérez la carte dans « Quick Actions », exécutez-la une fois et vérifiez le résultat.

Une règle manuelle utilise toujours toutes les actions, tous les délais et toutes les répétitions configurés. Avant de proposer une action rapide aux utilisateurs admin, donnez-lui un nom clair, rendez ses effets prévisibles et prévoyez un journal ou un moyen d’arrêt utilisable.

### Entretenir les règles et la configuration

La liste Rules permet d’activer, de désactiver, de déclencher manuellement, de modifier, d’exporter et de supprimer une règle.

- Manual Trigger exécute les actions sans vérifier si la règle est activée ni attendre son délai entre déclenchements. Il ne s’agit pas d’un aperçu, même si la règle est désactivée.
- Désactiver une règle empêche les futurs déclenchements automatiques. Cela n’annule pas les actions terminées.
- La suppression d’une règle ne peut pas être annulée sur la page.
- Avant de modifier une règle, vérifiez que ses variables et ses modèles d’action existent toujours.
- Avant d’importer une règle, examinez son ID, ses conditions et ses références d’action. Confirmez l’impact avant d’écraser un élément portant le même ID.

Après l’importation ou la modification de sources, d’actions ou de règles, vérifiez l’état du moteur et l’état d’activation dans chaque liste. Si la page exige Reload ou un redémarrage, terminez les tâches distantes en cours avant de le planifier.
