const express = require('express')
const dbh = require('DbHandler')
const app = express();

app.use(express.urlencoded({
	
	extended: true
}))

app.use(express.json())

var globalUser = "";

app.get('/', (req, res) => {
	
	res.send(`<html>
	 <body style="height: 100%; margin: 0; display: flex; justify-content: center; align-items: center; background-color: purple; color: white;">
	<div style="text-align: center;">
	<h1 style="font-family: \'Montserrat\', sans-serif;"> Cinema Room </h1>
	<p style="font-family: \'Open Sans\', sans-serif; font-family: 20px;"> The best movie reviewing platform.
	<a style="color: white;" href="/create"> Click here to create an account </a>
	Have an account?
	<a style="color: white;" href="/login"> Log in now! </a>
	</p>
	</div>
	</body>
	</html>`);
	
})

app.get('/create', (req, res) => {
	if (globalUser != "") {
		
		globalUser = ""
		
	}
	
	res.send(`<html>
	<body style="height: 100%; margin: 0; display: flex; justify-content: center; align-items: center; background-color: purple; color: white;">
	<div style="text-align: center;">
	<form method="post">
	<h1 style="font-family: \'Montserrat\', sans-serif;"> We\'re gladd you could join us. Create an account below. </h1>
	<h1 style="\'MOntserrat\', sans-serif;"> Username? </h1>
	<input name="username">
	<h1 style="\'Montserrat\', sans-serif;"> Password? </h1>
	<input type="password" name="password">
	<p style="\'Open Sans\', sans-serif; font-family: 20px;"> Have an account?
	<a href="/login"> Log in here. </a>
	</p>
	<button style="background-color: white; color: purple; font-family: \'Raleway\', sans-serif;"> Create Account </button>
	</form>
	</div>
	</body>
	</html>`);
	
})

