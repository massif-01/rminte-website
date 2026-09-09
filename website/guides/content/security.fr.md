# Guide complet de la page Sécurité de TianShanOS

Les noms des boutons et des rubriques sont conservés en anglais pour vous permettre de les retrouver sur l’appareil. Son interface web est disponible en chinois et en anglais ; changer la langue de ce site ne modifie pas les langues de l’appareil.

Ce guide explique comment changer les mots de passe de l’appareil, gérer l’accès SSH et configurer les certificats. Pour une première mise en service, commencez par les chapitres 1 et 2. Les procédures relatives aux certificats et à Config Pack s’adressent aux administrateurs responsables de la sécurité de l’appareil.

Version vérifiée : copie de travail examinée le 7 septembre 2026, fondée sur le commit `d6ed947`. Ce guide résulte d’une revue du code source, et non de tests sur votre appareil. Effectuez les contrôles de chaque section dans votre environnement.

> Utilisez un réseau d’administration isolé. L’interface web complète utilise actuellement HTTP et la plupart des opérations d’API ne disposent pas de contrôles centralisés et obligatoires de connexion et de permissions. N’exposez pas l’appareil à internet ni à un réseau invité. Installer un certificat HTTPS ne fait pas passer l’interface web complète en HTTPS.

## 1. Avant de commencer

### 1.1 Trouver la procédure adaptée

| Tâche | Où aller |
| --- | --- |
| Changer le mot de passe root ou admin de l’appareil | Account Security ; chapitre 2 |
| Se connecter à un serveur avec une clé SSH | Key Management et Deployed Hosts ; chapitre 3 |
| Copier des clés ou vérifier l’identité d’un serveur | Key Management et empreintes d’hôtes ; chapitre 4 |
| Configurer les certificats et l’authentification mutuelle | HTTPS Certificate ; chapitre 5 |
| Échanger des paquets de configuration chiffrés | Config Pack ; chapitre 6. L’application générale des configurations n’est pas encore implémentée |

### 1.2 Comptes et identité de l’appareil

- admin peut ouvrir Security et voir les clés, hôtes, certificats et commandes Config Pack, mais pas Account Security.
- root peut aussi définir les mots de passe root et admin ou rétablir le mot de passe admin par défaut. Le serveur impose une autorisation root pour ces opérations de gestion des mots de passe.
- Un appareil Developer est identifié par le champ OU de son certificat. Il ne s’agit pas d’un compte utilisateur. Actuellement, seuls ces appareils peuvent exporter des Config Packs et des configurations d’hôtes SSH ; se connecter en tant que root ne change pas l’identité de l’appareil.

Hormis les opérations qui vérifient elles-mêmes l’autorisation, comme la gestion des mots de passe, un écran de connexion n’empêche pas l’accès direct aux API. L’isolation réseau reste nécessaire.

### 1.3 Préparer l’opération

1. Vérifiez que l’adresse IP du navigateur correspond à l’appareil prévu et que votre ordinateur se trouve sur un réseau d’administration de confiance.
2. Confirmez l’adresse, le port et le nom d’utilisateur du serveur SSH avec son administrateur.
3. Pour déployer ou révoquer une clé publique depuis cette page, vous devez disposer du mot de passe du compte distant, qui doit accepter l’authentification par mot de passe. Ne laissez pas les restrictions du serveur assouplies uniquement pour résoudre un problème.
4. Avant de supprimer des clés, de révoquer un accès ou de remplacer des certificats, prévoyez une autre voie d’accès : console du serveur, autre clé d’administrateur ou interface HTTP d’administration de l’appareil.

## 2. Changer les mots de passe de l’appareil

Ces commandes modifient les mots de passe de connexion à TianShanOS, pas le mot de passe SSH d’un serveur distant.

### 2.1 L’invite de changement après connexion

Si un compte est encore marqué comme utilisant un mot de passe inchangé, une invite apparaît après la connexion. Définissez un mot de passe long et unique. Choisir de le changer plus tard ferme l’invite ; cela ne rend pas le mot de passe par défaut sûr à conserver.

