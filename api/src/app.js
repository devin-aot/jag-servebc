const express = require('express');
const bodyParser = require('body-parser');
const keycloak = require('./keycloak-config.js')
const { configuredSession } = require('./session-config.js')
const cors = require("cors")

const apiVersion = 'v1'

const routes = {
	attachments: require('./routes/attachments'),
	contacts: require('./routes/contacts'),
	documentStatuses: require('./routes/document-statuses'),
	documentTypes: require('./routes/document-types'),
	notes: require('./routes/notes'),
	servedDocuments: require('./routes/served-documents'),
	staffGroups: require('./routes/staff-groups'),
	// Add more routes here...
	// items: require('./routes/items'),
};

const app = express();

// FUTURE: comment it for prod
app.set('json spaces', 2)


// FUTURE: Change it to the correct origin
app.use(
  cors({
    origin: "*",
    credentials: true
  })
)

app.use(configuredSession);

// Install the Keycloak middleware.
app.use(keycloak.middleware({
  logout: '/logout'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// We create a wrapper to workaround async errors not being transmitted correctly.
function makeHandlerAwareOfAsyncErrors(handler) {
	return async function(req, res, next) {
		try {
			await handler(req, res);
		} catch (error) {
			next(error);
		}
	};
}

// We provide a root route just as an example
app.get('/', (req, res) => {
	res.send(`API is running...`);
});

// Example how to protect a service with keycloak
// https://github.com/keycloak/keycloak-nodejs-connect/blob/main/keycloak.d.ts#L297
// https://wjw465150.gitbooks.io/keycloak-documentation/content/securing_apps/topics/oidc/nodejs-adapter.html
app.get(`/api/${apiVersion}/protected`, keycloak.protect(), function (req, res) {
    res.send('{"test": "Private details"}')
});


// We define the standard REST APIs for each route (if they exist).
for (const [routeName, routeController] of Object.entries(routes)) {
	if (routeController.getByQuery) {
		app.get(
			`/api/${apiVersion}/${routeName}`,
			makeHandlerAwareOfAsyncErrors(routeController.getByQuery)
		);
	}	
	if (routeController.getAll) {
		app.get(
			`/api/${apiVersion}/${routeName}`,
			//keycloak.protect(),
			makeHandlerAwareOfAsyncErrors(routeController.getAll)
		);
	}
	if (routeController.getById) {
		app.get(
			`/api/${apiVersion}/${routeName}/:id`,
			makeHandlerAwareOfAsyncErrors(routeController.getById)
		);
	}
	if (routeController.create) {
		app.post(
			`/api/${apiVersion}/${routeName}`,
			makeHandlerAwareOfAsyncErrors(routeController.create)
		);
	}
	if (routeController.update) {
		app.put(
			`/api/${apiVersion}/${routeName}/:id`,
			makeHandlerAwareOfAsyncErrors(routeController.update)
		);
	}
	if (routeController.updateByApplicationId) {
		app.put(
			`/api/${apiVersion}/${routeName}/`,
			makeHandlerAwareOfAsyncErrors(routeController.updateByApplicationId)
		);
	}
	if (routeController.remove) {
		app.delete(
			`/api/${apiVersion}/${routeName}/:id`,
			makeHandlerAwareOfAsyncErrors(routeController.remove)
		);
	}
}

module.exports = app;
