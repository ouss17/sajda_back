const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sajda API Documentation",
      version: "1.0.0",
      description: "Documentation générée automatiquement avec swagger-jsdoc",
    },
     components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "jwt", // le nom de ton cookie JWT
        },
      },
    },
  },
  apis: ["./routes/*.js", "./controllers/*.js"], // Mets ici le chemin vers tes fichiers de routes/contrôleurs
};

const uiOptions = {
  swaggerOptions: {
    requestInterceptor: (req) => {
      // Ici, tu dois récupérer le token CSRF (par exemple depuis le localStorage ou une variable JS)
      req.headers['X-CSRF-Token'] = '8RKx6BoZ-IrnAHbXUWrfTv_wnCpuoiL5_tMs';
      return req;
    }
  }
};

const swaggerSpec = swaggerJsdoc(options);
