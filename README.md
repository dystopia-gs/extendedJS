extendedJS
==========

EJS Modular Architecture with compat polyfill and library independent core and utilities
extendedJS
==========

EJS Modular Architecture with compat polyfill and library independent core and utilities

EJS utilizes a structure similar to AngularJS.  It allows the configuration and optional inclusion of core EJS library modules and user-defined modules to define a scope that contains only the modules specified in the module definition.  This helps to reduce overall libary weight, and enables the logical and maintainable encapsulation of only the functionality that is required.

Modules including ui and dom are still work in progess.  Currently, ui contains controller/view classes that automatically bind to all dom input/select elements that are children of a parent tag containing the data-controller attribute.  Adding this attribute to a section of your page will do the following:

1.  All interactive elements are mapped to an internal "viewModel" within the controller.  This viewmodel provides a single point for event handling.  So, instead of a swarm of dom event handlers roaming your project, a single point of delegation is possible.  When a model value is changed, the change is reflected in the dom and vice-versa.  This is similar to Angular's 2 way data-binding.

More to come...

