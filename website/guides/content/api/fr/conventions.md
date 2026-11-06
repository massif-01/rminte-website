# Règles communes des appels

## Chemins et méthodes

Les URL des API de gestion suivent la forme `http://10.10.99.97/api/v1/...`. Les points du nom logique deviennent des séparateurs de chemin : fan.status correspond à /api/v1/fan/status. Respectez la casse, notamment dans key.exportPrivate et log.setLevel.

Utilisez uniquement les méthodes indiquées pour chaque API. Les lectures acceptent généralement GET/POST et les écritures POST/PUT/DELETE, mais certaines API n’acceptent que POST. Ce guide emploie surtout GET pour les requêtes simples et POST pour les actions. Une méthode non autorisée renvoie HTTP405.

L’action dépend du nom de l’interface et de ses paramètres. Ne supposez pas que DELETE supprime toujours un objet ou que POST en crée toujours un.

## Sessions et rôles

Les requêtes protégées transmettent `Authorization: Bearer <token>`. Ne placez pas les tokens dans les URL. Un rôle ou un session_id fourni dans le corps JSON d’une requête ordinaire ne permet pas d’établir cette identité.

| Niveau d’accès | Signification |
| --- | --- |
| Public | Accessible sans connexion ; les conditions propres à la ressource restent applicables |
| READ | Droit de lecture au minimum ; les sessions admin/root autorisées remplissent généralement cette condition |
| ADMIN | Opérations courantes sur l’appareil ; nécessite admin ou root |
| ROOT | Exécution de commandes brutes, modification des définitions d’automatisation et certaines opérations de gestion des comptes ; nécessite root |
| Token dans le corps | Les API d’authentification vérifient le champ JSON token ; cela n’autorise pas une modification anonyme des comptes |

Les comptes par défaut sont admin/root et leur mot de passe initial est rm01. La politique distingue READ/WRITE/ADMIN/ROOT, mais cela ne signifie pas qu’une API permet de créer librement des comptes à chaque niveau. Dans cette version, aucune interface enregistrée n’exige WRITE comme niveau minimal.

Certaines ressources ou certains paramètres imposent des contrôles supplémentaires. La lecture de fichiers ordinaires peut être accessible avec READ ; les chemins sensibles nécessitent ADMIN. config.get expose uniquement la préférence de langue sans authentification ; les autres clés nécessitent ADMIN. La lecture complète des hôtes et commandes SSH, des règles et des actions nécessite généralement ADMIN ; les secrets de automation.sources.list nécessitent toujours ROOT. temp.bind accepte ADMIN pour une consultation, mais exige ROOT pour modifier une liaison. automation.proxy.fetch applique les droits de l’API cible pour un appel local et exige ROOT pour un service externe. restricted:true indique que des champs ont été filtrés ; n’enregistrez jamais ces champs absents comme des valeurs vides.

## Paramètres

Utilisez Content-Type: application/json et un objet JSON dans le corps. Les tableaux doivent être placés dans des champs de cet objet. Évitez les clés en double et les noms de paramètres présents à la fois dans l’URL et dans le corps ; les conflits sont rejetés.

Les paramètres de l’URL sont décodés une seule fois et peuvent être interprétés comme des entiers ou des booléens. Préférez JSON pour les objets, tableaux, nombres à virgule flottante, null et identifiants dont les zéros initiaux doivent être conservés. N’encodez pas deux fois les valeurs de l’URL.

Un paramètre facultatif peut être omis ; null n’équivaut généralement pas à une omission. Certaines API de liaison utilisent explicitement null pour supprimer une liaison. Les unités de temps dépendent du champ : millisecondes, secondes ou temps Unix.

## Déterminer le résultat

Réponse de réussite habituelle :

```json
{"code":0,"data":{"example":"value"}}
```

Une erreur de traitement peut aussi être renvoyée avec HTTP200 :

```json
{"code":1,"error":"invalid_request"}
```

