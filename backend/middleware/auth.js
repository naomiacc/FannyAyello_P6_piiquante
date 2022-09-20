const jwt = require("jsonwebtoken");

/* recuperationn du token dans notre header 
vérification du token 
recuperation du userId du token 
si on as un userId dans le corp de la requête et que celui-ci est different = erreur 
sinon, appel de next pour le prochain middleware
si il y à la moindre erreur avant, le catch vas nous le signaler 
*/

module.exports = (req, res, next) => {
  try {
    /* On créé un const à partir de de la rêquete et du header authorization. On va séparer les éléments autour d'un espace. 
    Ce qui nous retournera un tableau avec Bearer en premier élément et le token en 2e. 
    On gardera alors uniquement le 2nd element. */
    const token = req.headers.authorization.split(" ")[1];
    /* On vient décoder le token. Lorsque le token est décodé, cela devient un objet JS */
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    const userId = decodedToken.userId;
    req.auth = { userId: userId };

    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
