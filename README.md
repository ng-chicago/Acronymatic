# Acronymatic

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## Creation steps 05/30/2019 1:53 PM

### Create new app with CLI
    ng new Acronymatic  --routing=true  
    cd Acronymatic  

### Add PWA stuff
    ng add @angular/pwa  

### Make sure it's up to date (double check)
    ng update

### Modify distribution folder in _angular.json_ (personal preference)
	old: "outputPath": "dist/Acronymatic",  
	new: "outputPath": "dist",  

## Bump up the Lighthouse score tweaks

### Add description meta data to _index.html_ page
        <meta name="description" content="Acronymatic">  
        <meta name="keywords" content="Angular, PWA">  

### Update _manifest.json_ short_name
    "short_name": "Very Short",  

### Add .htaccess file to root for HTTPS redirect  
[Gist File](https://gist.github.com/ng-chicago/8eeb71f749134983a83b8752a9a29905)  

### Modify _angular.json_ to include new .htaccess file in build  
	"assets": [
              "src/favicon.ico",
              "src/assets",
              "src/manifest.json",
              "src/.htaccess"
            ],


### Build Deploy & Audit Check
    ng build --prod  
    cd dist  
    Push the entire folder with the tool of your choice to your website  
    Run Chrome Lighthouse Audit to see score

### Push to GitHub
    git status  
    git add -A  
    git commit -m "base app creation"  
    git remote add origin https://github.com/ng-chicago/Acronymatic.git  
    git push -u origin master  

### Notes  
    My host does not offer HTTP2 - So I was dinged on the Best Practices number 
    Some browser Extensions will slow down things and lower scores  
        (turn them all off while testing)  
        
        
### My Steps To Clone This  
create new GitHub repository {PutNameHere}  
mkdir {PutNameHere}  
cd {PutNameHere}  
git clone https://github.com/ng-chicago/Acronymatic.git .  
git remote set-url origin https://github.com/ng-chicago/{PutNameHere}.git  
git push -u origin master  
npm install  
