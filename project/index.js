const express = require('express')
const dbh = require('DbHandler')
const app = express();

app.use(express.urlencoded({
	
	extended: true
}))

app.use(express.json())

var globalUser = "";

app.get('/', (req, res) => {
	
	res.send('<html> <body style="background-color: purple; color: white;"> <h1> Cinema Room </h1> <p> The best movie reviewing platform </p> <a href="/create"> Click here to create an account </a> <p> Have an account? </p> <a href="/login"> Log in now! </a> </body> </html>');
	
})

app.get('/create', (req, res) => {
	if (globalUser != "") {
		
		globalUser = ""
		
	}
	
	res.send('<html> <body style="background-color: purple; color: white;"><form method="post"> <h1> We\'re gladd you could join us. Create an account below. </h1> <h1> Username? </h1> <input name="username"> <h1> Password? </h1> <input type="password" name="password"> <p> Have an account? <a href="/login"> Log in here. </a> </p> <button> Create Account </button> </form></body></html>');
	
})

app.get('/home', async (req, res) => {
	
try {
	
	let myMovies = await dbh.getMovies(globalUser)
	
	myMovies.reverse()
	
	let page = '<html> <body style="background-color: black; color: white;"><nav style="background-color: purple; color: white;"> <a href="/home"> Home </a> <a href="/top10"> Top 10 </a> <a href="/search"> Search </a> <a href="/login"> Log Out </a> </nav> <h1> My Movies </h1>'
	
	if (myMovies.length === 0) {
		
		page += '<p> Your reviewed movies will appear here. </p>'
		
	} else  {
		
		page += '<div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gird-gap: 10px;">'
		
	for (let i = 0; i < myMovies.length; i++) {
		
			page += `<div> <a href="/mymovie/${myMovies[i]._id}"> ${myMovies[i].movieTitle} <img src="${myMovies[i].movieImage}" alt="${myMovies[i].movieTitle}"> </a></div>`
		
	}
	
	page+= '</div>'
	
}

page += '</body>'
page += '</html>'
	
	res.send(page)
	
} catch (err) {
	
	console.error(err)
	
	res.status(500).send('There was an issue on the server side')
	
}
})

app.get('/login', (req, res) => {
	
	if (globalUser != "") {
		
		globalUser = ""
			
	}
	
	res.send('<html> <body style="background-color: purple; color: white;"><h1> Welcome back! </h1> <form method="post"> <h1> Username? </h1> <input name="username"> <h1> password? </h1> <input type="password" name="password"> <p> Don\'t have an account? <a href="/create"> Create an account here. </a> </p> <button> Log In </button> </form></body></html>');
	
});

app.get('/movie/:id', async (req, res) => {
	
	try {
		
		const movieId = req.params.id;
		
		const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=a26a1684ba14b7b49ebbd51f98eb95f7`);
		
			const data = await response.json();
			
			const movie = data;
			
			let page = `<html> <body style="background-color: black; color: white;"><nav style="background-color: purple; color: white;"><a href="/home"> Home </a><a href="/top10"> Top 10 </a><a href="/search"> Search </a> <a href="/login"> Log Out </a> </nav>`;
			
			        page += `<h1>${movie.original_title}</h1>`;
				
					if (movie.poster_path) {
						
						             page += `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.original_title}">`;
									 
					} else {
						
						page += "<p> No image available </p>";
						
					}
					page += `<p>${movie.overview}</p>`;
					
					page += `<form method="post">`
					
					let reviews = await dbh.getReviews(movie.original_title)
					
					reviews.reverse()
				
					page += '<h1> Reviews Given </h1>';
					
					for (let i = 0; i < reviews.length; i++) {
						
						if (reviews[i].movieReviewBy === globalUser) {
							
							page += `<p> <a href="/myMovie/${reviews[i]._id}"> ${reviews[i].movieReview} - reviewed by @${reviews[i].movieReviewBy} </a> </p>`
							
							page += '<br>'
							
						} else {
							
							page += `<p> ${reviews[i].movieReview} - reviewed by @${reviews[i].movieReviewBy} </p>`
							
							page += '<br>'
							
						}
					}
					
					page += '<textarea name="review" placeholder="Leave a review"></textarea>'
					page += "<button> Submit Review </button>";
					page += '</form>'
					page += '</body>'
					page += '</html>'
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
		
		let page = '<html> <body style="background-color: black; color: white;"><nav style="background-color: purple; color: white;"> <a href="/home"> Back to My Movies </a> <a href="/login"> Log Out </a> </nav>'
		
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

page += '</body>'
page += '</html>'

		res.send(page)
		
	} catch (err) {
		
		console.error(err)
		
		res.status(500).send('There was an issue on the server side')
	}
	
})

app.get('/top10', async (req, res) => {
    let page = '<html> <body style="background-color: black; color: white;"><nav style="background-color: purple; color: white;"> <a href="/home"> Home </a> <a href="/top10"> Top 10 </a> <a href="/search"> Search </a> <a href="/login"> Log Out </a> </nav> <h1> Top 10 Movies </h1>';
    try {
        const response = await fetch("https://api.themoviedb.org/3/movie/top_rated?api_key=a26a1684ba14b7b49ebbd51f98eb95f7");
        const data = await response.json();
        const movies = data.results;

		page += '<div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; grid-gap: 10px">'
		
		if (movies && movies.length >= 0) {
			
			movies.slice(0, 10).forEach(movie => {
				if (movie.poster_path) {
        page += `<div> <a href="/movie/${movie.id}"> ${movie.original_title} <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.original_title}"> </a> </div>`
		
        } else {
			
            page += `<div> <a href="${movieId}"> ${movie.original_title} - No Image available </a> </div>`
			
        }
	})
}

page += '</div>'
page += '</body>'
page += '</html>'

        res.send(page);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching latest movies');
    }
});

