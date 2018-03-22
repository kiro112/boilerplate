# NodeJs Boilerplate

Requirements
------
1. MySQL 5.7
2. NodeJs v8.10.x


## Running the application
1. Download zip
2. Create the Database
  - Declare the *DB_USER* and *DB_PWD* variables
  ```sh
  $ mysql -uroot < database/schema.sql
  $ mysql -uroot < database/stored_procedures.sql
  $ mysql -uroot < database/seed.sql
  ``` 

3. Run this commands to get started:
  ```sh
  $ npm install
  ```

4. To run the server using nodemon: 
  ```sh
  $ npm run dev
  ```

5. Using cluster:
  ```sh
  $ npm run cluster-nodemon
  $ npm run cluster-forever
  ```

6. After starting the server, run this commands to check:
  ```sh
  $ curl http://localhost:8000
  ```
  
7. To get apidocs
  ```sh
  $ npm run docs
  ```
  Then check localhost:8000/apidoc/
  

## Package Vulnerability Check
1. Install needed packages globally
 ```sh
 $ npm install -g nsp
 $ npm install -g snyk
 ```

2. Check Using nsp(node security project) CLI
 ```sh
 $ cd to.project.folder
 $ nsp check 
 ```

3. Check Using snyk
 ```sh
 $ cd to.project.folder
 $ snyk test
 ```


License
-----
MIT


<!-- ## Special Thanks
(https://www.bithound.io/github/anyTV/anytv-node-boilerplate), especially rvnjl <3 -->
