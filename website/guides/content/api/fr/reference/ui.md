# API : Disposition du tableau de surveillance

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [ui.widgets.get](#uiwidgetsget) | Lire la configuration des widgets de données |
| [ui.widgets.set](#uiwidgetsset) | Enregistrer la configuration des widgets de données |

<a id="uiwidgetsget"></a>

## ui.widgets.get

Lire la configuration des widgets de données

**Méthodes**: GET / POST
**Voie**: `/api/v1/ui/widgets/get`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.widgets/refresh_interval/source ; la disposition est enregistrée dans la configuration de l’appareil.

<a id="uiwidgetsset"></a>

## ui.widgets.set

Enregistrer la configuration des widgets de données

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/ui/widgets/set`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `widgets` | array | Obligatoire | Tableau de configuration des widgets ; consultez le modèle des widgets. | Aucune valeur par défaut |
| `refresh_interval` | integer | Facultatif | Intervalle d’actualisation en millisecondes. | 5000 |

Consultez le [modèle de données commun](../configuration-models.md#monitoring-widgets).

### Exemple de requête

```json
{
  "widgets": [],
  "refresh_interval": 5000
}
```

### Réponse et confirmation de fin

data.nvs_saved. Relisez la disposition avec ui.widgets.get.

### Notes d'utilisation

La configuration sérialisée est limitée à 4000 octets.
