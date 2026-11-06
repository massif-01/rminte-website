# Modèles de configuration

Ces modèles enregistrent les hôtes, commandes, sources, actions et règles utilisables à l’exécution. Enregistrez un exemple désactivé et relisez-le avant d’activer ses effets.

## Lire la version avant d'écrire

Avec root, consultez automation.config.status et conservez active_version. Placez cette valeur au premier niveau de chaque requête d’écriture. Après une écriture réussie, utilisez la nouvelle version pour la requête suivante. Pour modifier une règle, transmettez aussi sa révision lue dans expected_revision. En cas de conflit, relisez les données et fusionnez les modifications ; ne remplacez pas seulement le numéro de version pour renvoyer des données périmées.

Les objets JSON ci-dessous montrent des structures complètes de requête. Remplacez CURRENT_VERSION, identifiants, adresses, clés et noms de variables. Placez les champs du modèle au premier niveau de la requête ; n’ajoutez pas d’objet englobant config, sauf pour les sous-objets explicitement présentés.

restricted:true peut indiquer une vue limitée aux métadonnées. Utilisez ADMIN pour lire les définitions complètes des hôtes et commandes SSH, des règles et des actions ; les secrets de automation.sources.list nécessitent toujours ROOT. L’écriture des définitions dépend du rôle requis par chaque point d’entrée. Un champ secret omis n’est pas une valeur vide. Les mises à jour des hôtes et des sources fusionnent avec le JSON existant ; celles des commandes et des actions doivent fournir les définitions complètes. Les règles ont leurs propres contrôles de fusion et de révision : ne généralisez pas le comportement d’une famille à toutes les autres.

## Hôtes SSH

Pour ssh.hosts.add/update. Enregistre la destination, les paramètres de connexion et la clé à utiliser ; hosts.* stocke les empreintes.

```json
{"id":"example-host","active_version":"CURRENT_VERSION","host":"192.0.2.20","port":22,"username":"YOUR_USER","auth_type":"key","keyid":"example-key","enabled":true}
```

| Champ | Type, limite et signification |
| --- | --- |
| id | Chaîne stable, 31 octets au maximum ; l’identifiant doit être inutilisé pour un ajout et déjà exister pour une modification |
| host | Chaîne représentant l’adresse, 63 octets au maximum |
| port | Port SSH entier, généralement 22 ; utilisez une valeur de 1 à 65535 |
| username | Utilisateur distant, 31 octets au maximum ; distinct de la connexion à l’appareil |
| auth_type | key/password ; key est recommandé pour les définitions persistantes |
| keyid | Identifiant d’une clé privée SSH locale enregistrée, 31 octets au maximum |
| enabled | Booléen, true par défaut au décodage |
| created_time | Valeur temporelle facultative, entier non signé de 32 bits ; conservez normalement la valeur existante |

Le modèle persistant ne stocke pas de champ password. Le mode password ne signifie pas qu’un mot de passe distant est enregistré ; les appels immédiats fournissent leurs propres identifiants. Au maximum 16 hôtes. L’adresse, l’existence de la clé et la confiance distante sont vérifiées séparément.

## Commandes SSH

Pour ssh.commands.add/update. Enregistrer une commande ne l’exécute pas. Utilisez service_mode:false pour une commande courte ; les services persistants gérés utilisent true et ssh.services.start.

```json
{"id":"example-command","active_version":"CURRENT_VERSION","host_id":"example-host","name":"Read OS","command":"uname -a","timeout_sec":30,"enabled":true,"service_mode":false}
```

| Champ | Type, limite et signification |
| --- | --- |
| id / host_id | Chaînes de 31 octets au maximum chacune ; host_id référence un hôte enregistré |
| name / command | Chaînes de 63 et 1023 octets au maximum |
| desc / icon | Chaînes facultatives, de 127 et 63 octets au maximum ; icon peut être une icône d’affichage ou un chemin |
| expect_pattern / fail_pattern / extract_pattern | Motifs facultatifs de correspondance et d’extraction, 127 octets au maximum chacun |
| var_name | Préfixe facultatif de la variable de résultat, 31 octets au maximum |
| timeout_sec | De 0 à 65535 secondes, 30 par défaut ; l’unité n’est pas la milliseconde |
| stop_on_match / nohup / enabled / service_mode | Booléens ; enabled vaut true par défaut, les autres false |
| ready_pattern / service_fail_pattern | Motifs indiquant la disponibilité ou l’échec du service, 127 octets au maximum chacun |
| ready_timeout_sec / ready_check_interval_ms | Entiers de 0 à 65535, respectivement en secondes et millisecondes ; choisissez des valeurs adaptées aux services |
| created_time | Valeur temporelle facultative, entier non signé de 32 bits |

