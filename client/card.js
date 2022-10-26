const toolsModule = require('./tools');
const tagModule = require('./tag');

const cardModule = {
    base_url: null,

    setBaseUrl: (url) => {
        cardModule.base_url = url + '/cards';
    },

    showAddModal: (e) => {
        // Je récupère l'élement HTML addListButton
        let modal = document.getElementById('addCardModal');
        // Je lui ajoute la classe is-active
        modal.classList.add('is-active');

        //En utilisant closest (cf.makeListInDOM ) je récupère 
        // l'element commun unique qui est .panel et j'utilise le dataset pour récupérer l'id de la liste
        const listId = e.target.closest('.panel').dataset.listId;
        //Sur mon modal je récupère mon input caché et j'affecte l'id
        modal.querySelector('input[name="list_id"]').value = listId;
    },

    handleAddFormSubmit: async (e) => {

        // on empeche le rechargement de la page et donc de prévenir du comportement par défaut d'un formulaire
        e.preventDefault();
        // c.f. la doc, je crée un nouvel instance de la classe FormData, qui permettra d'envoyer les données
        // du formulaire
        const formData = new FormData(e.target);

        try {
            // Je précise un entete particulière pour que le serveur comprenne que les donénes
            // que je lui envoi c'est du JSON
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');

            // On précise dans les options de fetch que la méthode est en POST et on lui donne le corps de la requete
            const res = await fetch(`${cardModule.base_url}`, {
                method: 'POST',
                headers: headers,
                // Je convertis le formData 
                body: toolsModule.formDataToJSON(formData)
            });

            if (!res.ok) {

                const error = await res.json();
                throw error;

            } else {
                // dans le cas ou ça se passe bien
                const card = await res.json();

                cardModule.makeDOMObject(card);
            }
        } catch (err) {
            alert("Impossible de créer une carte");
            console.error(err);
        }
        toolsModule.hideModals();
    },

    showEditModal: (e) => {
        // Je récupère l'élement HTML form a coté de mon h2
        let form = e.target.closest('.columns').querySelector('form');
        e.target.closest('.columns').querySelector('.card-name').classList.add('is-hidden');
        
        const cardName = e.target.closest('.columns').querySelector('.card-name').textContent;
        // dans mon formulaire, je cible linput et je mets le nom actuel de ma carte
        form.querySelector('input[name="content"]').value = cardName;
        // Je lui ajoute la classe is-active
        form.classList.remove('is-hidden');
    },
    handleEditFormSubmit: async (e) => {

        // on empeche le rechargement de la page et donc de prévenir du comportement par défaut d'un formulaire
        e.preventDefault();
        const cardId = e.target.closest('.box').dataset.cardId;
        console.log("CARD ID", cardId);
        const cardNameElm = document.querySelector(`[data-card-id="${cardId}"] .card-name`);

        // c.f. la doc, je crée un nouvel instance de la classe FormData, qui permettra d'envoyer les données
        // du formulaire
        const formData = new FormData(e.target);

        try {
            // Je précise un entete particulière pour que le serveur comprenne que les donénes
            // que je lui envoi c'est du JSON
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');

            // On précise dans les options de fetch que la méthode est en POST et on lui donne le corps de la requete
            const res = await fetch(`${cardModule.base_url}/${cardId}`, {
                method: 'PATCH',
                headers: headers,
                // Je convertis le formData 
                body: toolsModule.formDataToJSON(formData)
            });

            if (!res.ok) {

                const error = await res.json();
                throw error;

            } else {
                cardNameElm.textContent = formData.get('content');
                // je définis la nouvelle couleur de la bordure de la carte
                e.target.closest('.box').style.borderColor = formData.get('color');
            }
        } catch (err) {
            console.error(err);
        }

        cardNameElm.classList.remove('is-hidden');
        e.target.classList.add('is-hidden');
    },

    showDeleteModal: (e) => {
        if (confirm("Êtes-vous sur de vouloir supprimer cette carte ?")) {
            cardModule.handleDelete(e);
        }
    },
    updateCards: async (cards, listId) => {
        cards.forEach(async (card, index) => {
            // je prépare mes headers
            const headers = new Headers();
            // afin d'envoyer du JSON
            headers.append('Content-Type', 'application/json');

            // création de formData qui sera plus tard transformé en JSON
            let data = new FormData();

            // je connais l'id de liste (passé en param)
            data.set('list_id', listId);
            // je connais la position (index dans le tableau de cartes du DOM)
            data.set('position', index);

            // je fais la requête.
            await fetch(`${cardModule.base_url}/${card.dataset.cardId}`, {
                method: 'PATCH',
                body: toolsModule.formDataToJSON(data),
                headers,
            });
        });
    },
    handleDelete: async (e) => {
        try {
            const cardElem = e.target.closest('.box');
            const cardId = cardElem.dataset.cardId;

            // PAS BESOIN DE HEADER -> CAR PAS DE BODY LORS D'UN DELETE
            const res = await fetch(`${cardModule.base_url}/${cardId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const error = await res.json();
                throw error;
            } else {
                // Mettre à jour le DOM -> supprimer cette carte
                cardElem.remove();
            }
        } catch (error) {
            console.error(error);
            alert("Failed to delete card");
        }

    },
    makeDOMObject: (obj) => {
        let template = document.getElementById("template-card");

        let newCard = document.importNode(template.content, true);

        newCard.querySelector('.card-name').textContent = obj.content;
        newCard.querySelector('.box').dataset.cardId = obj.id;

        newCard.querySelector('.box').style.border = "2px solid white";
        // si j'ai une couleur...
        if (obj.color) {
            // je définis les bordures de ma carte
            newCard.querySelector('.box').style.borderColor = obj.color;

            // je définis aussi la valeur de mon input de couleur
            newCard.querySelector('.color-input').value = obj.color;
        } else {
            // si pas de couleur, l'input de couleur sera blanc
            newCard.querySelector('.color-input').value = "#FFFFFF"
        }

        newCard.querySelector('.edit-card-button').addEventListener('click', cardModule.showEditModal)
        newCard.querySelector('.delete-card-button').addEventListener('click', cardModule.showDeleteModal);

        newCard.querySelector("form").addEventListener('submit', cardModule.handleEditFormSubmit);
        newCard.querySelector('.add-tag-button').addEventListener('click', tagModule.showAddModal);



        let theGoodList = document.
            querySelector(`[data-list-id="${obj.list_id}"] .panel-block`);

        theGoodList.appendChild(newCard);
    },

    addToDOM: () => {

    }
}

module.exports = cardModule;
