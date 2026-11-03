# TianShanOS

Version couverte : TianshanOS 0.6.4. Révisé le 3 novembre 2026.

Utilisez ce guide pour modifier les mots de passe des appareils, vous connecter aux serveurs SSH, vérifier les identités des serveurs et gérer les certificats et les packages de configuration. Pour une première configuration, commencez par les chapitres 1, 2 et 3. Travaillez avec l'administrateur de votre appareil ou de votre serveur sur l'émission et la récupération des certificats.

> Utilisez un réseau de gestion fiable. L'interface Web complète utilise HTTP ; l'installation d'un certificat ne le fait pas basculer vers HTTPS. Certaines opérations de certificat peuvent toujours être appelées sans connexion, la déconnexion ne remplace donc pas l'isolation du réseau. N’exposez pas l’accès à la gestion des appareils aux réseaux publics.

## 1. Avant de commencer

### 1.1 Trouvez la tâche dont vous avez besoin Tâche

1. Saisissez l'adresse IP de l'appareil cible dans votre navigateur et connectez-vous avec le compte de votre appareil.
2. Sélectionnez Sécurité dans la barre de navigation. Vérifiez l'adresse avant de saisir des mots de passe ou de manipuler des clés.
3. Utilisez le tableau ci-dessous pour trouver la bonne section. Root voit également la sécurité du compte.

| Tâche | Où aller |
|---|---|
| Modifier le mot de passe root ou admin de l'appareil Sécurité du compte | ; Chapitre 2 |
| Se connecter à un serveur à l'aide d'une clé SSH | Gestion des clés et hôtes avec clé déployée ; chapitre 3 |
| Copiez des clés, modifiez ou supprimez un hôte ou vérifiez les empreintes | Gestion des clés, hôtes déployés et empreintes des hôtes connus ; Chapitre 4 |
| Demander et installer des certificats d'appareil | HTTPS ; Chapitre 5 Packages de configuration cryptés |
| Inspecter ou créer des packages de configuration généraux chiffrés | Pack de configuration ; lisez d'abord les limitations du chapitre 6 |

### 1.2 Comptes et identité de l'appareil

- **admin** peut ouvrir la sécurité et gérer les clés SSH, les hôtes et les fonctions de certificat fournies par la page. La sécurité du compte n'est pas affichée.
- **root** peut aussi définir les mots de passe root et admin, rétablir l’accès admin et gérer la configuration d’Automatisation et le terminal Web qui exigent root. Une session admin conserve les commandes de service proposées sur la page d’accueil.
- Un **Appareil de développeur** possède une identité de développement enregistrée dans son certificat. Ceci n'est pas un compte de connexion. L’exportation de packs de configuration chiffrés et de configurations d’hôtes SSH nécessite cette identité ; se connecter en tant que root ne le change pas.

Les opérations qui nécessitent une connexion vérifient le compte. Certaines requêtes et opérations de certificat ne nécessitent toujours pas de connexion. Un bouton visible ne signifie pas que toutes les exigences relatives au compte ou à l'appareil sont remplies. Si l'autorisation est refusée, vérifiez votre session et les exigences de l'opération avant de réessayer.

### 1.3 Préparer l'opération

1. Vérifiez que votre ordinateur et le périphérique cible se trouvent sur un réseau de gestion approuvé.
2. Confirmez l'adresse SSH, le port, le compte et l'empreinte complète de l'hôte auprès de l'administrateur du serveur.
3. Le déploiement ou la révocation d'une clé publique via la page nécessite le mot de passe du compte distant et l'authentification par mot de passe. L'administrateur du serveur décide de conserver ou non l'authentification par mot de passe activée par la suite.
4. Avant de révoquer l'accès, de supprimer des clés ou de remplacer des certificats, vérifiez qu'une autre connexion de gestion fonctionne, telle qu'une console serveur, une autre clé d'administrateur ou l'interface HTTP de l'appareil.

## 2. Changer les mots de passe des appareils

Ces contrôles modifient les mots de passe de connexion à TianshanOS. Ils ne modifient pas le mot de passe SSH d'un serveur distant.

### 2.1 L'invite après la première connexion

Une invite de changement de mot de passe apparaît après la connexion si le compte est toujours marqué comme ayant un mot de passe inchangé. Définissez un mot de passe long et unique. Choisir de le modifier plus tard ne fera que rejeter l'invite.

Cette invite n'est pas un écran de paramètres de compte que vous pouvez rouvrir à tout moment. Si l'administrateur a déjà modifié son mot de passe et a besoin d'un autre changement, demandez à root de le définir depuis la sécurité.

### 2.2 Définir un mot de passe comme root

1. Connectez-vous en tant que root et ouvrez Sécurité.
2. Sous Sécurité du compte, recherchez les contrôles de mot de passe root ou administrateur. Saisissez le nouveau mot de passe et sa confirmation.
3. Sélectionnez Définir le mot de passe root ou Définir le mot de passe administrateur. Utilisez un mot de passe unique d'au moins 12 caractères. Les lettres, chiffres et symboles anglais aident à éviter les différences de comptage de longueur.

La page indique une limite de 4 à 64 caractères ; l'appareil vérifie les octets UTF-8. Les lettres anglaises, les chiffres et les symboles ASCII courants utilisent chacun un octet. Les caractères chinois en utilisent généralement plusieurs. Quatre est la longueur minimale acceptée et non une longueur de mot de passe recommandée.

**Vérifiez le résultat :** connectez-vous avec le nouveau mot de passe dans une fenêtre de navigation privée avant de vous déconnecter de la session d'origine. La définition d'un nouveau mot de passe ne met pas automatiquement fin aux sessions existantes.

