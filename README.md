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
gulp new-page
```
This will ask you a few questions like "name?", "full page layout or side bar?" and "path in the pages dir.", after which this 
will generate the needed files to get you started as well as create routing and searchable content. If you want this page to be a link in the sidebar, that needs to be done manually (for now).

#### Building distributable Flux JS pattern library
This task runs automatically for you but you can also run it manually:
```bash
gulp build-js-plugins
```
This will put together all of the js under patterns named "plugin.js" and compile/minify it into 1 distributable js file. Building them individually distributable is a WIP and definitely wanted. 

#### Creating routes
This always runs for you automatically when you create new pages, but if you prefer to make routes manually, you can add them in the ```src/router/routes.json``` file. Once you edit that file, gulp should go and update the routes that vue reads from. If you want to manually regenerate the routes file you can run:
```bash
gulp build-routes
```

#### Build search
This will also run automatically for you whenever you edit or add any template in the ```pages/``` folder (this includes running the ```gulp new-page``` command). What it does is recursively search through the ```pages/``` folder for page information, makes that into JSON so that it can be easily searched. To manually run this step:
```bash
gulp build-search
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
... coming soon

## Further Vue documentation regarding this app
For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
