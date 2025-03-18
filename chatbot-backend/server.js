const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

app.post("/chat", async (req, res) => {
    const { message } = req.body;

    try {
        const fetch = (await import("node-fetch")).default;
        const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1", {


            method: "POST",
            headers: {
                "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: message })
        });

        const data = await response.json();
        console.log("API Response:", data);  // 👀 Log full response
        if (data && Array.isArray(data) && data.length > 0 && data[0].generated_text) {
            res.json({ response: data[0].generated_text });  // Extract correct response
        } else if (data.error) {
            console.error("Model Error:", data.error);
            res.json({ response: "Error from AI model: " + data.error });
        } else {
            res.json({ response: "The AI model did not return a response." });
        }
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ response: "Error generating response" });
    }
});


app.listen(5000, () => {
    console.log("Server running on port 5000");
});