**Si la connexion échoue :** vérifiez le compte et l'adresse de l'appareil. Cinq pannes consécutives déclenchent un lock-out d'environ cinq minutes. Évitez les suppositions répétées.

### 2.3 Réinitialiser le mot de passe admin

Root peut sélectionner Réinitialiser admin par défaut pour restaurer le mot de passe sur `rm01` et effacer le verrouillage de connexion. Connectez-vous en tant que admin dans une nouvelle session et définissez un mot de passe unique immédiatement après.

> Utilisez le mot de passe par défaut uniquement pour récupérer l'accès temporairement. Modifiez-le rapidement et déconnectez-vous des sessions dont vous n'avez plus besoin.

### 2.4 Si vous oubliez le mot de passe root

Demandez à l’administrateur une méthode de récupération adaptée à l’appareil. Le firmware de récupération actuel ne prend en charge que le nouveau stockage de configuration et réinitialise les mots de passe root et admin. N’installez pas vous-même un ancien firmware de récupération. Une fois l’accès rétabli, définissez un mot de passe unique pour chaque compte.

## 3. Connectez-vous à un serveur avec une clé SSH

Pour la configuration initiale, créez une clé RSA, déployez sa clé publique, examinez le résultat et testez la connexion. Vérifiez l'empreinte du serveur dans le cadre de ce processus. Pour retirer une clé, révoquez l'accès sur chaque serveur, confirmez que l'ancienne clé ne fonctionne plus, puis supprimez la clé locale.

### 3.1 Créer une clé

1. Dans Gestion des clés, sélectionnez Générer une nouvelle clé.
2. Choisissez un ID de clé inutilisé, tel que `backup01` . N'utilisez pas plus de 10 lettres ou chiffres anglais, sans virgules. La limite réelle est de 10 octets UTF-8, et non de 10 caractères chinois.
3. Choisissez RSA 2048 ou RSA 4096. RSA 2048 est la valeur par défaut. Les options ECDSA sont également affichées, mais le flux de travail SSH actuel ne les prend pas en charge ; choisissez RSA pour SSH.
4. Ajoutez un commentaire ou un alias si cela est utile. Activez Exportable uniquement si vous devez sauvegarder ou migrer la clé privée. Il n'existe aucun contrôle de page permettant de modifier cette option après la création.
5. Définissez Masqué si nécessaire, puis sélectionnez Générer. Affichage des effets cachés ; cela n'empêche pas l'accès au véritable identifiant de clé ou à la clé.

**Vérifiez le résultat :** une fois la fenêtre fermée et la liste actualisée, recherchez l'ID et le type RSA souhaités. Ouvrez la clé publique et vérifiez que le texte complet commence par `ssh-rsa` .

**Pendant l’attente :** ne renvoyez pas la demande. Fermer la fenêtre n’annule pas la génération sur l’appareil.

| Message ou situation | Que faire |
|---|---|
| L'ID est déjà utilisé | Choisissez un autre identifiant. La création d'une nouvelle clé ne peut pas écraser une clé existante |
| La limite du nombre de clés a été atteinte | L'appareil contient jusqu'à 8 clés SSH. Retirez d'abord une clé inutilisée via le processus de révocation |
| Le stockage ou la mémoire est insuffisant | Résolvez le problème de ressources du périphérique. Ne traitez pas l’échec comme une création réussie |
| La clé a été générée, mais la liste n'a pas pu être actualisée | Actualisez manuellement et vérifiez la clé ; ne le génère plus La génération |
| La génération n’est pas confirmée | Attendez et vérifiez le dossier. Ne soumettez pas à nouveau le même identifiant |
| Le nettoyage n’est pas terminé | Suspendre la création de clé et demander à un administrateur de vérifier le stockage |

Un enregistrement avec le même identifiant ne prouve pas que cette tentative a abouti. Si le résultat est incertain, vérifiez le dossier et les éléments clés.

### 3.2 Déployer la clé publique Le déploiement

Le déploiement ajoute la clé publique au fichier d'autorisation du compte distant, `~/.ssh/authorized_keys` , afin que la clé privée correspondante puisse se connecter. Il ne modifie pas le mot de passe du serveur.

1. Sélectionnez Déployer sur la ligne de la clé souhaitée.
2. Saisissez l'adresse du serveur, le nom d'utilisateur, le port SSH et le mot de passe de connexion SSH.
3. Vérifiez l'adresse et le compte, puis sélectionnez Démarrer le déploiement.
4. Lisez le résultat et vérifiez l'enregistrement correspondant sous Hôtes déployés.

> Le déploiement vérifie l'empreinte de l'hôte avant d'utiliser le mot de passe. Une empreinte modifiée pour un hôte connu est rejetée. Cependant, le déploiement initial sur un hôte inconnu enregistre et approuve toujours son empreinte sans vous demander de la confirmer au préalable. Utilisez un réseau contrôlé et vérifiez l’empreinte complète via un canal fiable.

### 3.3 Comprendre le résultat du déploiement

| Ce que vous dit le résultat | Que faire ensuite |
|---|---|
| La clé a été déployée, l'hôte enregistré et la connexion par clé publique vérifiée | Vérifiez les détails de l'hôte, puis testez la tâche réelle |
| La clé a été déployée et l'hôte enregistré, mais la connexion n'est pas confirmée | Sélectionnez Tester. En cas d'échec, vérifiez les paramètres d'autorisation et de compte via une autre connexion |
| La clé a été déployée, mais l'enregistrement a échoué ou n'est pas confirmé | Vérifiez la liste locale et l'autorisation à distance avant de procéder à un nouveau déploiement |
| Déploiement terminé, mais la liste n'a pas pu être actualisée | Actualiser manuellement. Un échec d'actualisation ne signifie pas que la clé distante n'a pas été installée |

