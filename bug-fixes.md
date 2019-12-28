`1. fix typing error: 'adddItem' => 'addItem'`

I realised the application wasn't adding new to-do's, so I tracked down a bug that prevented from adding new items.

`2. add "toggle all" functionality.`

I noticed missing ID attribute in HTML file, inside toggle-all input element, which caused selectors not to work correctly. I added the ID and unlocked toggle all functionality.

`3. fix to-do item ID`

Application used a custom function to assign a unique ID to each to-do item.
The ID was only numerical, and there was a potential conflict and possibility for this function to generate the same ID for more than one item. If not addressed, this would cause a possible app malfunction. I fixed this problem by assigning a random ID value, which now consists of both numbers and letters.

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

`Math.random` should be unique because of its seeding algorithm. I convert it to base 36 (numbers + letters) and grab the first nine characters after the decimal. I also had to address parsing to INT which was used in the previous solution and didn't fit with the new one, as my new ID is a String.

`4. optimise inner loops`

I noticed some inner loops which were confusing and not efficient.

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

`5. add documentation inside code for JSDoc`

I've added new lines, updated old documentation and re-wrote a few descriptions to clarify what each piece of code is doing. I followed patterns from JSDoc; this allows for more comfortable documentation generation straight from the codebase.

Example:
```javascript
/** @param {string} id
 *  @param {string} title - new to-do text to be saved
*/
```

`6. delete repetitive code`

I've identified code in `controller.js` file, which was doing a similar task, yet there were three different functions written to achieve it. I realised I could combine all those three methods into one, which will do the same task when supplied with only one parameter.

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

The new solution integrates well with the previous code. Unit tests work, and the new system eliminates the need to have three separate functions for one action, which in this case was a call to either show All, only Active or Completed to-do items.

`7. add aria-label for to-do input`

It's a hidden label that helps users who use readers to understand the page. If no label is attached, a user who does not see a page with their eyes, won't know what the input field is for. Simultaneously, a user who sees a page, do not necessarily need a label for each input as the UI is created specifically so that the purpose of the input field is communicated through design.

`8. add learn.json file`

File required by todomvc-common dependency. For this application, it's left empty.

`9. add <meta> tag to HTML to improve SEO`

Each HTML file these days requires viewport specification. It's width and initial scale. It helps browsers in displaying pages properly on different devices (desktop, tablet, mobile, etc.).

`10. add <meta> tag with a description of the application to improve the SEO.`

It's always good to be seen online well. Each page that's available online, needs to have a meta tag with description. It helps crawlers understand what the page is about and categorise it properly for search engines like 'google' or 'duck duck go'.