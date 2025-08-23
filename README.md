# esc-ug-coding-assessment (2025 to 2026)

**Link to project:** https://esc-ug-ca.onrender.com/

## How It's Made:
### Tech Stack:
* (Frontend) React + TailwindCSS + extendable-media-recorder
* (Backend) Node.js + Express + better-sqlite3 + bcrypt + jsonwebtoken + dotenv + multer + cors

### Client:
The client was built using React. The main pages the user will interact with are: 
* Home Page - where the user will be able to record and see the generated transcript.
* Login Page - where the user will log in
* Sign Up Page - where the user will create an account
* TransactionHistory Page - where the user can view/edit their previously generated transcripts

#### User Authentication
User authentication is handled using JSON web tokens. Requests made to the backend must have a valid JWT attached or the user will be redirected back to the Login page. On successful login, the generated JWT received from the backend is stored in a useContext hook. If the user refreshes the browser, this token will be reset, and the user will be redirected back to the Login page. 

#### Routing
Routing among the pages is handled using TanStack Router, with all pages except the Login and Sign Up page routes being protected. Therefore, attempting to visit a page with an invalid/expired token will redirect the user back to the Login page. 

#### Queries
Queries to the database are handled using TanStack Query. Using the REST API hosted on the web server, CRUD (create, read, update, delete) operations can be performed using appropriate HTTP methods to respective resource endpoints. 

### Server:
The web server was built using Express + Node.js. The web server hosts a REST API which allows for a consistent way of interacting with both transcript and user resources. The REST API endpoints and their supported request HTTP method(s) include: 
* /api/users
  * **POST** - create new user
* /api/users/:userId/transcripts
  * **GET** - get all user's transcripts
* /api/transcripts
  * **POST** - create a new transcript
* /api/transcripts/:transcriptId
  * **PUT** - update transcript text 
  * **DELETE** - delete transcript
* /api/auth/login
  * **POST** - login user
* /api/auth/:token
  * **GET** - get the user information associated with JWT

#### Generating transcript from user audio
When a new transcript is created, the user's id is obtained from the token attached to the request's headers. To generate the transcript from the user's recorded audio, I have used the Hugging Face (HF) Inference API for the openai/whisper-large-v3 model. Although I was able to connect with the same model deployed on AzureML, it is simpler to use the HF Inference API. The link to the documentation I used is [here](https://huggingface.co/docs/inference-providers/tasks/automatic-speech-recognition#api-specification).


#### Database: 
For the application's database, I chose to use SQLite via the better-sqlite3 library. The database contains two tables, users and transcripts. The respective table queries are shown below: 

##### users  
```sql
CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        email TEXT UNIQUE NOT NULL, 
        username TEXT UNIQUE NOT NULL, 
        password TEXT NOT NULL
)
```

##### transcripts 
```sql
CREATE TABLE IF NOT EXISTS transcripts (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        audio_file BLOB NOT NULL, 
        generated_text TEXT NOT NULL,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
)
```