Cette invite n’est pas un écran de réglages du compte que vous pouvez rouvrir à tout moment. Si admin a déjà changé son mot de passe et doit le modifier à nouveau, root peut le définir depuis Security.

### 2.2 Définir un mot de passe en tant que root

1. Connectez-vous en tant que root et ouvrez Security.
2. Dans Account Security, sélectionnez Set root password ou Set admin password.
3. Saisissez deux fois le même nouveau mot de passe et validez. L’interface accepte 4-64 caractères ; quatre caractères constituent un minimum technique, pas une recommandation de sécurité.

Vérifiez le résultat : connectez-vous avec le nouveau mot de passe dans une fenêtre de navigation privée avant de fermer votre session d’origine. Changer un mot de passe ne ferme pas automatiquement les sessions existantes.

Si la connexion échoue, vérifiez d’abord le compte et l’adresse de l’appareil. Cinq échecs consécutifs déclenchent un verrouillage d’environ cinq minutes. Évitez les essais répétés.

### 2.3 Réinitialiser le mot de passe admin

root peut rétablir le mot de passe admin par défaut, `rm01`, et lever son verrouillage de connexion. Après la réinitialisation, ouvrez une nouvelle session admin et définissez immédiatement un nouveau mot de passe. La réinitialisation est une mesure de récupération temporaire. Ne conservez pas le mot de passe par défaut et ne supposez pas que le changement ferme toutes les sessions existantes.

## 3. Se connecter à un serveur avec une clé SSH

Pour une première configuration, créez une clé RSA, déployez sa clé publique, testez la connexion, puis vérifiez l’empreinte du serveur. Pour retirer une clé, révoquez d’abord l’accès sur les serveurs, confirmez que l’ancienne clé ne fonctionne plus, puis supprimez la clé locale.

### 3.1 Créer une clé

1. Dans Key Management, sélectionnez Generate New Key.
2. Vérifiez la liste et choisissez un ID de clé inutilisé, par exemple `backup01`. Ne réutilisez pas un ID : l’API de génération ne rejette pas les doublons et peut écraser la clé existante.
3. Choisissez RSA 2048 ou RSA 4096. RSA 2048 est le choix par défaut de l’interface. Des options ECDSA sont affichées, mais le chemin actuel d’authentification SSH par clé publique ne les prend pas en charge.
4. Ajoutez un commentaire ou un alias si utile. N’autorisez l’exportation de la clé privée que pour un besoin de sauvegarde ou de migration ; aucune interface ne permet de modifier ce réglage ultérieurement.
5. Sélectionnez Generate, attendez la fin et actualisez la liste.

Vérifiez le résultat : retrouvez l’ID prévu et le type RSA. Ouvrez Public Key et vérifiez que le texte complet commence par `ssh-rsa`.

La liste contient au maximum huit entrées. Lorsqu’elle est pleine, retirez une clé inutilisée avant d’en générer une autre. Le stockage de la clé et son inscription dans la liste peuvent réussir ou échouer séparément ; vérifiez donc la liste même après un message de réussite. Hide Key ID n’empêche pas l’API d’exposer le véritable ID.

### 3.2 Déployer la clé publique

Le déploiement ajoute la clé publique à `~/.ssh/authorized_keys` du compte distant, ce qui permet à ce compte d’accepter la clé privée correspondante. Il ne change pas le mot de passe du serveur.

1. Sélectionnez Deploy sur la ligne de la nouvelle clé.
2. Saisissez l’adresse du serveur, le nom d’utilisateur, le port SSH et le mot de passe de ce compte.
3. Vérifiez les informations et sélectionnez Start Deploy.
4. Recherchez le serveur dans Deployed Hosts, puis testez-le comme indiqué ci-dessous.

