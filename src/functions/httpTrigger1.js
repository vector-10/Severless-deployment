const { app } = require("@azure/functions");
const mongoose = require("mongoose");

const atlasConnectionString =
  "mongodb+srv://duzieblaise10:Duzie.1234@database.4zja5si.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(atlasConnectionString, {
  useNewUrlParser: true,
});

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  author: {
    type: String,
  },
  content: {
    type: String,
  },
});

const News = mongoose.model("News", newsSchema);

app.http("httpTrigger1", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    console.log(
      `Http function processed POST request for url "${request.url}"`
    );
    if (request.method === "GET") {
      try {
        // Retrieve all news articles excluding certain fields
        const newArticles = await News.find({});
        return {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newArticles),
        };
      } catch (error) {
        console.error("Error retrieving news articles", error);
        return {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
          body: "Internal Server Error",
        };
      }
    }

    if (request.method === "POST") {
      try {
        const { title, author, content } = await request.json();
        // context.log(title, author, content);

        if (!title || !author || !content) {
          return {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
            body: "Bad request, please provide a title, author and content",
          };
        }
        const newArticle = await News.create({
          title,
          author,
          content,
        });
        return {
          headers: {
            "content-Type": "application/json",
          },
          message: "News article created",
          body: newArticle,
        };
      } catch (error) {
        // console.log("Error processing request", error);
        return {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
          body: "Internal Server Error",
        };
      }
    }
  },
});

//mongodb+srv://duzieblaise10:Duzie.1234@database.4zja5si.mongodb.net/?retryWrites=true&w=majority
