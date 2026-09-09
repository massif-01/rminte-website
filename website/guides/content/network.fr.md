# Guide de configuration réseau de RM-01

Les noms des boutons et des rubriques sont conservés en anglais pour vous permettre de les retrouver sur l’appareil. Son interface web est disponible en chinois et en anglais ; changer la langue de ce site ne modifie pas les langues de l’appareil.

## 1. Comprendre les deux voies de connexion

RM-01 propose deux voies réseau par USB-C, appelées **port C1** et **port C3** dans ce guide. Toutes deux transportent des connexions réseau, mais relient des appareils différents et créent des topologies distinctes :

| Port | Usage principal | Organisation du réseau après connexion |
| --- | --- | --- |
| C1 | Connecter un ordinateur, une tablette, un téléphone ou un autre appareil utilisateur à RM-01 | L’appareil rejoint le réseau du commutateur interne de RM-01 en tant que nœud interne |
| C3 | Connecter RM-01 au réseau local existant de l’utilisateur | LPMU achemine le trafic des autres nœuds internes, ce qui permet à l’ensemble du système de rejoindre le réseau du commutateur ou du routeur amont |

## 2. Identifier C1 et C3

### Port C1

C1 se trouve à l’arrière du boîtier. Parmi les deux ports USB-C disposés verticalement, il s’agit du port supérieur. Un symbole de connexion gravé sous le port permet de le repérer.

### Port C3

C3 se trouve sur le dessus du boîtier. Soulevez le couvercle magnétique pour accéder à ce port USB-C. C3 est le port USB supérieur partagé ; sa destination peut être commutée entre ESP, AGX et LPMU dans TianshanOS.

## 3. Connecter un appareil utilisateur par C1

Utilisez un câble USB-C prenant en charge le transfert de données pour connecter un iPad, un ordinateur, un téléphone ou un autre appareil à C1. RM-01 fournit la configuration DHCP : l’utilisateur n’a pas à saisir manuellement d’adresse IP, de passerelle ni de serveur DNS.

L’appareil détecte généralement une interface réseau filaire nommée `AX88179` ou USB Ethernet. Il rejoint ensuite le réseau du commutateur interne de RM-01 et peut communiquer avec les appareils de ce réseau.

> C1 relie directement l’appareil utilisateur au réseau interne de RM-01. Ne connectez que des appareils de confiance et ne raccordez pas d’appareils non administrés à C1 dans un environnement public ou non fiable.

## 4. Conserver l’accès à internet et le partager avec RM-01

### Effet possible sur la connexion internet de l’utilisateur

Après la connexion à C1, certains systèmes d’exploitation peuvent donner la priorité à `AX88179`. Comme C1 donne accès au réseau interne de RM-01, et non directement à internet, la connexion internet existante de l’appareil peut être interrompue.

Si l’appareil doit continuer à utiliser le Wi-Fi, Ethernet ou une autre connexion pour accéder à internet, conservez une priorité supérieure pour cette connexion par rapport à `AX88179` :

| Système | Terme employé | Principe de configuration |
| --- | --- | --- |
| macOS | Ordre des services réseau (Service Order) | Placez le service Wi-Fi ou Ethernet fournissant internet au-dessus de `AX88179` |
| Windows | Métrique d’interface | Une valeur plus faible donne une priorité supérieure ; attribuez à l’interface internet une métrique inférieure à celle de `AX88179` |
| Linux | Métrique de route | Une valeur plus faible donne une priorité supérieure ; attribuez à la route internet par défaut une métrique inférieure à celle de `AX88179` |

### Utiliser l’outil de connexion réseau de RM-01

Pour partager la connexion internet de l’appareil avec RM-01, téléchargez l’**Outil de connexion réseau de RM-01** depuis la page Téléchargements du site. Cet outil configure DHCP, le routage et les règles de partage entre l’appareil utilisateur et C1 afin d’acheminer le trafic internet vers le réseau interne de RM-01.

Systèmes actuellement pris en charge :

- macOS
- Linux
- Windows Pro

Windows Home n’est pas pris en charge actuellement.

> L’outil modifie l’adressage réseau, le routage et les réglages de partage sur l’appareil utilisateur. Les connexions existantes peuvent être brièvement interrompues. Préservez le travail lié aux téléchargements, aux sessions distantes et aux autres activités dépendant du réseau avant de commencer.

