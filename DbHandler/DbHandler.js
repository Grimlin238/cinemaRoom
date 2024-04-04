const { ObjectId } = require('mongodb');
const db = require('DbConnectionHandler')

class DbHandler {

	static async addReview(title, image, description, review, user) {
		
		try {
			
			const base = await db.get("CinemaRoom");
			
			const collection = await db.getCollection("reviewdata");
			
			const result = await collection.insertOne({
				
				movieTitle: title,
				movieImage: image,
				movieDescription: description,
				movieReview: review,
				movieReviewBy: user
				
			})
		} catch (err) {
			
			console.error(err);
			throw err;
			
		}
		
	}
	
	static async addUser(user, pass) {
		
		try {
			
			const base = await db.get('CinemaRoom');
			
			const collection = await db.getCollection('users');
			
			const result = await collection.insertOne({
				
				username: user,
				password: pass
				
			});
						
		} catch (err) {
			
			console.error(err);
			throw err;
		}
	}
	
	static async getMovies(user) {
		
		try {
			
			const base = await db.get('CinemaRoom')
			
			const collection = await db.getCollection('reviewdata')
			
			const movies = await collection.find({movieReviewBy: user}).toArray()
			
			if (movies) {
				
				return movies
				
			} else {
				
				console.log('Could not locate data')
				
			}
		} catch (err) {
			
			console.error(err)
			
			throw err
			
		}
	}
	
	static async getReviews(title) {
		
		try {
			
			const base = await db.get('CinemaRoom');
			
			const collection = await db.getCollection('reviewdata');
			
			const reviews = await collection.find({movieTitle: title}).toArray();
			
			if (reviews) {
				
				return reviews;
				
			} else {
				
				console.log('No reviews found');
			}
		} catch (err) {
			
			console.error(err);
			
			throw err;
			
		}
		
	}
	
	static async getReviewById(id, user) {
		
		try {
			
			const base = await db.get('CinemaRoom')
			
			const collection = await db.getCollection('reviewdata')
			
			const movies = await collection.find({
				
				_id: new ObjectId(id),
				movieReviewBy: user
				
			}).toArray()
			
			if (movies) {
				
				return movies;
				
			} else {
				
				console.log('Could not find movie')
				
			}
			
		} catch (err) {
			
console.error(err)
		
			throw err;
		}
	}

	static async isUserExists(user, pass) {
		
		try {
			
		const base = await db.get('CinemaRoom');
		
		const collection = await db.getCollection('users');
		
		const doc = await collection.find({
			
			username: user,
			password: pass
			
		}).toArray();
		
		if (doc.length > 0) {
			
			return true;
			
		} else {
			
			return false;
		}
		
	} catch (err) {
		
		console.error(err);
		throw err;
		
	}
	}	
}

module.exports = DbHandler;