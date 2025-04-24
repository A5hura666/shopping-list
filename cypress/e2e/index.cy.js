describe("page index.html ", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5174/index.html");
  });

  it("connexion à la page", () => {
    cy.visit("http://localhost:5174/index.html");
  });

  it("vérifier si ma liste des produits est affiché", () => {
    cy.get("#liste-produits").should("exist");
    cy.get("li").should("have.length", 98);
    cy.get("#compteur-produits").should("exist");
    cy.get("#compteur-produits").should("have.text", "98 produits");
  });

  it("recherche d'un produit", () => {
    cy.get("#recherche").should("exist");
    cy.get("#recherche").type("pomme");
    cy.get("#liste-produits li")
      .first()
      .should("contain", "Pomme")
      .should("contain", "12.74 €");
  });

  it("test des filtres des produits par noms", () => {
    cy.get("#tri").should("exist");
    cy.get("#tri").select("nom");
    cy.get("#liste-produits li")
      .first()
      .should("contain", "Abricot")
      .should("contain", "11.31 €");
  });

  it("test des filtres des produits par le prix", () => {
    cy.get("#tri").should("exist");
    cy.get("#tri").select("prix");
    cy.get("#liste-produits li")
      .first()
      .should("contain", "Sel")
      .should("contain", "0.7 €");
  });

  it("test du bouton réinitialiser", () => {
    cy.get("#tri").should("exist");
    cy.get("#tri").select("prix");
    cy.get("#reset-filtres").should("exist");
    cy.get("#reset-filtres").click();
    cy.get("#liste-produits li")
      .first()
      .should("contain", "Pomme")
      .should("contain", "12.74 €");
  });

  it("test d'ajout au panier", () => {
    cy.get("#liste-produits li")
      .first()
      .find("[data-id='Pomme']")
      .should("exist")
      .click();

    cy.window().then((win) => {
      const produits = JSON.parse(win.localStorage.getItem("panier"));
      expect(produits).to.deep.include({
        nom: "Pomme",
        quantite_stock: 1,
        prix_unitaire: 12.74,
      });
    });
  });

  it("test navigation vers la page panier", () => {
    cy.get("#goToBasket").should("exist");
    cy.get("#goToBasket").click();
    cy.url().should("include", "liste.html");
  });

  //test liste.html

  it("test si les produis sont affichés dans le panier", () => {
    cy.get("#liste-produits li")
      .first()
      .find("[data-id='Pomme']")
      .should("exist")
      .click();
    cy.get("#liste-produits li")
      .first()
      .find("[data-id='Pomme']")
      .should("exist")
      .click();
    cy.get("#goToBasket").click();
    cy.url().should("include", "liste.html");
    cy.get("#liste-course-body").should("exist");
    cy.get("#liste-course-body tr").should("have.length", 1);
  });

  it("augmente manuellement la quantité d’un produit dans le panier", () => {
    // Ajouter le produit une seule fois
    cy.get("#liste-produits li")
      .first()
      .find("[data-id='Pomme']")
      .should("exist")
      .click();

    // Aller au panier
    cy.get("#goToBasket").click();
    cy.url().should("include", "liste.html");

    // Vérifier que le panier contient bien une ligne
    cy.get("#liste-course-body tr").should("have.length", 1);

    // Vérifier que la quantité est 1 au départ
    cy.get("[data-index='0']").should("have.value", "1");

    // Augmenter la quantité à 2 (en modifiant l’input number)
    cy.get("[data-index='0']").clear().type("2");

    // Vérifier que l’input a bien la nouvelle valeur
    cy.get("[data-index='0']").should("have.value", "2");

    cy.get("#total-general").should("contain", "Total général: 25.48 €"); // Vérifier le total général

    cy.get(".sous-total").should("contain", "25.48"); // Vérifier le sous-total
  });

  it("test de la suppression d'un produit du panier", () => {
    cy.get("#liste-produits li")
      .first()
      .find("[data-id='Pomme']")
      .should("exist")
      .click();
    cy.get("#goToBasket").click();
    cy.url().should("include", "liste.html");
    cy.get("#liste-course-body tr").should("have.length", 1);
    cy.get("[data-indexDelete='0']").click();
    cy.get("#liste-course-body tr").should("have.length", 0);
  });
});
