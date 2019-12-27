#  Introduction

In browser to-do application which helps you organise your day of work.
The main idea is to keep track of your daily tasks. Finish them each day and set new for next. 

Features:
- list to-do's
- edit existing to-do's (double click)
- erase each to-do
- mark to-do's as completed
- toggle all to-do's as completed or active
- filter to-do's: `all`,`active`,`completed`
- clear completed to-do's from application

# MVC 

Stands for "Model-View-Controller." [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) is an 
application design model comprised of three interconnected parts. They include the model (data), the view (user interface), 
and the controller (processes that handle input). The MVC model or "pattern" is commonly used for developing modern 
user interfaces.

The three parts of MVC are interconnected (see diagram). The view displays the model for the user. The controller 
accepts user input and updates the model and view accordingly. While MVC is not required in application design, many 
programming languages and IDEs support the MVC architecture, making it an common choice for developers.

![img](https://cdn.techterms.com/img/lg/mvc_1321.png)

##### 1. Model
A model is data used by a program. This may be a database, file, or a simple object, such as an icon or a character in 
a video game.

##### 2. View
A view is the means of displaying objects within an application. Examples include displaying a window or buttons or text 
within a window. It includes anything that the user can see.

##### 3. Controller
A controller updates both models and views. It accepts input and performs the corresponding update. For example, 
a controller can update a model by changing the attributes of a character in a video game. It may modify the view by 
displaying the updated character in the game.


Christensson, P. (2018, March 7). MVC Definition. Retrieved 2019, Dec 23, from 
[https://techterms.com](https://techterms.com/definition/mvc)

Read more about MVC model [here](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller).

##### This application MVC implementation explained

In case of this to-do application the MVC model is used and works only on client side. There is no back-end database. 
The application creates a new client side storage object and creates an empty collection if no collection already exists.
If you close the card in which application is open, data will be lost. Depending on your browser settings, sometimes you 
might be able to retrieve information from previously closed tab, as most browsers keep information cached in their
memory.

# File Structure
```
To-do's application
|   package.json                    => dependencies
|   license.md                      => license
|   documentation.md                => application documentation
|   index.html                      => application start
|
└───js
│   │   app.js                      => application initializer
│   │   controller.js               => MVC Controller file
│   │   helpers.js                  => helper methods, selectors
│   │   model.js                    => MVC model implementation
│   │   store.js                    => local db implementation
│   │   template.js                 => bespoke template for to-do's
│   │   view.js                     => MVC view implementation
|
└───test
│   │   ControllerSpec.js           => Unit tests
│   │   SpecRunner.html             => Tests runner
```

`controller.js`

This file contains main logic for the application. When initialized, it binds all the events and therefore creates a way
for user to interact with the application. Below is the code used in it's constructor:

```javascript
function Controller (model, view) {
    var self = this;
    self.model = model;
    self.view = view;

    self.view.bind('newTodo', function (title) {
        self.addItem(title);
    });

    self.view.bind('itemEdit', function (item) {
        self.editItem(item.id);
    });

    self.view.bind('itemEditDone', function (item) {
        self.editItemSave(item.id, item.title);
    });

    self.view.bind('itemEditCancel', function (item) {
        self.editItemCancel(item.id);
    });

    self.view.bind('itemRemove', function (item) {
        self.removeItem(item.id);
    });

    self.view.bind('itemToggle', function (item) {
        self.toggleComplete(item.id, item.completed);
    });

    self.view.bind('removeCompleted', function () {
        self.removeCompletedItems();
    });

    self.view.bind('toggleAll', function (status) {
        self.toggleAll(status.completed);
    });
}
```

All the bindings reffer to functions inside `controller.js`. Those functions contain all calls necessary for actions.
Depending on action, controller will call methods from `model.js` and `view.js` and this way update local database and
re-render any changes in the view. It contains specific chains of commands needed for actions like `addItem` or `editItem`
Anything to-do app will do, will be started in `controller.js`

`view.js`

This file contains all methods which purpose is to manipulate DOM elements and change the way the application displays 
current data from database. For example, if user completes a task, it will trigger event, which will be picked up by 
`controller.js`, which in turn will eventually call `view.js` method to update the to-do item.

Most methods in `view.js` are private. The interface comprises of `render` and `bind` methods.
Main method which is responsible for proper 'directions' is `render`.
It's implementation is shown below:

```javascript
View.prototype.render = function (viewCmd, parameter) {
    var self = this;
    var viewCommands = {
        showEntries: function () {
            self.$todoList.innerHTML = self.template.show(parameter);
        },
        removeItem: function () {
            self._removeItem(parameter);
        },
        updateElementCount: function () {
            self.$todoItemCounter.innerHTML = self.template.itemCounter(parameter);
        },
        clearCompletedButton: function () {
            self._clearCompletedButton(parameter.completed, parameter.visible);
        },
        contentBlockVisibility: function () {
            self.$main.style.display = self.$footer.style.display = parameter.visible ? 'block' : 'none';
        },
        toggleAll: function () {
            self.$toggleAll.checked = parameter.checked;
        },
        setFilter: function () {
            self._setFilter(parameter);
        },
        clearNewTodo: function () {
            self.$newTodo.value = '';
        },
        elementComplete: function () {
            self._elementComplete(parameter.id, parameter.completed);
        },
        editItem: function () {
            self._editItem(parameter.id, parameter.title);
        },
        editItemDone: function () {
            self._editItemDone(parameter.id, parameter.title);
        }
    };

    viewCommands[viewCmd]();
};
```

Application uses custom templates to create to-do's and update information like the amount of active to-do's due to be 
completed. All templates are stored in:
 
`template.js`

This file contains one main template for to-do item stored as default template and is instantiated whenever template 
object is created. There are three methods `show`, `itemCounter` and `clearCompletedButton` As described, they show all 
the to-do's, update due items counter and update clear completed button text.

`model.js`

`Model` is created with instace of `Store.js`. `Model` is connecting local database (`Store`) with `Controller.js`.
Model coordinates and allows data manipulation along with CRUD persistent storage functions. It consist of methods:

- `create`
```
Creates a new to-do model

@param {string} title - The title of the task
@param {function} [callback] - The callback to fire after the model is created
```
- `read`
```
Finds and returns a model in storage. If no query is given it'll simply
return everything. If you pass in a string or number it'll look that up as
the ID of the model to find. Lastly, you can pass it an object to match
against.

@param {string|number|Object} query - A query to match models against
@param {function} [callback] - The callback to fire after the model is found

@example
model.read(1, func); // Will find the model with an ID of 1
model.read('1'); // Same as above
model.read({ foo: 'bar', hello: 'world' }); // will find a model with foo equalling 
                                               bar and hello equalling world.
```
- `update`
```
Updates a model by giving it an ID, data to update, and a callback to fire when
the update is complete.

@param {string} id - The id of the model to update
@param {Object} data - The properties to update and their new value
@param {function} [callback] - The callback to fire when the update is complete.
``` 
- `remove`
```
Removes a model from storage

@param {string} id - The ID of the model to remove
@param {function} callback - The callback to fire when the removal is complete.
```
- `removeAll`
```
Removes ALL data from storage.

@param {function} callback - The callback to fire when the storage is wiped.
```
- `getCount`
```
Returns a count of all todos

@param {function} callback - The callback to fire when count of to-do's is done.
```


`store.js`

When instantiated, creates a new client side storage object and will create an empty collection if no collection already 
exists. All our local database methods have callbacks to return data to callers (It would normally be AJAX calls to db). 
`Store.js` consists of five methods:

- `find`
```
Finds items based on a query given as a JS object

@param {Object} query - The query to match against (i.e. {foo: 'bar'})
@param {function} callback - The callback to fire when the query has completed running

@example
db.find({foo: 'bar', hello: 'world'}, function (data) {
  data will return any items that have foo: bar and
  hello: world in their properties
});
```
- `findAll`
```
Will retrieve all data from the collection

@param {function} callback - The callback to fire upon retrieving data
```
- `save`
```
Will save the given data to the DB. If no item exists it will create a new
item, otherwise it'll simply update an existing item's properties

@param {Object} updateData - The data to save back into the DB
@param {function} callback - The callback to fire after saving
@param {string} [id] - Optional param to enter an id of item to update
```
- `remove` 
```
Will remove an item from the Store based on its id

@param {string} id - The ID of the item you want to remove
@param {function} callback - The callback to fire after saving
```
- `drop`
```
Will drop all storage and start fresh

@param {function} callback - The callback to fire after dropping the data
```
