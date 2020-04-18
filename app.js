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
        },
        budget: 0,
        percent: 0
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(element) {
            sum += element.value;
        });
        data.totals[type] = sum;
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

        deleteItem: function(type, id) {

            var item_ids, index;

            item_ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = item_ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function() {
            calculateTotal('inc');
            calculateTotal('exp');

            data.budget = data.totals.inc - data.totals.exp;

            if (data.totals.inc > 0) {
                data.percent = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percent = -1;
            }

        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percent: data.percent
            };
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
        expenseContainer: ".expenses__list",
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentLabel: '.budget__expenses--percentage',
        container: '.container'
    };

    return {
        getInputs: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            if (type === "inc") {
                element = DOMStrings.icomeContainer;
                html = `<div class="item clearfix" id="inc-%id%"><div class = "item__description">%description%</div>
                <div class = "right clearfix"><div class = "item__value">+%value%</div><div class = "item__delete">
                    <button class = "item__delete--btn"><i class = "ion-ios-close-outline"></i></button>
                    </div></div></div>`;
            } else if (type === "exp") {
                element = DOMStrings.expenseContainer;
                html = `<div class="item clearfix" id="exp-%id%"><div class = "item__description">%description%</div><div class = "right clearfix"><div class = "item__value">-%value%</div><div class = "item__percentage"> 21 % </div> 
                <div class = "item__delete"><button class = "item__delete--btn"><i class = "ion-ios-close-outline"></i></button>
                    </div></div ></div>`;
            }

            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);

            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
        },

        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
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

        displayBudget: function(obj) {
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExp;

            if (obj.percent > 0) {
                document.querySelector(DOMStrings.percentLabel).textContent = obj.percent + '%';
            } else {
                document.querySelector(DOMStrings.percentLabel).textContent = '---';
            }
        },

        getDOM: function() {
            return DOMStrings;
        }
    };
})();

var controller = (function(budgetCtrl, UICtrl) {

    var updateBudget = function() {

        budgetCtrl.calculateBudget();

        var budget = budgetCtrl.getBudget();

        UICtrl.displayBudget(budget);
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

    var ctrlDeleteItem = function(event) {
        var splitId, itemId, type, ID;

        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemId) {
            splitId = itemId.split('-');
            type = splitId[0];
            ID = parseInt(splitId[1]);

            budgetController.deleteItem(type, ID);
            UIController.deleteListItem(itemId);

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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    return {
        init: function() {
            setupEventListeners();
            UIController.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percent: 0
            });
        }
    };
})(budgetController, UIController);

controller.init();