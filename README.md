# top-require

[![Build](https://travis-ci.org/sielay/node-top-require.png)](http://travis-ci.org/sielay/node-top-require)
[![Coverage](https://coveralls.io/repos/sielay/node-top-require/badge.png)](https://coveralls.io/r/sielay/node-top-require)
[![Dependencies](https://david-dm.org/sielay/node-top-require.png)](http://david-dm.org/sielay/node-top-require)


Require modules from highest (i.e. loading) module.

It is based hugely on [parent-require](https://github.com/jaredhanson/node-parent-require), but it loads declaration highest
in the project hierarchy. That is useful when you have for instance module that require module that require module which populate
Mongoose models you want to use in your project.

Most of code/documentation is copy from parent-require.

## Install

    $ npm install top-require

## Usage

`top-require` addresses an annoying error condition that arises when
developing plugins, which have [peer dependencies](http://blog.nodejs.org/2013/02/07/peer-dependencies/),
that are `npm link`'d into an application.

The problem is best illustrated by example.  We'll use a shared package of [Mongoose](http://mongoosejs.com/)
schemas, but the concept applies equally well to any module you plugin to a
larger framework.

#### Develop a Plugin for a Framework

Let's develop a set of shared [Mongoose](http://mongoosejs.com/) schemas for a
user database, packaged as `mongoose-schemas-users` for reuse by any application
that needs to query the database.

```javascript
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema(...);

module.exports = UserSchema;
```

The important bit here is that `mongoose` is a *peer dependency* of this
package.

#### Require a Plugin from an App

Now, let's install this package...

    npm install mongoose-schemas-users

..and require it within our application:

```javascript
var mongoose = require('mongoose')
  , schemas = require('mongoose-schemas-users')
  
mongoose.model('User', schemas.UserSchema);
```

So far, so good.

#### npm link Plugin for Development

During the course of developing the application, we discover that we need to
tweak the schemas we've defined.  This is usually easy:

    npm link mongoose-schemas-users

We've made some edits, and run the application:

    Error: Cannot find module 'mongoose'

WTF?!?  This issue arises because `mongoose` is a *peer dependency*.  Now that
it has been `npm link`'d to a directory that resides outside of the application
itself, Node's typical resolution algorithm fails to find it.

#### Fallback to Parent Require

This is where `top-require` comes into play.  It provides a fallback to
`require` modules from the *loading* (aka parent) module.  Because the loading
module exists within the application itself, Node's resolution algorithm will
correctly find our peer dependency.

```javascript
try {
  var mongoose = require('mongoose');
} catch (_) {
  // workaround when `npm link`'ed for development
  var prequire = require('top-require')
    , mongoose = prequire('mongoose');
}

var UserSchema = new mongoose.Schema(...);

module.exports = UserSchema;
```

With the fallback in place, we can both `npm install` and `npm link` this
plugin, correctly resolving peer dependencies in both cases.

## Tests

    $ npm install
    $ npm test

## Credits

  - Creator of original Parent Require [Jared Hanson](http://github.com/jaredhanson)
  - [Lukasz Sielski](http://github.com/sielay)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2014 Lukasz Sielski <[http://lukaszsielski.pl/](http://lukaszsielski.pl/)>
Copyright (c) 2013 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
