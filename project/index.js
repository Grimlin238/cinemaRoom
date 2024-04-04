const express = require('express')
const dbh = require('DbHandler')
const app = express();

app.use(express.urlencoded({
	
	extended: true
}))

app.use(express.json())

var globalUser;

app.get('/', (req, res) => {
	
	res.send('<h1> Cinema Room </h1> <p> The best movie reviewing platform </p> <a href="/create"> Click here to create an account </a> <p> Have an account? </p> <a href="/login"> Log in now! </a>');
})

app.get('/create', (req, res) => {
	
	res.send('<form method="post"> <h1> Username? </h1> <input name="username"> <h1> Password? </h1> <input type="password" name="password"> <button> Create </button> </form>');
} )

app.get('/home', async (req, res) => {
	
try {
	
	let myMovies = await dbh.getMovies(globalUser)
	
	let page = '<nav> <a href="/home"> Home </a> <a href="/latest"> Latest Movies </a> <a href="/search"> Search </a> </nav> <h1> My Movies </h1>'
	
	for (let i = 0; i < myMovies.length; i++) {
		
			page += `<h2> <a href="/mymovie/${myMovies[i]._id}"> ${myMovies[i].movieTitle} <a/> </h2>`
		
		page += `<img src="${myMovies[i].movieImage}" alt="${myMovies[i].movieTitle}"`
	}
	
	res.send(page)
	
} catch (err) {
	
	console.log(err)
	
	res.status(500).send('There was an issue on the server side')
	
}
})

app.get('/latest', async (req, res) => {
    let page = '<nav> <a href="/home"> Home </a> <a href="/latest"> Latest Movies </a> <a href="/search"> Search </a> </nav> <h1> Latest Movies </h1>';

    try {
        const response = await fetch("https://api.themoviedb.org/3/movie/latest?api_key=a26a1684ba14b7b49ebbd51f98eb95f7");
        const data = await response.json();
        const movie = data
			
            page += `<h1> <a href="/movie/${movie.id}">${movie.original_title} </a></h1>`;
            if (movie.poster_path) {
                page += `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.original_title}">`;
            } else {
                page += "<p>No image for movie</p>";
            }

        res.send(page);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching latest movies');
    }
});

app.get('/login', (req, res) => {
	
	res.send('<h1> Welcome back! </h1> <form method="post"> <h1> Username? </h1> <input name="username"> <h1> password? </h1> <input type="password" name="password"> <button> Log in </button> </form>');
});

app.get('/movie/:id', async (req, res) => {
	
	try {
		
		const movieId = req.params.id;
		
		const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=a26a1684ba14b7b49ebbd51f98eb95f7`);
		
			const data = await response.json();
			
			const movie = data;
			
			let page = `<nav><a href="/home">Home</a><a href="/latest">Latest Movies</a><a href="/search">Search</a></nav>`;
			
			        page += `<h1>${movie.original_title}</h1>`;
				
					if (movie.poster_path) {
						
						             page += `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.original_title}">`;
									 
					} else {
						
						page += "<p> No image available </p>";
						
					}
					page += `<p>${movie.overview}</p>`;
					
					page += `<form method="post">`
					
					let reviews = await dbh.getReviews(movie.original_title)
					
					page += '<h1> Reviews Given </h1>';
					
					for (let i = 0; i < reviews.length; i++) {
						
						page += `<p> ${reviews[i].movieReview}`
						page += '<br>'
						page += ` - review by @${reviews[i].movieReviewBy} </p>`
						
					}
					
					page += '<textarea name="review" placeholder="Leave a review"></textarea>'
					page += "<button> Submit Review </button>";
					page += '</form>'
					res.send(page)
					
						} catch (err) {
							
							console.error(err);
							res.status(500).send('There was an issue on the server side');
						}
})

app.get('/mymovie/:id', async (req, res) => {
	
	try {
		
		const movieId = req.params.id;
		
		let movie = await dbh.getReviewById(movieId, globalUser)
		
		let page = '<nav> <a href="/home"> Back to My Movies </a> </nav>'
		
		for (let i = 0; i < movie.length; i++) {
			
			page += `<h1> ${movie[i].movieTitle} </h1>`
			
			page += `<img src="${movie[i].movieImage} alt="${movie[i].movieTitle}">`
			
			page += `<p> ${movie[i].movieDescription} </p>`
			
			page += '<h2> Your review </h2>'
			
			page += `<p> ${movie[i].movieReview} </p>`
			
		page += '<button onclick="deleteReview()"> Delete Review </button>'
		
		page += '<button onclick="editReview()"> Edit Review </button>'
		
		page += `<script>
		
		function deleteReview() {
		const confirmed = confirm('Are you sure you want to delete this review. This action can not be undone');
		
		if (confirmed) {
		
		fetch("/mymovie/${movieId}", {
		
		method: "DELETE"
		}) .then(() => {
		
		window.location.href = "/home"
		}) .catch((error) => {
			console.error(error)
		
		alert('There was an issue communicating with the server, and the movie was not deleted')
		})
		}
		}
		
		function editReview() {
		
		let review = prompt("Edit review for ${movie[i].movieTitle}", "${movie[i].movieReview}");
	
	if (review && review.length > 0 && review.trim() !== "") {
	
	fetch("/mymovie/${movieId}", {
	
	method: 'PUT',
		
		headers: {
	
	'Content-Type': 'application/json'
	
	},
	
	body: JSON.stringify({
	
	review
		
	})
}) .then (() => {

window.location.href = "/mymovie/${movieId}"
	
}) .catch((err) => {

console.error(err)

alert('An issue occured, and your review was not updated.')

})  
	}
	}
		
		</script>`
}
		res.send(page)
		
	} catch (err) {
		
		console.error(err)
		
		res.status(500).send('There was an issue on the server side')
	}
	
})

