// le point d'entrée de l'app qui initialise et configure le serveur avec le bon port
// Un programme qui va attendre des requête http et y répondre
// require commande pour importer le package
// accès à http qui permet de créer un serveur
const http = require('http'); //module pour créer le serveur HTTP
const app = require('./app'); //application Express configurée dans le fichier app.js.
const { type } = require('os');

// Renvoie un port valide qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
};

const port = normalizePort(process.env.PORT || '4000' || '3000'); // permet de définir le port en fonction des variables d'environnement, avec des valeurs par défaut si aucune n'est spécifiée.

app.set('port', port);

// Recherche les différentes erreurs et les gère de manière appropriée
// Ensuite enregistrer dans le serveur
const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe' + address : 'port: ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app); // fonction appelée à chaque requête

// Un écouteur d'évènements est enregistré
// Consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port); // le cas ou 3000 pas dispo
