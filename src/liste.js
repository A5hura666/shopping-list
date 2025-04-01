import './style.css';

document.addEventListener('DOMContentLoaded', () => {
    let panier = JSON.parse(localStorage.getItem('panier')) || [];
    const listeCourseBody = document.getElementById('liste-course-body');

    function afficherListeCourse(panier) {
        listeCourseBody.innerHTML = '';
        panier.forEach((produit, index) => {
            const tr = document.createElement('tr');
            tr.classList.add('border-b', 'border-b-gray-100');

            tr.innerHTML = `
                <td class="py-4 px-4">${produit.nom}</td>
                <td class="py-4 px-4">${produit.prix_unitaire.toFixed(2)}</td>
                <td class="py-4 px-4">
                    <input type="number" class="quantity-input border rounded px-2 py-1 w-16"
                           data-index="${index}" value="${produit.quantite_stock}" min="1">
                </td>
                <td class="py-4 px-4 sous-total">${(produit.prix_unitaire * produit.quantite_stock).toFixed(2)}</td>
                <td class="py-4 px-4">
                    <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded cursor-pointer"
                            data-index="${index}">Supprimer</button>
                </td>
            `;

            listeCourseBody.appendChild(tr);
        });

        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', supprimerProduit);
        });

        const quantityInputs = document.querySelectorAll('.quantity-input');
        quantityInputs.forEach(input => {
            input.addEventListener('change', mettreAJourQuantite);
        });
    }

    function supprimerProduit(event) {
        const index = event.target.getAttribute('data-index');
        panier.splice(index, 1);
        localStorage.setItem('panier', JSON.stringify(panier));
        afficherListeCourse(panier);
    }

    function mettreAJourQuantite(event) {
        const index = event.target.getAttribute('data-index');
        const nouvelleQuantite = parseInt(event.target.value, 10);
        if (!isNaN(nouvelleQuantite) && nouvelleQuantite > 0) {
            panier[index].quantite_stock = nouvelleQuantite;
            localStorage.setItem('panier', JSON.stringify(panier));
            afficherListeCourse(panier);
        } else {
            event.target.value = panier[index].quantite_stock;
        }
    }

    afficherListeCourse(panier);
});
