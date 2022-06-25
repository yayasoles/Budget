
var budgetController = (function () {
    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1,
    }
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calcPercentage = function (totalinc) {
        if (totalinc > 0) {
            this.percentage = Math.floor((this.value / totalinc) * 100);
        }
    };
    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach((current, index, array) => {
            sum += current.value;
        });
        data.totals[type] = sum;
    };
    return {
        addItem: function (type, description, value) {
            var newItem, ID;
            if (data.allItems[type].length > 0) {
                // var ID = data.allItems[type].pop().id + 1;
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            } else {
                ID = 0;
            }
            if (type === 'exp') {
                newItem = new Expense(ID, description, value);
            } else if (type === 'inc') {
                newItem = new Income(ID, description, value);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        calculateBudget: function () {
            // calculate total  income and  expense
            calculateTotal('inc');
            calculateTotal('exp');

            // calculate Budget
            data.budget = data.totals.inc - data.totals.exp;
            // calculate the percentage
            data.percentage = Math.floor((data.totals.exp / data.totals.inc) * 100);
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalexp: data.totals.exp,
                totalinc: data.totals.inc,
                percentage: data.percentage,
            };
        },
        deleteItem: function (type, id) {
            var ids, index;
            var ids = data.allItems[type].map((current, index, array) => {
                return current.id;
            });

            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);

            }

        },
        calculatePercentages: function () {
            var totalinc;
            //  [20,10,40] 100
            // 10/100*
            // 10/100*
            // 40/100*100
            totalinc = data.totals.inc;
            data.allItems.exp.forEach((current, index, array) => {
                current.calcPercentage(totalinc);
            });
        },
        getPercentage: function () {
            var percentages = data.allItems.exp.map((current, index, array) => {
                return current.getPercentage();
            });
            return percentages;
        },
        testing: function () {
            console.log(data);
        }
    }
})();

var UIController = (function () {
    var DOMstrings = {
        type: '.add__type',
        description: '.add__description',
        value: '.add__value',
        add: '.add__btn',
        incomesContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLevel: '.budget__value',
        incomeLevel: '.budget__income--value',
        expenseLevel: '.budget__expenses--value',
        percentageLevel: '.budget__expenses--percentage',
        container: '.container',
        expensePercentageLevel: '.item__percentage',
    }
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.type).value,// will be inc or exp
                description: document.querySelector(DOMstrings.description).value,
                value: parseFloat(document.querySelector(DOMstrings.value).value),
            };
        },
        addListItem: function (obj, type) {
            var html, newHtml, element;
            // create HTML string with placholder text
            if (type === 'inc') {
                element = DOMstrings.incomesContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // replace the place holder text with the actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            // insert the html into the dom
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        clearFeilds: function () {
            var fields, fieldsArray;
            // document.querySelector(DOMstrings.description).value = '';
            // document.querySelector(DOMstrings.value).value = '';
            fields = document.querySelectorAll(DOMstrings.description + ' , ' + DOMstrings.value);
            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach((current, index, array) => {
                current.value = '';
            });
            fieldsArray[0].focus();

        },
        displayBudget: function (obj) {
            document.querySelector(DOMstrings.budgetLevel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLevel).textContent = obj.totalinc;
            document.querySelector(DOMstrings.expenseLevel).textContent = obj.totalexp;

            if (obj.percentage > 0 && obj.percentage !== Infinity) {
                document.querySelector(DOMstrings.percentageLevel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLevel).textContent = '---';
            }
        },
        deleteListItem: function (id) {
            var removeElement = document.getElementById(id);
            removeElement.parentNode.removeChild(removeElement);
        },
        displayPercentage: function (percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensePercentageLevel);

            var nodeListForEach = function(nodeList,callBack){
                for(var i=0; i<nodeList.length;i++){
                    callBack(nodeList[i],i);
                }
            };
            nodeListForEach(fields,function(current,index){
                if(percentages[index]>0){
                    current.textContent=percentages[index]+'%';
                }else{
                    current.textContent='---';
                }
                
            });
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
        document.querySelector(DOMstrings.container).addEventListener('click', controlDeleteItem);
    };
    var updateBudget = function () {
        //1.calculate the budget  
        budgetCtrl.calculateBudget();
        //  get the budget
        var budget = budgetCtrl.getBudget();

        // 2.display the budget on the user interface
        UICtrl.displayBudget(budget);

    };
    var ctrllAddItem = function () {
        var input, newItem;
        //    1. get the feild input data
        input = UICtrl.getInput();
        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //   3.add the item to the user interface and clear the feilds
            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFeilds();

            //call update budget to calculate and update budget
            updateBudget();
            // update percentages
            updatePercentages();
        } else {


        }
    };
    var controlDeleteItem = function (event) {
        var itemID, splitID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split("-");
            budgetCtrl.deleteItem(splitID[0], parseInt(splitID[1]));
            UICtrl.deleteListItem(itemID);
            updateBudget();
            updatePercentages();
        }

    };
    var updatePercentages = function () {
        // caalculate the percentage
        budgetCtrl.calculatePercentages();
        // read the percentage from the budget controller
        var percentages = budgetCtrl.getPercentage();
        // display the percentage on the UI
        UICtrl.displayPercentage(percentages);
    };
    return {
        init: function () {
            // document.querySelector('.budget__value').textContent = '';
            // document.querySelector('.budget__income--value').textContent = '';
            // document.querySelector('.budget__expenses--value').textContent = '';
            // document.querySelector('.budget__expenses--percentage').textContent = '';

            UICtrl.displayBudget({
                budget: 0,
                totalexp: 0,
                totalinc: 0,
                percentage: -1,
            });
            setUpEventListeners();

        },

    }
})(budgetController, UIController);

Controller.init();