L’implémentation actuelle s’authentifie avec le mot de passe avant de vérifier l’empreinte de l’hôte et fait automatiquement confiance aux hôtes inconnus. Elle ne garantit pas que l’identité du serveur soit vérifiée avant l’envoi du mot de passe. Effectuez la première connexion sur un réseau contrôlé ; vérifier ensuite l’empreinte ne peut pas annuler l’exposition du mot de passe. Si le déploiement annonce une réussite mais que l’entrée manque ou que le test échoue, ne recommencez pas immédiatement. La clé publique peut déjà être installée malgré l’échec du test par clé ou de l’enregistrement local qui suit. Vérifiez `authorized_keys` par une autre connexion d’administration. Des déploiements répétés peuvent ajouter des doublons.

### 3.3 Tester la connexion

1. Dans Deployed Hosts, vérifiez l’adresse, le port, le nom d’utilisateur et l’ID de clé.
2. Sélectionnez Test. L’appareil tente d’exécuter echo "TianshanOS SSH Test OK".
3. Après la première connexion, vérifiez l’empreinte enregistrée de l’hôte selon la section 4.3.

Ce que signifie la réussite : la page vérifie si l’opération d’API a réussi, mais pas le code de sortie ni la sortie de la commande distante. Il s’agit d’un contrôle élémentaire de connexion, pas d’un test d’acceptation complet. Il ne prouve pas que sudo ni les commandes de votre application fonctionneront. Pour une tâche importante, vérifiez la sortie, le code de sortie et les permissions de la commande réelle.

En cas d’échec, vérifiez la connectivité, le service SSH, le compte et l’autorisation distante. Cessez les essais si l’empreinte a changé ou si l’identité du serveur est incertaine ; suivez la section 4.3.

### 3.4 Révoquer l’accès avant de supprimer la clé locale

1. Confirmez qu’une autre connexion d’administration au serveur fonctionne et que la clé d’origine existe toujours sur l’appareil.
2. Sélectionnez Revoke sur la ligne de l’hôte, saisissez le mot de passe du serveur et confirmez Revoke & Remove. Vous pouvez aussi partir de la ligne de la clé et saisir les informations de la cible.
3. Examinez le résultat, puis vérifiez par une connexion d’administration de confiance que la clé publique et ses éventuels doublons ont disparu de `authorized_keys`.
4. Confirmez que l’ancienne clé ne permet plus de se connecter. La révocation laisse une sauvegarde `authorized_keys.bak` ; traitez-la selon la politique de sauvegarde du serveur pour éviter de rétablir ultérieurement une ancienne autorisation.
5. Actualisez la liste locale des hôtes. La page tente de retirer l’entrée sans vérifier le résultat de cette requête. Supprimez-la manuellement si elle subsiste.
6. Une fois tous les serveurs cibles traités, supprimez l’ancienne clé de l’appareil et les copies privées devenues inutiles.

Si aucune clé publique correspondante n’est trouvée, confirmez sur le serveur que le compte choisi est correct et que la clé est absente avant de supprimer uniquement l’entrée locale.

Si la révocation échoue ou si le serveur semble suspect, conservez la clé locale et utilisez une console de confiance ou une autre connexion d’administrateur. Ne continuez pas à envoyer un mot de passe à un serveur dont l’identité est douteuse.

## 4. Gérer les clés, les hôtes et les empreintes

### 4.1 Copier une clé publique ou exporter une clé privée

Clé publique : sélectionnez Public Key et copiez la valeur complète, sur une seule ligne, pour l’administrateur du serveur. Une clé publique n’est pas secrète. L’envoyer à la mauvaise personne n’expose pas en soi la clé privée et n’impose pas de remplacer la paire. L’accès n’est accordé que lorsqu’un administrateur l’ajoute à la liste d’autorisation d’un compte.

Clé privée : l’exportation n’est disponible que si elle a été autorisée à la création. Utilisez un ordinateur de confiance sur un réseau isolé, conservez la clé dans un coffre de secrets approuvé et effacez les copies temporaires du presse-papiers et du dossier de téléchargement. Ne la collez jamais dans une conversation, un ticket ou un journal.

