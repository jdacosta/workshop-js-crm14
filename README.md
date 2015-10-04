# French Tech Dance Floor

Vidéo du projet : [https://www.youtube.com/watch?v=2EqTC-yfowM](https://www.youtube.com/watch?v=2EqTC-yfowM)

Donne ton énergie en bougeant et en dansant pour garder un lien fort entre Grenoble et Annecy.

Le but est d'insiter les personnes à bouger le plus possible devant la caméra afin de ne
pas perdre la connexion entre Annecy et Grenoble. Lorsque le mouvement des personnes n'est
plus assez rapide, la conneion est perdu à l'aide d'un effet de glitch.


### Pour ce projet a été mis en place :
  * ES6 pour la partie cliente (ES6 serveur a été réalisé, mais abonné à cause d'une imcompatibilité avec peer.js)

  * Réalisation d'un gulp pour la compilation du projet

  * Passage du serveur en HTTPS (abandonné à cause d'une erreur avec peer.js)

  * Mise en place de SASS pour les feuilles de styles

  * WebRTC pour le livevidéo

  * Socket.io pour les échanges d'ID et de message entres clients

  * Reconnaissance vocale pour donner des instructions à un interlocuteur

  * Détection de mouvement (from scratch)
    * présence d'une personne
    * vitesse du mouvement de la personne
    * zone (droite, centre, gauche) ou a lieu le mouvement
    * déplacement droite -> gauche ET gauche -> droite

  * Utilisation de threejs pour l'interface et l'affichage du spectre sconore

  * Tweenmax pour quelques animations d'interface


### Utilisation du projet

Configurer le serveurs dans `src/servers/config/config.js`

Lancer la compilation `npm install` et `gulp`.

Lancer le serveur nodejs et RTC
```
cd dist/servers/
node server.js
```
