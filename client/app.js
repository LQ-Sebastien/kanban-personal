const toolsModule = require('./tools');
const tagModule = require('./tag');
const cardModule = require('./card');
const listModule = require('./list');

const app = {
  /**
   * PROPRIETES
   */
  // contient l'url de base de notre API
  base_url: 'http://localhost:3000/api',

  /**
   * L'initialisation de mon app
   */
  init: function () {
    console.log('app.init !');

    // Je configure les urls dans mes modules
    cardModule.setBaseUrl(app.base_url);
    listModule.setBaseUrl(app.base_url);
    toolsModule.setBaseUrl(app.base_url);
    tagModule.setBaseUrl(app.base_url);
    console.log("Set base urls");

    app.addListnersToActions();
    console.log("Added event listnerqs");

    app.loadData();
    console.log("Loading data");
  },



  loadData: async () => {
    try {

      let res = await fetch(`${app.base_url}/lists`);

      if (res.status !== 200) {
        // on récupère l'erreur, je la récupère et je la balance pour qu'il tombe dans le catch
        let error = await res.json();
        throw error;
      } else {
        // si tout s'est bien passé : on va passer à la création "visuel" des listes
        let lists = await res.json();

        for (const list of lists) {
          listModule.makeDOMObject(list);

          // Pour chaque liste je récupère ses cartes et j'appelle le makecardindom
          // Vu que la route nous envoi des cartes j'ai juste à appeler makeCardInDOM pour
          // les "dessiner"

          for (const card of list.cards) {
            cardModule.makeDOMObject(card);
            

            if (card.tags) {
              for (const tag of card.tags) {
                tagModule.makeDOMObject(tag);
              }
            }
          }
        }

        // une fois que j'ai construit toutes mes listes,
        // je vais rendre le div qui contient les listes SORTABLE
        listModule.setupSortableLists();
      }
    } catch (error) {
      console.error(error);
    }
  },

  // Une méthode gui gère l'ajout des events
  addListnersToActions: () => {
    // Je récupère l'element HTML du button
    let addListButton = document.getElementById('addListButton');
    // J'attache ensuite à l'évenement click mon callback showAddListModel défini plus haut
    addListButton.addEventListener('click', listModule.showAddModal);

    // Je récupère tous les bouttons de fermeture 
    let closeModalButtons = document.querySelectorAll('.modal .close');
    // pour chacun des boutons, j'ajoute l'event listner
    for (let button of closeModalButtons) {
      button.addEventListener('click', toolsModule.hideModals);
    }

    // formulaire ajouter une liste
    let addListForm = document.querySelector("#addListModal form");
    addListForm.addEventListener('submit', listModule.handleAddFormSubmit);

    // formulaire ajouter une carte
    let addCardForm = document.querySelector("#addCardModal form");
    addCardForm.addEventListener('submit', cardModule.handleAddFormSubmit);


    // formulaire ajouter une carte
    let addTagForm = document.querySelector("#addTagModal form");
    addTagForm.addEventListener('submit', tagModule.handleAddFormSubmit);
  },
};

// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);