Si Copy ne fait rien, le navigateur peut bloquer le presse-papiers sur une page HTTP. Sélectionnez et copiez manuellement le texte visible, puis vérifiez son début, sa fin et l’intégralité de son contenu. N’affaiblissez pas les réglages de sécurité du navigateur pour permettre la copie.

### 4.2 Révoquer, retirer et supprimer sont des opérations distinctes

| Action | Effet |
| --- | --- |
| Révoquer une clé publique | Tente de retirer l’autorisation sur le serveur ; exige le mot de passe distant |
| Retirer un hôte | Supprime l’entrée locale de connexion de l’appareil, pas l’autorisation distante |
| Supprimer une clé | Supprime les données de clé locales ; ne contacte pas le serveur et ne révoque pas l’accès |
| Supprimer une empreinte d’hôte | Supprime une identité de serveur enregistrée, pas l’entrée de connexion ni l’autorisation distante |

Deployed Hosts est une liste locale, pas une vue en temps réel des autorisations du serveur. Une liste vide ne prouve pas le retrait de l’accès distant, et la présence d’un hôte ne garantit pas qu’il soit joignable.

### 4.3 Vérifier l’empreinte du serveur SSH

Une empreinte identifie le serveur auquel vous vous connectez. Cette page conserve le condensat SHA-256 sous forme de 64 caractères hexadécimaux. Les outils OpenSSH affichent souvent `SHA256:base64`. Demandez à l’administrateur le même format avant toute comparaison ; les chaînes ne sont pas directement interchangeables.

Après la première connexion, ouvrez l’empreinte complète avec View dans la section des empreintes d’hôtes. Comparez-la à une valeur obtenue depuis une console du serveur, un inventaire d’actifs ou un autre canal de confiance. Le tableau n’affiche que les 32 premiers caractères, ce qui ne suffit pas à une vérification complète. En cas de différence, cessez les connexions et enquêtez dans un environnement isolé. Si vous avez saisi un mot de passe SSH, considérez-le comme potentiellement exposé. Changez-le par une connexion de confiance, examinez les journaux de connexion et retirez les autorisations de clé publique indésirables. N’utilisez pas la connexion suspecte pour révoquer l’accès depuis cette page.

Si une empreinte enregistrée change :

1. Cessez les essais. Ne supprimez pas simplement l’ancienne entrée.
2. Utilisez une console de confiance pour vérifier la nouvelle empreinte, l’adresse IP, le port, l’identité de l’actif et son historique de maintenance.
3. Ne supprimez l’ancienne empreinte qu’après avoir confirmé une réinstallation autorisée du serveur ou un changement autorisé de sa clé d’hôte.
4. Reconnectez-vous sur un réseau contrôlé, puis consultez et vérifiez la nouvelle empreinte enregistrée.

La page actuelle peut afficher une erreur de connexion générique plutôt qu’un dialogue dédié à la comparaison des empreintes.

Protégez la carte SD : les empreintes sont stockées localement et synchronisées dans des fichiers JSON en clair sur la carte. Au démarrage, les configurations d’empreintes disponibles sur SD remplacent les entrées NVS correspondantes. Ces fichiers ne sont pas signés ; empêchez leur modification par des sources non fiables.

### 4.4 Importer et exporter des configurations d’hôtes SSH

Ce processus `.tscfg` dédié est distinct de l’application générale des configurations, encore inachevée, décrite au chapitre 6. Un paquet d’hôte contient l’adresse, le port, le nom d’utilisateur, le type d’authentification et l’ID de clé. Il ne contient ni le mot de passe SSH ni la clé privée, et n’accorde aucun accès sur le serveur.

Pour exporter, sélectionnez Export sur la ligne de l’hôte depuis un appareil Developer. Pour un autre appareil, fournissez et vérifiez le certificat de la cible, puis téléchargez le paquet. Un appareil ordinaire peut afficher le bouton, mais le backend rejette sa demande d’exportation.

Pour importer :