Chaque déploiement ajoute la clé, donc la répéter peut créer des lignes en double. Utilisez une autre connexion de gestion pour inspecter le fichier d'autorisation lorsque le résultat distant doit être confirmé.

### 3.4 Tester la connexion

1. Sous Hôtes déployés, vérifiez l'adresse, le port, le nom d'utilisateur et l'ID de clé, puis sélectionnez Test.
2. Si une première confirmation d'empreinte apparaît, comparez l'empreinte complète comme décrit dans la section 4.3 avant de choisir Faire confiance et se connecter.
3. Si l'empreinte a changé, la boîte de dialogue affiche à la fois les valeurs stockées et actuelles. Annulez et enquêtez d’abord. Sélectionnez Mettre à jour la clé d'hôte uniquement après avoir confirmé une modification autorisée.

Le test tente la commande d'écho fixe `echo "TianshanOS SSH Test OK"` . Le message de réussite ne vérifie pas l'état de sortie ou la sortie de la commande. Utilisez-le uniquement comme vérification de connexion de base ; cela n'établit pas que sudo ou les commandes de votre application fonctionneront.

**En cas d'échec :** vérifiez le réseau, le service SSH, le compte et l'autorisation à distance. Arrêtez de réessayer si l'identité du serveur est incertaine ou si son empreinte a changé.

### 3.5 Révoquer l'accès à distance, puis nettoyer les enregistrements locaux

> La révocation affecte les connexions futures. Vérifiez qu'une autre connexion de gestion fonctionne et gérez les tâches qui doivent encore être arrêtées ou vérifiées. La révocation d'une clé publique, la suppression d'un hôte ou la suppression d'une clé n'arrête pas automatiquement les programmes distants.

1. Sélectionnez Révoquer sur la ligne de l'hôte, entrez le mot de passe du serveur, puis sélectionnez Révoquer la clé publique distante. Vous pouvez également partir de la ligne clé et saisir les détails de la cible.
2. Lisez le résultat à distance. Une révocation réussie ouvre la vérification de suppression de l'hôte local. La suppression locale nécessite toujours une décision distincte ; l'enregistrement n'a pas été supprimé automatiquement.
3. Grâce à une connexion fiable, vérifiez que la clé publique et tous les doublons ont disparu du fichier d'autorisation. Confirmez que l'ancienne clé ne fonctionne plus. Gérez le `authorized_keys.bak` résultant dans le cadre de la politique de sauvegarde du serveur afin que l'ancien accès ne soit pas restauré ultérieurement.
4. Si vous souhaitez supprimer la configuration de l'hôte local, examinez ses références et son impact comme décrit à la section 4.2 avant de confirmer.
5. Une fois que chaque serveur cible et les tâches associées ont été traités, supprimez l'ancienne clé de périphérique et les copies de clé privée inutiles comme décrit dans la section 4.1.

**Si aucune clé publique ne correspond :** vérifiez le compte cible et les clés autorisées sur le serveur. « Examiner et supprimer la configuration de l’hôte » traite uniquement l’enregistrement local ; cela ne remplace pas la vérification sur le serveur.

**Si la révocation échoue ou n'est pas confirmée :** inspectez l'autorisation à distance via une connexion approuvée. Conservez la clé locale jusqu'à ce que le résultat soit clair. Évaluez séparément la révocation à distance et la suppression locale ; un échec dans l’un ne prouve pas que l’autre n’a jamais eu lieu.

## 4. Gérer les clés, les hôtes et les empreintes

### 4.1 Copier, exporter et supprimer des clés

Suivez les instructions ci-dessous pour les lignes de clés SSH. La ligne nommée `https` contient la clé de certificat de périphérique. La suppression de cette ligne efface toutes les informations d'identification du certificat ; Lisez d'abord la section 5.6.

**Copier une clé publique :** sélectionnez Clé publique et envoyez la valeur complète sur une seule ligne à l'administrateur du serveur. Les clés publiques peuvent être partagées. L'accès est accordé lorsqu'un administrateur ajoute la clé à la liste d'autorisation d'un compte.

**Exporter une clé privée :** cette fonction exige d’avoir activé « Exportable » à la création. Sélectionnez « Clé privée » depuis un ordinateur de confiance et un réseau de gestion isolé, puis conservez-la dans un coffre de secrets approuvé. Effacez les copies temporaires du presse-papiers et du dossier de téléchargement. Ne la collez pas dans une conversation, une demande d’assistance ou un journal.

**Si Copier ne fait rien :** les navigateurs peuvent restreindre l'accès au presse-papiers sur une page HTTP. Sélectionnez et copiez le texte manuellement, puis vérifiez qu'il est complet. N'affaiblissez pas les paramètres de sécurité du navigateur pour permettre la copie.

**Avant de supprimer une clé :** révoquez l’autorisation sur le serveur et vérifiez les hôtes et l’historique d’exécution indiqués dans la confirmation. Après suppression, cet appareil ne peut plus utiliser cette clé pour se connecter, vérifier ou arrêter les tâches concernées. Elles peuvent pourtant continuer sur le serveur. Traitez-les d’abord par une autre connexion. Une liste d’impact incomplète ne signifie pas qu’aucune configuration n’utilise la clé.

Après avoir confirmé la suppression, actualisez et vérifiez le résultat. Si la suppression du stockage n'a pas abouti, inspectez l'état actuel et demandez à un administrateur de le résoudre. Une entrée de liste manquante ne constitue pas à elle seule une preuve d’achèvement.

### 4.2 Supprimer un hôte et gérer ses références

