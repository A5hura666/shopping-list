import './style.css';

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/liste_produits_quotidien.json');
    const produits = await response.json();

    const listeProduits = document.getElementById('liste-produits');
    const compteurProduits = document.getElementById('compteur-produits');
    const recherche = document.getElementById('recherche');
    const tri = document.getElementById('tri');
    const resetFiltres = document.getElementById('reset-filtres');

    function afficherProduits(produits) {
        listeProduits.innerHTML = '';
        const count = produits.length;
        produits.forEach(produit => {
            const li = document.createElement('li');
            li.classList.add(
                'bg-white',
                'rounded-lg',
                'shadow-md',
                'p-4',
                'flex',
                'flex-col',
                'items-center',
                'text-center',
                'transition-transform',
                'duration-300',
                'hover:shadow-lg',
                'hover:-translate-y-1'
            );

            li.innerHTML = `
            <div class="mb-4">
                <h2 class="card-title text-xl text-gray-800">${produit.nom}</h2>
                <p class="text-gray-600 mt-2">Quantité : ${produit.quantite_stock}</p>
                <p class="text-indigo-600 font-bold mt-2">${produit.prix_unitaire} €</p>
            </div>
            <button class="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer w-full
                           hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    data-id="${produit.nom}">
                Ajouter à la liste
            </button>
        `;

            listeProduits.appendChild(li);
        });
        const boutonsAjouter = document.querySelectorAll('button[data-id]');
        boutonsAjouter.forEach(bouton => {
            bouton.addEventListener('click', () => ajouterAuPanier(produits, bouton));
        });

        updateProductCount(count)
    }

    function ajouterAuPanier(produits, bouton) {
        const nomProduit = bouton.getAttribute('data-id');
        const produit = produits.find(p => p.nom === nomProduit);

        if (produit) {
            let panier = JSON.parse(localStorage.getItem('panier')) || [];

            panier.push(produit);

            localStorage.setItem('panier', JSON.stringify(panier));

            console.log(`${nomProduit} ajouté au panier.`);
        }
    }

    function updateProductCount(count) {
        compteurProduits.innerText = count ? `${count} produits` : 'Aucun produit trouvé';
    }

    function searchProductsByName(produits, query) {
        return produits.filter(produit => produit.nom.toLowerCase().includes(query.toLowerCase()));
    }

    function sortProductsByPriceAsc(produits, order) {
        return produits.sort((a, b) => {
            return a.prix_unitaire - b.prix_unitaire;
        });
    }

    function sortProductsByNameAsc(produits, order) {
        return produits.sort((a, b) => {
            return a.nom.localeCompare(b.nom);
        });
    }

    function resetFilters() {
        recherche.value = '';
        tri.value = 'default';
        afficherProduits(produits);
    }



    resetFiltres.addEventListener('click', resetFilters);

    tri.addEventListener('change', (e) => {
        tri.value = e.target.value;
        let produitsTries = [...produits];
        if (tri.value === 'prix') {
            produitsTries = sortProductsByPriceAsc(produitsTries);
        } else if (tri.value === 'nom') {
            produitsTries = sortProductsByNameAsc(produitsTries);
        }
        listeProduits.innerHTML = '';

        afficherProduits(produitsTries);
    })

    recherche.addEventListener('input', () => {
        const query = recherche.value;
        const produitsFiltres = searchProductsByName(produits, query);
        listeProduits.innerHTML = '';
        afficherProduits(produitsFiltres);
    });

    afficherProduits(produits);
});