Les explications peuvent figurer dans error ou message. data peut être un objet, un tableau ou être absent. Une réponse réussie ne contient pas nécessairement message.

1. Traitez tout statut HTTP non réussi comme une erreur de transport, d’autorisation, de format ou de service.
2. Si code est présent et différent de zéro, traitez l’erreur de l’opération.
3. Vérifiez les champs valid, success, exit_code, persisted ou l’état de l’opération propres à l’interface. Une réussite au premier niveau ne remplace pas ces contrôles.
4. Pour un traitement asynchrone, suivez la procédure de confirmation propre à l’API et conservez les informations de suivi renvoyées. Après une déconnexion ou result_unknown, vérifiez l’état avant de réessayer.

La connexion, la déconnexion, les envois binaires et les téléchargements ont des formats spécifiques. Le corps d’un téléchargement réussi contient les octets du fichier, et non du JSON.

## Codes d’erreur

| code | Nom | Action conseillée |
| --- | --- | --- |
| 0 | OK | Vérifiez les conditions de fin de l’interface |
| 1 | INVALID_ARG | Vérifiez les champs, types, plages et conditions de version |
| 2 | NOT_FOUND | Actualisez les informations de l’objet ou de l’opération ; n’inventez pas d’identifiant et ne réutilisez pas un identifiant périmé |
| 3 | NO_PERMISSION | Vérifiez le rôle, les ressources sensibles et les conditions d’exportation |
| 4 | BUSY | Vérifiez les opérations en cours et attendez avant de réessayer |
| 5 | TIMEOUT | Déterminez si un résultat existe avant de répéter une écriture |
| 6 | NO_MEM | Réduisez la taille de la requête ou la charge ; conservez les résultats connus |
| 7 | INTERNAL | Conservez la raison et vérifiez l’état en cas de result_unknown |
| 8 | NOT_SUPPORTED | Utilisez une interface prise en charge |
| 9 | HARDWARE | Vérifiez l’appareil, le capteur et la configuration |
| 10 | CONNECTION | Vérifiez le réseau, l’hôte distant, l’empreinte et le service |
| 11 | AUTH | Renouvelez l’authentification ou effectuez la vérification demandée |

Les procédures de confiance SSH utilisent aussi 1001/1002 pour les empreintes inconnues ou modifiées et fournissent les détails de l’empreinte. Vérifiez l’identité par un canal de confiance avant de confirmer ; supprimer un enregistrement de confiance ne vérifie pas l’identité.

## Application et enregistrement

applied indique que le réglage a été appliqué ; persisted ou saved indiquent qu’il a été enregistré. Ces résultats peuvent différer. Une erreur peut survenir après qu’une étape précédente a pris effet : conservez ses détails et relisez l’état actuel.

Les bascules, déclenchements de règles, exécutions distantes et mises à jour ne peuvent pas être considérés comme sûrs à répéter. Vous pouvez réessayer les lectures en contrôlant la charge. Après l’expiration du délai d’une écriture, consultez d’abord l’état ou les informations de suivi.

## Limites

Le nombre de connexions, la taille des corps, les délais de réception et les emplacements de tâches sont limités. Les contrôles d’identité et de taille peuvent rejeter une requête avant réception complète du corps. Ne remplacez pas les abonnements actifs par un grand nombre de consultations simultanées.

Cette version autorise jusqu’à 1 MiB pour la route JSON générique, avec un délai de réception de 30 secondes. Les requêtes d’authentification sont limitées à 16 KiB et 10 secondes. Les paquets de configuration sont limités à 64 KiB. Chaque API peut imposer des limites plus strictes. Consultez [Transferts](transfers.md) pour les routes binaires.

La profondeur d’imbrication JSON est limitée à 32. Les caractères NUL intégrés, le contenu parasite après le JSON et les clés en double sont rejetés. Pour HTTP413, réduisez la requête ou utilisez la route d’envoi prévue pour cette fonction.
