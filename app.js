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
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if (type === "exp") {
                newItem = new Expense(ID, des, val);
            } else if (type === "inc") {
                newItem = new Income(ID, des, val);
            }

            data.allItems[type].push(newItem);
            return newItem;
        },
        testing: function() {
            console.log(data);
        }
    };
})();

var UIController = (function() {
    var DOMStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        icomeContainer: ".income__list",
        expenseContainer: ".expenses__list"
    };

    return {
        getInputs: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            if (type === "inc") {
                element = DOMStrings.icomeContainer;
                html = `<div class="item clearfix" id="income-%id%"><div class = "item__description">%description%</div>
                <div class = "right clearfix"><div class = "item__value">+%value%</div><div class = "item__delete">
                    <button class = "item__delete--btn"><i class = "ion-ios-close-outline"></i></button>
                    </div></div></div>`;
            } else if (type === "exp") {
                element = DOMStrings.expenseContainer;
                html = `<div class="item clearfix" id="expense-%id%"><div class = "item__description">%description%</div><div class = "right clearfix"><div class = "item__value">-%value%</div><div class = "item__percentage"> 21 % </div> 
                <div class = "item__delete"><button class = "item__delete--btn"><i class = "ion-ios-close-outline"></i></button>
                    </div></div ></div>`;
            }

            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);

            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
        },

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(element, index, arr) {
                element.value = '';
            });

            fieldsArr[0].focus();
        },

        getDOM: function() {
            return DOMStrings;
        }
    };
})();

var controller = (function(budgetCtrl, UICtrl) {


    var updateBudget = function() {

    };

    var ctrlAddItem = function() {
        var inputs, newItem;
        inputs = UICtrl.getInputs();

        if (inputs.description !== "" && !isNaN(inputs.value) && inputs.value > 0) {
            newItem = budgetCtrl.addItem(inputs.type, inputs.description, inputs.value);
            UICtrl.addListItem(newItem, inputs.type);
            UICtrl.clearFields(inputs);

            updateBudget();
        }
    };

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOM();

        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

        document.addEventListener("keypress", function(e) {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
    };

    return {
        init: function() {
            setupEventListeners();
        }
    };
})(budgetController, UIController);

controller.init();