| Action | Ce que ça change |
|---|---|
| Révoquer une clé publique | Supprime l'autorisation à distance correspondante ; nécessite le mot de passe distant |
| Supprimer un hôte | Supprime la configuration de son appareil et gère les commandes et règles associées selon votre choix |
| Supprimer une clé | Supprime les éléments clés sur l'appareil |
| Supprimer une empreinte d'hôte connu | Supprime un enregistrement d'identité de serveur enregistré sur l'appareil |

Les trois dernières actions ne révoquent ni les clés publiques distantes ni n'arrêtent les programmes distants. Les hôtes déployés sont uniquement une liste locale ; une liste vide ne prouve pas que l'accès à distance a été supprimé.

1. Sélectionnez Supprimer sur la ligne hôte et attendez la vérification des références.
2. Passez en revue les commandes, modèles ou règles concernés. Choisissez un hôte de remplacement ou dissociez les références et désactivez la configuration concernée. Un remplaçant doit disposer du compte, de la clé et de l'environnement de tâches requis.
3. Sélectionnez Supprimer, lisez le résultat et vérifiez les commandes et règles associées. Les commandes non liées nécessitent la sélection d'un hôte avant de pouvoir être réactivées.

La suppression forcée correspond à une décision délibérée de supprimer la configuration. Il ne nécessite pas que le service distant soit arrêté ni que son état soit connu. Si l'impact ne peut pas être établi, vous devrez peut-être sélectionner J'accepte pour suspendre l'automatisation et poursuivre la suppression. L'automatisation reste ensuite en pause jusqu'à ce que root vérifie la configuration et l'active explicitement.

> Ne forcez pas la suppression uniquement pour effacer une erreur. Déterminez d’abord qui gérera les tâches à distance et quelles règles automatiques seront affectées.

Si la configuration a changé, sélectionnez Examiner l'impact de la suppression et décidez à partir du nouveau résultat. Après une panne de stockage ou un résultat non confirmé, actualisez et inspectez la configuration avant de la supprimer à nouveau.

### 4.3 Vérifier l'empreinte du serveur SSH

Une empreinte permet d'identifier le serveur. Cette page affiche un résumé SHA-256 sous forme de 64 caractères hexadécimaux. Les outils OpenSSH affichent généralement `SHA256:base64` . Demandez à l'administrateur le même format ; ces chaînes ne peuvent pas être comparées directement.

**Comparez la valeur complète :** sélectionnez Afficher sous Empreintes digitales d'hôte connues et comparez-la avec celle d'une console de serveur, d'un enregistrement d'actif ou d'un autre canal approuvé. Le tableau ne montre que les 32 premiers caractères, ce qui est insuffisant pour une vérification complète.

**Lorsque Test demande une confirmation :** une première boîte de dialogue affiche l'empreinte actuelle. Un avertissement de modification affiche à la fois les valeurs stockées et actuelles et permet l'annulation par défaut. Vérifiez le serveur, l'adresse, le port et l'enregistrement de maintenance avant de prendre une décision. La confirmation s'applique uniquement à l'empreinte affichée ; un autre changement nécessite une autre vérification.

**S'il diffère ou si sa source n'est pas claire :** annulez et enquêtez. Si un mot de passe a été utilisé sur une connexion suspecte, modifiez-le via une connexion fiable et examinez les journaux de connexion et les autorisations. N'envoyez pas de mot de passe via la connexion suspecte pour révoquer une clé.

**Après une réinstallation ou un changement autorisé de clé d’hôte :** vérifiez la nouvelle empreinte et consultez l’historique du changement. Sélectionnez ensuite « Mettre à jour la clé de l’hôte » dans la fenêtre de test. Ne supprimez pas l’ancienne entrée pour contourner la vérification : cela ne rend pas la connexion suivante fiable.

Les empreintes sont conservées dans l’appareil et ne sont plus synchronisées avec les fichiers d’empreintes de la carte SD. Les sauvegardes de configuration et les imports d’hôtes SSH ne les incluent pas. Vérifiez de nouveau l’identité des serveurs après une restauration ou une migration.

### 4.4 Modifier un hôte

1. Sous Hôtes déployés, sélectionnez Modifier.
2. Dans Modifier l'hôte SSH, modifiez l'adresse, le port ou le compte de connexion. Pour l'authentification par clé, vous pouvez également modifier l'ID de la clé de connexion. Le port doit être 1-65535.
3. Sélectionnez Enregistrer, actualisez et vérifiez les détails, puis testez la connexion. Vérifiez l'empreinte complète lors du changement de serveur cible.

Les changements concernent les prochaines connexions. Les tâches déjà lancées conservent les données d’origine de l’hôte dans leur historique d’exécution. Changer l’adresse ne déplace pas une tâche existante et ne l’arrête pas.

### 4.5 Importer et exporter les configurations d'hôtes SSH

Import Host est un flux de travail dédié, distinct des contrôles généraux du Config Pack du chapitre 6. Le package contient l'adresse, le port, le compte, la méthode d'authentification et l'ID de clé. Il ne contient aucun mot de passe SSH, clé privée ou empreinte d'hôte enregistrée, et n'accorde aucun accès au serveur.

**Pour exporter :** sur un appareil de développeur, sélectionnez Exporter sur la ligne de l'hôte. Pour un autre appareil, collez et vérifiez son certificat, générez le package et sélectionnez Télécharger. Confirmez que le fichier a été enregistré. La connexion en tant qu'utilisateur root ne donne pas d'éligibilité à l'exportation d'un appareil ordinaire.

**Avant l'importation :** vérifiez la source, confirmez que le package a été créé pour cet appareil et vérifiez que la clé correcte est déjà présente. Un identifiant correspondant ne suffit pas ; son matériel de clé doit correspondre à l'autorisation à distance. L'emplacement de configuration actuel doit être accessible en écriture, mais une carte SD n'est pas toujours requise.

