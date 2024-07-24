Creating a new NodeBB Theme
===========================

NodeBB is built on [Twitter Bootstrap](http://getbootstrap.com/), which
makes theming incredibly simple.

Quick start
-----------

The easiest way to get started theming NodeBB is to fork the [Quickstart
Theme](https://github.com/nodebb/nodebb-theme-quickstart) and adjust it
for your customisations.

The quickstart theme is a **child theme** (see below) of NodeBB's default
theme (Harmony), and thus inherits all of its styling and templates from
its parent theme.

If you want to overwrite an existing template, copy it from [the Harmony
repository](https://github.com/nodebb/nodebb-theme-harmony) into your
theme's `/templates` directory, taking care to follow the same directory
structure. You may have to create this directory.

Then rebuild NodeBB's assets and your template should override Harmony's
template of the same path.

e.g. If you want to modify topic.tpl, you would:

1. Copy the contents of `nodebb-theme-harmony/templates/topic.tpl`
1. Create `nodebb-theme-mytheme/templates`
1. Create a new file `nodebb-theme-mytheme/templates/topic.tpl` with the contents of the original topic.tpl file
1. Make your changes as necessary.
1. `./nodebb build tpl && ./nodebb dev` to rebuild and start NodeBB

Packaging for NodeBB
--------------------

NodeBB expects any installed themes to be installed via `npm`. Each
individual theme is an npm package, and users can install themes through
the command line, ex.:

``` bash
npm install nodebb-theme-modern-ui
```

The theme's folder must contain at least two files for it to be a valid
theme:

1.  `theme.json`
2.  `theme.scss`

`theme.scss` is where your theme's styles will reside. NodeBB expects
SCSS to be present in this file, and will precompile it down to CSS
on-demand. For more information regarding SCSS, take a look at [the
project homepage](https://sass-lang.com/).

**Note**: A *suggested* organization for `theme.scss` is to `@import`
multiple smaller files instead of placing all of the styles in the main
`theme.scss` file.

Configuration
-------------

The theme configuration file is a simple JSON string containing all
appropriate meta data regarding the theme. Please take note of the
following properties:

-   `id`: A unique id for a theme (e.g. "my-theme")
-   `name`: A user-friendly name for the theme (e.g. "My Theme")
-   `description`: A one/two line description about the theme (e.g.
    "This is the theme I made for my personal NodeBB")
-   `screenshot`: A filename (in the same folder) that is a preview
    image (ideally, 370x250, or an aspect ratio of 1.48:1)
-   `url`: A fully qualified URL linking back to the theme's
    homepage/project
-   `templates`: (Optional) A system path (relative to your plugin's
    root directory) to the folder containing template files. If not
    specified, NodeBB will search for the "templates" directory, and
    then simply fall back to using vanilla's template files.
-   `baseTheme`: (Optional) If undefined, will use nodebb-theme-persona
    (our current base theme) as a default for missing template files.
    See the Child Themes section for more details.

Child Themes
------------

### CSS / LESS

If your theme is based off of another theme, simply modify your LESS
files to point to the other theme as a base, ex for topics.less:

As `topic.less` from the theme `nodebb-theme-vanilla` was imported,
those styles are automatically incorporated into your theme.

### Templates

You do not need to redefine all templates for your theme. If the
template file does not exist in your current theme, NodeBB will inherit
templates from the baseTheme that you have defined in your `theme.json`
(or if undefined, it will inherit from `nodebb-theme-persona`'s
templates).

If your theme is dependent on a theme that is not nodebb-theme-vanilla,
you should set the `baseTheme` configuration in your `theme.json` to the
appropriate theme.

For more information, please see the detailed article on [the templating system](./templates.md)
