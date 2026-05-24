import app from "./app.js";
import "dotenv/config";

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
    if (error) throw error;
    console.log(`Listening on port ${PORT}`);
});