## 5. Configurer le partage internet de C1 avec l’IA

Un environnement d’exécution d’agents capable d’exécuter des commandes locales, tel que Codex ou Hermes, peut examiner la topologie à partir d’instructions en langage naturel et aider à configurer le transfert et le partage internet entre l’ordinateur utilisateur et le réseau interne de RM-01. L’IA doit pouvoir exécuter des commandes système sur l’ordinateur cible. Une IA limitée à la conversation peut fournir des instructions, mais ne peut pas appliquer la configuration.

### Où exécuter l’agent IA

Exécutez si possible l’agent directement sur l’ordinateur connecté à C1. Cet ordinateur gère la liaison internet, la route par défaut et les règles de partage ; l’agent a donc besoin d’un accès administrateur sur cet ordinateur pour effectuer la configuration.

Si Codex, Hermes ou un autre agent s’exécute dans RM-01, il doit déjà disposer d’une autorisation d’exécution de commandes à distance et d’un accès administrateur à l’ordinateur utilisateur. Sans cet accès, il ne peut pas modifier le partage réseau, le routage ni le pare-feu de cet ordinateur.

### Vérifications préalables

- L’ordinateur est connecté à RM-01 par C1 et détecte une interface nommée `AX88179` ou USB Ethernet.
- L’adresse C1 de l’ordinateur est `10.10.99.100/24`, tandis que les nœuds internes de RM-01 conservent `10.10.99.99`, `10.10.99.98` et `10.10.99.97`.
- L’ordinateur dispose déjà d’un accès internet fonctionnel par Wi-Fi, Ethernet ou une autre interface.
- L’environnement d’agents peut exécuter des commandes sur l’ordinateur et demander des privilèges administrateur si nécessaire.
- Le travail lié aux téléchargements, sessions distantes et autres activités dépendant du réseau a été préservé, et une récupération locale du réseau est possible.

### Instructions à envoyer à l’agent

Le texte suivant conserve la topologie d’usine de RM-01, exige une inspection avant toute modification et demande des vérifications ainsi que des instructions de retour arrière. Copiez-le dans Codex, Hermes ou un autre environnement d’agents capable d’exécuter des commandes :

```text
Aide-moi à configurer le partage internet de C1 pour RM-01. Examine d’abord le système d’exploitation, les interfaces réseau, les adresses, les routes par défaut et l’état du pare-feu. Ne modifie la configuration qu’après avoir confirmé qu’elle correspond à la topologie ci-dessous. Ne déduis pas le rôle d’une interface de son seul nom et ne change pas les adresses fixes des nœuds internes de RM-01.

Topologie actuelle :
- L’ordinateur utilisateur est connecté par USB-C au port C1 de RM-01. Sur l’ordinateur, cette connexion apparaît généralement sous le nom AX88179 ou USB Ethernet et utilise 10.10.99.100/24.
- Le réseau interne de RM-01 est 10.10.99.0/24.
- L’ordinateur applicatif (LPMU) est 10.10.99.99.
- L’ordinateur d’inférence (AGX) est 10.10.99.98.
- L’ordinateur d’administration hors bande est 10.10.99.97.
- L’ordinateur utilisateur dispose aussi d’un accès internet par une autre interface réseau.

Mon objectif est de conserver la connexion internet existante de l’ordinateur et de la partager par l’interface AX88179 / USB Ethernet associée à C1, afin de permettre à 10.10.99.99, 10.10.99.98 et 10.10.99.97 d’accéder à internet.

Respecte ces contraintes :
1. Identifie le système d’exploitation, la véritable liaison internet et l’interface associée à C1, puis explique les changements prévus.
2. Utilise la méthode native de partage la moins intrusive du système pour configurer uniquement le transfert IP, NAT, le routage ou le partage de connexion internet nécessaires.
3. Ne change ni la priorité ni la route par défaut de l’interface internet existante. Ne modifie pas les adresses RM-01 ci-dessus et ne vide ni n’écrase les règles de pare-feu étrangères à cette tâche.
4. Si des privilèges administrateur sont nécessaires, explique pourquoi avant de les demander. Si le système ou les permissions actuels ne permettent pas une configuration sûre, arrête-toi et indique la raison.
5. Après la configuration, vérifie que l’ordinateur dispose toujours d’internet ; que 10.10.99.99, 10.10.99.98 et 10.10.99.97 sont joignables ; et que les nœuds internes de RM-01 peuvent atteindre une IP publique et résoudre des noms DNS.
6. Enfin, détaille les commandes ou réglages réellement modifiés, les résultats de validation et les étapes de retour arrière permettant de rétablir la configuration d’origine.
```

