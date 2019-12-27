5-Bug Fixes

Project enchancements:

`1. 'adddItem' => 'addItem'`

I realised the application wasn't adding new to-do#'s so I tracked down a bug that prevented from adding new items.

`2. id="toggle all"`

I noticed missing ID attribute in HTML file, inside toggle-all input element, which caused selectors not to work properly. 
I added the ID and unlocked toggle all functionality.

`3. to-do item ID fix`

Application used a custom function to assign unique ID's to each to-do item.
The ID was only numerical and there was a potential conflict and possibility for this function to generate the same ID
for more than one item. If not addressed, this would cause a possible app malfunction. I fixed this problem by assigning
a random ID value, which now consists of both numbers and letters.

The old code was:

```javascript
var newId = "";
var charset = "0123456789";

for (var i = 0; i < 6; i++) {
  newId += charset.charAt(Math.floor(Math.random() * charset.length));
}
```

The new solution is:

```javascript
var newId = '_' + Math.random().toString(36).substr(2, 9);
```

`Math.random` should be unique because of its seeding algorithm. I convert it to base 36 (numbers + letters), and grab the 
first 9 characters after the decimal. I also had to address parsing to INT which was used in previous solution and did
fit with the new one, as my new ID is a String.

`4. add new unit tests`

examples:

```javascript
it('should show entries on start-up', function () {
    var todo = {title: 'to-do item'};

    setUpModel([todo]);

    subject.setView('');

    expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
});
```

```javascript
it('should show completed entries', function () {
    var todo = {title: 'my todo', completed: false};
    setUpModel([todo]);

    subject.setView('#/completed');

    expect(view.render).toHaveBeenCalledWith('setFilter', 'completed');
});
```

```javascript
it('should highlight "Active" filter when switching to active view', function () {
    var todo = {title: 'my todo', completed: true};
    setUpModel([todo]);

    subject.setView('#/active');

    expect(view.render).toHaveBeenCalledWith('setFilter','active');
});
```

```javascript
describe('toggle all', function () {
    it('should toggle all todos to completed', function () {
        var todo = [
            {id: 42, title: 'todo 1', completed: true},
            {id: 43, title: 'todo 2', completed: false}
        ];

        setUpModel(todo);
        subject.setView('');
        view.trigger('toggleAll', {completed: true});

        expect(view.render).toHaveBeenCalledWith('elementComplete',
            {id: 43, completed: true}
        );
    })
});
```

`5. optimised inner loops`

I notice some inner loops which were confusing and not efficient.

Old code:
```javascript
while (title[title.length-1] === " ") {
    title = title.slice(0, -1);
}

while (title[0] === " ") {
    title = title.slice(1);
}
```

I replaced it with:

```javascript
title = title.trim();
```

`6. added documentation inside code for JSDoc`

I've added new lines, updated old documentation and re-wrote few descriptions to clarify what each piece of code is doing.
I followed patters from JSDoc, this allows for easier documentation generation straight from code base.

Example:
```javascript
/** @param {string} id
 *  @param {string} title - new to-do text to be saved
*/
```

`7. deleted repetetive code`

I've identified code in `controller.js` file which was doing very similar task, yet there were theree different function
written to achieve it. I realised I can combine all those three methods into one, which will do the same task, with only 
one parameter.

Old solution:
```javascript
Controller.prototype.showAll = function () {
    var self = this;
    
    self.model.read(function (data) {
        self.view.render('showEntries', data);
    });
};

Controller.prototype.showActive = function () {
    var self = this;

    self.model.read({ completed: false }, function (data) {
        self.view.render('showEntries', data);
    });
};

Controller.prototype.showCompleted = function () {
    var self = this;
	
    self.model.read({ completed: true }, function (data) {
        self.view.render('showEntries', data);
    });
};
```

New solution:

```javascript
Controller.prototype.show = function (completed) {
    var self = this;
    var queryType = typeof completed;

    if(queryType === 'boolean') {
        self.model.read({ completed: completed }, function (data) {
            self.view.render('showEntries', data);
        });
    } else if (queryType === 'undefined') {
        self.model.read(function (data) {
            self.view.render('showEntries', data);
        });
    }
};
```

The new solution integrates well with previous code. Unit tests work and the new code eliminates the need to have three 
separate functions for one action, which in this case is a call to either show All, only Active or Completed to-do items.

