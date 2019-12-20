(function (window) {
	'use strict';

	/**
	 * Takes a model and view and acts as the controller between them
	 *
	 * @constructor
	 * @param {Object} model - The model instance
	 * @param {Object} view  - The view instance
	 */
	function Controller(model, view) {
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

	/**
	 * Loads and initialises the view
	 *
	 * @param {string} locationHash - '' | 'active' | 'completed'
	 */
	Controller.prototype.setView = function (locationHash) {
		var page = locationHash.split('/')[1] || '';

		this._updateFilterState(page);
	};

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

	/**
	 * An event to fire on load. Will get all items and display them in the to-do list
	 */
	// Controller.prototype.showAll = function () {
	// 	var self = this;
	//
	// 	self.model.read(function (data) {
	// 		self.view.render('showEntries', data);
	// 	});
	// };

	//TODO MENTOR glue together showActive and showCompleted functions into one function that will accept boolean parameter?
	// maybe even with showAll ?
	// - check all the dependecies and if possible rewrite

	/**
	 * Renders all active tasks
	 */
	// Controller.prototype.showActive = function () {
	// 	var self = this;
	//
	// 	self.model.read({ completed: false }, function (data) {
	// 		self.view.render('showEntries', data);
	// 	});
	// };

	/**
	 * Renders all completed tasks
	 */
	// Controller.prototype.showCompleted = function () {
	// 	var self = this;
	//
	// 	self.model.read({ completed: true }, function (data) {
	// 		self.view.render('showEntries', data);
	// 	});
	// };

	/**
	 * An event to fire whenever you want to add an item. Simply pass in the event
	 * name and it'll handle the DOM insertion and saving of the new item.
	 *
	 * @param {string} title - to-do item title
	 */
	Controller.prototype.addItem = function (title) {
		var self = this;

		if (title.trim() === '') {
			return;
		}

		self.model.create(title, function () {
			self.view.render('clearNewTodo');
			self._filter(true);
		});
	};

	/**
	 * Triggers the item editing mode. Fires after double-click on to-do item.
	 *
	 * @param {string} id - to-do items' id
	 */
	Controller.prototype.editItem = function (id) {
		var self = this;
		self.model.read(id, function (data) {
			self.view.render('editItem', {id: id, title: data[0].title});
		});
	};

	/**
	 * Finishes the item editing mode successfully.
	 * Triggered by clicking away (onBlur) or pressing Enter (onKeyDown)
	 *
	 * @param {string} id
	 * @param {string} title - new to-do text to be saved
	 */
	Controller.prototype.editItemSave = function (id, title) {
		var self = this;

		// TODO Mentor use trim() to get rid of two while loops?

		// while (title[0] === " ") {
		// 	title = title.slice(1);
		// }
		//
		// while (title[title.length-1] === " ") {
		// 	title = title.slice(0, -1);
		// }

		title = title.trim();

		if (title.length !== 0) {
			self.model.update(id, {title: title}, function () {
				self.view.render('editItemDone', {id: id, title: title});
			});
		} else {
			self.removeItem(id);
		}
	};

	/**
	 * Cancels the item editing mode.
	 * Triggered by pressing ESC key (onKeyDown)
	 *
	 * @param {string} id
	 */
	Controller.prototype.editItemCancel = function (id) {
		var self = this;
		self.model.read(id, function (data) {
			self.view.render('editItemDone', {id: id, title: data[0].title});
		});
	};

	/**
	 * Finds the DOM element that is matching supplied id and removes that element
     * from the DOM and local database storage.
	 *
	 * @param {string} id
	 */
	Controller.prototype.removeItem = function (id) {
		var self = this;
		var items = {};

		self.model.read(function(data) {
			items = data;
		});

		items.forEach(function(item) {
			if (item.id === id) {
				console.log("Element with ID: " + id + " has been removed.");

				self.model.remove(id, function () {
					self.view.render('removeItem', id);
				});
				self._filter();
			}
		});
	};

	/**
	 * Will remove all completed items from the DOM and storage.
	 */
	Controller.prototype.removeCompletedItems = function () {
		var self = this;
		self.model.read({ completed: true }, function (data) {
			data.forEach(function (item) {
				self.removeItem(item.id);
			});
		});

		self._filter();
	};

	//TODO make sure the below description is accurate, double check this

	/**
	 * Give it an ID of a model and a checkbox value and it will update the item
	 * in storage based on the checkbox's state.
	 *
	 * @param {string} id - The ID of the element to complete or uncomplete
	 * @param {boolean} completed - The checkbox to check the state of complete or not
	 * @param {boolean|undefined} [silent] - Prevent re-filtering the to-do items
	 */
	Controller.prototype.toggleComplete = function (id, completed, silent) {
		var self = this;

		self.model.update(id, { completed: completed }, function () {
			self.view.render('elementComplete', {
				id: id,
				completed: completed
			});
		});

		if (!silent) {
			self._filter();
		}
	};

	//TODO what does completeness of models mean?

	/**
	 * Will toggle ALL checkboxes' on/off state and completeness of to-do's.
	 *
	 * @param {boolean} completed - Value for all items to be ticked off or not
	 */
	Controller.prototype.toggleAll = function (completed) {
		var self = this;

		self.model.read({ completed: !completed }, function (data) {
			data.forEach(function (item) {
				self.toggleComplete(item.id, completed, true);
			});
		});

		self._filter();
	};

	/**
	 * Updates the pieces of the page which change depending on the remaining number of todos.
	 *
	 */
	Controller.prototype._updateCount = function () {
		var self = this;

		self.model.getCount(function (todos) {
			self.view.render('updateElementCount', todos.active);
			self.view.render('clearCompletedButton', {
				completed: todos.completed,
				visible: todos.completed > 0
			});

			self.view.render('toggleAll', {checked: todos.completed === todos.total});
			self.view.render('contentBlockVisibility', {visible: todos.total > 0});
		});
	};

	/**
	 * Re-filters to-do items based on the active route.
	 *
	 * @param {boolean|undefined} [force] - if true, triggers re-painting of to-do items.
	 */
	Controller.prototype._filter = function (force) {
		var activeRoute = this._activeRoute.charAt(0).toUpperCase() + this._activeRoute.substr(1);

		// Update the elements on the page, which change with each completed to-do
		this._updateCount();

		// re-create the to-do item elements if not "All" or when switching routes:
		if (force || this._lastActiveRoute !== 'All' || this._lastActiveRoute !== activeRoute) {
			if(activeRoute === 'All') {
				this.show();
			} else if (activeRoute === 'Active') {
				this.show(false);
			} else if (activeRoute === 'Completed') {
				this.show(true);
			}
		}

		this._lastActiveRoute = activeRoute;
	};

	/**
	 * Updates the filter nav's selected states
	 *
	 * @param {string} currentPage - one of three posibilities -> '' | 'active' | 'completed'
	 */
	Controller.prototype._updateFilterState = function (currentPage) {
		// Store a reference to the active route, allowing us to re-filter
		// to-do items as they are marked complete or incomplete.
		this._activeRoute = currentPage;

		if (currentPage === '') {
			this._activeRoute = 'All';
		}

		this._filter();

		this.view.render('setFilter', currentPage);
	};

	// Export to window
	window.app = window.app || {};
	window.app.Controller = Controller;
})(window);