macOS utilise généralement le partage internet et les fonctions de routage du système ; Linux, le transfert IP avec nftables ou iptables ; Windows Pro, le partage de connexion internet (ICS). Les commandes et les noms d’interfaces exacts doivent découler de l’inspection de l’ordinateur actuel. Windows Home n’est pas pris en charge actuellement.

### Vérifier le résultat

Après la configuration, toutes les conditions suivantes doivent être remplies :

1. La connexion internet d’origine de l’ordinateur reste disponible.
2. L’ordinateur peut joindre `10.10.99.99`, `10.10.99.98` et `10.10.99.97`.
3. Les nœuds internes de RM-01 peuvent joindre des adresses IP publiques et des noms d’hôtes internet résolus par DNS.
4. L’agent détaille les modifications effectuées et fournit des étapes de retour arrière exécutables, au lieu de simplement annoncer une réussite.

### Avis de sécurité

> Accorder à un agent un accès administrateur ou root pour configurer le réseau lui permet de modifier les routes, le transfert IP, NAT, le partage de connexion internet et les règles du pare-feu. N’utilisez qu’un environnement d’agents de confiance et examinez ses actions proposées avant de les autoriser. Si l’ordinateur héberge une session distante ou une autre activité réseau critique, vérifiez d’abord qu’une récupération locale de la configuration est possible.

## 6. Connecter RM-01 au réseau amont par C3

Dans ce guide, le « réseau amont » désigne le réseau local existant de l’utilisateur, par exemple celui d’un commutateur ou d’un routeur.

### Préparer l’adaptateur

L’utilisateur doit fournir :

- Un adaptateur Ethernet USB-C vers RJ45.
- Un câble Ethernet RJ45 raccordé au commutateur ou au routeur.

Connectez l’extrémité USB-C à C3, puis le câble RJ45 au commutateur ou au routeur. Le seul raccordement physique ne termine pas la configuration DHCP ni le routage. Il faut ensuite exécuter le programme de configuration réseau intégré à RM-01.

### Commuter le port USB supérieur vers LPMU

1. Ouvrez la page d’accueil de TianshanOS.
2. Repérez « USB Switch ».
3. Sélectionnez le bouton « USB » et faites passer la destination du port supérieur à `LPMU`.
4. Vérifiez que la page affiche `LPMU` comme destination actuelle avant de continuer.

<!-- operational-note -->

La commutation peut interrompre brièvement la liaison actuelle. Ne changez pas de destination pendant un transfert de données par ce port.

## 7. Connecter l’ensemble du système par LPMU

RM-01 est livré avec le projet d’automatisation réseau préinstallé sur LPMU. Une fois la liaison amont établie, LPMU utilise le routage interne et NAT pour transférer le trafic d’AGX et des autres nœuds internes, reliant ainsi l’ensemble du système au réseau amont de l’utilisateur.

### Emplacement du projet et rôle de l’utilisateur

Le projet se trouve dans le **répertoire personnel de l’utilisateur actuel de LPMU**, à l’emplacement `~/network-setup/`. Les scripts propres à LPMU sont dans `~/network-setup/lpmu/`.

Sur un appareil configuré en usine, ne téléchargez pas à nouveau le projet et ne répétez pas les étapes de déploiement technique du README du dépôt, telles que `scp`, `chmod` ou l’installation de services. En usage courant, lancez la configuration depuis TianshanOS. N’ouvrez le répertoire du projet que pour le dépannage ou le développement.

> Ne déplacez, ne renommez et ne supprimez pas `~/network-setup/`. Le processus de configuration réseau de TianshanOS dépend du chemin et des scripts d’usine.

### Ce que configure le projet d’automatisation

Au lancement, le projet effectue les opérations suivantes sur LPMU :

1. Il détecte les interfaces disposant d’une passerelle et teste la connectivité pour choisir une voie amont utilisable.
2. Il remplace la route par défaut de LPMU pour acheminer le trafic par l’interface sélectionnée.
3. Il active le transfert IPv4 et configure les règles NAT et FORWARD de `iptables`.
4. Il permet à AGX, dont l’adresse interne par défaut est `10.10.99.98`, d’accéder au réseau amont par LPMU à l’adresse `10.10.99.99`.
5. Il ajoute des règles de redirection de ports pour les services hébergés sur AGX.