1. Sélectionnez Importer l'hôte, choisissez le fichier `.tscfg` et attendez la fin des vérifications.
2. Vérifiez l'hôte, l'adresse, le compte et les modifications dans l'aperçu. Activez le remplacement uniquement lorsque vous avez l'intention de remplacer une configuration existante par le même ID.
3. Sélectionnez Confirmer l'importation. L'appareil revérifie le package, les informations d'identification et la configuration actuelle plutôt que de s'appuyer sur un aperçu obsolète.
4. Après une sauvegarde réussie, actualisez et vérifiez la liste des hôtes, puis testez la connexion. La configuration enregistrée prend effet immédiatement sans redémarrage. Le paramètre d'automatisation activé ou suspendu existant est conservé.

Ce flux de travail vérifie l'appareil du destinataire, la signature, l'émetteur de confiance et l'éligibilité du signataire lors de la prévisualisation, puis décrypte et vérifie le contenu. Confirmez également la source via un canal fiable. Un nom ou une étiquette officielle ne suffit pas.

**Si les vérifications échouent :** suivez le message pour vérifier l'heure de l'appareil, le certificat de l'appareil, la chaîne d'autorité de certification du client et les paramètres de l'émetteur de confiance. Un certificat accepté pour HTTPS n'est pas nécessairement éligible pour signer des Config Packs. Demandez à l'administrateur de l'appareil de résoudre ce problème ; n'installez pas une autorité de certification inconnue uniquement pour importer un package inconnu.

**Si l'aperçu expire :** sélectionnez à nouveau Vérifier le package et vérifiez les modifications. Si la boîte de dialogue doit être rouverte, conservez d'abord toute entrée nécessaire et suivez la section 7.2.

### 4.6 Ce que la sauvegarde et la restauration peuvent apporter

Les hôtes SSH sont enregistrés avec les règles d'automatisation, les modèles, les commandes et la configuration associée. Le fonctionnement normal utilise la configuration SD. En mode d'urgence interne, les modifications sont enregistrées à l'intérieur de l'appareil. Les importations, modifications et suppressions d'hôtes écrivent toutes dans la configuration actuellement utilisée.

Root peut afficher l'emplacement actuel sous Configuration et sauvegarde sur la page Automatisation. Enregistrer la sauvegarde d'urgence met à jour manuellement la copie interne complète ; il ne se synchronise pas après chaque modification. La restauration de la sauvegarde d'urgence affiche les différences avant de remplacer la configuration actuelle, sans redémarrage.

Une copie plus ancienne peut ramener d'anciens hôtes, commandes et règles, et peut changer si l'automatisation est activée. Passez en revue les différences avant de restaurer. La restauration n'arrête ni ne redémarre les services distants, ni ne récupère les clés privées ou les empreintes de l'hôte connu.

La suppression de la configuration actuelle ne nettoie pas l’autre copie manuelle. Organisez la mise à jour de la copie d'urgence après le retrait d'un hôte. La réinsertion de la carte SD ne change pas automatiquement les configurations ; root doit choisir lequel utiliser sous Configuration et sauvegarde. Ne supprimez pas et n'écrasez pas les fichiers Automation gérés en interne via le gestionnaire de fichiers.

## 5. Configurer les certificats HTTPS et mTLS

La configuration de build examinée pour ce guide n'active pas le service HTTPS. Les contrôles de certificat peuvent préparer les informations d'identification, mais n'établissent pas que le port 443 est ouvert. Si vous avez besoin de HTTPS, demandez d'abord à l'administrateur de l'appareil de confirmer que le micrologiciel installé le permet.

Lorsqu’il est activé, le service HTTPS actuel fournit des points de terminaison de test d’intégrité, d’identité et d’autorisation, et non l’interface Web complète. Les tests de connexion ci-dessous s'appliquent aux déploiements avec HTTPS activé.

### 5.1 Savoir quel certificat fait quoi

- Le **certificat d'appareil et la clé privée** permettent à l'appareil de prouver son identité aux clients.
- Un **certificat client et une clé privée**, détenus par un ordinateur ou un service, permettent à ce client de prouver son identité à l'appareil.
- L'**autorité de certification de vérification client sur l'appareil** valide les certificats clients. Cela n’oblige pas automatiquement un navigateur à faire confiance au certificat de l’appareil.

Cette authentification bidirectionnelle est appelée mTLS. Les clients doivent toujours faire confiance à l'émetteur du certificat de périphérique et vérifier ses noms d'accès, ses utilisations autorisées et sa validité. Une autorité de certification est une autorité de certification, ou son certificat.

### 5.2 Lire l'état et régler l'heure de l'appareil

« Enregistré », « Dans la période de validité » et « HTTPS : En cours » décrivent trois choses distinctes : le stockage, les dates et le fonctionnement du service. Aucun de ces états ne prouve les deux autres.

| Statut ou situation | Que faire |
|---|---|
| Le certificat de périphérique, la clé privée ou l'autorité de certification de vérification du client sont manquants | Installer le matériel manquant |
| En attente de l'heure de l'appareil | Vérifiez l'horloge de votre ordinateur, puis sélectionnez Définir l'heure de l'appareil à partir de cet ordinateur (source du navigateur) |
| Pas encore valide ou expiré | Vérifiez l'heure de l'appareil et les dates des certificats ; organiser le renouvellement si nécessaire |
| La validité temporelle est correcte, mais HTTPS est arrêté | Vérifiez d'abord que le micrologiciel active HTTPS, puis résolvez les problèmes d'identification, de correspondance ou de démarrage affichés. |
| Le service en cours d'exécution utilise toujours le matériel précédent | Enregistrez les autres travaux, redémarrez comme indiqué et vérifiez le certificat réellement utilisé. |
| L'enregistrement ou la lecture n'est pas confirmé | Actualisez et vérifiez avant d'installer ou de supprimer à nouveau |

