# API : Réseau de l’ordinateur d’applications

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [network.lpmu_access.log](#networklpmu_accesslog) | Lire le journal d’une exécution de configuration réseau de l’ordinateur d’applications |
| [network.lpmu_access.start](#networklpmu_accessstart) | Lancer la configuration de l’accès au réseau amont de l’ordinateur d’applications |
| [network.lpmu_access.status](#networklpmu_accessstatus) | Lire l’état de configuration de l’accès réseau amont de l’ordinateur d’applications |

<a id="networklpmu_accesslog"></a>

## network.lpmu_access.log

Lire le journal d’une exécution de configuration réseau de l’ordinateur d’applications

**Méthodes**: GET / POST
**Voie**: `/api/v1/network/lpmu_access/log`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `run_id` | integer | Obligatoire | Numéro d’exécution actuel, renvoyé par start/status. | Aucune valeur par défaut |
| `offset` | integer | Obligatoire | Décalage en octets non négatif ; commencez par 0. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "run_id": 1,
  "offset": 0
}
```

### Réponse et confirmation de fin

data.run_id/output/next_offset/done. Poursuivez la lecture à next_offset.

### Notes d'utilisation

Au maximum 1024 octets par bloc. Un run_id périmé est rejeté. done indique que la fin actuelle du journal a été lue ; vérifiez aussi l’état de la tâche.

<a id="networklpmu_accessstart"></a>

## network.lpmu_access.start

Lancer la configuration de l’accès au réseau amont de l’ordinateur d’applications

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/network/lpmu_access/start`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `sudo_password` | string | Facultatif | Mot de passe sudo distant, utilisé uniquement pour cette exécution. | Vide |

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.run_id/running/stage. Continuez à consulter l’état et le journal.

### Notes d'utilisation

Cible fixe 10.10.99.99:22 ; nécessite un hôte et une clé enregistrés, une seule tâche à la fois. Modifie le réseau distant.

<a id="networklpmu_accessstatus"></a>

## network.lpmu_access.status

Lire l’état de configuration de l’accès réseau amont de l’ordinateur d’applications

**Méthodes**: GET / POST
**Voie**: `/api/v1/network/lpmu_access/status`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `diagnostics` | boolean | Facultatif | Inclure les diagnostics supplémentaires de durée et de ressources. | false |

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.run_id/running/stage, octets transférés, exit_code/reason/failure_stage, internet_confirmed/configuration_complete, output_tail/output_truncated. Les diagnostics ne sont inclus que sur demande.

### Notes d'utilisation

La fin de l’opération doit être confirmée par l’étape finale ou le script. La mise en file d’attente ou le seul code de sortie 0 du script ne prouve pas que le réseau est configuré.
