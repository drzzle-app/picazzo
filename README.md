# Picazzo

Picazzo is an open source front end framework that was created for websites built from the [drzzle.app](https://drzzle.app) site builder.

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm start
```

```bash
# build dist for production with minification for both picazzo the docs and library
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Testing
To unit test vue components and droplet plugins run the following
```bash
npm run test:unit
```

## Automation

#### Creating New Pages
```bash
npm run build:newpage
```
This will ask you a few questions like "name?", "full page layout or side bar?" and "path in the pages dir.", after which this
will generate the needed files to get you started as well as create routing and searchable content. If you want this page to be a link in the sidebar, that needs to be done manually (for now).

#### Creating New Droplets
```bash
npm run build:newdroplet
```
Here you can specify the name and if it needs a js plugin or not and this task  will go and add the new droplet to each theme as well as add the new vue files for the droplet in the correct locations.

#### Creating New Tools
```bash
npm run build:newtool
```
Tools are components that aren't necessarily droplets but could be used _with_ them. Things like modals, tool tips, breadcrumbs, pagination etc. would be considered a tool. This script does what build:newdroplet does except puts the files in the tool location.

#### Creating New Themes
```bash
npm run build:newtheme
```
Here you just need to specify a name and this task will copy the default theme and create the new theme files for you. You just need to go and change the new LESS rules to how you wish manually of course.

#### Building distributable Picazzo JS droplet library
This task runs automatically for you but you can also run it manually:
```bash
npm run build:jsplugins
```
This will put together all of the js under droplets named "plugin.js" and compile/minify it into 1 distributable js file.

For building each js plugin separately into dist you will need to run the following command manually:
```bash
npm run build:jsplugins:separate
```

#### Creating routes
This always runs for you automatically when you create new pages, but if you prefer to make routes manually, you can add them in the ```src/router/routes.json``` file. Once you edit that file, this task should go and update the routes that vue reads from. If you want to manually regenerate the routes file you can run:
```bash
npm run build:routes
```

#### Build search
This will also run automatically for you whenever you edit or add any template in the ```pages/``` folder (this includes running the ```npm run build:newpage``` command). What it does is recursively search through the ```pages/``` folder for page information, makes that into a JSON file so that it can be easily searched. To manually run this step:
```bash
npm run build:search
```

## Adding Sidebar Links
Our nested side bar links are templated using json from our ```src/layout/side-bar/links.json``` file. They can be nested as deep as desired. FYI if a link has children (aka it's a dropdown) then it's ```route``` property won't be needed. See below of example:
```json
{
  "links": [
    {
      "text": "Some Drop Down Link",
      "children": [
        {
          "text": "Deeper Drop Down Link",
          "children": [
            {
              "text": "Some Deeper Sublink",
              "route": "/some-deeper-sublink",
              "children": []
            }
          ]
        }
      ]
    },
    {
      "text": "I am a link with no children",
      "route": "/some-route",
      "children": []
    }
  ]
}
```
In case you forget what page route your page is, see the ```src/pages.json``` file.

## Adding new Icons
When adding new icons in fontello, you just need to copy the new files and dump them into ```./src/icons/```. There is a watcher in place on this icons directory that should auto run this command for you
```bash
npm run build:icons
```
This task will take the fontello icons/files from ```./src/icons/``` and add them to the relative location for each theme in ```dist/```. The icons page also auto generates it's content from the fontello config file.

## LESS Breakdown
The styling for Picazzo _the app_ is separated from everything else, those core LESS files are located in ```./src/less/picazzo/``` and are compiled by webpack. The themes on the other hand are different. Those are compiled into ```dist/``` by gulp and their core files are located in  ```./src/less/themes/```. You'll notice each droplet has a ```themes/``` directory. This is in case the same droplet will need to look different in each theme, if they are not needed, they can be removed.

Themes exist to give droplets default styling. These styles can be overridden in the editor by users.

## Maintainable CSS
We go by the maintainable CSS rules when writing css/less. Please make sure you are aware of these before contributing. You can read the documentation here: [Read Docs](https://maintainablecss.com/chapters/introduction/)

## Further Vue documentation regarding this app
For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
