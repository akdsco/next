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