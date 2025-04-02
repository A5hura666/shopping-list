import './style.css';

document.addEventListener('DOMContentLoaded', async () => {
    let produits;

    // Vérifier si les produits sont déjà dans le localStorage
    if (localStorage.getItem('produits')) {
        produits = JSON.parse(localStorage.getItem('produits'));
    } else {
        const response = await fetch('/liste_produits_quotidien.json');
        produits = await response.json();
        localStorage.setItem('produits', JSON.stringify(produits)); // Sauvegarde initiale
    }

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
                'bg-white', 'rounded-lg', 'shadow-md', 'p-4', 'flex', 'flex-col',
                'items-center', 'text-center', 'transition-transform', 'duration-300',
                'hover:shadow-lg', 'hover:-translate-y-1'
            );

            li.innerHTML = `
            <div class="mb-4">
                <h2 class="card-title text-xl text-gray-800">${produit.nom}</h2>
                <p class="text-gray-600 mt-2">Quantité : <span class="stock">${produit.quantite_stock}</span></p>
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

        updateProductCount(count);
    }

    function afficherConfirmation(nom, quantite) {
        const message = document.createElement('div');
        message.classList.add(
            'fixed', 'bottom-5', 'right-5', 'bg-green-500', 'text-white',
            'px-4', 'py-2', 'rounded', 'shadow-lg', 'transition-opacity', 'duration-500'
        );
        message.innerText = `${nom} ajouté au panier (${quantite})`;

        document.body.appendChild(message);

        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 500);
        }, 2000);
    }

    function ajouterAuPanier(produits, bouton) {
        const nomProduit = bouton.getAttribute('data-id');
        const produitsStock = JSON.parse(localStorage.getItem('produits')) || produits;
        const produit = produitsStock.find(p => p.nom === nomProduit);

        // Vérifier si le produit est en stock
        if (!produit || produit.quantite_stock <= 0) {
            alert("Ce produit n'est plus en stock !");
            return;
        }

        // Récupérer le panier actuel
        let panier = JSON.parse(localStorage.getItem('panier')) || [];
        const produitExistant = panier.find(p => p.nom === produit.nom);

        // Si le produit est déjà dans le panier, on augmente sa quantité
        if (produitExistant) {
            produitExistant.quantite_stock += 1; // Augmente la quantité
        } else {
            // Sinon, on ajoute le produit avec une quantité initiale de 1
            panier.push({ ...produit, quantite_stock: 1 });
        }

        // Réduire le stock du produit
        produit.quantite_stock -= 1;

        // Sauvegarde des modifications dans localStorage
        localStorage.setItem('panier', JSON.stringify(panier));
        localStorage.setItem('produits', JSON.stringify(produitsStock));

        // Mise à jour de l'affichage
        const stockElement = bouton.parentElement.querySelector('.stock');
        if (stockElement) stockElement.innerText = produit.quantite_stock;

        afficherConfirmation(produit.nom, produitExistant ? produitExistant.quantite_stock : 1);
    }

    function updateProductCount(count) {
        compteurProduits.innerText = count ? `${count} produits` : 'Aucun produit trouvé';
    }

    function searchProductsByName(produits, query) {
        return produits.filter(produit => produit.nom.toLowerCase().includes(query.toLowerCase()));
    }

    function sortProductsByPriceAsc(produits) {
        return produits.sort((a, b) => a.prix_unitaire - b.prix_unitaire);
    }

    function sortProductsByNameAsc(produits) {
        return produits.sort((a, b) => a.nom.localeCompare(b.nom));
    }

    function resetFilters() {
        recherche.value = '';
        tri.value = 'default';
        afficherProduits(produits);
    }

    resetFiltres.addEventListener('click', resetFilters);

    tri.addEventListener('change', (e) => {
        let produitsTries = [...produits];
        if (e.target.value === 'prix') {
            produitsTries = sortProductsByPriceAsc(produitsTries);
        } else if (e.target.value === 'nom') {
            produitsTries = sortProductsByNameAsc(produitsTries);
        }
        afficherProduits(produitsTries);
    });

    recherche.addEventListener('input', () => {
        const query = recherche.value;
        const produitsFiltres = searchProductsByName(produits, query);
        afficherProduits(produitsFiltres);
    });

    afficherProduits(produits);
});
