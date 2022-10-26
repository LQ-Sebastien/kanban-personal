const toolsModule = {
    base_url: null,

    setBaseUrl: (url) => {

    },

    hideModals: () => {
        // tous les modals
        let modals = document.querySelectorAll(".modal");

        // Pour chacun des modals je retire la clase .is-active
        for (let modal of modals) {
            modal.classList.remove('is-active');
        }
    },
    /**
     * Outils
     */
    formDataToObj: (formData) => {
        const obj = {};
        //conversion de formData vers obj
        // pour chaque clef de mon objet formData
        for (const key of formData.keys()) {
            // je récupère la valeur de chaque clef et je le stocke dans mon nouvel objet
            obj[key] = formData.get(key);
        }

        return obj;
    },
    formDataToJSON: (formData) => {
        const obj = toolsModule.formDataToObj(formData);
        return JSON.stringify(obj);
    }
}

module.exports = toolsModule;