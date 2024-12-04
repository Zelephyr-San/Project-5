document.addEventListener("DOMContentLoaded", () => {
  fetchProjects(); // Appel de la fonction principale
  setupFilterButtons(); // Initialisation des boutons
});

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

function displayAdmimode() {
  if (sessionStorage.authToken) {
    console.log("ok");
    const editBanner = document.createElement("div");
    editBanner.className = "edit";
    editBanner.innerHTML =
      '<p><a href="modal" class="js-modal"><i class="fa-regular fa-pen-to-square"></i> Mode édition</a></p>';
    document.body.prepend(editBanner);
  }
}

// Initialiser les boutons de filtre après le chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  fetchProjects();
  setupFilterButtons();
  displayAdmimode();
});

const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
};

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});