Avec HTTPS activé dans le micrologiciel, un service arrêté tente de démarrer lorsque les informations d'identification et l'heure sont prêtes. Après avoir réglé l'heure, vérifiez l'horloge de l'appareil, l'état de synchronisation et l'état HTTPS. Le succès de l’installation ne prouve pas à lui seul que l’on est prêt.

### 5.3 Générer une clé d'appareil et une demande de certificat

> Si une clé existe déjà, lisez d’abord la section 5.6. La régénérer écrase cette clé et peut rendre inutilisables les anciens certificats et paquets.

1. Sélectionnez Générer une paire de clés. Cela crée une clé privée ECDSA P-256 distincte, sans rapport avec les clés SSH. Il ne peut pas être exporté via cette interface.
2. Sélectionnez Générer CSR. Saisissez l'ID de l'appareil (CN), l'organisation et le service, ou laissez tous les champs vides. Le département correspond à l'unité organisationnelle (UO) du certificat.
3. Sélectionnez Générer une demande de signature de certificat et envoyez le CSR complet à l'administrateur de l'autorité de certification.

Utilisez un identifiant d'appareil court et stable composé de lettres et de chiffres anglais. Les champs de formulaire autorisent jusqu'à 63 octets UTF-8 ; Les caractères chinois utilisent plusieurs octets. Raccourcissez les champs si une erreur de longueur apparaît.

**Vérifiez les noms d'accès avant l'émission :** avec les champs personnalisés, ce formulaire ne génère pas de liste de noms alternatifs du sujet (SAN). Avec tous les champs vides, l’ID de l’appareil est fixé à `TIANSHAN-DEVICE-001` . Seule l'adresse IP actuelle est ajoutée si elle est disponible ; aucun nom DNS n'est ajouté. Demandez à l'administrateur de l'autorité de certification d'inclure l'adresse IP ou le nom DNS d'accès réel et de vérifier les objectifs d'authentification via un processus d'émission contrôlé. Ce formulaire ne peut pas modifier les SAN.

Un CSR n’est qu’une demande. Il ne contient aucune clé privée et n'installe pas de certificat. Vérifiez sa clé publique, son sujet et ses noms d'accès avant l'émission.

### 5.4 Installer le certificat de l'appareil

1. Obtenez un certificat PEM correspondant à la clé privée de l'appareil actuel. PEM est un texte avec des marqueurs de limite BEGIN/END.
2. Sélectionnez Installer le certificat, collez le texte complet, puis sélectionnez Installer.
3. Vérifiez le résultat enregistré, le sujet, l'émetteur et la validité, puis vérifiez le statut HTTPS réel.

L'installation vérifie le format et la correspondance des clés. Les clients doivent toujours vérifier séparément la confiance, l’adresse d’accès et les utilisations autorisées.

Pour afficher le texte du certificat, sélectionnez Cert sur la ligne `https` dans Gestion des clés. Examinez ou copiez le PEM complet. Vous pouvez partager le certificat public avec un expéditeur du Config Pack ; garder la clé privée secrète.

**Si la clé ne correspond pas :** recherchez le certificat émis pour le CSR actuel. Ne régénérez pas une clé privée uniquement pour effacer l’erreur. Si le résultat n'est pas confirmé, actualisez et vérifiez ce qui a été enregistré avant de décider de réessayer.

### 5.5 Installer la chaîne d'autorité de certification client et tester

1. Sélectionnez Installer l'autorité de certification, collez un ou plusieurs certificats d'autorité de certification PEM nécessaires pour valider les clients, puis sélectionnez Installer. Installez uniquement les autorités de certification approuvées par votre administrateur.
2. Vérifiez l'état. Lorsque HTTPS est activé, un service arrêté tente de démarrer une fois que les informations d'identification et l'heure sont prêtes. Si un service en cours d'exécution doit appliquer du nouveau matériel, redémarrez comme indiqué.
3. Demandez à un administrateur d'accéder aux points de terminaison de test appropriés avec un certificat client de confiance dont l'objectif et le rôle sont corrects.
4. Répétez l'opération avec un certificat non fiable ou sans certificat, puis confirmez le rejet.

**Vérifier le résultat :** confirmez que HTTPS utilise le certificat prévu. Comparez « SHA-256 du certificat actif » si cette valeur est affichée. Un client de confiance ne doit accéder qu’aux points autorisés pour son rôle. Sur l’appareil cible, vérifiez les connexions qui doivent être acceptées et celles qui doivent être refusées.

### 5.6 Renouveler, remplacer ou supprimer les informations d'identification

**Renouveler un certificat :** réutilisez une clé non compromise pour demander un nouveau certificat. Installez-le, appliquez-le selon les instructions, puis testez. Les Config Packs sont liés à l’empreinte du certificat destinataire. Même avec la même clé privée, un ancien paquet peut être refusé à sa relecture après un changement de certificat. Prévoyez d’abord de nouveaux paquets.

**Remplacement de clé privée :** l'ancienne CSR et le certificat ne correspondent plus. Les packages qui dépendent de l'ancienne clé peuvent être irrécupérables. Si la clé a été exposée, demandez également à l'administrateur de l'autorité de certification de révoquer le certificat. La génération d'une nouvelle clé n'effectue pas de révocation.

**Supprimez toutes les informations d'identification :** vérifiez d'abord que l'accès à la gestion HTTP fonctionne et organisez les packages dont vous avez encore besoin. Supprimer les informations d’identification supprime ensemble la clé de périphérique, le certificat de périphérique et la chaîne d’autorité de certification client. Une sauvegarde de certificat public ne peut pas récupérer une clé privée.

