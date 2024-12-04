// URL de l'API pour la connexion (à modifier selon les besoins)
const loginApi = "http://localhost:5678/api/users/login";

document.addEventListener("DOMContentLoaded", () => {
  // Sélectionne le formulaire de connexion dans le DOM
  const loginForm = document.querySelector("#loginForm");
  const errorMessage = document.querySelector("#errorMessage");

  // Vérifie si le formulaire existe dans le DOM
  if (!loginForm) {
    console.error("Erreur : le formulaire de connexion est introuvable.");
    return;
  }

  // Ajoute un gestionnaire d'événement pour la soumission du formulaire
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Empêche le rechargement automatique de la page

    // Récupère et nettoie les données des champs email et mot de passe
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    // Vérifie si les champs sont vides
    if (!email || !password) {
      showError("Veuillez remplir tous les champs."); // Affiche un message d'erreur
      return; // Arrête l'exécution si les champs sont vides
    }

    // Crée un objet utilisateur contenant les données saisies
    const user = { email, password };

    // Appelle la fonction pour gérer la connexion
    await processLogin(user);
  });

  // Fonction pour traiter la connexion
  async function processLogin(user) {
    try {
      // Effectue une requête POST pour envoyer les données utilisateur à l'API
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST", // Méthode HTTP utilisée
        headers: { "Content-Type": "application/json" }, // Type des données envoyées
        body: JSON.stringify(user), // Convertit l'objet utilisateur en JSON
      });

      // Vérifie si la réponse n'est pas correcte
      if (!response.ok) {
        if (response.status === 401) {
          showError("Identifiants incorrects."); // Erreur 401 : mauvais identifiants
        } else {
          showError("Erreur serveur. Veuillez réessayer plus tard."); // Autres erreurs serveur
        }
        return; // Stoppe l'exécution si la réponse n'est pas valide
      }

      // Si la connexion réussit, analyse la réponse en JSON
      const result = await response.json();

      // Si un token est présent dans la réponse
      if (result.token) {
        sessionStorage.setItem("authToken", result.token); // Stocke le token dans le localStorage
        console.log("Connexion réussie !");
        console.log("E-mail:", user.email);
        console.log("Mot de passe:", user.password);

        window.location.href = "index.html"; // Redirige vers la page d'accueil
      }
    } catch (error) {
      // Capture les erreurs réseau ou autres exceptions
      console.error("Erreur :", error);
      showError("Une erreur est survenue. Veuillez réessayer."); // Affiche un message d'erreur
    }
  }

  // Fonction pour afficher un message d'erreur
  function showError(message) {
    errorMessage.style.display = "block"; // Rendre visible le conteneur d'erreur
    errorMessage.textContent = message; // Afficher le message dans l'élément HTML
  }
});