1. Confirmez que le paquet a été créé pour cet appareil, que la carte SD est accessible en écriture et que l’origine a été vérifiée par un canal de confiance.
2. Assurez-vous que l’appareil possède déjà la bonne clé référencée par le paquet. Un ID identique ne suffit pas ; les données de clé doivent correspondre à l’autorisation du serveur.
3. Sélectionnez Import Host, choisissez le fichier et examinez l’aperçu. N’activez l’écrasement que pour remplacer volontairement une configuration portant le même nom.
4. Confirmez et redémarrez lorsque cela est demandé. L’importation enregistre le paquet sur SD ; le chargement et le déchiffrement sont tentés au redémarrage.
5. Vérifiez l’adresse, le nom d’utilisateur, le port et l’ID de clé chargés, puis testez la connexion. Un aperçu réussi ne prouve pas que le paquet fonctionnera. Il n’établit ni la confiance dans le signataire ni l’empreinte du destinataire. Le contrôle de la cible a lieu au chargement après redémarrage. Supprimez une entrée incorrecte et son paquet SD pour empêcher un nouveau chargement. Avant de remplacer le certificat de l’appareil, lisez aussi la section 5.5.

## 5. Configurer les certificats HTTPS et mTLS

Ce chapitre s’adresse aux administrateurs de certificats. Le service actuel sur le port 443 ne propose que des points d’accès de santé, d’identité et de test des permissions, pas l’interface web complète. Avec ses réglages par défaut, son démarrage exige une clé privée d’appareil, un certificat d’appareil et une chaîne de CA de confiance pour les clients.

### 5.1 Comprendre le rôle de chaque certificat

- Le certificat et la clé privée de l’appareil lui permettent de prouver son identité au client qui se connecte.
- Le certificat et la clé privée du client, détenus par un ordinateur ou un service, permettent à ce client de prouver son identité à l’appareil.
- La chaîne de CA installée sur l’appareil sert à vérifier les certificats clients. Elle ne fait pas automatiquement reconnaître le certificat de l’appareil comme fiable par un ordinateur ou un navigateur.

Cet échange de certificats dans les deux sens est appelé TLS mutuel, ou mTLS. Le client doit aussi faire confiance à la CA ayant émis le certificat de l’appareil et vérifier son nom et ses usages autorisés.

### 5.2 Générer une clé d’appareil et une demande de certificat

1. Dans HTTPS Certificate, sélectionnez Generate Key Pair. Cela crée une clé privée ECDSA P-256 distincte des clés SSH. Elle ne peut pas être exportée par cette interface.
2. Si une clé existe déjà, arrêtez-vous et consultez la section 5.5. En générer une nouvelle écrase l’ancienne.
3. Sélectionnez Generate CSR. Saisissez l’ID d’appareil (CN), l’organisation (O) et l’unité d’organisation (OU), ou laissez tous les champs vides.
4. Envoyez le texte complet de la CSR à l’administrateur de votre CA. Une CSR demande un certificat ; elle ne contient pas de clé privée et n’installe aucun certificat.

Vérifiez les noms avant l’émission : le chemin utilisant des champs personnalisés ne génère pas de SAN. Avec tous les champs vides, le CN est fixé à `TIANSHAN-DEVICE-001` ; l’IP actuelle n’est incluse comme SAN de type IP que si elle peut être obtenue. Aucun SAN DNS n’est ajouté. Demandez à l’administrateur de la CA d’examiner la CSR et d’utiliser un processus d’émission contrôlé pour inclure les adresses IP ou noms DNS requis dans le SAN du certificat final. Ce formulaire ne permet pas de modifier les SAN. Vérifiez le résultat : actualisez la page pour confirmer la présence de la clé privée. L’administrateur de la CA doit examiner la clé publique, le sujet et le SAN de la CSR, et vérifier que le certificat émis autorise l’authentification de serveur requise (EKU).

### 5.3 Installer le certificat de l’appareil

1. Obtenez un certificat PEM correspondant à la clé privée actuelle de l’appareil.
2. Sélectionnez Install Cert, collez le texte complet avec ses délimiteurs et validez.
3. Consultez le certificat et vérifiez son sujet, son émetteur et ses dates de validité.

