const toolsModule = require('./tools');

const tagModule = {
    base_url: null,
    card_base_url: null,

    setBaseUrl: (url) => {
        tagModule.base_url = url + '/tags';
        tagModule.card_base_url = url + '/cards';
    },

    loadTags: async () => {
        const tags = await (await fetch(`${tagModule.base_url}`)).json();

        return tags;
    },

    showAddModal: async (e) => {
        const select = document.querySelector('#addTagModal select');

        while (select.options.length > 0)
            select.remove(0);

        const optionElem = document.createElement('option');
        optionElem.value = -1;
        optionElem.textContent = "Aucun tag selectionné";
        select.appendChild(optionElem);

        const tags = await tagModule.loadTags();

        for (const tag of tags) {
            const optionElem = document.createElement('option');
            optionElem.value = tag.id;
            optionElem.textContent = tag.name;
            select.appendChild(optionElem);
        }


        let modal = document.getElementById('addTagModal');
        //En utilisant closest (cf.makeListInDOM ) je récupère 
        // l'element commun unique qui est .panel et j'utilise le dataset pour récupérer l'id de la liste
        const cardId = e.target.closest('.box').dataset.cardId;
        //Sur mon modal je récupère mon input caché et j'affecte l'id
        modal.querySelector('input[name="card_id"]').value = cardId;

        // Je récupère l'élement HTML addTagButton
        // Je lui ajoute la classe is-active
        modal.classList.add('is-active');


    },

    handleAddFormSubmit: async (e) => {
        // on empeche le rechargement de la page et donc de prévenir du comportement par défaut d'un formulaire
        e.preventDefault();


        // c.f. la doc, je crée un nouvel instance de la classe FormData, qui permettra d'envoyer les données
        // du formulaire
        const formData = new FormData(e.target);

        console.log(formData.get('tag_id'));
        if (formData.get('tag_id') == "-1") {
            alert("Vous devez choisir un tag");
            return;
        }

        try {

            // On précise dans les options de fetch que la méthode est en POST et on lui donne le corps de la requete
            const res = await fetch(`${tagModule.card_base_url}/${formData.get('card_id')}/tags/${formData.get('tag_id')}`, {
                method: 'PUT',
            });

            if (!res.ok) {
                const error = await res.json();
                throw error;

            } else {
                // dans le cas ou ça se passe bien
                const card = await res.json();


                // je récupère une carte de puis l'API et donc je récupère le dernier tag en date (et donc dernière dans la liste)
                tagModule.makeDOMObject(card.tags[card.tags.length - 1]);
            }
        } catch (err) {
            alert("Impossible d'associer une tag");
            console.error(err);
        }

        // Je passe l'objet formData à makeTagInDom
        // app.makeTagInDOM(app.formDataToObj(formData));

        toolsModule.hideModals();
    },

    showDeleteModal: (e) => {
        if (confirm("Are you sure you wanna delete the tag ? ")) {
            tagModule.handleDelete(e);
        }
    },
    handleDelete: async (e) => {
        // TODO A MODIFIER
        try {
            const tagElem = e.target.closest('.panel');
            const tagId = tagElem.dataset.tagId;

            // Executer la requete vers le back pour acter la suppression
            // PAS BESOIN DE HEADER -> CAR PAS DE BODY LORS D'UN DELETE
            const res = await fetch(`${tagModule.base_url}/${tagId}`, {
                method: 'DELETE',
                // pas de body dans une methode delete
            });

            if (!res.ok) {
                const error = await res.json();
                throw error;
            } else {
                // Mettre à jour le DOM -> supprimer cette carte
                tagElem.remove();
            }
        } catch (error) {
            console.error(error);
            alert("Failed to delete tag");
        }
    },
    makeDOMObject: (obj) => {
        // récupère l'element HTML qui correspond au template
        let template = document.getElementById("template-tag");

        let newTag = document.importNode(template.content, true);

        // Je récupère depuis formData la valeur du nom
        newTag.querySelector('.tag-content').textContent = obj.name;

        newTag.querySelector(".tag").dataset.tagId = obj.id;

        let theGoodCardAddTagBtn = document.querySelector(`[data-card-id="${obj.card_has_tag.card_id}"] .add-tag-button`);

        // gestion de la suppression du tag
        newTag.querySelector('.delete').addEventListener('click', async (event) => {

            // dans event.target... j'ai mon bouton
            console.log(event.target);

            // objectif : faire la requête pour supprimer le tag de la carte
            const cardId = event.target.closest('[data-card-id]').dataset.cardId;
            const tagId = event.target.closest('[data-tag-id]').dataset.tagId;

            try {
                // plutôt facile, les ids transitent par l'url, pas besoin de body
                await fetch(`${tagModule.card_base_url}/${cardId}/tags/${tagId}`, {
                    method: 'DELETE'
                });

                // juste après avoir fait le fetch, en cas de réussite, je
                // supprime le tag du DOM
                const tagInDOM = event.target.closest('[data-tag-id]');
                tagInDOM.remove();
            } catch (e) {
                alert('Erreur lors de la suppression du tag');
            }
        });

        theGoodCardAddTagBtn.before(newTag);
    },

    addToDOM: () => {
    }

}

module.exports = tagModule;