Après suppression, actualisez et vérifiez qu'il manque du matériel. Un service HTTPS en cours d'exécution peut toujours contenir d'anciennes informations d'identification ; la suppression des données stockées ne constitue pas une révocation immédiate. Redémarrez comme indiqué, puis confirmez que les anciennes informations d'identification ne sont plus utilisées. Pour restaurer le service, préparez à nouveau une clé, un certificat de périphérique et une chaîne d'autorité de certification, puis testez.

## 6. Comprendre les limitations générales du Config Pack

Un Config Pack est un fichier `.tscfg` chiffré et signé. Les contrôles généraux de la section Config Pack diffèrent de ceux d'Import Host de la section 4.5. N’utilisez pas le comportement de contrôle général pour évaluer les importations d’hôtes dédiés, de commandes, de sources, de modèles ou de règles.

### 6.1 Ce que font les commandes

| Action | Résultat actuel Certificat de périphérique d'exportation |
|---|---|
| Exporter le certificat de l’appareil | Partage un certificat public afin qu'un expéditeur puisse créer un package pour cet appareil ; n'exporte pas sa clé privée |
| Vérifier uniquement | Vérifie la structure et la signature par rapport au certificat inclus ; n'établit pas la confiance du signataire ou la correspondance des destinataires |
| Importer après avoir sélectionné ou collé dans la boîte de dialogue générale | Ce point d'entrée ne peut pas actuellement terminer l'importation |
| Importer depuis la liste des packages | Vérifie un fichier de périphérique existant sans copier, déchiffrer ou appliquer la configuration |
| Appliquer | Décrypte et répertorie les catégories de configuration sans écrire leurs paramètres ; peut encore signaler un succès |
| Exporter Config Pack sur un appareil Developer | Crée et enregistre un package sur la carte SD, puis propose un téléchargement après succès |

> N’utilisez pas le bouton général « Appliquer » pour configurer un parc, restaurer un système après incident ou confirmer l’application de réglages. Même si un succès est annoncé, configurez chaque fonction sur sa page et vérifiez le résultat.

### 6.2 Vérifier la source et le destinataire La vérification

La vérification générale utilise uniquement le certificat de signataire inclus dans le package sans vérifier qu'il a été émis par une autorité de confiance. La signature protège le contenu crypté ; cela ne rend pas tous les champs affichés dignes de confiance. Une étiquette officielle, un nom de package ou un nom de cible ne peut pas remplacer une vérification de source.

Utilisez les enregistrements d'actifs ou un canal de confiance indépendant pour confirmer l'empreinte du certificat du signataire, le certificat de l'appareil du destinataire et l'objectif. Un certificat et une empreinte reçus dans le même message ne constituent pas une vérification indépendante. Arrêtez-vous si la source, la cible ou le but n'est pas clair.

### 6.3 Partager un certificat d'appareil et inspecter un colis

**Fournissez le certificat de cet appareil :** sélectionnez Exporter le certificat de l'appareil et copiez le PEM complet et l'empreinte affichée. Envoyez le certificat public à l'expéditeur, puis confirmez l'empreinte via un autre canal de confiance.

**Inspectez un package reçu :** ouvrez Import Config Pack, sélectionnez ou collez le fichier, puis sélectionnez Vérifier uniquement. Vérifiez les informations de signature et confirmez la source. Cela n'applique pas les paramètres et ne prouve pas que cet appareil est le destinataire.

Même une fois la vérification réussie, les fonctions générales d'importation et d'application ne peuvent pas être utilisées pour configurer l'appareil. Utilisez Import Host pour un package d’hôte SSH et les contrôles pris en charge sur les pages pertinentes pour d’autres paramètres.

### 6.4 Exporter un Config Pack général à partir d'un appareil développeur

1. Préparez des fichiers de configuration JSON valides sur la carte SD et obtenez un certificat de périphérique cible vérifié.
2. Sélectionnez Exporter le pack de configuration et choisissez les fichiers. Vérifiez que tous les fichiers requis ont été chargés. Résolvez les erreurs de lecture plutôt que de laisser de côté le contenu requis.
3. Entrez un nom et une description, collez le certificat du destinataire et générez le package.
4. Vérifiez le message de réussite et le chemin d'enregistrement de l'appareil, puis sélectionnez Télécharger. Confirmez que le navigateur a enregistré le fichier `.tscfg` .

Les paquets sont enregistrés dans `/sdcard/output_config/`. Si l’enregistrement sur l’appareil échoue, une erreur s’affiche et le nouveau paquet n’est pas proposé au téléchargement. Ne prenez pas un ancien résultat pour le succès de cet essai. Vérifiez la carte SD et le résultat de l’enregistrement avant de décider de recommencer.

L’exportation ne change pas les réglages d’origine. Si la cible est incorrecte ou si le certificat destinataire a été remplacé, générez un nouveau paquet. Une exportation réussie ne garantit pas que la fonction générale « Appliquer » soit disponible sur le destinataire.

## 7. Dépannage et réponse aux incidents

### 7.1 Problèmes courants Symptôme

