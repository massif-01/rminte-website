# API : LED et matrice

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [led.boot.config](#ledbootconfig) | Obtenir la configuration de démarrage LED |
| [led.brightness](#ledbrightness) | Lire ou modifier la luminosité du périphérique |
| [led.clear](#ledclear) | Éteindre toutes les LED du périphérique |
| [led.color.hsv](#ledcolorhsv) | Convertir HSV en RGB |
| [led.color.parse](#ledcolorparse) | Convertir une chaîne de couleur en RGB |
| [led.color_correction.export](#ledcolor_correctionexport) | Exporter la configuration de la correction de couleur vers la carte SD |
| [led.color_correction.get](#ledcolor_correctionget) | Obtenir la configuration de correction de couleur |
| [led.color_correction.import](#ledcolor_correctionimport) | Importer la configuration de correction de couleur à partir de la carte SD |
| [led.color_correction.reset](#ledcolor_correctionreset) | Réinitialiser la correction de couleur aux valeurs par défaut |
| [led.color_correction.set](#ledcolor_correctionset) | Définir la configuration de correction de couleur |
| [led.effect.list](#ledeffectlist) | Lister les effets disponibles |
| [led.effect.start](#ledeffectstart) | Démarrer un effet sur le périphérique |
| [led.effect.stop](#ledeffectstop) | Arrêter l’effet sur le périphérique |
| [led.fill](#ledfill) | Appliquer une couleur à toutes les LED |
| [led.filter.list](#ledfilterlist) | Lister les filtres de post-traitement disponibles |
| [led.filter.start](#ledfilterstart) | Appliquer un filtre de post-traitement |
| [led.filter.stop](#ledfilterstop) | Arrêter le filtre post-traitement |
| [led.image](#ledimage) | Afficher l'image sur la matrice |
| [led.list](#ledlist) | Lister les périphériques LED |
| [led.qrcode](#ledqrcode) | Générer et afficher le code QR |
| [led.save](#ledsave) | Enregistrer l'état actuel comme configuration de démarrage |
| [led.set](#ledset) | Définir une plage de pixel LED |
| [led.text](#ledtext) | Afficher le texte sur la matrice |
| [led.text.stop](#ledtextstop) | Arrêter la superposition du texte |

<a id="ledbootconfig"></a>

## led.boot.config

Obtenir la configuration de démarrage LED

**Méthodes**: GET / POST
**Voie**: `/api/v1/led/boot/config`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `device` | string | Facultatif | Nom du périphérique LED : touch/board/matrix ; consultez led.list pour connaître les valeurs prises en charge. | Tous les périphériques LED |

### Exemple de requête

```json
{
  "device": "matrix"
}
```

### Réponse et confirmation de fin

Tableau data.boot_config : device/enabled/animation/speed/brightness/filter/filter_speed/image_path/qrcode_text.

<a id="ledbrightness"></a>

## led.brightness

Lire ou modifier la luminosité du périphérique

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/led/brightness`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `device` | string | Facultatif | Nom du périphérique LED : touch/board/matrix ; consultez led.list pour connaître les valeurs prises en charge. | Tous les périphériques LED |
| `brightness` | integer | Facultatif | Luminosité, 0-255. | Consultation uniquement |

### Exemple de requête

```json
{
  "device": "matrix",
  "brightness": 64
}
```

### Réponse et confirmation de fin

data.device/brightness.

<a id="ledclear"></a>

## led.clear

Éteindre toutes les LED du périphérique

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/led/clear`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `device` | string | Facultatif | Nom du périphérique LED : touch/board/matrix ; consultez led.list pour connaître les valeurs prises en charge. | Tous les périphériques LED |
| `off` | boolean | Facultatif | Désactiver la sortie après effacement. | false |

### Exemple de requête

```json
{
  "device": "matrix"
}
```

### Réponse et confirmation de fin

data.device/cleared.

### Notes d'utilisation

Arrête ou remplace l’affichage actuel. L’enregistrement de la configuration de démarrage est une opération distincte.

<a id="ledcolorhsv"></a>

## led.color.hsv

Convertir HSV en RGB

**Méthodes**: GET / POST
**Voie**: `/api/v1/led/color/hsv`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `h` | integer | Obligatoire | Teinte entière, 0-359 degrés. | Aucune valeur par défaut |
| `s` | integer | Obligatoire | Saturation entière, 0-255. | Aucune valeur par défaut |
| `v` | integer | Obligatoire | Valeur ou luminosité entière, de 0 à 255. | Aucune valeur par défaut |

Consultez le [modèle de données commun](../response-models.md#color).

### Exemple de requête

```json
{
  "h": 200,
  "s": 255,
  "v": 255
}
```

### Réponse et confirmation de fin

data.hsv/rgb/hex ; consultez les plages du modèle de couleurs.

<a id="ledcolorparse"></a>

## led.color.parse

Convertir une chaîne de couleur en RGB

**Méthodes**: GET / POST
**Voie**: `/api/v1/led/color/parse`
**Accès minimum**: READ

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `color` | string | Obligatoire | Chaîne de couleur prise en charge, par exemple #00A0FF. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "color": "#00A0FF"
}
```

### Réponse et confirmation de fin

data.input/rgb(r/g/b)/hex/value.

<a id="ledcolor_correctionexport"></a>

## led.color_correction.export

Exporter la configuration de la correction de couleur vers la carte SD

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/led/color_correction/export`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `path` | string | Facultatif | Chemin de destination SD absolu. | /sdcard/config/led_color_correction.json |

### Exemple de requête

```json
{
  "path": "/sdcard/example-color.json"
}
```

### Réponse et confirmation de fin

data.path/success.

<a id="ledcolor_correctionget"></a>

## led.color_correction.get

Obtenir la configuration de correction de couleur

**Méthodes**: GET / POST
**Voie**: `/api/v1/led/color_correction/get`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

Consultez le [modèle de données commun](../response-models.md#color).

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

Configuration de correction des couleurs : enabled/brightness/gamma/saturation/white_point ; consultez le modèle de couleurs.

<a id="ledcolor_correctionimport"></a>

## led.color_correction.import

Importer la configuration de correction de couleur à partir de la carte SD

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/led/color_correction/import`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `path` | string | Obligatoire | Chemin absolu sur l’appareil ; la configuration gérée et les fichiers sensibles sont soumis à des restrictions supplémentaires. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "path": "/sdcard/example-color.json"
}
```

### Réponse et confirmation de fin

data.success.

### Notes d'utilisation

La lecture de fichiers utilise la session actuelle. Les chemins gérés ou sensibles peuvent nécessiter ADMIN.

<a id="ledcolor_correctionreset"></a>

## led.color_correction.reset

Réinitialiser la correction de couleur aux valeurs par défaut

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/led/color_correction/reset`
**Accès minimum**: ADMIN

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.success.

<a id="ledcolor_correctionset"></a>

## led.color_correction.set

Définir la configuration de correction de couleur

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/led/color_correction/set`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | Facultatif | Activer la correction de couleur. | Sans changement |
| `brightness` | object | Facultatif | {enabled:boolean,factor:number} ; factor de 0 à 2. | Sans changement |
| `gamma` | object | Facultatif | {enabled:boolean,gamma:number} ; gamma de 0.1 à 4 ; value est un alias de gamma. | Sans changement |
| `saturation` | object | Facultatif | {enabled:boolean,factor:number} ; factor de 0 à 2. | Sans changement |
| `white_point` | object | Facultatif | Gains RGB du point blanc ; consultez le modèle de couleurs. | Sans changement |

Consultez le [modèle de données commun](../response-models.md#color).

### Exemple de requête

```json
{
  "enabled": true
}
```

### Réponse et confirmation de fin

data.success.

### Notes d'utilisation

Lisez les réglages actuels et ne modifiez que les champs souhaités. La correction est distincte de la luminosité de 0 à 255 propre à chaque périphérique.

<a id="ledeffectlist"></a>

## led.effect.list

Lister les effets disponibles

**Méthodes**: GET / POST
**Voie**: `/api/v1/led/effect/list`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.effects ; led.list indique aussi les fonctions prises en charge par le périphérique.

<a id="ledeffectstart"></a>

## led.effect.start

Démarrer un effet sur le périphérique

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/led/effect/start`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `device` | string | Facultatif | Nom du périphérique LED : touch/board/matrix ; consultez led.list pour connaître les valeurs prises en charge. | Tous les périphériques LED |
| `effect` | string | Obligatoire | Nom de l’effet dans la liste des effets pris en charge. | Aucune valeur par défaut |
| `speed` | integer | Facultatif | Vitesse d'animation, 1-100. | 50 |
| `color` | string / object / integer | Facultatif | Couleur sous forme de chaîne, d’objet {r,g,b} ou d’entier représentant 0xRRGGBB ; composantes de 0 à 255. | Couleur par défaut de l'effet |

### Exemple de requête

```json
{
  "device": "matrix",
  "effect": "rainbow",
  "speed": 50
}
```

### Réponse et confirmation de fin

data.device/effect/speed/started.

### Notes d'utilisation

Vérifiez que l’effet de l’exemple est pris en charge. Un nouvel effet remplace l’effet actuel.

<a id="ledeffectstop"></a>

## led.effect.stop

Arrêter l’effet sur le périphérique

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/led/effect/stop`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `device` | string | Facultatif | Nom du périphérique LED : touch/board/matrix ; consultez led.list pour connaître les valeurs prises en charge. | Tous les périphériques LED |

### Exemple de requête

```json
{
  "device": "matrix"
}
```

### Réponse et confirmation de fin

data.device/stopped.

<a id="ledfill"></a>

## led.fill

Appliquer une couleur à toutes les LED

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/led/fill`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `device` | string | Facultatif | Nom du périphérique LED : touch/board/matrix ; consultez led.list pour connaître les valeurs prises en charge. | Tous les périphériques LED |
| `color` | string / object / integer | Obligatoire | Couleur sous forme de chaîne, d’objet {r,g,b} ou d’entier représentant 0xRRGGBB ; composantes de 0 à 255. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "device": "board",
  "color": "#00A0FF"
}
```

### Réponse et confirmation de fin

data.device/color(r/g/b)/success.

<a id="ledfilterlist"></a>

## led.filter.list

Lister les filtres de post-traitement disponibles

**Méthodes**: GET / POST
**Voie**: `/api/v1/led/filter/list`
**Accès minimum**: READ

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.filters avec name/description.

<a id="ledfilterstart"></a>

## led.filter.start

Appliquer un filtre de post-traitement

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/led/filter/start`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `device` | string | Facultatif | Nom du périphérique LED : touch/board/matrix ; consultez led.list pour connaître les valeurs prises en charge. | Tous les périphériques LED |
| `filter` | string | Obligatoire | Sélectionner parmi led.filter.list. | Aucune valeur par défaut |
| `speed` | integer | Facultatif | Vitesse du filtre. | 50 |
| `intensity` | number | Facultatif | Intensité. | Filtre par défaut |
| `amount` | number | Facultatif | Intensité de l’effet. | Filtre par défaut |
| `scale` | number | Facultatif | Échelle spatiale. | Filtre par défaut |
| `angle` | number | Facultatif | Angle. | Filtre par défaut |
| `frequency` | number | Facultatif | Fréquence. | Filtre par défaut |
| `amplitude` | number | Facultatif | Amplitude. | Filtre par défaut |
| `wavelength` | number | Facultatif | Longueur d'onde. | Filtre par défaut |
| `width` | number | Facultatif | Largeur. | Filtre par défaut |
| `saturation` | number | Facultatif | Saturation. | Filtre par défaut |
| `levels` | number | Facultatif | Nombre de niveaux. | Filtre par défaut |
| `decay` | number | Facultatif | Décidé. | Filtre par défaut |
| `density` | number | Facultatif | Densité. | Filtre par défaut |

### Exemple de requête

```json
{
  "device": "matrix",
  "filter": "YOUR_FILTER",
  "speed": 50
}
```

### Réponse et confirmation de fin

data.device/filter/speed/applied.

### Notes d'utilisation

Chaque option ne concerne que les filtres qui l’utilisent. Configurez le filtre sélectionné sans appliquer systématiquement toutes les options.

<a id="ledfilterstop"></a>

## led.filter.stop

Arrêter le filtre post-traitement

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/led/filter/stop`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `device` | string | Facultatif | Nom du périphérique LED : touch/board/matrix ; consultez led.list pour connaître les valeurs prises en charge. | Tous les périphériques LED |

### Exemple de requête

```json
{
  "device": "matrix"
}
```

### Réponse et confirmation de fin

data.device/stopped.

<a id="ledimage"></a>

## led.image

Afficher l'image sur la matrice

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/led/image`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `device` | string | Facultatif | Périphérique d’affichage cible. | matrix |
| `path` | string | Obligatoire | Chemin absolu sur l’appareil ; la configuration gérée et les fichiers sensibles sont soumis à des restrictions supplémentaires. | Aucune valeur par défaut |
| `center` | boolean | Facultatif | Centrer l'image. | true |

### Exemple de requête

```json
{
  "device": "matrix",
  "path": "/sdcard/example.png",
  "center": true
}
```

### Réponse et confirmation de fin

data.device/path/displayed/width/height/animated/frames.

### Notes d'utilisation

Nécessite un format d’image pris en charge et un fichier valide. Les lectures sensibles restent soumises aux contrôles de chemin.

<a id="ledlist"></a>

## led.list

Lister les périphériques LED

**Méthodes**: GET / POST
**Voie**: `/api/v1/led/list`
**Accès minimum**: Public

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

data.devices avec name/count/brightness/layout/effects/current ; current contient animation/speed/on/color.

<a id="ledqrcode"></a>

## led.qrcode

Générer et afficher le code QR

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/led/qrcode`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `device` | string | Facultatif | Périphérique d’affichage cible. | matrix |
| `text` | string | Obligatoire | Contenu à encoder. | Aucune valeur par défaut |
| `ecc` | string | Facultatif | Niveau de correction d'erreur L/M/Q/H. | L |
| `bg_image` | string | Facultatif | Chemin absolu facultatif de l’image d’arrière-plan. | Aucune |
| `color` | string / object / integer | Facultatif | Couleur sous forme de chaîne, d’objet {r,g,b} ou d’entier représentant 0xRRGGBB ; composantes de 0 à 255. | Avant-plan par défaut |

### Exemple de requête

```json
{
  "device": "matrix",
  "text": "https://example.com",
  "ecc": "L"
}
```

### Réponse et confirmation de fin

data.device/text/version/size/capacity/displayed.

### Notes d'utilisation

La capacité dépend de la longueur du texte, des dimensions de la matrice et du niveau ECC. La lecture de l’arrière-plan est soumise à des contrôles de chemin.

<a id="ledsave"></a>

## led.save

Enregistrer l'état actuel comme configuration de démarrage

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/led/save`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `device` | string | Facultatif | Nom du périphérique LED : touch/board/matrix ; consultez led.list pour connaître les valeurs prises en charge. | Tous les périphériques LED |

### Exemple de requête

```json
{
  "device": "board"
}
```

### Réponse et confirmation de fin

data.device/saved/animation/brightness/speed. Considérez-les comme la configuration de démarrage uniquement après réussite de l’enregistrement.

<a id="ledset"></a>

## led.set

Définir une plage de pixel LED

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/led/set`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `device` | string | Obligatoire | Nom du périphérique LED : touch/board/matrix ; consultez led.list pour connaître les valeurs prises en charge. | Aucune valeur par défaut |
| `color` | string / object / integer | Obligatoire | Couleur sous forme de chaîne, d’objet {r,g,b} ou d’entier représentant 0xRRGGBB ; composantes de 0 à 255. | Aucune valeur par défaut |
| `index` | integer | Facultatif | Indice du premier pixel, à partir de zéro ; doit être inférieur au nombre de pixels du périphérique. | 0 |
| `count` | integer | Facultatif | Nombre positif de pixels consécutifs; la plage doit correspondre à l'appareil. | 1 si index est fourni ; sinon tous les pixels |

### Exemple de requête

```json
{
  "device": "board",
  "index": 0,
  "count": 1,
  "color": {
    "r": 0,
    "g": 64,
    "b": 128
  }
}
```

### Réponse et confirmation de fin

data.device/start/count/color (r/g/b)/success.

### Notes d'utilisation

Arrête l’animation de la couche cible et active le périphérique. Sans index/count, remplit tout le périphérique ; index seul écrit un pixel. Un remplissage complet actualise le préréglage actuel de couleur unie. L’enregistrement persistant reste une étape distincte de configuration de l’éclairage.

<a id="ledtext"></a>

## led.text

Afficher le texte sur la matrice

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/led/text`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `device` | string | Facultatif | Appareil cible. | matrix |
| `text` | string | Obligatoire | Affiche le texte. | Aucune valeur par défaut |
| `font` | string | Facultatif | Nom d’une police prise en charge. | cjk ; charge /sdcard/fonts/<font>.fnt |
| `x` | integer | Facultatif | Coordonnée horizontale de départ. | Position par défaut |
| `y` | integer | Facultatif | Coordonnée verticale de départ. | Position par défaut |
| `align` | string | Facultatif | left/center/right. | left |
| `scroll` | string | Facultatif | none/left/right/up/down. | none |
| `speed` | integer | Facultatif | Vitesse de défilement. | 30 |
| `loop` | boolean | Facultatif | Répéter le défilement du texte en boucle. | false |
| `invert` | boolean | Facultatif | Inverser la sortie qui se chevauche. | false |
| `color` | string / object / integer | Facultatif | Couleur sous forme de chaîne, d’objet {r,g,b} ou d’entier représentant 0xRRGGBB ; composantes de 0 à 255. | Blanc |

### Exemple de requête

```json
{
  "device": "matrix",
  "text": "Ready",
  "scroll": "none"
}
```

### Réponse et confirmation de fin

data.device/text/font/displayed.

### Notes d'utilisation

La disponibilité des caractères dépend de la police sélectionnée.

<a id="ledtextstop"></a>

## led.text.stop

Arrêter la superposition du texte

**Méthodes**: POST / PUT / DELETE
**Voie**: `/api/v1/led/text/stop`
**Accès minimum**: ADMIN

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `device` | string | Facultatif | Appareil cible. | matrix |

### Exemple de requête

```json
{
  "device": "matrix"
}
```

### Réponse et confirmation de fin

data.device/stopped.