app.get('/search', (req, res) => {
	
	res.send('<html> <body style="background-color: black; color: white;"><nav style="background-color: purple: color: white;"> <a href="/home"> Home </a> <a href="/top10"> Top 10 </a> <a href="/search"> Search </a> <a href="/login"> Log Out </a> </nav> <form method="post"> <h1> Search For Movies </h1> <input name="movieSearch"> <button> Search </button> </form></body></html>')
	
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
	
	const username = req.body.username.trim();
	
	const password = req.body.password.trim();
	
	if (username.trim() == "" || password.trim() == "") {
		
		res.send('<script> alert("Error! Please ensure all fields are filled out"); window.location.href = "/create"; </script>')
		
	} else {
	
	const isInThere = await dbh.isUserExists(username, password)
	
	if (isInThere) {
		
		res.send('<html> <body style="background-color: purple; color: white"><h1> Account created </h1> <p> We\'re sorry. That account already exists. Head to the log in page to sign in. </p> <a href="/login"> Go To Log In </a></body></html>');
	} else {
		
		await dbh.addUser(username, password);
		globalUser = username;		
		res.send('<html><body style="background-color: purple; color: white;"><h1> Account Created! :-> </h1> <p> Thanks for becoming a member. Click get started below. Have fun! </p> <a href="/home"> Get Started! </a></body></html>')
		
	}
	} 
})

app.post('/login', async (req, res) => {
	
	const username = req.body.username.trim();
	
	const password = req.body.password.trim();
	if (username.trim() == "" || password.trim() == "") {
		
		res.send('<script> alert("Error! Please ensure all fields are filled out."); window.location.href = "/login"; </script>')
		
	} else {
	
	const isInThere = await dbh.isUserExists(username, password);
	
	if (isInThere == true) {
		
		globalUser = username
		res.redirect('/home')
	} else {
		
		res.send(`<script> alert("Your account isn\'t in our records. Please try again."); window.location.href = "/login"; </script>`)
	}
}
})

app.post('/movie/:id', async (req, res) => {
	
	const movieId = req.params.id;
	
	const review = req.body.review;
	
	try {
		
	 const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=a26a1684ba14b7b49ebbd51f98eb95f7`);
		
		const data = await response.json()
		
		const movie = data;
		
		const exists = await dbh.isReviewExists(movie.original_title, globalUser)
		
		if (exists != true) {
			
		if (review && review.length > 0) {
			
			await dbh.addReview(movie.original_title, `https://image.tmdb.org/t/p/w500${movie.poster_path}`, movie.overview, review, globalUser);
				
				res.send(`<script>
					
alert("Review submitted for ${movie.original_title}");
window.location.href = "/movie/${movieId}";

</script>`)
			} else {
				
				res.send(`<script> alert("Error! There is nothing to submit. Please type write a review before clicking submit."); window.location.href = "/movie/${movieId}"; </script>`);
			}
		} else {
			
			res.send(`<script> alert("YOu\'ve already reviewed this movie."); window.location.href = "/movie/${movieId}"; </script>`)
			
		}
			} catch (err) {
				
				console.error(err);
				res.status(500).send('There was an issue on the server side');
			}
})

app.post('/search', async (req, res) => {
    let searchPage = '<html> <body style="background-color: black; color: white;"><nav style="background-color: purple: color: white;"> <a href="/search"> Back To Search </a> <a href="/login"> Log Out </a> </nav> <h1> Search results </h1>';
    
    try {
        const search = req.body.movieSearch;
        
        const response = await fetch('https://api.themoviedb.org/3/search/movie?api_key=a26a1684ba14b7b49ebbd51f98eb95f7&query=' + search);
        
        const data = await response.json();
        
        const movies = data.results;
        if (search.trim() == "") {
        	
			res.send('<script> alert("Error! Please enter a movie to be searched."); window.location.href = "/search"; </script>')
			
        } else {
		
        if (movies && movies.length > 0) {
			
			searchPage += '<div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; grid-gap: 10px;">'
			
            movies.slice(0, 20).forEach(movie => {
				
                if (movie.poster_path) {
					
					searchPage += `<div> <a href="/movie/${movie.id}"> ${movie.original_title} <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.original_title}"> </a> </div>`;
                } else {
					searchPage += `<div> <a href="/movie/${movie.id}"> ${movie.original_title} - No image available </a> </div>`
                }
            });
			searchPage += '</body>'
			searchPage += '</html>'
            res.send(searchPage);
        } else {
            res.send('<script> alert("Sorry! We couldn\'t find that movie."); window.location.href = "/search"; </script>');
        }
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
		
		if (review.trim() == "") {
			
			res.send(`<script> window.location.href = "/mymovie/${movieId}"; </script>`)
			
		} else {
		
		await dbh.updateReview(movieId, globalUser, review)
	
		res.redirect(`/mymovie/${movieId}`)
	
	}	
	} catch (err) {
		
		console.error(err)
		
		res.status(500).send('There was an issue on the server side')
	}
})

app.listen(8080, () => {	
	console.log("I\'m listening on port 8080");
})