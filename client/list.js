const toolsModule = require('./tools');
const cardModule = require('./card');

const listModule = {
    base_url: null,

    setBaseUrl: (url) => {
        listModule.base_url = url + '/lists';
    },

    showAddModal: () => {
        // Je récupère l'élement HTML addListButton
        let modal = document.getElementById('addListModal');
        // Je lui ajoute la classe is-active
        modal.classList.add('is-active');
    },

    handleAddFormSubmit: async (e) => {
        // on empeche le rechargement de la page et donc de prévenir du comportement par défaut d'un formulaire
        e.preventDefault();

        // c.f. la doc, je crée un nouvel instance de la classe FormData, qui permettra d'envoyer les données
        // du formulaire
        const formData = new FormData(e.target);

        try {
            /**
             * AVEC JSON 
             *  */
            // Je précise un entete particulière pour que le serveur comprenne que les données
            // que je lui envoi c'est du JSON
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');

            // On précise dans les options de fetch que la méthode est en POST et on lui donne le corps de la requete
            const res = await fetch(`${listModule.base_url}`, {
                method: 'POST',
                headers: headers,
                // Je convertis le formData 
                body: toolsModule.formDataToJSON(formData)
            });

            /**
             * AVEC FORM DATA 
             *  */
            // const res = await fetch(`${app.base_url}/lists`, {
            //   method: 'POST',
            //   body: formData
            // });

            if (!res.ok) {
                const error = await res.json();
                throw error;

            } else {
                // dans le cas ou ça se passe bien
                const list = await res.json();

                listModule.makeDOMObject(list);
            }
        } catch (err) {
            alert("Impossible de créer une liste");
            console.error(err);
        }

        // Je passe l'objet formData à makeListInDom
        // app.makeListInDOM(app.formDataToObj(formData));

        toolsModule.hideModals();
    },

    showEditModal: (e) => {
        // Je récupère l'élement HTML form a coté de mon h2
        let form = e.target.closest('.column').querySelector('form');
        e.target.classList.add('is-hidden');
        // Je lui ajoute la classe is-active
        form.classList.remove('is-hidden');
    },
    handleEditFormSubmit: async (e) => {

        // on empeche le rechargement de la page et donc de prévenir du comportement par défaut d'un formulaire
        e.preventDefault();

        const listId = e.target.closest('.panel').dataset.listId;

        const h2Elem = document.querySelector(`[data-list-id="${listId}"] h2`);

        // c.f. la doc, je crée un nouvel instance de la classe FormData, qui permettra d'envoyer les données
        // du formulaire
        const formData = new FormData(e.target);

        try {
            // Je précise un entete particulière pour que le serveur comprenne que les donénes
            // que je lui envoi c'est du JSON
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');

            // On précise dans les options de fetch que la méthode est en POST et on lui donne le corps de la requete
            const res = await fetch(`${listModule.base_url}/${listId}`, {
                method: 'PATCH',
                headers: headers,
                // Je convertis le formData 
                body: toolsModule.formDataToJSON(formData)
            });

            if (!res.ok) {

                const error = await res.json();
                throw error;

            } else {
                h2Elem.textContent = formData.get('name');

            }
        } catch (err) {
            console.error(err);
        }

        h2Elem.classList.remove('is-hidden');
        e.target.classList.add('is-hidden');
    },
    showDeleteModal: (e) => {
        // Je remonte jusqu'a l'élement parent .panel pour récendre au niveau du panel-block
        const panelBlockElem = e.target.closest('.panel').querySelector('.panel-block');
        // Si il a des enfants alors j'ai des cartes
        if (panelBlockElem.children.length > 0) {
            alert("You cannot delete a list with cards in it !");
        } else {
            if (confirm("Are you sure you wanna delete the list ? ")) {
                listModule.handleDelete(e);
            }
        }
    },
    handleDelete: async (e) => {
        try {
            const listElem = e.target.closest('.panel');
            const listId = listElem.dataset.listId;

            // Executer la requete vers le back pour acter la suppression
            // PAS BESOIN DE HEADER -> CAR PAS DE BODY LORS D'UN DELETE
            const res = await fetch(`${listModule.base_url}/${listId}`, {
                method: 'DELETE',
                // pas de body dans une methode delete
            });

            if (!res.ok) {
                const error = await res.json();
                throw error;
            } else {
                // Mettre à jour le DOM -> supprimer cette carte
                listElem.remove();
            }
        } catch (error) {
            console.error(error);
            alert("Failed to delete list");
        }
    },
    handleDragCard: (event) => {
        // je détermine les ids de liste arrivée et départ
        const startListId = event.from.closest('.column').dataset.listId;
        const endListId = event.to.closest('.column').dataset.listId;

        // je choppe toutes les cartes des 2 listes
        const startCards = event.from.querySelectorAll('.box');
        const endCards = event.to.querySelectorAll('.box');

        // je retrie chaque tableau de cartes individuellement
        cardModule.updateCards(startCards, startListId);
        cardModule.updateCards(endCards, endListId);
    },
    makeDOMObject: (obj) => {

        // récupère l'element HTML qui correspond au template
        let template = document.getElementById("template-list");

        let newList = document.importNode(template.content, true);

        // dès qu'on a créé la liste
        // on va la rendre "triable" avec sortableJS
        // je vais utiliser un querySelector, pour trouver
        // dans newList, le div qui accueillera les cartes
        let cardsContainer = newList.querySelector('.panel-block');

        // on crée une instance de sortableJS sur le div qui contiendra les cartes
        new Sortable(cardsContainer, {
            // groupage par cards afin de pouvoir tirer d'une liste a l'autre
            group: 'cards',
            // méthode appelée a la fin du drag and drop (quand on lache quoi)
            onEnd: listModule.handleDragCard
        });

        // Je récupère depuis formData la valeur du nom
        newList.querySelector('h2').textContent = obj.name;

        // Je récupère depuis le addListButton la colonne parente la plus proche
        const lastColumn = document.getElementById('addListButton').closest('.column');

        // au moment ou je crée ma list j'ajoute l'évent listener pour gérer la création d'une carte
        newList.querySelector(".add-card-btn").addEventListener('click', cardModule.showAddModal);
        newList.querySelector('.delete-list-btn').addEventListener('click', listModule.showDeleteModal);

        newList.querySelector("h2").addEventListener('dblclick', listModule.showEditModal);
        newList.querySelector("form").addEventListener('submit', listModule.handleEditFormSubmit);

        const timestamp = (new Date()).getTime();
        // Pour l'instant, lors qu'on va créer une liste, tant qu'on ne le fait pas en base
        // j'ai pas d'id
        // newList.querySelector(".column").dataset.listId = obj.id ? obj.id : timestamp;
        newList.querySelector(".column").dataset.listId = obj.id || timestamp;

        // J'ajoute ensuite ma nouvelle liste AVANT la dernière colonne dans le DOM
        lastColumn.before(newList);
    },
    updateLists: (event) => {
        // je commence par récupérer toutes mes listes
        const lists = document.querySelectorAll('.column[data-list-id]');

        // j'itère sur mes listes
        lists.forEach(async (list, index) => {
            // pour chaque liste, je fais ma requête pour changer
            // sa position

            // l'id de la liste
            const listId = list.dataset.listId;

            // je définis mes headers
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');

            const data = new FormData();

            // ma position est l'ordre de l'élément dans le DOM
            data.set('position', index);

            await fetch(`${listModule.base_url}/${listId}`, {
                method: 'PATCH',
                // je transforme mon body en JSON
                body: toolsModule.formDataToJSON(data),
                headers,
            });
        })
    },
    setupSortableLists: () => {
        // récupération du div qui contient les listes
        const listsContainer = document.querySelector('.card-lists');

        new Sortable(listsContainer, {
            // pour ne pas pouvoir tirer la dernière colonne
            // qui contient le bouton
            filter: '.list-btn',
            onEnd: listModule.updateLists,
        });
    },
    addToDOM: () => {
    }

}

module.exports = listModule;