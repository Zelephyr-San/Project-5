document.addEventListener("DOMContentLoaded", () => {
  // Initialisation des fonctionnalités au chargement
  fetchProjects(); // Charge les projets
  setupFilterButtons(); // Initialise les boutons filtres
  displayAdmimode(); // Affiche la banderole "Mode édition"
  updateFiltersVisibility(); // Met à jour l'affichage des filtres et du bouton "Modifier"
  updateAuthButton(); // Met à jour l'état du bouton Auth au chargement
});

// ========================================================
// Gestion des projets et de la galerie
// ========================================================

// Fonction principale pour charger les projets
async function fetchProjects() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error("Impossible de récupérer les éléments");
    }
    const projects = await response.json();
    populateGallery(projects);
  } catch (error) {
    console.error("Erreur:", error);
  }
}

// Remplir la galerie avec les projets
function populateGallery(projects) {
  const gallery = document.querySelector(".gallery");

  if (!gallery) {
    console.error("Erreur : L'élément '.gallery' est introuvable.");
    return;
  }

  gallery.innerHTML = ""; // Vide la galerie avant d'ajouter les projets

  projects.forEach((project) => {
    const figure = document.createElement("figure");
    figure.dataset.categoryId = project.categoryId;

    const img = document.createElement("img");
    img.src = project.imageUrl;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = project.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

// ========================================================
// Gestion des filtres
// ========================================================

// Gérer les boutons de filtre
function setupFilterButtons() {
  const buttons = document.querySelectorAll(".filtres-boutton");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      // Retire la classe active de tous les boutons, puis l’ajoute au bouton cliqué
      buttons.forEach((btn) => btn.classList.remove("filtres-boutton-active"));
      button.classList.add("filtres-boutton-active");

      // Récupère l'ID de la catégorie du bouton cliqué
      const categoryId = button.dataset.categoryId;
      filterGallery(categoryId);
    });
  });
}

// Filtrer la galerie
function filterGallery(categoryId) {
  const allProjects = document.querySelectorAll(".gallery figure");

  allProjects.forEach((project) => {
    if (categoryId === "all" || project.dataset.categoryId === categoryId) {
      project.style.display = "block"; // Affiche le projet
    } else {
      project.style.display = "none"; // Masque le projet
    }
  });
}

// ========================================================
// Gestion du bouton Login et Logout
// ========================================================

// Mettre à jour l'état du bouton Auth
function updateAuthButton() {
  const authButton = document.getElementById("authButton");

  if (sessionStorage.getItem("authToken")) {
    // Utilisateur connecté : afficher Logout
    authButton.textContent = "Logout";
    authButton.href = "#"; // Désactive la redirection
    authButton.addEventListener("click", handleLogout);
  } else {
    // Utilisateur déconnecté : afficher Login
    authButton.textContent = "Login";
    authButton.href = "login.html"; // Redirige vers la page de connexion
    authButton.removeEventListener("click", handleLogout); // Retire l'événement de déconnexion
  }
}

// Gérer la déconnexion
function handleLogout(e) {
  e.preventDefault(); // Empêche la redirection
  logout(); // Déclenche la déconnexion
}

// Déconnexion de l'utilisateur
function logout() {
  sessionStorage.removeItem("authToken"); // Supprime le token

  // Supprime le bandeau "Mode édition"
  const editBanner = document.querySelector(".edit");
  if (editBanner) {
    editBanner.remove();
  }

  // Met à jour le bouton Auth
  updateAuthButton();

  // Réinitialise les filtres et autres éléments
  updateFiltersVisibility();

  alert("Vous êtes déconnecté !");
  window.location.href = "index.html"; // Redirige vers la page d'accueil
}

// ========================================================
// Gestion du mode édition
// ========================================================

