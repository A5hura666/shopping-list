import './style.css';

document.addEventListener('DOMContentLoaded', () => {
    let panier = JSON.parse(localStorage.getItem('panier')) || [];
    const listeCourseBody = document.getElementById('liste-course-body');
    const totalGeneral = document.getElementById('total-general');
    const viderListeButton = document.getElementById('vider-liste');

    function afficherListeCourse(panier) {
        listeCourseBody.innerHTML = '';
        let total = 0;

        panier.forEach((produit, index) => {
            const tr = document.createElement('tr');
            tr.classList.add('border-b', 'border-b-gray-100');

            const sousTotal = (produit.prix_unitaire * produit.quantite_stock).toFixed(2);
            total += parseFloat(sousTotal);

            tr.innerHTML = `
            <td class="py-4 px-4">${produit.nom}</td>
            <td class="py-4 px-4">${produit.prix_unitaire.toFixed(2)}</td>
            <td class="py-4 px-4">
                <input type="number" class="quantity-input border rounded px-2 py-1 w-16"
                       data-index="${index}" value="${produit.quantite_stock}" min="1">
            </td>
            <td class="py-4 px-4 sous-total">${sousTotal}</td>
            <td class="py-4 px-4">
                <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded cursor-pointer"
                        data-index="${index}">Supprimer</button>
            </td>
        `;

            listeCourseBody.appendChild(tr);
        });

        totalGeneral.textContent = total > 0 ? `Total général: ${total.toFixed(2)} €` : '';

        document.getElementById('vider-liste').style.display = panier.length > 0 ? 'block' : 'none';

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', supprimerProduit);
        });

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', mettreAJourQuantite);
        });
    }

    function ajusterStockProduit(nomProduit, quantite, ajouter = false) {
        // Charger les produits depuis le localStorage
        let produitsStock = JSON.parse(localStorage.getItem('produits')) || [];
        const produit = produitsStock.find(p => p.nom === nomProduit);

        if (produit) {
            // Ajuster le stock du produit
            if (ajouter) {
                produit.quantite_stock += quantite; // Ajouter la quantité
            } else {
                produit.quantite_stock -= quantite; // Réduire le stock
            }
            // Mettre à jour le localStorage avec le nouveau stock
            localStorage.setItem('produits', JSON.stringify(produitsStock));
        }
    }

    function supprimerProduit(event) {
        const index = event.target.getAttribute('data-index');
        // Récupérer le produit à supprimer pour réajouter la quantité au stock
        const produitSupprime = panier[index];
        panier.splice(index, 1);
        localStorage.setItem('panier', JSON.stringify(panier));
        ajusterStockProduit(produitSupprime.nom, produitSupprime.quantite_stock, true); // Récupérer le stock
        afficherListeCourse(panier);
    }

    function mettreAJourQuantite(event) {
        const index = event.target.getAttribute('data-index');
        const nouvelleQuantite = parseInt(event.target.value, 10);
        const produit = panier[index];

        if (!isNaN(nouvelleQuantite) && nouvelleQuantite > 0) {
            // Vérifie la quantité en stock dans le localStorage
            const produitsStock = JSON.parse(localStorage.getItem('produits'));
            const produitStock = produitsStock.find(p => p.nom === produit.nom);

            // Si la nouvelle quantité dépasse le stock, avertir l'utilisateur
            if (nouvelleQuantite > produitStock.quantite_stock + produit.quantite_stock) {
                alert("Stock insuffisant !");
                event.target.value = produit.quantite_stock; // Réinitialiser à la quantité actuelle
                return;
            }

            // Ajuster le stock de l'article dans le localStorage
            ajusterStockProduit(produit.nom, nouvelleQuantite - produit.quantite_stock);

            // Met à jour la quantité dans le panier
            panier[index].quantite_stock = nouvelleQuantite;
            localStorage.setItem('panier', JSON.stringify(panier));

            afficherListeCourse(panier);
        } else {
            event.target.value = panier[index].quantite_stock; // Réinitialiser à la quantité actuelle
        }
    }

    function viderListe() {
        if (confirm('Voulez-vous vraiment vider la liste ?')) {
            panier.forEach(produit => {
                ajusterStockProduit(produit.nom, produit.quantite_stock, true); // Récupérer le stock pour tous les produits
            });
            panier = [];
            localStorage.removeItem('panier');
            afficherListeCourse(panier);
        }
    }

    viderListeButton.addEventListener('click', viderListe);

    afficherListeCourse(panier);
});