| La sécurité du compte | Que faire |
|---|---|
| La section de sécurité des comptes n’apparaît pas | Il est affiché uniquement pour root |
| L'authentification ou l'autorisation est refusée | Vérifiez votre compte et l'identité de l'appareil requise. Les clics répétés ne peuvent pas contourner les exigences |
| La génération ou le déploiement n'est pas confirmé | Vérifiez les enregistrements locaux et le résultat distant avant de soumettre à nouveau |
| Une liste ne peut pas être lue | Restaurez la connectivité et actualisez. Un échec de lecture ne signifie pas que la liste est vide |
| L'empreinte de l'hôte change | Annuler et vérifier via un canal de confiance ; voir la section 4.3 |
| Un hôte local reste après la révocation | Vérifiez séparément la révocation à distance et la suppression locale ; voir la section 3.5 |
| Access fonctionne toujours après la suppression d'un hôte | Révoquer la clé publique distante séparément ; la suppression locale ne révoque pas l'accès |
| Un contrôle de suppression ou un aperçu du package expire | Revérifiez et décidez à partir du nouveau résultat, pas de l'ancien aperçu |
| Un certificat est enregistré, mais HTTPS est arrêté | Vérifiez d'abord que le micrologiciel active HTTPS, puis vérifiez l'heure, les informations d'identification et les messages de démarrage. |
| Un client rejette le certificat | Vérifiez la confiance des clients, les noms d'accès, les utilisations autorisées et la validité |
| Général L'application réussit, mais les paramètres ne changent pas | Ce point d'entrée n'écrit pas encore les paramètres ; utiliser la page de fonctionnalités appropriée |

### 7.2 Modifications de configuration ou résultat incertain

**L'éditeur indique que la configuration a changé :** votre saisie est peut-être toujours dans la fenêtre, mais elle n'a pas été enregistrée en tant que brouillon. Copiez tout ce dont vous avez besoin dans un endroit sûr, fermez et rouvrez l'éditeur, lisez la configuration actuelle, puis modifiez-la à nouveau. Ne mettez pas de mots de passe ou de clés privées dans des notes ordinaires.

**Un aperçu du package expire :** sélectionnez à nouveau Vérifier le package et examinez les modifications. Un ancien aperçu ne peut pas être réutilisé après la modification des informations d'identification ou de la configuration.

**Un contrôle de suppression expire :** sélectionnez Examiner l'impact de la suppression et vérifiez les références actuelles. Une opération dans une autre fenêtre a pu modifier le résultat.

**Un délai d'attente, une déconnexion ou une réponse incomplète se produit :** inspectez d'abord la configuration, la clé, le certificat ou l'autorisation à distance actuelle. Une confirmation manquante ne signifie pas que l’opération n’a jamais eu lieu. Vérifiez avant de décider de réessayer.

### 7.3 Exposition suspectée de clé ou de mot de passe

1. Restreindre l’accès à l’appareil et au matériel concerné. Conservez les dossiers nécessaires à l’enquête.
2. Pour une clé privée SSH exposée, révoquez sa clé publique sur chaque serveur concerné via des connexions approuvées. Vérifiez les sauvegardes et confirmez que l'ancienne clé ne fonctionne plus.
3. Créez et déployez une nouvelle clé RSA sous un nouvel ID. Vérifiez-le, puis supprimez l'ancienne clé et les copies exportées.
4. Pour un mot de passe SSH exposé, modifiez-le via une connexion de gestion approuvée et examinez les enregistrements de connexion.
5. Pour une clé de certificat de périphérique exposée, remplacez les informations d'identification comme décrit à la Section 5.6. Travaillez avec l'administrateur de l'autorité de certification sur la révocation et les anciens packages.

La liste d'hôtes locaux peut ne pas couvrir tous les serveurs ayant accordé l'accès. Vérifiez également les enregistrements du serveur et des actifs. Avant de partager des journaux, examinez-les pour rechercher des mots de passe, des clés ou d'autres informations sensibles.

### 7.4 Limites d'exploitation actuelles

Tenez compte des limitations HTTP et d'accès au chapitre 1, de l'approbation du déploiement initial au chapitre 3 et des limitations générales du Config Pack au chapitre 6. Hidden n'est pas un mécanisme de contrôle d'accès.

La configuration de build examinée n’active ni le chiffrement NVS, ni le chiffrement Flash, ni Secure Boot. Elle ne permet pas d’affirmer que les clés stockées sont protégées par le chiffrement et le démarrage sécurisé. Vérifiez séparément les réglages réels du firmware et du matériel. Si ces limites sont inacceptables, demandez au responsable de sécurité de prévoir l’isolation ou une correction.

## 8. Portée et glossaire

### 8.1 Base de cette édition

Ce guide couvre TianshanOS 0.6.4. Ses instructions suivent le code en amont et ses interfaces chinoises et anglaises révisées le 3 novembre 2026. Utilisez l'implémentation révisée pour juger des fonctionnalités ; un numéro de version seul est insuffisant.

Les mises à jour ultérieures n’invalident pas forcément ce guide. Si les pages, les étapes ou les résultats diffèrent, consultez l’interface réelle et les notes de mise à jour. La vérification des documents ne remplace pas les essais sur l’appareil : accès SSH, autorisations distantes, connexions HTTPS, redémarrage et récupération.

### 8.2 Termes utilisés dans ce guide

- **Clé publique / clé privée :** partagez la clé publique avec la partie qui accorde l'accès ; garder la clé privée secrète. La connexion utilise une paire correspondante.
- **Fingerprint :** un résumé utilisé pour comparer les identités des serveurs ou des certificats. Convertissez différents formats d'affichage avant de comparer.
- **CSR / CA :** une demande de signature de certificat, et une autorité de certification ou son certificat.
- **CN / OU :** le nom et l'unité organisationnelle dans un certificat. Le département sous la forme correspond à l'UO.
- **SAN :** les noms DNS ou adresses IP couverts par un certificat.
- **PEM :** certificat, demande ou texte de clé avec des marqueurs BEGIN/END.
- **mTLS :** authentification dans laquelle les deux parties présentent des certificats.
- **NVS :** une zone de stockage interne pour les paramètres et les clés de l'appareil. Son nom n'implique pas de cryptage.
