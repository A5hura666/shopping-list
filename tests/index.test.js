/**
 * @jest-environment jsdom
 */
import {
    afficherProduits,
    searchProductsByName,
    sortProductsByPriceAsc,
    sortProductsByNameAsc,
    ajouterAuPanier
} from '../src/main.js';

describe('Gestion des produits', () => {
    let produits;

    beforeEach(() => {
        document.body.innerHTML = `
            <span id="compteur-produits"></span>
            <ul id="liste-produits"></ul>
        `;

        produits = [
            { nom: 'Pomme', quantite_stock: 10, prix_unitaire: 5 },
            { nom: 'Banane', quantite_stock: 15, prix_unitaire: 2 },
            { nom: 'Carotte', quantite_stock: 5, prix_unitaire: 3 }
        ];
    });

    test('Affichage des produits dans le DOM', () => {
        afficherProduits(produits);
        const items = document.querySelectorAll('#liste-produits li');
        expect(items.length).toBe(3);
    });

    test('Tri des produits par prix', () => {
        const sorted = sortProductsByPriceAsc(produits);
        expect(sorted[0].nom).toBe('Banane');
        expect(sorted[1].nom).toBe('Carotte');
        expect(sorted[2].nom).toBe('Pomme');
    });

    test('Tri des produits par nom', () => {
        const sorted = sortProductsByNameAsc(produits);
        expect(sorted[0].nom).toBe('Banane');
        expect(sorted[1].nom).toBe('Carotte');
        expect(sorted[2].nom).toBe('Pomme');
    });

    test('Recherche de produits', () => {
        const result = searchProductsByName(produits, 'Pom');
        expect(result.length).toBe(1);
        expect(result[0].nom).toBe('Pomme');
    });

    test('Ajout au panier avec mise à jour du stock', () => {
        localStorage.setItem('produits', JSON.stringify(produits));
        localStorage.setItem('panier', JSON.stringify([]));

        const bouton = document.createElement('button');
        bouton.setAttribute('data-id', 'Pomme');

        ajouterAuPanier(produits, bouton);

        const panier = JSON.parse(localStorage.getItem('panier'));
        const stockProduits = JSON.parse(localStorage.getItem('produits'));

        expect(panier.length).toBe(1);
        expect(panier[0].nom).toBe('Pomme');
        expect(panier[0].quantite_stock).toBe(1);
        expect(stockProduits[0].quantite_stock).toBe(9);
    });
});