Les alias sont timeout, expectPattern, failPattern, extractPattern, varName, stopOnMatch, serviceMode, readyPattern, serviceFailPattern, readyTimeout et readyInterval. Préférez les noms du tableau et ne fournissez pas les deux formes simultanément. _object_id/runtime_instance représentent l’identité persistante et l’identité d’exécution ; conservez les valeurs reçues sans les inventer. Au maximum 64 commandes.

## Sources de données

Pour automation.sources.add/update. Les sources acquièrent des données et les associent aux variables utilisées par les règles.

```json
{"id":"example-source","active_version":"CURRENT_VERSION","label":"Temperature","type":"rest","enabled":false,"poll_interval_ms":5000,"auto_discover":false,"rest_url":"https://example.com/status","rest_method":"GET","mappings":[{"path":"temperature","var":"compute.temperature"}]}
```

| Champ partagé | Type et signification |
| --- | --- |
| id / label | Chaînes de 63 et 47 octets au maximum |
| type | Chaînes builtin/websocket/socketio/rest/variable, ou entiers correspondants de 0 à 4 |
| enabled / auto_discover | Booléens ; auto_discover vaut true par défaut ; l’exemple le désactive explicitement |
| poll_interval_ms | Entier de 0 à 4294967295 millisecondes ; le comportement dépend du type ; zéro ne signifie pas un échantillonnage illimité |
| mappings | Au maximum 4 correspondances : path jusqu’à 95 octets, var jusqu’à 63 octets et transform facultatif jusqu’à 63 octets |

path/var des correspondances acceptent aussi les alias json_path/var_name. Le chemin désigne un champ de data, comme temperature ou cpu.cores[0].freq ; ce n’est pas une URL. Vérifiez les transformations avec des valeurs de test connues.

| Type | Champs spécifiques au type |
| --- | --- |
| websocket | ws_uri jusqu’à 95 octets ; ancien chemin mono-champ ws_path jusqu’à 63 octets ; reconnect_ms de 0 à 65535 ms |
| socketio | sio_url jusqu’à 95 octets ; sio_event jusqu’à 63 octets |
| rest | rest_url jusqu’à 95 octets ; rest_method jusqu’à 7 ; rest_auth jusqu’à 47 ; ancien chemin rest_path jusqu’à 63 octets |
| variable | var_name, var_prefix, var_watch_all ; les flux SSH utilisent aussi ssh_host_id, ssh_command, expect_pattern, fail_pattern, extract_pattern, timeout_sec |
| builtin | Objet builtin : type sélectionne une source intégrée ; GPIO utilise pin, ADC utilise channel/atten et l’état des ordinateurs peut utiliser device_index |

Les entrées dont le type est une chaîne acceptent aussi les alias suivants : uri/json_path pour WebSocket ; url/event pour Socket.IO ; url/method/auth_header/json_path pour REST. Préférez les champs canoniques ci-dessus. Les chaînes des sources variables sont généralement limitées à 63 octets, ssh_command à 95 et timeout_sec à 0–65535 secondes. Pour les identifiants numériques de type ou canal du matériel intégré, partez des définitions existantes sans deviner les broches ou canaux.

## Variables utilisateur

automation.variables.set écrit ; get/list lisent. Outre value, vérifiez name, source, readonly et age.

```json
{"name":"example.temperature","value":42.5,"active_version":"CURRENT_VERSION"}
```

value accepte null, un booléen, un nombre fini ou une chaîne de 63 octets au maximum. En général, omettez value_type pour laisser le système déduire le type. Les types explicites sont 0=null, 1=bool, 2=int, 3=float et 4=string ; ils doivent correspondre à la valeur. Les entiers utilisent la plage des entiers signés sur 32 bits ; les autres valeurs numériques finies utilisent la virgule flottante.

