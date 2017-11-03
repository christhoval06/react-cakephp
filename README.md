# How it works?

Below you can see how to bootstrap a project using ReactJS and CakePHP 2.8.
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

Install the database contained into `database.sql` file in the root folder.
Basic installation contains many functionalities:
* users
* profiles
* login
* payments system (PayPal, still working on it)

To run and work on the client application:
```cd client
npm install
npm start
```