app.get('/home', async (req, res) => {
	
try {
	
	let myMovies = await dbh.getMovies(globalUser)
	
	myMovies.reverse()
	
	let page = `<html>
	<body style="background-color: black; color: white;">
	<nav style="background-color: purple; color: white; font-family: \'Raleway\', sans-serif;"> <div style="position: absolute; left: 0; font-family: \'Montserrat\', sans-serif;"> <p> &#x1F3A5; Cinema Room </p> </div> <div style="color: white; position: absolute; right: 0;"> <a href="/home"> Home </a> <a href="/top10"> Top 10 </a> <a href="/search"> Search </a> <a href="/login"> Log Out </a> </div> </nav>
	<h1 style="font-family: \'Montserrat\', sans-serif;"> My Movies </h1>`
	
	if (myMovies.length === 0) {
		
		page += '<div style="display: flex; justify-content: center; text-align: center;">'
		page += '<p style="font-family: \'Open Sans\', sans-serif;"> Your reviewed movies will appear here. </p>'
		page += '</div>'
		
	} else  {
		
		page += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">'
		
	for (let i = 0; i < myMovies.length; i++) {
		
			page += `<div>
		<h2 style="font-family: \'Montserrat\', sans-serif;"> ${myMovies[i].movieTitle} </h2>
		<a href="/mymovie/${myMovies[i]._id}">
		<img src="${myMovies[i].movieImage}" alt="${myMovies[i].movieTitle}">
		</a>
		</div>`
		
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
	
	res.send(`<html>
	<body style="height: 100%; margin: 0; display: flex; justify-content: center; align-items: center; background-color: purple; color: white;">
	<div style="text-align: center;">
	<h1 style="font-family: \'Montserrat\', sans-serif;"> Welcome back! </h1>
	<form method="post">
	<h1 style="font-family: \'Montserrat\', sans-serif;"> Username? </h1>
	<input name="username">
	<h1 style="font-family: \'Montserrat\', sans-serif;"> password? </h1>
	<input type="password" name="password">
	<p style="\'Open Sans\', sans-serif; font-family: 20px;"> Don\'t have an account?
	<a href="/create"> Create an account here. </a>
	</p>
	<button style="background-color: white; color: purple; font-family: \'Raleway\', sans-serif;"> Log In </button>
	</form>
	</div>
	</body>
	</html>`);
	
});

app.get('/movie/:id', async (req, res) => {
	
	try {
		
		const movieId = req.params.id;
		
		const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=a26a1684ba14b7b49ebbd51f98eb95f7`);
		
			const data = await response.json();
			
			const movie = data;
			
			let page = `<html>
			<body style="background-color: black; color: white;">
			<nav style="background-color: purple; color: white; font-family: \'Raleway\', sans-serif;"> <div style="position: absolute; left: 0; font-family: \'Montserrat\', sans-serif;"> <p> &#x1F3A5; Cinema Room </p> </div> <div style="color: white; position: absolute; right: 0;"> <a href="/home"> Home </a> <a href="/top10"> Top 10 </a> <a href="/search"> Search </a> <a href="/login"> Log Out </a> </div> </nav>` 
			
			page += '<div style="position: absolute; left: 0;">'

page += '<div>'
			page += `<h1 style="font-family; \'Montserrat\', sans-serif;">${movie.original_title}</h1>`;
				
					if (movie.poster_path) {
						
						             page += `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.original_title}">`;
									 
					} else {
						
						page += `<p style="font-family: \'Open Sans\', sans-serif;"> No image available </p>`;
						
					}
					page += `<p style="font-family: \'Open Sans\', sans-serif;">${movie.overview}</p>`;
					
					page += '</div>'
			page += '</div>'
					
					page += '<div style="position: absolute; right: 0;">'
					
					page += '<div>'
										
					let reviews = await dbh.getReviews(movie.original_title)
					
					reviews.reverse()
				
					page += '<h1 style="font-family: \'Montserrat\', sans-serif;"> Reviews Given </h1>';
					if (reviews.length === 0) {
						
						page += '<p style="font-family: \'Open Sans\', sans-serif;"> No reviews yet. Wanna be the first? </p>'
						
					} else {
						
					for (let i = 0; i < reviews.length; i++) {
						
						if (reviews[i].movieReviewBy === globalUser) {
							
							page += `<p style="font-family: \'Open Sans\', sans-serif;"> <a href="/myMovie/${reviews[i]._id}"> ${reviews[i].movieReview} - reviewed by @${reviews[i].movieReviewBy} </a> </p>`
							
							page += '<br>'
							
						} else {
							
							page += `<p style="font-family: \'Open Sans\', sans-serif;"> ${reviews[i].movieReview} - reviewed by @${reviews[i].movieReviewBy} </p>`
							
							page += '<br>'
							
						}
					}
				}
				
					page += '<div style="position: fixed; bottom: 0; right: 0;">'
					page += '<div>'
					page += `<form method="post">`
				
					page += '<textarea name="review" placeholder="Leave a review"></textarea>'
					page += '<button style="background-color: purple; color: white; font-family: \'Raleway\', sans-serif;"> Submit Review </button>';
					page += '</form>'
					page += '</div>'
					page += '</div>'
					page += '</div>'
					
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
		
		let page = `<html>
		<body style="background-color: black; color: white;">
		<nav style="background-color: purple; color: white; font-family: \'Raleway\', sans-serif;"> <a style="color: white;" href="/home"> Back to My Movies </a> <a style=" color: white; href="/login"> Log Out </a> </nav>`
		
		page += '<div style="position: absolute; left: 0;">'
		page += '<div>'
		
		for (let i = 0; i < movie.length; i++) {
			
			page += `<h1 style="font-family: \'Montserrat\', sans-serif;"> ${movie[i].movieTitle} </h1>`
			
			page += `<img src="${movie[i].movieImage} alt="${movie[i].movieTitle}">`
			
			page += `<p style="font-family: \'Open Sans\', sans-serif;"> ${movie[i].movieDescription} </p>`
		
		page += '<br>'
			
		page += '</div>'
		page += '</div>'
				
			page += '<div style="position: absolute; right: 0;">'
			
			page += '<div>'
			
			page += `<h2 style="font-family: \'Montserrat\', sans-serif;"> Your review </h2>`
			
			page += `<p style="color: white; font-family: \'Open Sans\', sans-serif;"> ${movie[i].movieReview} </p>`
			page += '<br>'
			
			page += '<div style="position: fixed; bottom: 0; right: 0;">'
			
			page += '<div>'
			
		page += `<button style="background-color: purple; color: white; font-family: \'Raleway\', sans-serif; margin-right: 10px;" onclick="deleteReview()"> Delete Review </button>`
		
		page += '<button style="background-color: purple; color: white; font-family: \'Raleway\', sans-serif;" onclick="editReview()"> Edit Review </button>'
			page += '</div>'
			page += '</div>'
			page += '</div>'
			
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

app.get('/search', (req, res) => {
	
	res.send(`<html>
	<body style="background-color: black; color: white;">
	<nav style="background-color: purple; color: white; font-family: \'Raleway\', sans-serif;"> <div style="color: white; position: absolute; left: 0; font-family: \'Montserrat\', sans-serif;"> <p> &#x1F3A5; Cinema Room </p> </div> <div style="position: absolute; right: 0;"> <a href="/home"> Home </a> <a href="/top10"> Top 10 </a> <a href="/search"> Search </a> <a href="/login"> Log Out </a> </div> </nav>
	<div style="height: 100%; margin: 0; display: flex; justify-content: center; align-items: center; text-align: center;">
	<form method="post">
	<h1> Search For Movies </h1 style="font-family: \'Montserrat\', sans-serif;">
	<input name="movieSearch">
	<button style="background-color: purple; color: white; font-family: \'Raleway\', sans-serrif;"> Search </button>
	</form>
	</div>
	</body>
	</html>`)
	
})

app.get('/top10', async (req, res) => {
	
    let page = `<html>
	<body style="background-color: black; color: white;">
	<nav style="background-color: purple; color: white; font-family: \'Raleway\', sans-serif;"> <div style="position: absolute; left: 0; font-family: \'Montserrat\', sans-serif;"> <p> &#x1F3A5; Cinema Room </p> </div> <div style="color: white; position: absolute; right: 0;"> <a href="/home"> Home </a> <a href="/top10"> Top 10 </a> <a href="/search"> Search </a> <a href="/login"> Log Out </a> </div> </nav>
	<h1 style="font-family: \'Montserrat\', sans-serif;"> Top 10 Movies </h1>`;
    try {
        const response = await fetch("https://api.themoviedb.org/3/movie/top_rated?api_key=a26a1684ba14b7b49ebbd51f98eb95f7");
        const data = await response.json();
        const movies = data.results;

		page += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">'
		
		if (movies && movies.length >= 0) {
			
			movies.slice(0, 10).forEach(movie => {
				if (movie.poster_path) {
					
        page += `<div>
					<h2 style="font-family: \'Montserrat\', sans-serif;"> ${movie.original_title} </h2>
					<a href="/movie/${movie.id}">
					<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.original_title}">
					</a>
					</div>`
		
        } else {
 			
            page += `<div> <h2> <a style="color: white; font-family: \'Raleway\', sans-serif;" href="${movieId}"> ${movie.original_title} - No Image available </a> </h2> </div>`
 
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
		
		res.send(`<html>
		<body style="height: 100%; margin: 0; display: flex; justify-content: center; align-items: center; background-color: purple; color: white">
		<div style="text-align: center;">
		<h1 style="font-family: \'Montserrat\', sans-serrif;"> Account created </h1>
		<p style="font-family: \'Open Sans\', sans-serif; font-size: 20px;"> We\'re sorry. That account already exists. Head to the log in page to sign in. </p>
		<a style="font-family: \'Raleway\', sans-serif;" href="/login"> Go To Log In </a>
		</div>
		</body>
		</html>`);
	} else {
		
		await dbh.addUser(username, password);
		globalUser = username;
		
		res.send(`<html>
		<body style="height: 100%; margin: 0; display: flex; justify-content: center; align-items: center; background-color: purple; color: white;">
		<div style="text-align: center;">
		<h1 style="font-family: \'Monserrat\', sans-serif;"> Account Created! :-> </h1>
		<p style="font-family: \'Montserrat\', sans-serif; font-size: 20px;"> Thanks for becoming a member. Click get started below. Have fun! </p>
		<a style="font-family: \'Raleway\', sans-serif;" href="/home"> Get Started! </a>
		</div>
		</body>
		</html>`)
		
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
    let searchPage = `<html>
	<body style="background-color: black; color: white;">
	<nav style="background-color: purple: color: white; font-family: \'Raleway\', sans-serif;"> <a style="color: white;" href="/search"> Back To Search </a> <a style="color: white;" href="/login"> Log Out </a> </nav>
	<h1 style="font-family: \'Montserrat\', sans-serif;"> Search results </h1>`;
    
    try {
        const search = req.body.movieSearch;
        
        const response = await fetch('https://api.themoviedb.org/3/search/movie?api_key=a26a1684ba14b7b49ebbd51f98eb95f7&query=' + search);
        
        const data = await response.json();
        
        const movies = data.results;
        if (search.trim() == "") {
        	
			res.send('<script> alert("Error! Please enter a movie to be searched."); window.location.href = "/search"; </script>')
			
        } else {
		
        if (movies && movies.length > 0) {
			
			searchPage += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">'
	 		
            movies.slice(0, 20).forEach(movie => {
				
                if (movie.poster_path) {
					
					searchPage += `<div>
					<h2 style="font-family: \'Montserrat\', san-serif;"> ${movie.original_title} </h2>
					<a href="/movie/${movie.id}">
					<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.original_title}">
					</a>
					</div>`;
                } else {
					searchPage += `<div> <h2> <a style="color: whitr; font-family: \'Raleway\', sans-serif;" href="/movie/${movie.id}"> ${movie.original_title} - No image available </a> </h2> </div>`
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