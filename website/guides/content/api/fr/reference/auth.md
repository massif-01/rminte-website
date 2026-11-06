# API : Comptes et sessions

[Indice complet](README.md) | [Règles communes](../conventions.md) | [Dépannage](../troubleshooting.md)

Les exemples sont des corps JSON envoyés par POST, avec des valeurs fictives. Sauf indication contraire, les descriptions des réponses concernent data.

| API | Objet |
| --- | --- |
| [auth.admin.reset_password](#authadminreset_password) | Rétablir le mot de passe admin par défaut |
| [auth.admin.set_password](#authadminset_password) | Définir le mot de passe admin avec root |
| [auth.change_password](#authchange_password) | Modifier le mot de passe |
| [auth.login](#authlogin) | Connexion d’un utilisateur |
| [auth.logout](#authlogout) | Déconnexion de l'utilisateur |
| [auth.root.set_password](#authrootset_password) | Définir le mot de passe root avec root |
| [auth.status](#authstatus) | Vérifier l’état d’authentification |

<a id="authadminreset_password"></a>

## auth.admin.reset_password

Rétablir le mot de passe admin par défaut

**Méthodes**: POST
**Voie**: `/api/v1/auth/admin/reset_password`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `token` | string | Obligatoire | Token de connexion valide dans le JSON ; session_id ne peut pas le remplacer. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "token": "ROOT_TOKEN"
}
```

### Réponse et confirmation de fin

data.success/username/password_changed. Après réussite, admin se connecte avec le mot de passe par défaut rm01.

### Notes d'utilisation

root rétablit le mot de passe admin à rm01. Utilisez ce mot de passe par défaut après la réinitialisation.

<a id="authadminset_password"></a>

## auth.admin.set_password

Définir le mot de passe admin avec root

**Méthodes**: POST
**Voie**: `/api/v1/auth/admin/set_password`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `token` | string | Obligatoire | Token de connexion valide dans le JSON ; session_id ne peut pas le remplacer. | Aucune valeur par défaut |
| `new_password` | string | Obligatoire | Nouveau mot de passe, 4-64 octets. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "token": "ROOT_TOKEN",
  "new_password": "NEW_PASSWORD"
}
```

### Réponse et confirmation de fin

data.success/sessions_revoked/reauth_required/username/password_changed. Les sessions du compte concerné sont révoquées.

### Notes d'utilisation

L’identité transmise dans Authorization et le token JSON doivent tous deux satisfaire les contrôles root ; les deux champs sont nécessaires.

<a id="authchange_password"></a>

## auth.change_password

Modifier le mot de passe

**Méthodes**: POST
**Voie**: `/api/v1/auth/change_password`
**Accès minimal** : token dans le corps de la requête (API d’authentification)

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `token` | string | Obligatoire | Token de connexion valide dans le JSON ; session_id ne peut pas le remplacer. | Aucune valeur par défaut |
| `old_password` | string | Obligatoire | Mot de passe actuel. | Aucune valeur par défaut |
| `new_password` | string | Obligatoire | Nouveau mot de passe, 4-64 octets. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "token": "YOUR_TOKEN",
  "old_password": "CURRENT_PASSWORD",
  "new_password": "NEW_PASSWORD"
}
```

### Réponse et confirmation de fin

data.success/sessions_revoked/reauth_required. Reconnectez-vous après réussite.

### Notes d'utilisation

Le titulaire du compte choisit quand modifier son mot de passe. L’ancienne session est invalidée après réussite.

<a id="authlogin"></a>

## auth.login

Connexion d’un utilisateur

**Méthodes**: POST
**Voie**: `/api/v1/auth/login`
**Accès minimum**: Public

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `username` | string | Obligatoire | Compte admin ou root configuré. | Aucune valeur par défaut |
| `password` | string | Obligatoire | Mot de passe actuel pour ce compte. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "username": "admin",
  "password": "rm01"
}
```

### Réponse et confirmation de fin

La réussite de POST contient code=0 et data.token/session_id/username/level/expires_in (secondes)/password_changed.

### Notes d'utilisation

Cinq échecs consécutifs bloquent la connexion pendant 300 secondes. La connexion n’établit pas d’abonnement WebSocket.

<a id="authlogout"></a>

## auth.logout

Déconnexion de l'utilisateur

**Méthodes**: POST
**Voie**: `/api/v1/auth/logout`
**Accès minimal** : token dans le corps de la requête (API d’authentification)

### Paramètres

Aucun paramètre fonctionnel.

### Exemple de requête

```json
{}
```

### Réponse et confirmation de fin

La route POST dédiée renvoie {success:true}. Supprimez également le token côté client.

### Notes d'utilisation

Authorization identifie la session à fermer ; aucun JSON n’est nécessaire. Le token dans le corps du gestionnaire interne ne correspond pas au contrat de cette route HTTP POST dédiée.

<a id="authrootset_password"></a>

## auth.root.set_password

Définir le mot de passe root avec root

**Méthodes**: POST
**Voie**: `/api/v1/auth/root/set_password`
**Accès minimum**: ROOT

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `token` | string | Obligatoire | Token de connexion valide dans le JSON ; session_id ne peut pas le remplacer. | Aucune valeur par défaut |
| `new_password` | string | Obligatoire | Nouveau mot de passe, 4-64 octets. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "token": "ROOT_TOKEN",
  "new_password": "NEW_PASSWORD"
}
```

### Réponse et confirmation de fin

data.success/sessions_revoked/reauth_required/username/password_changed. Les sessions du compte concerné sont révoquées.

### Notes d'utilisation

L’identité transmise dans Authorization et le token JSON doivent tous deux satisfaire les contrôles root ; les deux champs sont nécessaires.

<a id="authstatus"></a>

## auth.status

Vérifier l’état d’authentification

**Méthodes**: POST
**Voie**: `/api/v1/auth/status`
**Accès minimal** : token dans le corps de la requête (API d’authentification)

### Paramètres

| Champ | Type | Condition | Signification | En cas d’omission |
| --- | --- | --- | --- | --- |
| `token` | string | Obligatoire | Token de connexion valide dans le JSON ; session_id ne peut pas le remplacer. | Aucune valeur par défaut |

### Exemple de requête

```json
{
  "token": "YOUR_TOKEN"
}
```

### Réponse et confirmation de fin

data.valid indique la validité ; les sessions valides incluent username/level/expires_in/password_changed. valid=false peut coexister avec code=0.
