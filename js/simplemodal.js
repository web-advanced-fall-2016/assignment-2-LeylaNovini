class SimpleModal {
    constructor(cas = 'modal') {
        this.contentAttributeSelector = cas;
        this.contentAttribute = cas.replace(/(\-\w)/g, (m) => m[1].toUpperCase());

        this.stylesheet = this.addStyleSheet();
        this.registerModals();
    }
    buildModal() {
        this.modalPanel = document.createElement('div');
        this.modalPanel.setAttribute('id', `${this.contentAttributeSelector}-layer`);
    }
    addStyleSheet() {
        var style = document.createElement("style");
        style.appendChild(document.createTextNode(`#${this.contentAttributeSelector}-layer {
                                                        position: fixed;
                                                        display: flex;
                                                        justify-content: center;
                                                        align-items: center;
                                                        top: 0;
                                                        left: 0;
                                                        width: 100vw;
                                                        height: 100vh;
                                                        background-color: rgba(0, 0, 0, 0.7);
                                                        z-index:99999;
                                                    }
                                                    [data-${this.contentAttributeSelector}-content] {
                                                        display: none;
                                                    }`));
        document.head.appendChild(style);
        return style.sheet;
    }
    registerModals() {
        let modals = document.querySelectorAll(`[data-${this.contentAttributeSelector}]`);
        console.log(modals);
        for (let modal of modals) {
            modal.addEventListener('click', (evnt) => this.handleClick(evnt), false);
        }
    }
    parseOptions(str) {
        return JSON.parse(str);
    }
    handleClick(evnt) {
        let options = this.parseOptions(evnt.target.dataset[this.contentAttribute]);
        this.openModal(options);
    }

    modalClickHandler(evnt) {
        evnt.stopPropagation();
        if (evnt.target === this.modalPanel) {
            this.closeModal();
        }
    }
    openModal(options) {
        this.closeModal();
        let content;
        this.buildModal();
        if (options.contentId) {
            let contentHolderNode = document.querySelector(`[data-${this.contentAttributeSelector}-content=${options.contentId}]`);
            content = contentHolderNode.innerHTML || 'No Content Found!';
            this.modalPanel.innerHTML = content;
        } else if (options.contentURL) {
            fetch(options.contentURL).then(function(response) {
                return response.text();
            }).then(function(text) {
                document.querySelector('#modal-layer').innerHTML = text;
            });
        }


        //take care of closing logic
        document.body.appendChild(this.modalPanel);
        this.modalPanel.addEventListener('click', (evnt) => this.modalClickHandler(evnt, this.modalPanel));

        this.registerModals();
    }
    closeModal() {
        if (this.modalPanel) {
            document.body.removeChild(this.modalPanel);
            this.modalPanel = null;
        }
    }
}