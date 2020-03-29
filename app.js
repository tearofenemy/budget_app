var budgetController = (function() {

    function Expense(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    function Income(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        allItems: {
            allExp: [],
            allInc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };
})();

var UIController = (function() {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return {
        getInputs: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },
        getDOM: function() {
            return DOMStrings;
        }
    };

})();

var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM = UIController.getDOM();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(e) {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
    };


    var ctrlAddItem = function() {
        var inputs = UIController.getInputs();
    };

    return {
        init: function() {
            setupEventListeners();
        }
    };


})(budgetController, UIController);

controller.init();