// Afficher ou cacher le mode édition
function displayAdmimode() {
  if (sessionStorage.getItem("authToken")) {
    const editBanner = document.querySelector(".edit");
    if (!editBanner) {
      const newEditBanner = document.createElement("div");
      newEditBanner.className = "edit";
      newEditBanner.innerHTML =
        '<p><a href="#modal" class="js-modal"><i class="fa-regular fa-pen-to-square"></i> Mode édition</a></p>';
      document.body.prepend(newEditBanner);
    }
  }
}

// ========================================================
// Gestion des filtres et du bouton "Modifier"
// ========================================================

// Mettre à jour l'affichage des filtres et du bouton "Modifier"
function updateFiltersVisibility() {
  const filters = document.querySelector(".Filtres");
  const modifierButtonContainer = document.getElementById(
    "modifierButtonContainer"
  );

  if (sessionStorage.getItem("authToken")) {
    // Masque les filtres et affiche le bouton "Modifier"
    if (filters) {
      filters.style.display = "none";
    }
    if (modifierButtonContainer) {
      modifierButtonContainer.style.display = "block";

      // Configure les boutons de modals pour le bouton "Modifier"
      setupModalButtons();
    }
  } else {
    // Affiche les filtres et masque le bouton "Modifier"
    if (filters) {
      filters.style.display = "flex";
    }
    if (modifierButtonContainer) {
      modifierButtonContainer.style.display = "none";
    }
  }
}

// ========================================================
// Gestion des modals
// ========================================================

// Configure les boutons pour ouvrir et fermer les modals
function setupModalButtons() {
  const modifierButton = document.getElementById("modifierButton");
  const closeModalButton = document.getElementById("closeModal");
  const closeModalButton2 = document.getElementById("closeModal2");

  if (modifierButton) {
    modifierButton.addEventListener("click", displayModal);
  }
  if (closeModalButton) {
    closeModalButton.addEventListener("click", hideModal);
  }
  if (closeModalButton2) {
    closeModalButton2.addEventListener("click", hideModal2);
  }
}

// Fonction pour afficher la première modal
function displayModal() {
  const modal = document.getElementById("modal");
  if (modal) {
    populateModalGallery(); // Met à jour la galerie de la modal
    modal.style.display = "flex";
  }
}

// Fonction pour fermer la première modal
function hideModal() {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.style.display = "none";
  }
}

// Fonction pour générer la galerie dans la modal
function populateModalGallery() {
  const gallery = document.querySelector(".gallery"); // Galerie principale
  const modalGallery = document.querySelector(".modal-gallery"); // Conteneur de la modal

  if (gallery && modalGallery) {
    modalGallery.innerHTML = ""; // Vide le conteneur avant d'ajouter les images

    // Parcourt chaque image de la galerie principale
    gallery.querySelectorAll("img").forEach((img) => {
      const imageWrapper = document.createElement("div"); // Conteneur pour chaque image
      imageWrapper.classList.add("modal-image-wrapper");

      const imgClone = img.cloneNode(true); // Clone l'image
      imgClone.classList.add("modal-thumbnail"); // Ajoute une classe pour les styles spécifiques

      const deleteButton = document.createElement("button"); // Bouton de suppression
      deleteButton.classList.add("delete-button");
      deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>'; // Icône de la poubelle

      imageWrapper.appendChild(imgClone); // Ajoute l'image au conteneur
      imageWrapper.appendChild(deleteButton); // Ajoute le bouton au conteneur
      modalGallery.appendChild(imageWrapper); // Ajoute le conteneur à la galerie
    });
  }
}

// Fonction pour ouvrir la modal 2 depuis le bouton
function setupModalTransition() {
  const openModal2Button = document.getElementById("openModal2");
  const modal1 = document.getElementById("modal");
  const modal2 = document.getElementById("modal2");

  if (openModal2Button) {
    openModal2Button.addEventListener("click", () => {
      if (modal1) {
        modal1.style.display = "none"; // Cache la modal 1
      }
      if (modal2) {
        modal2.style.display = "flex"; // Affiche la modal 2
      }
    });
  }
}

