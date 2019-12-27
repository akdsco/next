# New Unit Tests

1: Show entries on start-up
```javascript
it('should show entries on start-up', function () {
    var todo = {title: 'to-do item'};

    setUpModel([todo]);

    subject.setView('');

    expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
});
```
2: Show active entries
```javascript
it('should show active entries', function () {
    var todo = {title: 'my todo'};
    setUpModel([todo]);

    subject.setView('/active');

    expect(view.render).toHaveBeenCalledWith('setFilter', 'active');
});
```
3: Show completed entries
```javascript
it('should show completed entries', function () {
    var todo = {title: 'my todo', completed: false};
    setUpModel([todo]);

    subject.setView('/completed');

    expect(view.render).toHaveBeenCalledWith('setFilter', 'completed');
});
```
4: Highlight 'All' filter by default
```javascript
it('should highlight "All" filter by default', function () {
    var todo = {title: 'my todo', completed: true};
    setUpModel([todo]);

    subject.setView('');

    expect(view.render).toHaveBeenCalledWith('setFilter','');
});
```
5: Highlight 'Active' filter when switching to active view
```javascript
it('should highlight "Active" filter when switching to active view', function () {
    var todo = {title: 'my todo', completed: true};
    setUpModel([todo]);

    subject.setView('/active');

    expect(view.render).toHaveBeenCalledWith('setFilter','active');
});
```
6: Toggle all todos to coompleted
```javascript
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
});
```
7: Should update the view
```javascript
{}
```
8: Add a new todo to the model
```javascript
it('should add a new todo to the model', function () {
    setUpModel([]);
    subject.setView('');

    view.trigger('newTodo', 'a new todo');

    expect(model.create).toHaveBeenCalledWith('a new todo', jasmine.any(Function));
});
```
9: Remove an entry from the model
```javascript
it('should remove an entry from the model', function () {
    var todo = {id: 42, title: 'my todo', completed: true};
    setUpModel([todo]);

    subject.setView('/completed');

    view.trigger('itemRemove', {id: 42});

    expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));

});
```