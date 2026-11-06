# Exemples fournis

Le PDF contient read_status.py et subscribe.js en pièces jointes. Enregistrez-les avec un lecteur PDF gérant les pièces jointes ; la version modifiable fournit les mêmes fichiers. Les adresses, tokens et chemins de certificat fictifs ne sont pas les réglages réels d’un appareil.

## Copier un exemple de code

Les blocs de code contiennent du texte sélectionnable sans numéros de ligne intégrés au code. Pour conserver exactement l’indentation et les fins de ligne, utilisez le trombone en haut à droite pour enregistrer le fichier source nommé, ou enregistrez-le depuis le panneau des pièces jointes de votre lecteur PDF.

Si votre lecteur ne gère pas les pièces jointes, le paquet téléchargeable contient les exemples originaux dans code-examples/en, avec les mêmes noms de fichiers. Enregistrez le JSON de requête dans request.json pour l’interface correspondante. Les exemples de réponse et les messages WebSocket ont les usages décrits dans leurs chapitres. Renseignez les adresses, tokens et autres valeurs fictives avant utilisation.

## Requête Python en lecture seule

Python 3 et sa bibliothèque standard sont suffisants. Utilisez l'adresse de votre appareil et exécutez :

```sh
python3 read_status.py --base 'http://10.10.99.97' \
  --user admin
```

Saisissez le mot de passe dans l’invite masquée, et non dans l’historique des commandes. Le script se connecte, lit l’état et tente de se déconnecter. Il ne commande pas le matériel, n’exécute pas de tâches distantes et n’effectue pas de mise à jour. Il ne suit aucune redirection et ne réessaie pas automatiquement. Vérifiez valid/duty_valid et les autres indicateurs de mesure dans sa sortie.

## Abonnement depuis un navigateur

subscribe.js exporte watchTianShan sous forme de module ES, sans bibliothèque tierce. Utilisez un navigateur capable de joindre l’appareil. Obtenez d’abord un token en vous connectant par HTTP :

```javascript
import {watchTianShan} from './subscribe.js';
const close = watchTianShan({
  baseUrl: 'http://10.10.99.97',
  token: yourLoginToken,
  onData: message => renderYourDashboard(message.data),
  onState: state => showConnectionState(state)
});
```

Votre page doit fournir renderYourDashboard/showConnectionState. Appelez close() lorsque vous quittez la vue. Après une déconnexion, marquez les mesures comme périmées avant de rétablir l’authentification et les abonnements. Ne placez pas de tokens dans le code source, les URL ou les journaux courants. Cet exemple ne rétablit pas la connexion et ne rejoue pas les actions automatiquement.