Le message de réussite signifie seulement que le certificat peut être analysé et que sa clé publique correspond à la clé privée actuelle. L’installation ne valide pas complètement la chaîne de confiance, le SAN, l’EKU, la validité actuelle ni la politique du sujet.

Le client réel doit vérifier la chaîne, le nom d’accès, les usages et la validité. Si l’installation signale une incompatibilité de clé, retrouvez le certificat émis pour la CSR actuelle. Ne générez pas une nouvelle clé privée simplement pour faire disparaître l’erreur.

### 5.4 Installer la chaîne de CA de confiance pour les clients et tester

1. Sélectionnez Install CA et collez un ou plusieurs certificats CA PEM utilisés pour faire confiance à vos clients.
2. Gardez l’interface HTTP d’administration disponible et prévoyez un redémarrage avant les tests. L’installation met à jour le stockage, mais ne redémarre pas activement le service du port 443.
3. Accédez aux points de test concernés avec un certificat client de confiance ayant l’usage et le rôle appropriés.
4. Répétez avec un certificat non fiable ou sans certificat et confirmez le rejet de la connexion.

Vérifiez que l’appareil présente le nouveau certificat prévu, que les clients de confiance n’accèdent qu’aux points autorisés par leur rôle et que les clients non fiables ne peuvent pas se connecter. La négociation et les rôles doivent être testés sur l’appareil, et non déduits d’un message d’installation.

### 5.5 Renouveler les certificats ou supprimer tous les éléments d’authentification

<!-- operational-note -->

Si seul le certificat arrive à expiration, vous pouvez réutiliser une clé privée non compromise pour demander un nouveau certificat, l’installer et refaire les tests. Toutefois, les Config Packs sont liés à l’empreinte du certificat du destinataire. Même avec la même clé privée, un changement d’empreinte entraîne le rejet des anciens paquets comme destinés à un autre appareil après réinitialisation ou redémarrage. Préparez des paquets de remplacement avant de changer le certificat.

Lorsque vous remplacez la clé privée, l’ancienne CSR et l’ancien certificat ne correspondent plus à la nouvelle clé. Cela ne révoque pas l’ancien certificat auprès de la CA. Si l’ancienne clé a été exposée, traitez séparément la révocation et la réponse à l’incident. Les paquets dépendant d’une clé privée perdue peuvent être irrécupérables. Pour supprimer tous les éléments PKI, Delete Credentials dans la section des certificats efface ensemble la clé privée, le certificat de l’appareil et la chaîne de CA de confiance pour les clients. Vérifiez votre accès de récupération HTTP et préparez des paquets de remplacement avant de confirmer. Une sauvegarde du certificat public ne peut pas restaurer une clé privée.

Après la suppression, actualisez la page et vérifiez l’état non initialisé. Redémarrez et vérifiez que le port 443 n’utilise plus les anciens éléments d’authentification. Pour rétablir le service, générez une nouvelle clé, obtenez et installez un certificat d’appareil, installez la chaîne de CA et répétez les tests.

## 6. Comprendre les limites de Config Pack

Un Config Pack est un paquet `.tscfg` chiffré et signé. L’implémentation actuelle permet de créer et d’inspecter des paquets, mais l’application générale des configurations est inachevée. Ne vous y fiez pas pour configurer un parc en production, assurer une reprise après sinistre ou prouver que des réglages ont changé.

### 6.1 Ce que font actuellement les commandes

| Action | Résultat actuel |
| --- | --- |
| Export Device Certificate | Affiche le certificat public pour qu’un expéditeur crée un paquet destiné à cet appareil ; n’exporte pas la clé privée |
| Verify | Vérifie la structure et la signature du contenu chiffré avec le certificat inclus ; n’établit ni la confiance dans le signataire ni l’identité du destinataire |
| Import après sélection ou collage d’un paquet | Les paramètres du frontend et du backend ne correspondent pas ; ce processus ne peut pas aboutir |
| Import depuis la liste des paquets | Valide un fichier existant sur l’appareil ; ne le copie, ne le déchiffre et ne l’applique pas |
| Apply | Déchiffre et énumère les noms de modules sans écrire leurs réglages ; peut malgré tout annoncer une réussite |
| Export Config Pack sur un appareil Developer | Crée un paquet chiffré et signé téléchargeable et tente de l’enregistrer sur la carte SD |

