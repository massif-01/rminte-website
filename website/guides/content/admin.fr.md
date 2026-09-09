# Guide d’utilisation de TianshanOS pour admin

Les noms des boutons et des rubriques sont conservés en anglais pour vous permettre de les retrouver sur l’appareil. Son interface web est disponible en chinois et en anglais ; changer la langue de ce site ne modifie pas les langues de l’appareil.

Ce guide s’adresse aux utilisateurs qui gèrent TianshanOS avec le compte admin. Il décrit les opérations courantes de l’interface web. Pour la gestion de la sécurité, consultez le Guide de sécurité de TianshanOS. L’accès au terminal, les règles d’automatisation et la gestion des commandes sont traités dans le guide d’exploitation de root.

Les commandes disponibles dépendent de votre appareil et de sa configuration. Certaines n’apparaissent que si le matériel requis est connecté ou si la fonction a été configurée.

## 1. Premiers pas

### Ouvrir l’interface web

1. Ouvrez l’interface web de l’appareil (WebUI) à l’adresse fournie par votre administrateur.
2. Sélectionnez « Login » en haut à droite.
3. Conservez `admin` comme nom d’utilisateur et saisissez le mot de passe admin fourni avec l’appareil.
4. Sélectionnez « Login ». Une fois la connexion établie, le nom de l’utilisateur actuel apparaît en haut à droite.

Si le mot de passe par défaut est encore utilisé, le message « Security Reminder » apparaît après la connexion. Saisissez le mot de passe actuel et le nouveau, puis sélectionnez « Change Now ». Les deux saisies du nouveau mot de passe doivent être identiques. « Change Later » ferme le rappel.

Lorsque vous avez terminé, sélectionnez « Logout » en haut à droite. Vous devrez vous reconnecter pour utiliser l’appareil.

### Changer de langue

Sélectionnez le bouton de langue en haut de la page, puis choisissez le chinois ou l’anglais. Le contenu et les libellés des commandes changent aussitôt.

### Naviguer entre les pages

Les principales pages accessibles à admin sont :

- « System » : consulter l’état de l’appareil, commander les modules, les ventilateurs et les LED, et accéder aux mises à jour OTA.
- « Network » : consulter l’état Ethernet et les clients DHCP, configurer le WiFi et gérer le transfert NAT.
- « Files » : gérer les fichiers de la carte SD et de SPIFFS.
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

Un redémarrage interrompt temporairement l’interface web et la gestion de l’appareil. Terminez les opérations en cours avant de sélectionner « Reboot » et de confirmer. La page indique que le système redémarre. Rouvrez l’interface lorsque l’appareil est de nouveau disponible.

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

« Quick Actions » affiche les cartes d’action mises à la disposition des utilisateurs admin.

1. Sélectionnez une carte pour lancer son action.
2. Patientez pendant que la carte indique un traitement en cours.
3. Les cartes prenant en charge les tâches en arrière-plan affichent un état d’exécution et les commandes « Log » et « Stop ».
4. Sélectionnez « Log » pour consulter la sortie actuelle. Sélectionnez « Stop » pour arrêter une tâche en cours.

<!-- operational-note -->

Une tâche en cours doit être arrêtée avant de pouvoir être relancée. Après avoir déclenché une action, attendez quelques secondes avant d’en lancer une autre.

Maintenez une carte enfoncée jusqu’à l’apparition de l’indicateur de réorganisation, puis faites-la glisser pour modifier l’ordre d’affichage. « No Quick Actions » signifie qu’aucune carte n’est actuellement disponible pour le compte admin.

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

Sélectionnez « Network » dans la navigation supérieure pour ouvrir « Network Settings ». Changer le mode réseau, le point d’accès ou les réglages NAT peut interrompre la connexion actuelle à l’interface web. Avant d’enregistrer, assurez-vous de pouvoir vous reconnecter à la nouvelle adresse réseau.

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

L’appareil redémarre pendant une mise à jour, ce qui déconnecte temporairement l’interface web. Enregistrez le travail en cours et assurez une alimentation stable avant de commencer. N’éteignez pas l’appareil tant que la mise à jour n’est pas terminée.

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
