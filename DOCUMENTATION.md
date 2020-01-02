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

# App Audit & Comparison

 ### TodoListMe audit

 ##### Summary
 
 Download Audits (.pdf):
 
 - [Mobile](https://github.com/akdsco/todo-list-enchance/blob/master/audits/todolistme/todolistme_audit_mobile.pdf)
 - [Mobile Throttled -- 4G Slow Sim](https://github.com/akdsco/todo-list-enchance/blob/master/audits/todolistme/todolistme_audit_mobile_4g_slow.pdf)
 - [Desktop](https://github.com/akdsco/todo-list-enchance/blob/master/audits/todolistme/todolistme_audit_desktop.pdf)
 - [Desktop Throttled -- 4G Slow Sim](https://github.com/akdsco/todo-list-enchance/blob/master/audits/todolistme/todolistme_audit_desktop_4g_slow.pdf)
 
 TodoListMe is an application which allows user to:
 - create and name separate lists of to-do's
 - create and name categories
 - drag and drop lists into specified categories
 - add new to-do item to lists
 - move to-do items to 'tomorrow' and 'later' sub category inside the list
 - edit current to-do items
 - clear completed items (delete)
 - sort to-do's (alphabetically,random, top 3)
 - sync and use to-do's across different devices (account facilities)
 - show mobile specifc view
 - revert recent changes
 
 Application performs well when run on high speed internet connection. However, the performance on slower speed connections
 suffers signigicantly, especially on mobile devices, where it only receives 44 score in performance. The other major 
 low score is Accesibility, which is only 38 and that's across all four different audits. SEO and Best Practices are 
 ok but there's certainly room to improve.
 
 ##### Performance
 
 Desktop: `Score: 99/100`
 Desktop 4G Throttled: `Score: 67/100`
 Mobile 4G Throttled: `Score: 44/100`
 
 Performance figures when run on high speed internet (Desktop):
 
  | Metrics                          |  Time  |
  |----------------------------------|-------:|
  | First Contentful Paint           |   0.9s |
  | Speed Index                      |   1.4s |
  | Time to Interactive              |   2.4s |
  | Max Potential First Input Delay  |  180ms |
  | First CPU Idle                   |   2.4s |
  | First Meaningful Paint           |   1.2s |

 Performance figures when run on slow, 4G speed internet (Desktop):
 
   | Metrics                          |  Time  |
   |----------------------------------|-------:|
   | First Contentful Paint           |   1.5s |
   | Speed Index                      |   4.7s |
   | Time to Interactive              |   7.2s |
   | Max Potential First Input Delay  |  540ms |
   | First CPU Idle                   |   6.8s |
   | First Meaningful Paint           |   2.4s |
   
 Performance figures when run on slow, 4G speed internet (Mobile):

   | Metrics                          |  Time  |
   |----------------------------------|-------:|
   | First Contentful Paint           |   2.8s |
   | Speed Index                      |   6.0s |
   | Time to Interactive              |  10.8s |
   | Max Potential First Input Delay  |  870ms |
   | First CPU Idle                   |   9.9s |
   | First Meaningful Paint           |   2.8s |   
   
 If we compare the result, we can clearly see the slow down. The application runs the fastest on Desktop with high speed
 connection. The desktop slow 4G simulation shows slow down and further decline on Mobile. Let's examine it in %:
 
 Percentage of slowdown - Desktop HS -> Desktop 4G Slow 
 
   | Metrics                          |    Time    |
   |----------------------------------|-----------:|
   | First Contentful Paint           | 40% slower |
   | Speed Index                      | 60% slower |
   | Time to Interactive              | 65% slower |
   | Max Potential First Input Delay  | 65% slower |
   | First CPU Idle                   | 64% slower |
   | First Meaningful Paint           | 50% slower |
   
 Percentage of slowdown - Desktop HS -> Mobile 4G Slow
 
   | Metrics                          |    Time    |
   |----------------------------------|-----------:|
   | First Contentful Paint           | 67% slower |
   | Speed Index                      | 76% slower |
   | Time to Interactive              | 79% slower |
   | Max Potential First Input Delay  | 79% slower |
   | First CPU Idle                   | 75% slower |
   | First Meaningful Paint           | 57% slower |
   
Main suggestions to improve performance:

- optimise images
- remove unused CSS rules
- preconnect required origins
- restructure JS code and deliver in trenches as needed
- change cache policy to a more efficient one
- limit the number of redundant third party code and try to load this code after page has finished loading
   
 TODO should I write more here ?
 
 ##### Accessibility

 `Score: 38/100`
 
 This metrics did not differ when performing audits on different devices and speeds. The score is quite low, 38/100. 
 There are a couple of things that need to be improved. As the internet grows and reaches many people, we need to 
 be aware that there are many users who access data available on the internet, alternatively. In order to make this 
 particular application more available, developer would need to:
 
 - change background and foreground colours so that they have sufficient contrast ratio
 - make all ID's on the page unique
 - add `<title>` to `<iframe>` and `<form>`
 - add alt atributes to all `<img>` tags
 - add lang atribute to `<html>` tag
 
 There are also many other things that can't be checked automatically. Manual checks that can be performed are listed 
 [here](https://github.com/akdsco/todo-list-enchance/blob/master/audits/todolistme/todolistme_audit_desktop.pdf) on
 page 10.
 
 ##### Best Practice
 
 `Score: 71/100`
 
 - HTTPS
 
 As the internet grows and security flaws are discovered daily, we try to stay as secure as possible. In order to do so
 HTTPS connections are more and more common, even on websites that do not store any data. This application isn't using 
 the secure connection and therefore it's listed on the audit as a first thing. 
 
 - HTTP/2
  
 Another security upgrade is usage of HTTP/2 which is a newer way to transport data across the internet. In order to 
 use HTTP/2 (if server hosting website is ready for HTTP/2), there's a pre-requisite, which is HTTPS. As we know, this 
 application does not use it, therefore it can't use HTTP/2 either. It's something that can help bring security on this 
 page to a higher level.
 
 - @jQuery - vulnerable dependency
 
 It's crucial for both performance and security to use up to date software. Many times we only discover our code isn't 
 secure after we used it for some time. When we do discover that, version with insecure code gets flagged and information 
 to all developers using it sent. Then it's developers job to update the software and close the open door to stop 
 possible attacks and data leaks. In case of this application, jQuery library should be updated. 
 
 ##### SEO
 
 Desktop: `Score: 78/100`
 Mobile: `Score: 64/100`
 
 There are a few things application developers could do to optimise this app search engine rankings.
 Search engine's enjoy having lots of data. In this case we're missing:
 
 - `<meta>` tags with initial scale
 - `alt` attributes for `<img>` we mentioned in Accesibility section as well
 
 Additionally, application got 64 score for mobile devices as the font sizes are not big enough for those small devices 
 and some buttons are smaller than 48px x 48px and therefore hard for thumbs to tap on without zooming in.

 ### Todos app audit
 
 ##### Summary
 
 Download Audits (.pdf):
  
  - [Mobile](https://github.com/akdsco/todo-list-enchance/blob/master/audits/todos-fixed/todos_audit_mobile.pdf)
  - [Mobile Throttled -- 4G Slow Sim](https://github.com/akdsco/todo-list-enchance/blob/master/audits/todos-fixed/todos_audit_mobile_4g_slow.pdf)
  - [Desktop](https://github.com/akdsco/todo-list-enchance/blob/master/audits/todos-fixed/todos-audit-desktop.pdf)
  - [Desktop Throttled -- 4G Slow Sim](https://github.com/akdsco/todo-list-enchance/blob/master/audits/todos-fixed/todos_audit_desktop_4g_slow.pdf)
 
 Application allows users to create a simple list of to-do's. It stores data locally in client browser. It allows item 
 edits. It's simple implementation and lack of ads displayed with it, alows a maximum performance on both mobile and 
 desktop devices and on slower networks as well.
 
 ##### Performance
 
 Desktop: `Score: 100/100`
 Mobile: `Score: 100/100`
 Desktop 4G Throttled: `Score: 99/100`
 Mobile 4G Throttled: `Score: 99/100`

 
 | Metrics                          | Time |
 |----------------------------------|-----:|
 | First Contentful Paint           | 0.3s |
 | Speed Index                      | 0.3s |
 | Time to Interactive              | 0.4s |
 | Max Potential First Input Delay  | 40s  |
 | First CPU Idle                   | 0.4s |
 | First Meaningful Paint           | 0.3s |
 
 The stats are impressive, application loads extremely fast. It's mostly due to it's simplicity, as it does not need to 
 connect with servers and databases. It's simple and powerfull. The stats above are from a non throttled desktop based 
 audit. However, even when throttled, it performs extremely fast, in ranges of 0.1-0.4s. One of the reasons it works
 so efficient is because there are no additional files or adds that need to be downloaded, which would result in worse
 performance.
 
 There are few suggestions to improve applications performance, however the gains are marginal. Some of those 
 suggestions:
 - change priority for assets load
 - keep request counts low and transfer sizes small
 - minify JS - Potential 12KB Savings
 - remove unused CSS - Potential 8KB Savings
 - enable text compression - Potential 25KB Savings
 
 ##### Accessibility
 
 All: `Score: 60/100`
  
 There is one issue which need to be addressed to improve accessibility. `<Form>` tags need to have `<label>` tags
 associated with them. If those tags interfere with design, `<aria-label>` should be used. This way readers will read
 them and users who see the page, won't see any label. Since UI is made in an intuitive way to input to-do's, a 
 visible label is obsolete.
  
 ##### Best Practice
 
  All: `Score: 86/100`
 
 There are two problems when it comes to best practice:
 
 - HTTP/2
 
 Application runs locally and we have little power over how server handles connection. It's possible to influence it but
 it isn't as straightforward as simply installing a missing module. For the sake of clarity, I'd recommend to leave it as
 is. However if you'd like to improve this, possibly explore HTTP/3 which has been added to major browsers in September 
 2019
 - Browser errors logged
 
 Application's dependency `todomvc-common` is missing `learn.json` file. 
 In order to delete this message, an empty json file needs to be created in root folder of this project. 
 
 ##### SEO
 
 Desktop: `Score: 75/100`
 Desktop: `Score: 60/100`
 
 SEO can be improved by adding `<meta>` tags with viewport and initial-scale attributes. Also, we need to add meta 
 description tag to describe what is this application about, to help search engines understand it better and send it to 
 people who search for similar applications. Mobile version also needs to adjust font sizes properly as some of them
 render smaller than 12px, which is below the border for users to see without zooming in. Some buttons are smaller than
 48px and therefore not easily clicable with thumb without zooming in either.
 
 ### TodoListMe vs. Todos (comparative summary)

 ##### Summary
 
 Both applications run well. However, huge difference is visible on mobile devices with slower speed internet connections. 
 Difference in performance is significant. Therefore I'll focus on comparing 4G simulated slower speed results.
 
 ##### Performance
 
 | Metrics                          | Todos | TodoListMe | Todos faster |
 |----------------------------------|------:|-----------:|-------------:|
 | First Contentful Paint           | 1.7s  |    2.8s    |        39%   |    
 | Speed Index                      | 1.7s  |    6.0s    |        71%   | 
 | Time to Interactive              | 1.8s  |   10.8s    |        83%   | 
 | Max Potential First Input Delay  | 50s   |    870s    |        94%   |
 | First CPU Idle                   | 1.7s  |    9.9s    |        82%   |
 | First Meaningful Paint           | 1.7s  |    2.8s    |        39%   |
 
 As we can see, Todos is diametrically faster. There are few key differences:
 
 - it's a smaller application with client side "database"
 - it does not have to load any additional code, e.g. adds
 - it has much less features, therefore less lines of code to execute
 - it does not connect with any other API's e.g. twitter, facebook, google, oAuth

 Additionally, the TodoListMe App isn't specifically mobile ready. It isn't designed with mobile first approach. This is
 a major thing in 2020 and it should be changed first, in order to keep up with other competitors. Todos stands out with
 it's clear design, yet it looses massively on other fronts like features, as it certainly has not many.
 
 ##### Accessibility
 
 
 
 ##### Best Practice
 ##### SEO

  - files size of app
  - response times
  - advertisements influence over loading