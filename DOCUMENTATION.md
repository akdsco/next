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
|   package.json                    => dependencies (for developers)
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
###### controller.js
This file contains main logic for the application. When initialized, it binds all the events and therefore creates a way
for user to interact with the application. Below is the code used in it's constructor:

```
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

