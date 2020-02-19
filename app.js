const budgetController = (() => {
  const Expense = function(id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  };

  const Income = function(id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  };

  const calculateTotal = function(type) {
    let suma = 0;
    data.allItems[type].forEach(function(cur) {
      suma = suma + cur.value;
    });
    data.totals[type] = suma;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0
  };

  return {
    addItem: (type, des, val) => {
      let newItem, ID;
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

    calculateBudget: () => {
      calculateTotal("exp");
      calculateTotal("inc");
      data.budget = data.totals.inc - data.totals.exp;
    },

    deleteItem: (type, id) => {
      let ids, index;
      ids = data.allItems[type].map(function(cur) {
        return cur.id;
      });
      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    getBudget: () => {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp
      };
    }
  };
})();

const UIController = (() => {
  let DOMstring = {
    type: ".add__type",
    description: ".add__description",
    value: ".add__value",
    incomeContainer: ".income__list",
    expenseContainer: ".expenses__list",
    Income: ".budget__income--value",
    Expenses: ".budget__expenses--value",
    AllBudgetValue: ".budget__value",
    conatainer: ".container"
  };

  return {
    getInput: () => {
      return {
        type: document.querySelector(".add__type").value,
        description: document.querySelector(".add__description").value,
        value: parseFloat(document.querySelector(".add__value").value)
      };
    },

    addListItem: (obj, type) => {
      let html, newHTML, element;
      if (type === "inc") {
        element = DOMstring.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
      } else if (type === "exp") {
        element = DOMstring.expenseContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>';
      }

      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.desc);
      newHtml = newHtml.replace("%value%", obj.value);
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    updateMonth() {
      months = new Date().getMonth();

      let month = new Array();
      month[0] = "January";
      month[1] = "February";
      month[2] = "March";
      month[3] = "April";
      month[4] = "May";
      month[5] = "June";
      month[6] = "July";
      month[7] = "August";
      month[8] = "September";
      month[9] = "October";
      month[10] = "November";
      month[11] = "December";

      document.querySelector(".budget__title--month").textContent =
        month[months];
    },

    deleteList: selector => {
      let el = document.getElementById(selector);
      el.parentNode.removeChild(el);
    },

    clearField: () => {
      let fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMstring.description + "," + DOMstring.value
      );
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });

      fieldsArr[0].focus();
    },

    addHeader: IE => {
      document.querySelector(DOMstring.Income).textContent = IE.totalInc;
      document.querySelector(DOMstring.Expenses).textContent = IE.totalExp;
      document.querySelector(DOMstring.AllBudgetValue).textContent = IE.budget;
    }
  };
})();

const controller = ((UIcontroller, budgetcontroller) => {
  UIcontroller.updateMonth();

  const updateBudget = function() {
    //Calculating the budget
    budgetcontroller.calculateBudget();

    // Returning the budget
    let budget = budgetcontroller.getBudget();

    //Displaying the budget UI
    UIcontroller.addHeader(budget);
  };

  const addButton = () => {
    var input, newItem;
    //Getting input
    var input = UIcontroller.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      //Adding the item to the budget controller
      newItem = budgetcontroller.addItem(
        input.type,
        input.description,
        input.value
      );

      //Adding to the UI
      UIcontroller.addListItem(newItem, input.type);

      //Clear the field and set cursor to the input form, after submitting
      UIcontroller.clearField();
      updateBudget();
    } else {
      alert("Please add data in the input");
    }
  };

  const DeleteItem = function(event) {
    let ItemID, splitID, type, ID;

    ItemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    splitID = ItemID.split("-");
    type = splitID[0];
    ID = parseInt(splitID[1]);

    //Delete from the budget
    budgetcontroller.deleteItem(type, ID);

    //Delete from the UI
    UIcontroller.deleteList(ItemID);
    updateBudget();
  };

  document.querySelector(".add__btn").addEventListener("click", addButton);
  document.querySelector(".container").addEventListener("click", DeleteItem);
})(UIController, budgetController);