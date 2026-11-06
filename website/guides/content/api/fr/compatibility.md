# Version et compatibilité

Ce guide s’appuie sur **TianshanOS 0.6.4**. Il reste applicable aux versions ultérieures lorsque les interfaces et les procédures n’ont pas changé. Si les paramètres ou les résultats diffèrent, consultez la documentation correspondant à la version installée.

## Connexions et comptes

| Objet | Utilisation |
| --- | --- |
| API de gestion | HTTP, port 80 par défaut, préfixe /api/v1 ; par exemple http://10.10.99.97 |
| Messages en temps réel | WebSocket, ws://device-address/ws |
| Comptes par défaut | admin/root, mot de passe initial rm01 pour les deux ; utilisez le mot de passe actuel s’il a été modifié |
| Authentification des sessions | Token de connexion transmis dans Authorization: Bearer |
| Contrôle d'accès | Rôle minimal par interface, avec des contrôles supplémentaires de ressource, de version et d’appartenance |

## Conditions préalables des fonctions

La présence d’une interface ne prouve pas que ses dépendances sont prêtes. Vérifiez l’état correspondant avant de l’utiliser.

| Fonctionnalité | Préalables |
| --- | --- |
| Température, ventilateurs, alimentation et ordinateurs | Pilotes initialisés, cibles existantes, mesures valides |
| Télémétrie des ressources de calcul | Surveillance en cours, service de l’hôte accessible et données récentes valides |
| Fichiers et mises à jour SD | Stockage nécessaire monté, fichier présent, capacité suffisante ; l’envoi direct utilise une procédure distincte |
| SSH/SFTP et services gérés | Réseau, identifiants, empreintes des hôtes, clés, configuration enregistrée et capacité disponible pour les tâches |
| Automatisation | Configuration chargée et activée, état du moteur correct, références valides et versions d’écriture correspondantes |
| Paquets de configuration | Identité de l’appareil ou du destinataire et confiance envers l’éditeur ; l’exportation nécessite aussi la capacité Developer |
| PKI de l’appareil et mises à jour | Données PKI et heure valides pour les diagnostics ; images APP/WWW complètes et compatibles pour les mises à jour |
| Contenu de la matrice | Cible prise en charge et fichiers de police ou d’image utilisables |

## Alias et interfaces non prises en charge

config.pack.apply est conservé, mais n’applique pas une configuration générique ; utilisez l’importation propre à l’objet concerné. led.set écrit des plages de pixels. ota.upload_begin/end/abort pilotent un téléversement, mais aucune API publique upload_write ne permet d’envoyer ses données. Pour une intégration courante, utilisez le téléversement binaire de l’image complète.

OTA conserve les alias upgrade_url/start_url et upgrade_file/start_file. Préférez start_url/start_file pour les nouvelles intégrations.

## Service de diagnostic mTLS

Ce service distinct utilise une authentification par certificat et écoute par défaut sur le port 443. Il ne constitue pas un autre port pour /api/v1. Sa disponibilité dépend des éléments PKI, de la configuration et de l’état du service. Les tokens Bearer ne remplacent pas les certificats clients.

| Method/path | Rôle minimal du certificat | Objet |
| --- | --- | --- |
| GET / | anonymous | Santé |
| GET /api/auth/whoami | viewer | Identité du certificat |
| GET /api/test/viewer | viewer | Test du rôle de lecture |
| GET /api/test/operator | operator | Test du rôle operator |
| GET /api/test/admin | admin | Test de lecture avec le rôle admin |
| POST /api/test/admin-action | admin | Test d’écriture avec le rôle admin |

Ces interfaces servent à diagnostiquer le bon fonctionnement, l’identité et les droits ; elles n’exécutent pas les fonctions de gestion de l’appareil. Les rôles de certificat viewer/operator/admin et les rôles de gestion READ/ADMIN/ROOT appartiennent à des systèmes d’identité distincts et ne sont pas interchangeables.
