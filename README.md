# Flux

> Zoolander replacement

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm start
```

```bash
# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Automation

#### Creating New Pages
```bash
npm run build:newpage
```
This will ask you a few questions like "name?", "full page layout or side bar?" and "path in the pages dir.", after which this
will generate the needed files to get you started as well as create routing and searchable content. If you want this page to be a link in the sidebar, that needs to be done manually (for now).

#### Creating New Patterns
```bash
npm run build:newpattern
```
Here you can specify the name and if it needs a js plugin or not and this task  will go and add the new pattern to each theme as well as add the new vue files for the pattern in the correct locations.

#### Creating New Themes
```bash
npm run build:newtheme
```
Here you just need to specify a name and this task will copy the default theme (ecomm) and create the new theme files for you. You just need to go and change the new scss rules to how you wish manually of course.

#### Building distributable Flux JS pattern library
This task runs automatically for you but you can also run it manually:
```bash
npm run build:jsplugins
```
This will put together all of the js under patterns named "plugin.js" and compile/minify it into 1 distributable js file.

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

## SCSS Breakdown
The styling for flux _the app_ is separated from everything else, those core scss files are located in ```./src/scss/flux/``` and are compiled by webpack. The themes on the other hand are different. These are compiled into ```dist/``` by gulp but their core files are located in  ```./src/scss/themes/```. You'll notice each pattern has a ```themes/``` directory. This is in case the same pattern will need to look different in each theme, if they are not needed, they can be removed.

## Further Vue documentation regarding this app
For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
