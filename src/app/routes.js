const { Router } = require('express');
const Controller = require('./controllers/Controller.js');

module.exports = () => {
	const app = Router();
    Controller(app);
	return app
}
