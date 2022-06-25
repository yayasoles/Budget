
var budgetController = (function () {
    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            totalExpenses: 0,
            totalIncome: 0,
        }
    }
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    return {
        addItem: function (type, description, value) {
            var newItem,ID;
            if(data.allItems[type].length>0){
            // var ID = data.allItems[type].pop().id + 1;
            ID=data.allItems[type][data.allItems[type].length-1].id + 1 
            }else{
                ID=0;   
            }
            if (type === 'exp') {
                newItem = new Expense(ID, description, value);
            } else if (type === 'inc') {
                newItem = new Income(ID, description, value);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        testing:function(){
            console.log(data); 
        }
    }
})();

var UIController = (function () {
    var DOMstrings = {
        type: '.add__type',
        description: '.add__description',
        value: '.add__value',
        add: '.add__btn'
    }
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.type).value,// will be inc or exp
                description: document.querySelector(DOMstrings.description).value,
                value: document.querySelector(DOMstrings.value).value,
            };
        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();
var Controller = (function (budgetCtrl, UICtrl) {
    var setUpEventListeners = function () {
        var DOMstrings = UICtrl.getDOMstrings();
        document.querySelector(DOMstrings.add).addEventListener('click', ctrllAddItem);

        document.addEventListener('keypress', (event) => {
            if (event.code === 'Enter' || event.which === 13 || event.keyCode === 13) {
                //    call the controlAddItem Function
                ctrllAddItem();
            }
        });
    };
    var ctrllAddItem = function () {
        var input, newItem;
        //    1. get the feild input data
        input = UICtrl.getInput();
        // 2. add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        //   3.add the item to the user interface
       /*
          4.calculate the budget  
          5.display the budget on the user interface
          */
    };
    return {
        init: function () {
            setUpEventListeners();
        },
    }
})(budgetController, UIController);

Controller.init();