// Fonction pour afficher la deuxième modal
function displayModal2() {
  const modal = document.getElementById("modal2");
  if (modal) {
    modal.style.display = "flex";
  }
}
// Gérer le retour vers la modal 1 depuis la modal 2
function setupBackToModal1() {
  const backToModal1Button = document.getElementById("backToModal1");
  const modal1 = document.getElementById("modal");
  const modal2 = document.getElementById("modal2");

  if (backToModal1Button) {
    backToModal1Button.addEventListener("click", () => {
      if (modal2) modal2.style.display = "none"; // Cache la modal 2
      if (modal1) modal1.style.display = "flex"; // Affiche la modal 1
    });
  }
}

// Fonction pour fermer la deuxième modal
function hideModal2() {
  const modal = document.getElementById("modal2");
  if (modal) {
    modal.style.display = "none";
  }
}

// Fonction pour fermer la modal en cliquant en dehors de celle-ci
function setupModalCloseOnOutsideClick() {
  const modals = document.querySelectorAll(".modal");

  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      const modalWrapper = modal.querySelector(".modal-wrapper");
      if (!modalWrapper.contains(e.target)) {
        modal.style.display = "none"; // Cache la modal si le clic est en dehors
      }
    });
  });
}

// Fonction pour supprimer un projet
async function deleteProject(projectId) {
  const url = `http://localhost:5678/api/works/${projectId}`;
  const token = sessionStorage.getItem("authToken");

  if (!token) return alert("Vous devez être connecté pour effectuer cette action.");

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    });

    if (response.ok) {
      document.querySelector(`.modal-gallery [data-id="${projectId}"]`)?.remove();
      alert("Projet supprimé avec succès !");
    } else {
      alert("Erreur lors de la suppression du projet.");
    }
  } catch (error) {
    console.error("Erreur :", error);
    alert("Impossible de supprimer le projet pour le moment.");
  }
}

// Fonction pour remplir la galerie de la modal
function populateModalGallery() {
  const gallery = document.querySelector(".gallery");
  const modalGallery = document.querySelector(".modal-gallery");

  if (gallery && modalGallery) {
    modalGallery.innerHTML = "";
    gallery.querySelectorAll("img").forEach((img) => {
      const projectId = img.dataset.id;
      const imageWrapper = document.createElement("div");
      imageWrapper.className = "modal-image-wrapper";
      imageWrapper.setAttribute("data-id", projectId);

      const imgClone = img.cloneNode(true);
      imgClone.className = "modal-thumbnail";

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
      deleteButton.addEventListener("click", () => deleteProject(projectId));

      imageWrapper.append(imgClone, deleteButton);
      modalGallery.appendChild(imageWrapper);
    });
  }
}

// Fonction pour charger les catégories depuis l'API
async function fetchCategories() {
  const url = "http://localhost:5678/api/categories"; // URL de l'API des catégories

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Impossible de récupérer les catégories.");
    }

    const categories = await response.json(); // Récupère les données en JSON
    populateCategoryDropdown(categories); // Remplit le champ déroulant
  } catch (error) {
    console.error("Erreur :", error);
  }
}

// Fonction pour remplir la liste déroulante des catégories
function populateCategoryDropdown(categories) {
  const categoryDropdown = document.getElementById("categorie");

  if (!categoryDropdown) {
    console.error("Élément #categorie introuvable.");
    return;
  }

  // Ajoute chaque catégorie en tant qu'option dans la liste déroulante
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id; // Utilise l'ID comme valeur
    option.textContent = category.name; // Utilise le nom comme texte affiché
    categoryDropdown.appendChild(option);
  });
}


// ========================================================
// Initialisation des fonctionnalités au chargement
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
  setupModalButtons(); // Configuration des boutons d'ouverture et fermeture des modals
  setupModalTransition(); // Configuration de la transition vers la modal 2
  setupBackToModal1(); // Configuration du retour vers la modal 1
  setupModalCloseOnOutsideClick(); // Fermeture des modals au clic en dehors
  fetchCategories(); // Charger les catégories au chargement de la page
});
