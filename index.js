import app from "./app.js";
import databaseConnection from "./src/config/db.js";

databaseConnection();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`))



