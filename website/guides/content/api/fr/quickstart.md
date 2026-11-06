# Démarrage rapide

Connectez-vous à l’appareil, ouvrez une session et lisez une mesure protégée. Cette procédure consulte uniquement l’état de l’appareil, à l’exception de l’ouverture et de la fermeture de la session.

## Définir l'adresse du périphérique

Utilisez l’adresse IP actuelle de l’appareil. L’interface Web et les API de gestion utilisent HTTP sur le port 80 par défaut ; il n’est donc généralement pas nécessaire de préciser le port. Le préfixe des API est `/api/v1`. Remplacez l’adresse de l’exemple par celle de votre appareil :

```sh
export TS_BASE='http://10.10.99.97'
```

Pour les problèmes de connexion, vérifiez l'adresse IP, le réseau et l'état du service. Voir [Dépannage](troubleshooting.md#cannot-connect).

## Lire les informations du contrôleur

```sh
curl --connect-timeout 5 --max-time 15 \
  "$TS_BASE/api/v1/system/info"
```

Extrait de réponse fourni à titre d’exemple :

```json
{"code":0,"data":{"app":{"name":"TianShanOS","version":"0.6.4","compile_date":"Nov 5 2026","compile_time":"10:00:00"},"chip":{"model":"ESP32-S3","cores":2},"uptime_ms":123456}}
```

Vérifiez le statut HTTP, puis la valeur de code. La version figure dans data.app.version ; uptime_ms est exprimé en millisecondes. Ne supposez pas qu’un champ data.version existe au premier niveau.

## Connectez-vous et conservez la session

Les comptes par défaut sont `admin` et `root`, avec le mot de passe initial `rm01` pour les deux. Connectez-vous et utilisez les API autorisées pour ce compte. Si vous avez changé le mot de passe, utilisez le mot de passe actuel.

Exécutez `umask 077` avant de créer login.json afin de restreindre l’accès au fichier. Cet exemple utilise le compte admin par défaut :

```json
{"username":"admin","password":"rm01"}
```

```sh
umask 077
curl --connect-timeout 5 --max-time 15 \
  -H 'Content-Type: application/json' --data-binary @login.json \
  "$TS_BASE/api/v1/auth/login" > login-response.json
export TS_TOKEN="$(python3 -c 'import json; r=json.load(open("login-response.json")); assert r["code"] == 0; print(r["data"]["token"])')"
```

En cas de réussite, data contient token, session_id, username, level, expires_in (en secondes) et password_changed. Utilisez token pour vous authentifier ; session_id sert uniquement d’identifiant de session.

Utilisez le token reçu pour les appels suivants. Les accès dépendent de data.level et des autorisations de chaque point d’accès. Vous pouvez changer le mot de passe avec auth.change_password ; cette opération de gestion du compte est facultative.

Traitez les fichiers contenant des mots de passe, les réponses de connexion et les tokens comme des données d’authentification. Supprimez les fichiers temporaires après utilisation.

## Lire une température nécessitant une authentification

```sh
curl --connect-timeout 5 --max-time 15 \
  -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/temp/read"
```

Extrait fourni à titre d’exemple :

```json
{"code":0,"data":{"temperature_c":42.5,"temperature_01c":425,"source":"variable","timestamp_ms":120000,"valid":true}}
```

temperature_c est exprimé en degrés Celsius et temperature_01c en dixièmes de degré. N’utilisez la mesure que si valid:true. Votre système de surveillance ne doit pas convertir une donnée absente ou invalide en une température de 0 degré.

## Se déconnecter

```sh
curl --connect-timeout 5 --max-time 15 \
  -X POST -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/auth/logout"
unset TS_TOKEN
```

La requête POST de déconnexion renvoie `{"success":true}`, et non la structure habituelle code/data. Les scripts et connexions qui utilisaient cette session doivent disposer à nouveau d’une session valide.

Choisissez ensuite un [scénario](scenarios.md) ou utilisez l’exemple Python en lecture seule fourni avec la documentation modifiable.
