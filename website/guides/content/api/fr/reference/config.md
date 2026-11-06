# API : Configuration

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [config.delete](#configdelete) | Supprimer une valeur de configuration |
| [config.get](#configget) | Obtenez la valeur de configuration |
| [config.list](#configlist) | Lister les clés de configuration |
| [config.module.list](#configmodulelist) | Lister tous les modules de configuration |
| [config.module.reset](#configmodulereset) | Réinitialiser la configuration du module |
| [config.module.save](#configmodulesave) | Enregistrer la configuration du module dans NVS |
| [config.module.set](#configmoduleset) | Définir la configuration du module |
| [config.module.show](#configmoduleshow) | Afficher la configuration du module |
| [config.save](#configsave) | Enregistrer la configuration dans le stockage |
| [config.set](#configset) | Définir la valeur de configuration |

<a id="configdelete"></a>

## config.delete

Supprimer une valeur de configuration

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/config/delete`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `key` | string | Obligatoire | Nom complet de la clé de configuration. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "key": "example.setting"
}
```

### Réponse et confirmation de fin

data.key/deleted.

<a id="configget"></a>

## config.get

Obtenez la valeur de configuration

**Méthodes**: GET / POST
**Voie**: `/api/v1/config/get`
**Accès minimum**: Public

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `key` | string | Obligatoire | Nom complet de la clé de configuration. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "key": "system.language"
}
```

### Réponse et confirmation de fin

data.key/type/value. Seule la consultation de key=system.language est accessible sans authentification ; les autres clés nécessitent ADMIN.

<a id="configlist"></a>

## config.list

Lister les clés de configuration

**Méthodes**: GET / POST
**Voie**: `/api/v1/config/list`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.items/file_keys/nvs_keys/total_keys, selon la configuration enregistrée.

<a id="configmodulelist"></a>

## config.module.list

Lister tous les modules de configuration

**Méthodes**: GET / POST
**Voie**: `/api/v1/config/module/list`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.modules avec name/version/dirty/nvs_namespace/registered ; des informations de séquence globale peuvent aussi apparaître.

<a id="configmodulereset"></a>

## config.module.reset

Réinitialiser la configuration du module

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/config/module/reset`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `module` | string | Obligatoire | net/dhcp/wifi/nat/led/fan/device/system ; consultez chaque opération pour connaître les fonctions prises en charge. | Aucune valeur par défaut |
| `persist` | boolean | Facultatif | Enregistrer durablement le résultat de la réinitialisation. | false |

### Exemple de requête

```json
{
  "module": "system",
  "persist": false
}
```

### Réponse et confirmation de fin

data.module/reset/persisted.

### Notes d'utilisation

Remplace le module sélectionné. Lisez et conservez d’abord les réglages nécessaires.

<a id="configmodulesave"></a>

## config.module.save

Enregistrer la configuration du module dans NVS

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/config/module/save`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `module` | string | Obligatoire | net/dhcp/wifi/nat/led/fan/device/system ; consultez chaque opération pour connaître les fonctions prises en charge. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "module": "all"
}
```

### Réponse et confirmation de fin

Résultat d’un module, ou all avec results/success_count/fail_count. Vérifiez chaque success/error.

<a id="configmoduleset"></a>

## config.module.set

Définir la configuration du module

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/config/module/set`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `module` | string | Obligatoire | net/dhcp/wifi/nat/led/fan/device/system ; consultez chaque opération pour connaître les fonctions prises en charge. | Aucune valeur par défaut |
| `key` | string | Obligatoire | Nom complet de la clé de configuration. | Aucune valeur par défaut |
| `value` | boolean / number / string | Obligatoire | Valeur correspondant au type du champ du module. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../configuration-models.md#module-configuration).

### Exemple de requête

```json
{
  "module": "system",
  "key": "timezone",
  "value": "CST-8"
}
```

### Réponse et confirmation de fin

data.module/key/success/dirty. Enregistrez durablement avec config.module.save.

<a id="configmoduleshow"></a>

## config.module.show

Afficher la configuration du module

**Méthodes**: GET / POST
**Voie**: `/api/v1/config/module/show`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `module` | string | Obligatoire | net/dhcp/wifi/nat/led/fan/device/system ; consultez chaque opération pour connaître les fonctions prises en charge. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../configuration-models.md#module-configuration).

### Exemple de requête

```json
{
  "module": "wifi"
}
```

### Réponse et confirmation de fin

Un module : data.module/config/dirty. all peut renvoyer les modules regroupés. Les vues des rôles inférieurs à ADMIN omettent les mots de passe.

<a id="configsave"></a>

## config.save

Enregistrer la configuration dans le stockage

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/config/save`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.saved. Après un échec, conservez et consultez l’état ; ne supposez pas que tout a été enregistré.

<a id="configset"></a>

## config.set

Définir la valeur de configuration

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/config/set`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `key` | string | Obligatoire | Nom complet de la clé de configuration. | Aucune valeur par défaut |
| `value` | boolean / number / string | Obligatoire | Valeur de configuration; pas d'objet ou de tableau. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "key": "system.language",
  "value": "zh-CN"
}
```

### Réponse et confirmation de fin

data.key/success. Utilisez séparément config.save pour enregistrer durablement le réglage.
