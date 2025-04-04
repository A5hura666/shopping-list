import produits from '../public/liste_produits_quotidien.json';
const { afficherProduits } = require('../src/main.js');

const mockProduits = [
    { nom: "Produit A", quantite_stock: 10, prix_unitaire: 5 },
    { nom: "Produit B", quantite_stock: 5, prix_unitaire: 10 }
  ];

beforeEach(() => {
  document.body.innerHTML = `
    <div id="liste-produits"></div>
    <span id="compteur-produits"></span>
  `;
});

test('afficherProduits affiche correctement le nombre de produits', () => {

  afficherProduits(produits);
  
  let compteur = document.getElementById('compteur-produits');
  expect(compteur.innerText).toBe(`${produits.length} produits`);
});

test('afficher les produits après tri par nom', () => {
    document.body.innerHTML = `
        <div id="liste-produits"></div>
        <span id="compteur-produits"></span>
        <select id="tri">
            <option value="default">-- Trier --</option>
            <option value="prix">Par prix</option>
            <option value="nom">Par nom</option>
        </select>
    `;
    // Ajouter un mock de produits dans le DOM
    afficherProduits(produits);

    // Simuler un changement dans le select de tri
    const triSelect = document.getElementById('tri');
    triSelect.value = 'nom'; // Choisir "Par nom"
    const event = new Event('change');
    triSelect.dispatchEvent(event);

    // Vérifier que les produits sont triés par nom
    const produitListe = document.querySelectorAll('#liste-produits li');
    expect(produitListe[0].textContent).toContain('Produit A');
    expect(produitListe[1].textContent).toContain('Produit B');
    expect(produitListe[2].textContent).toContain('Produit C');
});