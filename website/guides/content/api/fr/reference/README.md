# Index de l’API

277 noms enregistrés dans 28 groupes : 276 interfaces avec un traitement fonctionnel, alias compris, et une interface conservée mais non prise en charge. L’enregistrement seul ne prouve pas que les dépendances sont prêtes. Les routes binaires dédiées et WebSocket ont leurs propres chapitres.

## Envoyer un exemple

Enregistrez le JSON de l’API cible dans request.json et remplacez les valeurs fictives. Envoyez-le par POST au chemin indiqué. L’en-tête Authorization peut être omis pour une interface publique.

```sh
curl --connect-timeout 5 --max-time 60 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' --data-binary @request.json \
  "$TS_BASE/api/v1/PATH_FROM_REFERENCE"
```

Un objet vide {} permet une consultation ou un appel sans arguments fonctionnels. Les écritures ont des effets réels. Récupérez d’abord la version, l’identifiant d’objet, le certificat ou les fichiers de publication nécessaires. GET n’est autorisé que lorsque cela est indiqué ; utilisez POST JSON pour les paramètres complexes.

## Groupes

| Groupe | Nombre |
| --- | --- |
| [Comptes et sessions](auth.md) | 7 |
| [Statut de contrôleur](system.md) | 8 |
| [Ventilateurs](fan.md) | 8 |
| [Température](temp.md) | 6 |
| [Puissance et protection](power.md) | 13 |
| [Ordinateurs et USB](device.md) | 9 |
| [Configuration générale et module](config.md) | 10 |
| [Réseau](network.md) | 9 |
| [Gestion du WiFi](wifi.md) | 4 |
| [Transmission de réseaux](nat.md) | 4 |
| [Affectation des adresses](dhcp.md) | 4 |
| [Heure](time.md) | 5 |
| [Fichiers de périphériques](storage.md) | 9 |
| [Services de contrôleur](service.md) | 5 |
| [Surveillance du calcul](monitor.md) | 6 |
| [Mise en page du suivi](ui.md) | 2 |
| [Registres](log.md) | 5 |
| [Empreintes SSH](hosts.md) | 5 |
| [Clés SSH](key.md) | 6 |
| [Certificats d'appareil](cert.md) | 7 |
| [Lumières et matrice](led.md) | 24 |
| [Entretien des goupilles](gpio.md) | 4 |
| [Configuration du réseau d'application-ordinateur](lpmu_access.md) | 3 |
| [Connexions et commandes SSH](ssh.md) | 23 |
| [Fichiers distants](sftp.md) | 6 |
| [Automatisation et gestion des services](automation.md) | 56 |
| [Paquets de configuration](config_pack.md) | 8 |
| [Mises à jour et récupération](ota.md) | 21 |

## Tous les noms

| Dénomination | Objet | Niveau minimal d’accès | Méthodes | Disponibilité |
| --- | --- | --- | --- | --- |
| [auth.admin.reset_password](auth.md#authadminreset_password) | Rétablir le mot de passe admin par défaut | ROOT | POST | Selon les conditions ; voir les détails |
| [auth.admin.set_password](auth.md#authadminset_password) | Définir le mot de passe admin avec root | ROOT | POST | Selon les conditions ; voir les détails |
| [auth.change_password](auth.md#authchange_password) | Modifier le mot de passe | Token dans le corps de la requête, pour les API d’authentification | POST | Selon les conditions ; voir les détails |
| [auth.login](auth.md#authlogin) | Connexion d’un utilisateur | Public | POST | Selon les conditions ; voir les détails |
| [auth.logout](auth.md#authlogout) | Déconnexion de l'utilisateur | Token dans le corps de la requête, pour les API d’authentification | POST | Selon les conditions ; voir les détails |
| [auth.root.set_password](auth.md#authrootset_password) | Définir le mot de passe root avec root | ROOT | POST | Selon les conditions ; voir les détails |
| [auth.status](auth.md#authstatus) | Vérifier l’état d’authentification | Token dans le corps de la requête, pour les API d’authentification | POST | Selon les conditions ; voir les détails |
| [automation.action.stats](automation.md#automationactionstats) | Obtenir des statistiques sur l'exécution des actions | READ | GET/POST | Selon les conditions ; voir les détails |
| [automation.action.stats.reset](automation.md#automationactionstatsreset) | Réinitialiser les statistiques d'action | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.actions.add](automation.md#automationactionsadd) | Créer un nouveau modèle d'action | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.actions.delete](automation.md#automationactionsdelete) | Supprimer un modèle d'action | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.actions.execute](automation.md#automationactionsexecute) | Exécuter un modèle d'action | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.actions.export](automation.md#automationactionsexport) | Exporter un modèle d’action en paquet de configuration (.tscfg) | ROOT | POST | Selon les conditions ; voir les détails |
| [automation.actions.get](automation.md#automationactionsget) | Obtenir le modèle d'action par ID | READ | GET/POST | Selon les conditions ; voir les détails |
| [automation.actions.import](automation.md#automationactionsimport) | Importer un modèle d’action depuis un paquet de configuration | ROOT | POST | Selon les conditions ; voir les détails |
| [automation.actions.list](automation.md#automationactionslist) | Lister tous les modèles d’action | READ | GET/POST | Selon les conditions ; voir les détails |
| [automation.actions.update](automation.md#automationactionsupdate) | Mettre à jour un modèle d'action existant | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.config.apply](automation.md#automationconfigapply) | Appliquer le choix de restauration ou de source confirmé | ROOT | POST | Selon les conditions ; voir les détails |
| [automation.config.backup](automation.md#automationconfigbackup) | Enregistrer la configuration d'urgence complète | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.config.enable](automation.md#automationconfigenable) | Activer ou suspendre explicitement la configuration actuelle | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.config.preview](automation.md#automationconfigpreview) | Prévisualiser un choix de restauration ou de source de configuration | ROOT | POST | Selon les conditions ; voir les détails |
| [automation.config.refresh](automation.md#automationconfigrefresh) | Vérifiez la carte SD une fois sans changer le choix de l'utilisateur | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.config.status](automation.md#automationconfigstatus) | État actuel de stockage et de sauvegarde de l'automatisation | READ | GET/POST | Selon les conditions ; voir les détails |
| [automation.pause](automation.md#automationpause) | Suspendre le moteur d’automatisation | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.proxy.fetch](automation.md#automationproxyfetch) | Effectuer une requête vers une API REST externe via le proxy | READ | POST | Selon les conditions ; voir les détails |
| [automation.proxy.socketio_test](automation.md#automationproxysocketio_test) | Tester une connexion Socket.IO, protocole v4 | ROOT | POST | Selon les conditions ; voir les détails |
| [automation.proxy.websocket_test](automation.md#automationproxywebsocket_test) | Tester la connexion WebSocket | ROOT | POST | Selon les conditions ; voir les détails |
| [automation.reload](automation.md#automationreload) | Recharger la configuration | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.resume](automation.md#automationresume) | Reprendre le moteur d'automatisation | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.rules.add](automation.md#automationrulesadd) | Ajouter une nouvelle règle | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.rules.delete](automation.md#automationrulesdelete) | Supprimer une règle | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.rules.disable](automation.md#automationrulesdisable) | Désactiver une règle | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.rules.enable](automation.md#automationrulesenable) | Activer une règle | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.rules.export](automation.md#automationrulesexport) | Exporter une règle en paquet de configuration (.tscfg) | ROOT | POST | Selon les conditions ; voir les détails |
| [automation.rules.get](automation.md#automationrulesget) | Obtenez les détails de la règle par ID | READ | GET/POST | Selon les conditions ; voir les détails |
| [automation.rules.import](automation.md#automationrulesimport) | Importer une règle depuis un paquet de configuration | ROOT | POST | Selon les conditions ; voir les détails |
| [automation.rules.list](automation.md#automationruleslist) | Lister toutes les règles | READ | GET/POST | Selon les conditions ; voir les détails |
| [automation.rules.trigger](automation.md#automationrulestrigger) | Déclencher manuellement une règle | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.rules.update](automation.md#automationrulesupdate) | Modifier une règle avec sa révision attendue | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.services.list](automation.md#automationserviceslist) | Lister les commandes indépendantes de services distants | READ | GET/POST | Selon les conditions ; voir les détails |
| [automation.services.status](automation.md#automationservicesstatus) | Confirmer l'état du processus distant géré | READ | GET/POST | Selon les conditions ; voir les détails |
| [automation.services.stop](automation.md#automationservicesstop) | Arrêter le processus distant géré vérifié | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.sources.add](automation.md#automationsourcesadd) | Ajouter une nouvelle source de données | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.sources.add_mapping](automation.md#automationsourcesadd_mapping) | Ajouter une correspondance de champ à une source de données existante | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.sources.delete](automation.md#automationsourcesdelete) | Supprimer une source de données | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.sources.disable](automation.md#automationsourcesdisable) | Désactiver une source de données | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.sources.enable](automation.md#automationsourcesenable) | Activer une source de données | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.sources.export](automation.md#automationsourcesexport) | Exporter une source de données en paquet de configuration (.tscfg) | ROOT | POST | Selon les conditions ; voir les détails |
| [automation.sources.import](automation.md#automationsourcesimport) | Importer une source de données depuis un paquet de configuration | ROOT | POST | Selon les conditions ; voir les détails |
| [automation.sources.list](automation.md#automationsourceslist) | Lister toutes les sources de données | READ | GET/POST | Selon les conditions ; voir les détails |
| [automation.sources.remove_mapping](automation.md#automationsourcesremove_mapping) | Supprimer une correspondance de champ dans une source de données | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.sources.update](automation.md#automationsourcesupdate) | Mettre à jour une source de données existante | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.start](automation.md#automationstart) | Démarrer le moteur d’automatisation | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.status](automation.md#automationstatus) | Obtenir l'état du moteur d'automatisation | READ | GET/POST | Selon les conditions ; voir les détails |
| [automation.stop](automation.md#automationstop) | Arrêter le moteur d’automatisation | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.test.device](automation.md#automationtestdevice) | Tester une action de commande de périphérique | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.test.gpio](automation.md#automationtestgpio) | Tester une action GPIO | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.test.led](automation.md#automationtestled) | Tester une action LED | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.test.ssh](automation.md#automationtestssh) | Tester l’exécution d’une commande SSH | ROOT | POST | Selon les conditions ; voir les détails |
| [automation.variables.delete](automation.md#automationvariablesdelete) | Supprimer une variable utilisateur enregistrée | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [automation.variables.get](automation.md#automationvariablesget) | Obtenez une valeur variable | READ | GET/POST | Selon les conditions ; voir les détails |
| [automation.variables.list](automation.md#automationvariableslist) | Lister toutes les variables | READ | GET/POST | Selon les conditions ; voir les détails |
| [automation.variables.set](automation.md#automationvariablesset) | Définir la valeur d’une variable | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [cert.delete](cert.md#certdelete) | Supprimer toutes les données d’authentification PKI | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [cert.generate_csr](cert.md#certgenerate_csr) | Générer une demande de signature de certificat | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [cert.generate_keypair](cert.md#certgenerate_keypair) | Générer la paire de clés ECDSA P-256 | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [cert.get_certificate](cert.md#certget_certificate) | Lire le certificat de l’appareil au format PEM | Public | GET/POST | Selon les conditions ; voir les détails |
| [cert.install](cert.md#certinstall) | Installer le certificat signé | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [cert.install_ca](cert.md#certinstall_ca) | Installer la chaîne de certificats CA | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [cert.status](cert.md#certstatus) | Lire le certificat et l'état du service de diagnostic | Public | GET/POST | Selon les conditions ; voir les détails |
| [config.delete](config.md#configdelete) | Supprimer une valeur de configuration | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [config.get](config.md#configget) | Obtenez la valeur de configuration | Public | GET/POST | Selon les conditions ; voir les détails |
| [config.list](config.md#configlist) | Lister les clés de configuration | ADMIN | GET/POST | Selon les conditions ; voir les détails |
| [config.module.list](config.md#configmodulelist) | Lister tous les modules de configuration | READ | GET/POST | Selon les conditions ; voir les détails |
| [config.module.reset](config.md#configmodulereset) | Réinitialiser la configuration du module | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [config.module.save](config.md#configmodulesave) | Enregistrer la configuration du module dans NVS | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [config.module.set](config.md#configmoduleset) | Définir la configuration du module | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [config.module.show](config.md#configmoduleshow) | Afficher la configuration du module | READ | GET/POST | Selon les conditions ; voir les détails |
| [config.pack.apply](config_pack.md#configpackapply) | Application de configuration générique non prise en charge | ADMIN | POST/PUT/DELETE | Non soutenu |
| [config.pack.content](config_pack.md#configpackcontent) | Déchiffrer le paquet de configuration importé et en lire le contenu | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [config.pack.export](config_pack.md#configpackexport) | Exporter la configuration sous forme de .tscfg chiffré | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [config.pack.export_cert](config_pack.md#configpackexport_cert) | Exporter le certificat de l’appareil pour le chiffrement | READ | GET/POST | Selon les conditions ; voir les détails |
| [config.pack.import](config_pack.md#configpackimport) | Valider sur place un fichier .tscfg envoyé | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [config.pack.info](config_pack.md#configpackinfo) | Lire les informations système des paquets de configuration | READ | GET/POST | Selon les conditions ; voir les détails |
| [config.pack.list](config_pack.md#configpacklist) | Lister les fichiers .tscfg dans le répertoire | READ | GET/POST | Selon les conditions ; voir les détails |
| [config.pack.verify](config_pack.md#configpackverify) | Vérifier la signature d’un paquet .tscfg | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [config.save](config.md#configsave) | Enregistrer la configuration dans le stockage | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [config.set](config.md#configset) | Définir la valeur de configuration | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [device.fan.set](device.md#devicefanset) | Définir le mode et la commande du ventilateur | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [device.fan.status](device.md#devicefanstatus) | Obtenir le statut de ventilateur | Public | GET/POST | Selon les conditions ; voir les détails |
| [device.ping](device.md#deviceping) | Tester la connectivité réseau (contrôle de port TCP) | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [device.power](device.md#devicepower) | Commander l’alimentation du périphérique (on/off/force_off) | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [device.power.status](device.md#devicepowerstatus) | Lire les mesures électriques | Public | GET/POST | Selon les conditions ; voir les détails |
| [device.reset](device.md#devicereset) | Réinitialiser l'appareil | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [device.status](device.md#devicestatus) | Obtenir l'état d'alimentation de l'appareil | Public | GET/POST | Selon les conditions ; voir les détails |
| [device.usb.set](device.md#deviceusbset) | Sélectionner la cible du multiplexeur USB | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [device.usb.status](device.md#deviceusbstatus) | Lire l’état du multiplexeur USB | Public | GET/POST | Selon les conditions ; voir les détails |
| [dhcp.clients](dhcp.md#dhcpclients) | Lister les clients DHCP | READ | GET/POST | Selon les conditions ; voir les détails |
| [dhcp.start](dhcp.md#dhcpstart) | Démarrer le serveur DHCP | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [dhcp.status](dhcp.md#dhcpstatus) | Obtenir l'état du serveur DHCP | READ | GET/POST | Selon les conditions ; voir les détails |
| [dhcp.stop](dhcp.md#dhcpstop) | Arrêter le serveur DHCP | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [fan.config](fan.md#fanconfig) | Obtenir la configuration du ventilateur, y compris la courbe | READ | GET/POST | Selon les conditions ; voir les détails |
| [fan.curve](fan.md#fancurve) | Définir la courbe de température du ventilateur | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [fan.enable](fan.md#fanenable) | Activer ou désactiver un ventilateur | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [fan.limits](fan.md#fanlimits) | Définir les limites minimale et maximale de commande du ventilateur | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [fan.mode](fan.md#fanmode) | Régler le mode de fonctionnement du ventilateur | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [fan.save](fan.md#fansave) | Enregistrer la configuration du ventilateur sur NVS | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [fan.set](fan.md#fanset) | Définir la vitesse du ventilateur en mode manuel | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [fan.status](fan.md#fanstatus) | Obtenir le statut de ventilateur | Public | GET/POST | Selon les conditions ; voir les détails |
| [gpio.info](gpio.md#gpioinfo) | Obtenez des informations sur les broches GPIO | READ | GET/POST | Selon les conditions ; voir les détails |
| [gpio.list](gpio.md#gpiolist) | Lister toutes les broches GPIO contrôlables | READ | GET/POST | Selon les conditions ; voir les détails |
| [gpio.set](gpio.md#gpioset) | Définir le niveau GPIO | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [gpio.toggle](gpio.md#gpiotoggle) | Basculer le niveau GPIO | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [hosts.clear](hosts.md#hostsclear) | Effacer tous les hôtes connus | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [hosts.info](hosts.md#hostsinfo) | Lire les informations d’un hôte connu | READ | GET/POST | Selon les conditions ; voir les détails |
| [hosts.list](hosts.md#hostslist) | Lister tous les hôtes SSH connus | READ | GET/POST | Selon les conditions ; voir les détails |
| [hosts.remove](hosts.md#hostsremove) | Supprimer un hôte connu | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [hosts.update](hosts.md#hostsupdate) | Forcer la mise à jour de l’empreinte d’un hôte | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [key.delete](key.md#keydelete) | Supprimer une clé | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [key.export](key.md#keyexport) | Exporter une clé publique | READ | GET/POST | Selon les conditions ; voir les détails |
| [key.exportPrivate](key.md#keyexportprivate) | Exporter une clé privée, uniquement si elle est exportable | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [key.generate](key.md#keygenerate) | Générer une nouvelle clé | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [key.info](key.md#keyinfo) | Lire les informations d’une clé | READ | GET/POST | Selon les conditions ; voir les détails |
| [key.list](key.md#keylist) | Lister toutes les clés enregistrées | READ | GET/POST | Selon les conditions ; voir les détails |
| [led.boot.config](led.md#ledbootconfig) | Obtenir la configuration de démarrage LED | READ | GET/POST | Selon les conditions ; voir les détails |
| [led.brightness](led.md#ledbrightness) | Lire ou modifier la luminosité du périphérique | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [led.clear](led.md#ledclear) | Éteindre toutes les LED du périphérique | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [led.color.hsv](led.md#ledcolorhsv) | Convertir HSV en RGB | READ | GET/POST | Selon les conditions ; voir les détails |
| [led.color.parse](led.md#ledcolorparse) | Convertir une chaîne de couleur en RGB | READ | GET/POST | Selon les conditions ; voir les détails |
| [led.color_correction.export](led.md#ledcolor_correctionexport) | Exporter la configuration de la correction de couleur vers la carte SD | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [led.color_correction.get](led.md#ledcolor_correctionget) | Obtenir la configuration de correction de couleur | READ | GET/POST | Selon les conditions ; voir les détails |
| [led.color_correction.import](led.md#ledcolor_correctionimport) | Importer la configuration de correction de couleur à partir de la carte SD | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [led.color_correction.reset](led.md#ledcolor_correctionreset) | Réinitialiser la correction de couleur aux valeurs par défaut | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [led.color_correction.set](led.md#ledcolor_correctionset) | Définir la configuration de correction de couleur | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [led.effect.list](led.md#ledeffectlist) | Lister les effets disponibles | READ | GET/POST | Selon les conditions ; voir les détails |
| [led.effect.start](led.md#ledeffectstart) | Démarrer un effet sur le périphérique | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [led.effect.stop](led.md#ledeffectstop) | Arrêter l’effet sur le périphérique | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [led.fill](led.md#ledfill) | Appliquer une couleur à toutes les LED | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [led.filter.list](led.md#ledfilterlist) | Lister les filtres de post-traitement disponibles | READ | GET/POST | Selon les conditions ; voir les détails |
| [led.filter.start](led.md#ledfilterstart) | Appliquer un filtre de post-traitement | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [led.filter.stop](led.md#ledfilterstop) | Arrêter le filtre post-traitement | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [led.image](led.md#ledimage) | Afficher l'image sur la matrice | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [led.list](led.md#ledlist) | Lister les périphériques LED | Public | GET/POST | Selon les conditions ; voir les détails |
| [led.qrcode](led.md#ledqrcode) | Générer et afficher le code QR | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [led.save](led.md#ledsave) | Enregistrer l'état actuel comme configuration de démarrage | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [led.set](led.md#ledset) | Définir une plage de pixel LED | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [led.text](led.md#ledtext) | Afficher le texte sur la matrice | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [led.text.stop](led.md#ledtextstop) | Arrêter la superposition du texte | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [log.capture](log.md#logcapture) | Activer ou désactiver la collecte ESP_LOG | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [log.clear](log.md#logclear) | Vider le tampon des journaux | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [log.list](log.md#loglist) | Obtenez les entrées de journal avec filtrage | ADMIN | GET/POST | Selon les conditions ; voir les détails |
| [log.setLevel](log.md#logsetlevel) | Définir le niveau de journalisation | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [log.stats](log.md#logstats) | Lire les statistiques du système de journalisation | ADMIN | GET/POST | Selon les conditions ; voir les détails |
| [monitor.config](monitor.md#monitorconfig) | Lire la configuration de surveillance des ressources de calcul | READ | GET/POST | Selon les conditions ; voir les détails |
| [monitor.data](monitor.md#monitordata) | Lire les dernières données de télémétrie des ressources de calcul | READ | GET/POST | Selon les conditions ; voir les détails |
| [monitor.set_server](monitor.md#monitorset_server) | Définir l’adresse IP et le port du serveur de surveillance des ressources de calcul | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [monitor.start](monitor.md#monitorstart) | Démarrer la surveillance des ressources de calcul | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [monitor.status](monitor.md#monitorstatus) | Lire l’état de surveillance des ressources de calcul | READ | GET/POST | Selon les conditions ; voir les détails |
| [monitor.stop](monitor.md#monitorstop) | Arrêter la surveillance des ressources de calcul | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [nat.disable](nat.md#natdisable) | Désactiver la passerelle NAT | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [nat.enable](nat.md#natenable) | Activer la passerelle NAT | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [nat.save](nat.md#natsave) | Enregistrer la configuration de NAT | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [nat.status](nat.md#natstatus) | Obtenir le statut de passerelle NAT | READ | GET/POST | Selon les conditions ; voir les détails |
| [network.eth.status](network.md#networkethstatus) | Obtenez l'état Ethernet | Public | GET/POST | Selon les conditions ; voir les détails |
| [network.hostname](network.md#networkhostname) | Lire ou modifier le nom d’hôte | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [network.lpmu_access.log](lpmu_access.md#networklpmu_accesslog) | Lire le journal d’une exécution de configuration réseau de l’ordinateur d’applications | ADMIN | GET/POST | Selon les conditions ; voir les détails |
| [network.lpmu_access.start](lpmu_access.md#networklpmu_accessstart) | Lancer la configuration de l’accès au réseau amont de l’ordinateur d’applications | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [network.lpmu_access.status](lpmu_access.md#networklpmu_accessstatus) | Lire l’état de configuration de l’accès réseau amont de l’ordinateur d’applications | ADMIN | GET/POST | Selon les conditions ; voir les détails |
| [network.status](network.md#networkstatus) | Obtenir l'état général du réseau | Public | GET/POST | Selon les conditions ; voir les détails |
| [network.wifi.ap.config](network.md#networkwifiapconfig) | Configurer le point d’accès Wi-Fi | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [network.wifi.ap.stations](network.md#networkwifiapstations) | Lire la liste des stations connectées au point d’accès | READ | GET/POST | Selon les conditions ; voir les détails |
| [network.wifi.connect](network.md#networkwificonnect) | Se connecter à un réseau Wi-Fi | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [network.wifi.disconnect](network.md#networkwifidisconnect) | Se déconnecter du Wi-Fi | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [network.wifi.mode](network.md#networkwifimode) | Lire ou modifier le mode Wi-Fi | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [network.wifi.scan](network.md#networkwifiscan) | Rechercher les réseaux Wi-Fi | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ota.abort](ota.md#otaabort) | Demander l'annulation de la mise à jour du firmware | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ota.partitions](ota.md#otapartitions) | Inspecter les partitions de mise à jour | READ | GET/POST | Selon les conditions ; voir les détails |
| [ota.progress](ota.md#otaprogress) | Lire la progression de la mise à jour du micrologiciel | READ | GET/POST | Selon les conditions ; voir les détails |
| [ota.rollback](ota.md#otarollback) | Revenir à la version précédente du micrologiciel | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ota.server.get](ota.md#otaserverget) | Lire la configuration du serveur de mise à jour | READ | GET/POST | Selon les conditions ; voir les détails |
| [ota.server.set](ota.md#otaserverset) | Définir la configuration du serveur de mise à jour | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ota.start_file](ota.md#otastart_file) | Démarrer la mise à jour du micrologiciel depuis la carte SD | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ota.start_url](ota.md#otastart_url) | Démarrer la mise à jour du micrologiciel depuis une URL | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ota.status](ota.md#otastatus) | Lire l’état de la mise à jour du micrologiciel | READ | GET/POST | Selon les conditions ; voir les détails |
| [ota.test_connection](ota.md#otatest_connection) | Tester une URL de mise à jour | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ota.upgrade_file](ota.md#otaupgrade_file) | Alias de compatibilité de ota.start_file | ADMIN | POST/PUT/DELETE | Alias |
| [ota.upgrade_url](ota.md#otaupgrade_url) | Alias de compatibilité de ota.start_url | ADMIN | POST/PUT/DELETE | Alias |
| [ota.upload_abort](ota.md#otaupload_abort) | Annuler le contrôle d’envoi du micrologiciel | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ota.upload_begin](ota.md#otaupload_begin) | Commencer le contrôle d’envoi du micrologiciel | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ota.upload_end](ota.md#otaupload_end) | Terminer le contrôle d’envoi du micrologiciel | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ota.validate](ota.md#otavalidate) | Confirmer le bon fonctionnement du micrologiciel en cours d’exécution | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ota.version](ota.md#otaversion) | Lire la version du micrologiciel | Public | GET/POST | Selon les conditions ; voir les détails |
| [ota.www.abort](ota.md#otawwwabort) | Demander l'annulation de la mise à jour de WWW | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ota.www.progress](ota.md#otawwwprogress) | Lire la progression de la mise à jour WWW | READ | GET/POST | Selon les conditions ; voir les détails |
| [ota.www.start](ota.md#otawwwstart) | Démarrer la mise à jour WWW à partir d'une URL | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ota.www.start_sdcard](ota.md#otawwwstart_sdcard) | Démarrer la mise à jour WWW depuis la carte SD | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [power.chip](power.md#powerchip) | Lire les données de la puce de mesure électrique | Public | GET/POST | Selon les conditions ; voir les détails |
| [power.debug](power.md#powerdebug) | Définir le mode de débogage | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [power.interval.set](power.md#powerintervalset) | Définir l’intervalle d’échantillonnage | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [power.monitor.start](power.md#powermonitorstart) | Démarrer la surveillance électrique | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [power.monitor.stop](power.md#powermonitorstop) | Arrêter la surveillance électrique | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [power.protection.config](power.md#powerprotectionconfig) | Lire la configuration de protection de tension | READ | GET/POST | Selon les conditions ; voir les détails |
| [power.protection.set](power.md#powerprotectionset) | Configurer la protection de tension | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [power.protection.status](power.md#powerprotectionstatus) | Lire l’état de protection de tension | Public | GET/POST | Selon les conditions ; voir les détails |
| [power.stats](power.md#powerstats) | Lire les statistiques de surveillance | READ | GET/POST | Selon les conditions ; voir les détails |
| [power.stats.reset](power.md#powerstatsreset) | Réinitialiser les statistiques de surveillance | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [power.status](power.md#powerstatus) | Lire l’état de surveillance électrique | Public | GET/POST | Selon les conditions ; voir les détails |
| [power.threshold.set](power.md#powerthresholdset) | Régler les seuils de tension | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [power.voltage](power.md#powervoltage) | Lire la tension actuelle | Public | GET/POST | Selon les conditions ; voir les détails |
| [service.list](service.md#servicelist) | Lister tous les services | Public | GET/POST | Selon les conditions ; voir les détails |
| [service.restart](service.md#servicerestart) | Redémarrer un service | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [service.start](service.md#servicestart) | Démarrer un service | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [service.status](service.md#servicestatus) | Obtenir le statut de service | Public | GET/POST | Selon les conditions ; voir les détails |
| [service.stop](service.md#servicestop) | Arrêter un service | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [sftp.get](sftp.md#sftpget) | Télécharger le fichier via SFTP | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [sftp.ls](sftp.md#sftpls) | Lister le contenu d’un répertoire distant par SFTP | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [sftp.mkdir](sftp.md#sftpmkdir) | Créer un répertoire distant via SFTP | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [sftp.put](sftp.md#sftpput) | Envoyer un fichier par SFTP | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [sftp.rm](sftp.md#sftprm) | Supprimer le fichier distant via SFTP | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [sftp.stat](sftp.md#sftpstat) | Lire les informations d’un fichier distant par SFTP | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ssh.cancel](ssh.md#sshcancel) | Annuler une session d’exécution SSH en cours | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ssh.commands.add](ssh.md#sshcommandsadd) | Ajouter ou modifier une configuration de commande SSH | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ssh.commands.export](ssh.md#sshcommandsexport) | Exporter une configuration de commande SSH au format .tscfg | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ssh.commands.get](ssh.md#sshcommandsget) | Lire une configuration de commande SSH par identifiant | READ | GET/POST | Selon les conditions ; voir les détails |
| [ssh.commands.import](ssh.md#sshcommandsimport) | Importer une configuration de commande SSH depuis un fichier .tscfg | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ssh.commands.list](ssh.md#sshcommandslist) | Lister toutes les configurations de commandes SSH | READ | GET/POST | Selon les conditions ; voir les détails |
| [ssh.commands.remove](ssh.md#sshcommandsremove) | Supprimer une configuration de commande SSH | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ssh.commands.update](ssh.md#sshcommandsupdate) | Modifier une configuration de commandes SSH existante | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ssh.copyid](ssh.md#sshcopyid) | Déployer la clé publique vers le serveur distant | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ssh.exec](ssh.md#sshexec) | Exécuter la commande distante via SSH | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ssh.exec_status](ssh.md#sshexec_status) | Lire son résultat SSH en cours ou le plus récent | ROOT | GET/POST | Selon les conditions ; voir les détails |
| [ssh.exec_stream](ssh.md#sshexec_stream) | Exécuter la commande distante avec sortie en streaming via WebSocket | ROOT | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ssh.hosts.add](ssh.md#sshhostsadd) | Ajouter une configuration d’hôte SSH | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ssh.hosts.export](ssh.md#sshhostsexport) | Exporter une configuration d’hôte SSH au format .tscfg | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ssh.hosts.get](ssh.md#sshhostsget) | Lire une configuration d’hôte SSH par identifiant | READ | GET/POST | Selon les conditions ; voir les détails |
| [ssh.hosts.import](ssh.md#sshhostsimport) | Importer une configuration d’hôte SSH depuis un fichier .tscfg | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ssh.hosts.list](ssh.md#sshhostslist) | Lister toutes les configurations d’hôtes SSH | READ | GET/POST | Selon les conditions ; voir les détails |
| [ssh.hosts.remove](ssh.md#sshhostsremove) | Supprimer une configuration d’hôte SSH | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ssh.hosts.update](ssh.md#sshhostsupdate) | Modifier une configuration d’hôtes SSH existante | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ssh.keygen](ssh.md#sshkeygen) | Générer une paire de clés SSH | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ssh.revoke](ssh.md#sshrevoke) | Révoquer une clé publique déployée en la retirant du serveur distant | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ssh.services.start](ssh.md#sshservicesstart) | Démarrer un service géré enregistré | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ssh.test](ssh.md#sshtest) | Tester une connexion SSH | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [storage.delete](storage.md#storagedelete) | Supprimer le fichier ou le répertoire | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [storage.info](storage.md#storageinfo) | Obtenez des informations sur le fichier | READ | GET/POST | Selon les conditions ; voir les détails |
| [storage.list](storage.md#storagelist) | Lister le contenu d’un répertoire | READ | GET/POST | Selon les conditions ; voir les détails |
| [storage.mkdir](storage.md#storagemkdir) | Créer un répertoire | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [storage.mount](storage.md#storagemount) | Monter la carte SD | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [storage.read](storage.md#storageread) | Lire le contenu du fichier | READ | GET/POST | Selon les conditions ; voir les détails |
| [storage.rename](storage.md#storagerename) | Renommer ou déplacer un fichier | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [storage.status](storage.md#storagestatus) | Obtenir le statut de stockage | Public | GET/POST | Selon les conditions ; voir les détails |
| [storage.unmount](storage.md#storageunmount) | Démonter la carte SD | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [system.apis](system.md#systemapis) | Lister toutes les API enregistrées | READ | GET/POST | Selon les conditions ; voir les détails |
| [system.cpu](system.md#systemcpu) | Lire les statistiques des cœurs du processeur | Public | GET/POST | Selon les conditions ; voir les détails |
| [system.info](system.md#systeminfo) | Obtenir des informations sur le système | Public | GET/POST | Selon les conditions ; voir les détails |
| [system.log.level](system.md#systemloglevel) | Lire ou modifier le niveau de journalisation | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [system.memory](system.md#systemmemory) | Obtenir des informations sur la mémoire | Public | GET/POST | Selon les conditions ; voir les détails |
| [system.memory_detail](system.md#systemmemory_detail) | Obtenez une analyse de mémoire détaillée | ADMIN | GET/POST | Selon les conditions ; voir les détails |
| [system.reboot](system.md#systemreboot) | Redémarrer le système | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [system.tasks](system.md#systemtasks) | Obtenir la liste des tâches | ADMIN | GET/POST | Selon les conditions ; voir les détails |
| [temp.bind](temp.md#tempbind) | Lier une température à une variable système ou supprimer cette liaison | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [temp.manual](temp.md#tempmanual) | Lire ou modifier le mode de température manuelle | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [temp.read](temp.md#tempread) | Lire la température actuelle | READ | GET/POST | Selon les conditions ; voir les détails |
| [temp.select](temp.md#tempselect) | Lire ou modifier la source de température préférée | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [temp.sources](temp.md#tempsources) | Lire les informations de toutes les sources de température | READ | GET/POST | Selon les conditions ; voir les détails |
| [temp.status](temp.md#tempstatus) | Obtenir l'état du système de température | Public | GET/POST | Selon les conditions ; voir les détails |
| [time.force_sync](time.md#timeforce_sync) | Forcer la synchronisation NTP | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [time.info](time.md#timeinfo) | Obtenir des informations sur la synchronisation du temps | Public | GET/POST | Selon les conditions ; voir les détails |
| [time.set_ntp](time.md#timeset_ntp) | Définir le serveur NTP | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [time.set_timezone](time.md#timeset_timezone) | Régler le fuseau horaire | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [time.sync](time.md#timesync) | Synchroniser l'heure depuis le navigateur | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [ui.widgets.get](ui.md#uiwidgetsget) | Lire la configuration des widgets de données | READ | GET/POST | Selon les conditions ; voir les détails |
| [ui.widgets.set](ui.md#uiwidgetsset) | Enregistrer la configuration des widgets de données | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [wifi.connect](wifi.md#wificonnect) | Se connecter à un réseau Wi-Fi | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [wifi.disconnect](wifi.md#wifidisconnect) | Se déconnecter du Wi-Fi | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [wifi.scan](wifi.md#wifiscan) | Rechercher les réseaux Wi-Fi | ADMIN | POST/PUT/DELETE | Selon les conditions ; voir les détails |
| [wifi.status](wifi.md#wifistatus) | Obtenir l'état WiFi | Public | GET/POST | Selon les conditions ; voir les détails |

## Autres interfaces

[Transfert de fichier/image](../transfers.md) | [WebSocket](../websocket.md) | [mTLS diagnostics](../compatibility.md#mtls-diagnostic-service)