source_id vaut user par défaut. create_only:true conserve une variable existante ; il ne confirme donc pas que la nouvelle valeur demandée a été écrite. Les variables en lecture seule ou issues d’une source système peuvent refuser les modifications. La liaison de température nécessite des variables numériques de température adaptées ; les chaînes, les valeurs invalides et les données périmées ne constituent pas des mesures normales de capteur.

## Modèles d'action

automation.actions.add/update enregistre des actions réutilisables. Cet exemple écrit un message dans le journal sans commander le matériel.

```json
{"id":"example-action","active_version":"CURRENT_VERSION","name":"Record a message","enabled":true,"type":"log","async":false,"delay_ms":0,"log":{"level":3,"message":"Example action"}}
```

Champs communs : id jusqu’à 63 octets, name 47 et description 63 ; enabled vaut true par défaut et async false ; delay_ms de 0 à 65535 millisecondes. created_at est un entier temporel non négatif facultatif, généralement conservé depuis l’objet existant.

| type | Sous-objet et champs spécifiques au type |
| --- | --- |
| log | log: level, message jusqu’à 47 octets |
| set_var | set_var: variable, value et value_type facultatif |
| ssh_cmd | ssh: host_ref, command, timeout_ms, async |
| ssh_cmd_ref | ssh_ref: cmd_id référençant une commande enregistrée |
| gpio | gpio: pin, level de type **boolean**, pulse_ms |
| device_ctrl | device: device, action utilisant les actions prises en charge |
| cli | cli: command, var_name, timeout_ms |
| webhook | webhook: url, method, body_template |
| led | led: device, ctrl_type et champs de la fonction d’affichage correspondante |

Les références d’hôtes, noms de variables, références de commandes et noms de périphériques ou d’actions sont généralement limités à 63 octets. Les commandes SSH/CLI intégrées et l’URL webhook sont limitées à 95 octets, method à 7 et body_template à 63. Les champs trop longs sont rejetés ; ne comptez pas sur une troncature. Une commande intégrée à une action a une capacité inférieure à celle d’une commande ssh.commands enregistrée.

### Champs d'action LED

led.ctrl_type accepte fill/effect/brightness/off/text/image/qrcode/filter/filter_stop/text_stop. Fournissez les champs de la fonction choisie, et non tous les paramètres d’une API LED directe.

Champs d’affichage communs : device, index (255=all), color sous forme de chaîne ou r/g/b, brightness de 0 à 255, effect, speed, duration_ms de 0 à 65535. Pour la matrice : text jusqu’à 127 octets, font 31, image_path 127, qr_text 255, qr_ecc comme chaîne L/M/Q/H, filter 31, filter_params, center, loop, scroll, align, x/y et auto_pos pour placer le texte. scroll vaut none/left/right/up/down ; align vaut left/center/right ; x/y sont des coordonnées signées de 16 bits.

La couleur du QR utilise qr_fg et l’image d’arrière-plan qr_bg_image. Le noir explicite est une couleur choisie, et non une valeur absente. filter_params contient les options numériques nommées prises en charge par l’effet. L’exécution exige aussi un matériel compatible et des chemins et réglages valides. Enregistrez et relisez la configuration avant de tester volontairement un effet.

## Règles d'automatisation

automation.rules.add/update enregistre des conditions et des actions. Une règle activée peut s’exécuter automatiquement ; commencez avec enabled:false.

```json
{"id":"example-rule","active_version":"CURRENT_VERSION","name":"Temperature example","enabled":false,"logic":"and","cooldown_ms":10000,"conditions":[{"variable":"example.temperature","operator":"gt","value":50}],"actions":[{"type":"log","level":3,"message":"Temperature high"}]}
```

| Champ | Type et signification |
| --- | --- |
| id / name / icon | Chaînes de 63, 47 et 63 octets au maximum ; l’identifiant refuse les séparateurs et caractères de contrôle |
| enabled | Booléen, true par défaut ; l’exemple le désactive explicitement |
| manual_trigger / show_on_dashboard / allow_manual_trigger | Booléens liés au déclenchement et à l’affichage, et non aux droits de l’appelant |
| cooldown_ms | Entier non signé de 32 bits, en millisecondes |
| revision | Révision de la règle ; utilisez la révision lue comme expected_revision pour les conditions de mise à jour |
| logic / conditions | and/or, and par défaut ; au maximum 255 conditions |
| actions | Au maximum 255 éléments ; une règle activée ne peut pas être dépourvue d’actions |

