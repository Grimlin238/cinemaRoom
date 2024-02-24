const express = require('express')
const dbh = require('DbHandler')

const app = express();

app.use(express.urlencoded({
	
	extended: true
}))

app.use(express.json())

app.get('/', (req, res) => {
	
	res.send('<h1> Cinema Room </h1> <p> The best movie reviewing platform </p> <a href="/create"> Click here to create an account </a> <p> Have an account? </p> <a href="/login"> Log in now! </a>');
})

app.get('/create', (req, res) => {
	
	res.send('<form method="post"> <h1> Username? </h1> <input name="username"> <h1> Password? </h1> <input type="password" name="password"> <button> Create </button> </form>');
} )

app.get('/home', (req, res) => {
	
	res.send('<nav> <a href="/home"> Home </a> <a href="/latest"> Latest Movies </a> <a href="/search"> Search For Movies </a> </nav>');
})

app.get('/login', (req, res) => {
	
res.send('<h1> Glad you could join us. Create an account below </h1> <form method="post"> <h1> Username? </h1> <input name="username"> <h1> password? </h1> <input type="password" name="password"> <button> Log in </button> </form>')
})

app.post('/create', async (req, res) => {
	
	const username = req.body.username;
	
	const password = req.body.password;
	const isInThere = await dbh.isUserExists(username, password)
	
	if (isInThere) {
		
		res.send('<h1> Account created </h1> <p> We\'re sorry. That account already exists. Head to the log in page to sign in. </p> <a href="/login"> Go To Log In </a>');
	} else {
		
		await dbh.addUser(username, password);
		
		res.send('<h1> Account Created! :-> </h1> <p> Thanks for becoming a member. Click get started below. Have fun! </p> <a href="/home"> Get Started! </a>')
	} 
})

app.post('/login', async (req, res) => {
	
	const username = req.body.username;
	
	const password = req.body.password;
	
	const isInThere = await dbh.isUserExists(username, password);
	
	if (isInThere == true) {
		
		res.redirect('/home')
	} else {
		
		res.send('<h1> Login Error! </h1> </p> Sorry, but your account isn\'t in our records. </p> <a href="/login"> Try Again </a>')
	}
})

app.listen(8080, () => {
	
	console.log("I\'m listening on port 8080");
})