Le projet comprend aussi un service facultatif de surveillance intelligente des routes. Lorsqu’il est activé, il vérifie la voie amont toutes les 30 secondes, tente de basculer en cas de perte de connectivité et revient à l’interface préférée dès qu’elle est rétablie.

### Lancer la configuration depuis TianshanOS

1. Vérifiez que C3 est raccordé au commutateur ou au routeur par l’adaptateur Ethernet USB-C vers RJ45.
2. Vérifiez que la destination du port USB supérieur est `LPMU` sur la page d’accueil de TianshanOS.
3. Ouvrez « Network » dans la navigation supérieure de TianshanOS.
4. Repérez « Upstream Network Access ».
5. Sélectionnez « Access via LPMU ».
6. Attendez que l’état passe de « Processing » à « Success » ou « Failed ». Ne relancez pas l’opération pendant le traitement.

« Success » signifie que le script a trouvé une voie amont utilisable, configuré la route de LPMU et exécuté la configuration du transfert interne et de NAT. Vérifiez ensuite la connectivité IP et la résolution DNS d’AGX ; l’état du bouton ne suffit pas à prouver la connectivité.

### Vérifier la connexion

Vérifiez d’abord que TianshanOS indique « Success ». Si vous disposez d’un accès au terminal d’AGX, exécutez ces contrôles sur AGX :

```bash
ping -c 3 10.10.99.99  # Vérifier la liaison entre AGX et LPMU
ping -c 3 8.8.8.8       # Vérifier l’accès à une IP sur internet
ping -c 3 google.com    # Vérifier la résolution DNS
```

Ces tests distinguent la liaison interne, le transfert vers internet et DNS. Si le premier échoue, vérifiez la liaison interne et l’adressage. Si le premier réussit mais que le deuxième échoue, vérifiez la connexion amont de LPMU, la route par défaut et NAT. Si seul le troisième échoue, vérifiez DNS.

### Redirection de ports et périmètre de sécurité

Le projet actuel configure les redirections suivantes sur l’interface amont de LPMU :

| Entrée LPMU | Destination | Usage |
| --- | --- | --- |
| TCP `58022` | AGX TCP `22` | Accéder au service SSH d’AGX par LPMU |
| TCP/UDP `58000–58999` | Les mêmes ports sur AGX | Accéder aux services applicatifs exécutés sur AGX |

Pour SSH, le client se connecte à l’adresse amont de LPMU, mais le nom d’utilisateur et les éléments d’authentification sont ceux d’AGX :

```bash
ssh -p 58022 <AGX_USERNAME>@<LPMU_IP>
```

> La redirection de ports rend les services d’AGX plus accessibles depuis le réseau amont. Ne l’activez que sur un réseau local de confiance et limitez les adresses sources avec le commutateur, le routeur ou le pare-feu amont. N’exposez pas directement ces ports sur internet.

### Risques et dépannage

> « Access via LPMU » supprime les anciennes routes par défaut de LPMU, vide la table NAT et la chaîne FORWARD de `iptables`, définit DROP comme politique FORWARD par défaut, puis écrit les règles de routage, de NAT et de redirection de ports de RM-01. Cela peut interrompre immédiatement les sessions distantes et écraser une configuration réseau ou de pare-feu personnalisée. Si LPMU a été personnalisé, exportez d’abord les routes et règles actuelles et assurez-vous de disposer d’une voie de récupération locale.

En cas d’échec, vérifiez les points suivants dans l’ordre :

1. L’adaptateur USB-C vers RJ45 et le câble Ethernet raccordés à C3 sont bien branchés.
2. Le port du commutateur ou du routeur est activé.
3. La page d’accueil de TianshanOS affiche `LPMU` comme destination actuelle du port USB supérieur.
4. Le réseau amont fournit à LPMU une adresse, une passerelle et une configuration DNS valides.
5. Consultez l’erreur et la sortie affichées dans « Upstream Network Access ».
6. Vérifiez qu’AGX peut toujours joindre l’adresse interne de LPMU, `10.10.99.99`.
7. Recherchez des règles LPMU personnalisées en conflit avec la route par défaut, NAT, la chaîne FORWARD ou les redirections de ports.