### 6.2 Vérifier l’origine, pas seulement la signature

Le destinataire vérifie actuellement la signature avec le certificat inclus dans le paquet. La validation de confiance de la chaîne du certificat signataire n’est pas implémentée. La signature couvre le contenu chiffré ; n’en déduisez pas que toutes les métadonnées affichées sont authentifiées. Le libellé Official ne prouve pas non plus une origine fiable.

Avant d’importer ou d’inspecter un paquet, utilisez un système de gestion des actifs ou un canal indépendant approuvé pour confirmer l’empreinte du certificat signataire, le certificat cible et le changement prévu. Recevoir un certificat et son empreinte dans le même courriel ne constitue pas une vérification indépendante. Le nom de cible affiché dans l’aperçu ne remplace pas la vérification de l’empreinte du certificat.

### 6.3 Partager le certificat de l’appareil et inspecter un paquet

Pour fournir le certificat de cet appareil, sélectionnez Export Device Certificate, copiez le PEM complet et l’empreinte affichée, puis transmettez le certificat public à l’expéditeur. Confirmez l’empreinte par un autre canal de confiance.

Pour inspecter un paquet reçu, ouvrez Import Config Pack, sélectionnez ou collez le fichier `.tscfg`, puis sélectionnez Verify. Examinez les informations du signataire et vérifiez l’origine. La vérification n’applique aucun réglage et ne prouve pas que cet appareil est le destinataire. Arrêtez-vous si l’origine, la cible ou l’objectif n’est pas clair.

Même si la vérification réussit, ne comptez pas sur les commandes générales Import et Apply actuelles pour configurer l’appareil. Utilisez les commandes prises en charge sur les pages des fonctions concernées, puis contrôlez les réglages réels.

### 6.4 Exporter un paquet depuis un appareil Developer

1. Préparez des fichiers de configuration JSON valides sur la carte SD et obtenez un certificat vérifié de l’appareil cible.
2. Sélectionnez Export Config Pack, choisissez les fichiers, saisissez un nom et une description, puis collez le certificat cible.
3. Générez et téléchargez le fichier `.tscfg`.
4. Vérifiez séparément le téléchargement du navigateur et le fichier enregistré dans `/sdcard/output_config/`. Si l’écriture SD échoue, l’API peut tout de même renvoyer le paquet à télécharger.

L’exportation ne modifie pas les réglages sources. Régénérez un paquet créé pour la mauvaise cible ou pour un certificat destinataire obsolète. Une exportation réussie ne prouve pas le fonctionnement de toute la distribution : l’application générale sur l’appareil récepteur reste inachevée.

## 7. Dépannage et réponse aux incidents

### 7.1 Problèmes courants

| Symptôme | Mesure à prendre |
| --- | --- |
| Account Security est absent | Connectez-vous en tant que root ; admin ne voit pas cette section |
| La création annonce une réussite, mais la clé manque | Actualisez la liste et vérifiez sa capacité ; ne réutilisez pas les ID et ne générez pas des clés à répétition |
| Le déploiement ECDSA échoue | Créez une clé RSA avec un nouvel ID ; n’assouplissez pas sans cesse la politique du serveur |
| Le déploiement réussit, mais Test échoue | Vérifiez l’autorisation distante par une autre connexion avant de redéployer |
| L’accès fonctionne encore après le retrait d’un hôte | Remove ne touche que l’entrée locale ; révoquez séparément la clé publique distante |
| Une empreinte change ou l’identité du serveur est incertaine | Cessez les connexions et vérifiez par une console de confiance ; voir la section 4.3 |
| Le port 443 échoue après l’installation des certificats | Vérifiez la clé, le certificat et la chaîne de CA de confiance pour les clients ; redémarrez et testez avec un certificat client adapté |
| Un client rejette toujours le certificat | Vérifiez son magasin de confiance, le SAN, l’EKU, la validité et la chaîne ; le magasin CA de l’appareil n’est pas celui du navigateur |
| Apply réussit, mais les réglages ne changent pas | L’implémentation actuelle n’écrit pas les réglages des modules ; utilisez les pages des fonctions concernées |