app.get('/search', (req, res) => {
	res.send('<nav> <a href="/home"> Home </a> <a href="/latest"> Latest Movies </a> <a href="/search"> Search </a> </nav> <form method="post"> <h1> Search For Movies </h1> <input name="movieSearch"> <button> Search </button> </form>')
	
})

app.delete('/mymovie/:id', async (req, res) => {
	
	try {
		
		const movieId = req.params.id
		
		await dbh.removeReview(movieId, globalUser)
		
		res.redirect('/home')
		
	} catch (err) {
		
		console.error(err)
		res.status(500).send('There was an issue on the server side')
		
	}
})

app.post('/create', async (req, res) => {
	
	const username = req.body.username;
	
	const password = req.body.password;
	const isInThere = await dbh.isUserExists(username, password)
	
	if (isInThere) {
		
		res.send('<h1> Account created </h1> <p> We\'re sorry. That account already exists. Head to the log in page to sign in. </p> <a href="/login"> Go To Log In </a>');
	} else {
		
		await dbh.addUser(username, password);
		globalUser = username;		
		res.send('<h1> Account Created! :-> </h1> <p> Thanks for becoming a member. Click get started below. Have fun! </p> <a href="/home"> Get Started! </a>')
		
	} 
})

app.post('/login', async (req, res) => {
	
	const username = req.body.username;
	
	const password = req.body.password;
	
	const isInThere = await dbh.isUserExists(username, password);
	
	if (isInThere == true) {
		
		globalUser = username
		res.redirect('/home')
	} else {
		
		res.send('<h1> Login Error! </h1> </p> Sorry, but your account isn\'t in our records. </p> <a href="/login"> Try Again </a>')
	}
})

app.post('/movie/:id', async (req, res) => {
	
	const movieId = req.params.id;
	
	const review = req.body.review;
	
	try {
		
	const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=a26a1684ba14b7b49ebbd51f98eb95f7`);
		
		const data = await response.json()
		
		const movie = data;
		
		if (review && review.length > 0) {
			
			await dbh.addReview(movie.original_title, `https://image.tmdb.org/t/p/w500${movie.poster_path}`, movie.overview, review, globalUser);
				
				res.send(`
					<h1> movie submitted </h1>
					<p> Review submitted for ${movie.original_title}
					<a href="/movie/${movie.id}"> Back to review </a>`)			
			} else {
				
				res.redirect(`/movie/${movie.id}`);
			}
			} catch (err) {
				
				console.error(err);
				res.status(500).send('There was an issue on the server side');
			}
})

app.post('/search', async (req, res) => {
    let searchPage = '<nav> <a href="/search"> Back To Search </a> </nav>  <h1> Search results </h1>';
    
    try {
        const search = req.body.movieSearch;
        
        const response = await fetch('https://api.themoviedb.org/3/search/movie?api_key=a26a1684ba14b7b49ebbd51f98eb95f7&query=' + search);
        
        const data = await response.json();
        
        const movies = data.results;
        
        if (movies && movies.length > 0) {
            movies.slice(0, 12).forEach(movie => {
                searchPage += `<h1> <a href="/movie/${movie.id}"> ${movie.original_title} </a></h1>`;
                
                if (movie.poster_path) {
                    searchPage += `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.original_title}">`;
                } else {
                    searchPage += "<p>No image for movie</p>";
                }
            });
            res.send(searchPage);
        } else {
            res.send('<nav> <a href="/search"> Back To Search </a> </nav> <p> We could not find that movie. </p>');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching search results');
    }
});

app.put('/mymovie/:id', async (req, res) => {
	
	try {
		
		const movieId = req.params.id;
		
		const review = req.body.review
		
		await dbh.updateReview(movieId, globalUser, review)
		
		res.redirect('/mymovie/:id')
		
	} catch (err) {
		
		console.error(err)
		
		res.status(500).send('There was an issue on the server side')
	}
})

app.listen(8080, () => {	
	console.log("I\'m listening on port 8080");
})