# About 
This is my "version" of mixed reactjs/react-redux/react-router boilerplate project.
I'm sorry for this tiny documentation, I hope to write more and more in the time about that.
For now my pourpose for this project is to create technical notes necessary (primary to my) to 
describe code API designed and developed in the boilerplate app. 

# Setup 
To install copy of this boilerplate project, open your shell and write these commands: 
```bash
git clone https://github.com/RoBYCoNTe/react-cakephp.git <ProjectName>
git remote set-url origin <New Repository Path>
git add .
git commit -m "First commit in new repository"
```
After installation you have to configure many files:
* app/Config/database.php: put your mysql database username/password
* app/Config/email.php: put your email service username/password (if you needs it)
* client/src/config/index.js: change endpoint with your server
* client/src/config/index-env.js: the same thing done for the previous element. 

Install the database contained into `database.sql` file.
Basic installation contains many entities (very common in most of projects):
* users
* profiles
* login
* payments system (PayPal, still working on it)

To run and work on the client application:
```cd client
npm install
npm start
```

# Entity Configuration
This project uses REST API written using CakePHP (2.8) and provide an easy way to map entity of your database.
In details, for each entity you can describe Grid and Form. 
To create and describe new entity you have to create a file, descriptors/<EntityName>.js containing all informations required to map the object. 
## Server Mapping (CakePHP)
Create an Entity using CakePHP. After all you will have a file called <EntityName>.php in app/Model. 
This file needs to be mapped in to the RestController.php, the file designed to serve CRUD service for each entity. 
## Form 
### Events
### Properties
## Grid 
### Events 
### Properties


