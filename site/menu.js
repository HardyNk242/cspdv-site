// Ouverture du menu sur téléphone. C'est le seul JavaScript du site :
// tout le reste s'affiche sans, ce qui est exactement ce que les robots
// d'indexation savent lire le mieux.
document.addEventListener("DOMContentLoaded", function () {
  var burger = document.getElementById("burger");
  var liens = document.getElementById("liens");
  if (!burger || !liens) return;

  burger.addEventListener("click", function () {
    var ouvert = liens.classList.toggle("ouvert");
    burger.setAttribute("aria-expanded", ouvert ? "true" : "false");
  });

  // Anciennes adresses en #/ : le site a longtemps tourné sous React
  // avec un HashRouter. Les liens déjà partagés continuent de marcher.
  var routes = {
    "#/": "/", "#/ecole": "/ecole.html", "#/tarifs": "/tarifs.html",
    "#/bourses": "/bourses.html", "#/donateurs": "/donateurs.html",
    "#/galerie": "/galerie.html", "#/contact": "/contact.html"
  };
  var cible = routes[location.hash];
  if (cible && location.pathname === "/") location.replace(cible);
});
