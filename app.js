const budgetController = (function() {


})();

const UIController = (function() {

    const DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return {
        getInputs() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },
        getDOM() {
            return DOMStrings;
        }
    };

})();

const controller = (function(budgetCtrl, UICtrl) {

    const setupEventListeners = () => {
        let DOM = UIController.getDOM();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', (e) => {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
    };


    const ctrlAddItem = () => {
        let inputs = UIController.getInputs();
    };

    return {
        init() {
            setupEventListeners();
        }
    };


})(budgetController, UIController);

controller.init();