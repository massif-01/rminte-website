# Index complet des API

Cet index comprend les 277 noms enregistrés. Sélectionnez un nom pour accéder à l’entrée correspondante. Chaque entrée indique les méthodes autorisées, les droits minimaux, les paramètres et les vérifications permettant de confirmer la fin de l’opération.

Envoyez les exemples de requête de la référence au format JSON par POST. Enregistrez un exemple dans request.json, remplacez les valeurs fictives et utilisez le chemin indiqué. Les appels publics peuvent omettre Authorization.

```sh
curl --connect-timeout 5 --max-time 60 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' --data-binary @request.json \
  "$TS_BASE/api/v1/PATH_FROM_REFERENCE"
```

Les opérations d’écriture ont des effets réels. Obtenez d’abord les versions, identifiants d’objets, certificats ou fichiers de publication nécessaires. Utilisez GET uniquement pour les API qui l’autorisent explicitement ; pour les paramètres complexes, envoyez du JSON par POST.

## Rechercher par nom

Les droits indiqués correspondent au niveau minimal requis pour appeler chaque API. Les conditions liées aux ressources, aux sessions et aux fonctions restent applicables. Les API toujours enregistrées mais non prises en charge sont signalées dans la référence.