### 7.2 Exposition présumée d’une clé privée SSH

1. Restreignez l’accès à l’appareil et aux journaux. Les journaux actuels peuvent contenir le début d’une clé privée.
2. Révoquez la clé publique sur tous les serveurs concernés par des connexions de confiance. Vérifiez les sauvegardes et confirmez que l’ancienne clé ne fonctionne plus.
3. Créez et déployez une nouvelle clé RSA avec un nouvel ID. Une fois son fonctionnement confirmé, supprimez l’ancienne clé et ses copies exportées.
4. Examinez les journaux de connexion. La liste locale de l’appareil peut ne pas contenir tous les serveurs ayant autorisé cette clé.

Si c’est la clé privée HTTPS qui a été exposée, remplacez les éléments d’authentification selon la section 5.5 et coordonnez avec l’administrateur de la CA la révocation du certificat et le traitement des anciens paquets.

### 7.3 Autres risques de sécurité actuels

Outre les limites déjà décrites concernant HTTP, les autorisations, la confiance à la première connexion et les paquets, la configuration de compilation examinée n’active ni NVS Encryption, ni Flash Encryption, ni Secure Boot. N’affirmez pas que ces mécanismes protègent les clés privées stockées ou l’intégrité du démarrage. Le firmware réellement installé et les réglages eFuse de l’appareil exigent des contrôles distincts.

Si votre usage ne peut pas accepter ces limites, maintenez l’appareil hors de ce réseau ou de cet environnement de confiance jusqu’à l’approbation de mesures d’isolation ou d’une correction du produit par le responsable de la sécurité. Les vérifications d’un guide utilisateur ne remplacent pas les contrôles de sécurité absents du produit.

## 8. Périmètre de la revue et glossaire

### 8.1 Base de ce guide

La revue a utilisé la copie de travail actuelle fondée sur `d6ed947`. Le comportement et les messages de la page se trouvent dans `components/ts_webui/web/js/app.js` ; celui des API, dans `components/ts_api/src/` ; le stockage des clés et des hôtes, dans `components/ts_security/src/`. Les certificats, le service du port 443 et les paquets sont implémentés dans `components/ts_cert/`, `components/ts_https/` et `components/ts_config_pack/`.

Les contrôles ont notamment porté sur les ID de clé en double, le traitement du code de sortie du test SSH, le nettoyage local après révocation, les empreintes du certificat destinataire et la logique inachevée d’importation et d’application des paquets. Il s’agissait d’une revue statique : aucune connexion à un serveur distant, aucune modification des éléments d’authentification d’un appareil ni aucun test d’acceptation de sécurité sur matériel n’a été effectué.

### 8.2 Termes employés

- Clé publique / clé privée : partagez la clé publique avec l’administrateur qui accorde l’accès ; gardez la clé privée secrète. L’authentification utilise la paire correspondante.
- NVS : zone de stockage Flash des réglages et des clés de l’appareil. Ce nom n’implique aucun chiffrement.
- CSR / CA : demande de signature de certificat, et autorité de certification ou son certificat.
- CN / O / OU : champs de nom commun, d’organisation et d’unité d’organisation du sujet d’un certificat.
- SAN / EKU : noms ou adresses IP couverts par un certificat, et usages d’authentification autorisés.
- PEM : format texte avec des délimiteurs BEGIN/END, utilisé pour les certificats, CSR et clés.
- PKI / mTLS : système de gestion des certificats et de la confiance, et TLS mutuel où client et serveur présentent des certificats.