Une condition a la forme {variable, operator, value} ; les opérateurs sont eq/ne/lt/le/gt/ge/contains. Les valeurs suivent le modèle des variables. La forme conditions:{logic, items:[...]} est aussi acceptée ; choisissez une seule représentation.

Les actions intégrées aux règles utilisent des **champs à plat** : log contient level/message, SSH host_ref/command et GPIO pin/level. Les modèles utilisent des sous-objets imbriqués. Le type SSH intégré est ssh ; celui d’un modèle est ssh_cmd. Une référence template_id est prioritaire sur les champs intégrés conservés en cache.

Champs communs des actions : delay_ms, async, repeat_mode (once/while_true/count), repeat_count de 0 à 255, repeat_interval_ms de 0 à 65535 et condition facultative selon le modèle des conditions ; null la supprime. Choisissez la répétition en tenant compte des effets de l’action.

| Type d’action à plat | Champs à plat |
| --- | --- |
| log / set_var | level/message ; ou variable/value/value_type |
| ssh / ssh_cmd_ref | host_ref/command/ssh_async/timeout_ms; ou cmd_id |
| gpio / device_ctrl | pin/level booléen/pulse_ms ; ou device/action |
| webhook / cli | url/method/body_template ; ou command/var_name/timeout_ms |
| led | Champs à plat device/ctrl_type/r/g/b, etc. ; ctrl_type utilise une énumération entière, et non les chaînes des modèles |

Préférez une référence à un modèle enregistré pour les règles LED complexes. Valeurs intégrées de ctrl_type : 0 fill, 1 effect, 2 brightness, 3 off, 4 text, 5 image, 6 qrcode, 7 filter, 8 filter_stop, 9 text_stop. qr_ecc intégré est le code entier d’un caractère : L76/M77/Q81/H72.

filter_params reste un objet distinct. Plages de valeurs entières : speed de 1 à 100 ; intensity/density/decay/amplitude de 0 à 255 ; scale de 1 à 100 ; levels de 2 à 16 ; amount/saturation/frequency de 0 à 100 ; angle de 0 à 360 ; width de 1 à 16 ; wavelength de 1 à 32. Ces unités de modèle et d’interface diffèrent de celles de certains filtres LED directs. Ne placez pas une requête API complète dans le tableau actions.

## Configuration du module

config.module.show renvoie l’objet config du module. Lisez les champs existants avant de modifier une clé avec config.module.set. Modules : net/dhcp/wifi/nat/led/fan/device/system. Consultez chaque opération pour connaître les fonctions prises en charge. key désigne une clé propre au module ; conservez le type de sa valeur.

config.module.save et l’état indiquant des modifications non enregistrées sont distincts de la valeur active_version de l’automatisation. Une modification du réseau peut interrompre l’accès ; notez d’abord le moyen d’accès utilisé. Les vues WiFi accessibles aux rôles inférieurs à ADMIN omettent les mots de passe.

## Widgets de surveillance

ui.widgets enregistre la disposition de l’interface au format JSON ; il ne crée aucun collecteur. widgets est un tableau interprété par l’interface et peut être vide au départ. Commencez par ui.widgets.get et conservez les champs et identifiants existants. refresh_interval est exprimé en millisecondes, avec 5000 par défaut. La configuration complète sérialisée est limitée à 4000 octets. nvs_saved ne prouve pas qu’une variable dispose de données.

## Importation, suppression et sélection de source

Commencez par preview, puis appelez apply avec les préconditions renvoyées par l’aperçu. tscfg doit contenir le JSON complet du paquet sous forme de **chaîne de caractères**, et non un objet quelconque. L’importation des hôtes, commandes, sources et actions utilise expected_digest/expected_credential. L’importation des règles possède d’autres champs de confirmation : consultez sa référence.

Prévisualisez l’impact avant de choisir une suppression ordinaire, un remplacement ou une cascade. Supprimer les définitions n’arrête pas automatiquement les processus distants et ne révoque pas les clés distantes. Sélectionner la carte SD ou la sauvegarde interne remplace l’ensemble de la configuration ; utilisez automation.config.preview/apply au lieu d’écraser des fichiers protégés.
