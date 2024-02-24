var db = require('DbConnectionHandler')

class DbHandler {
	
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