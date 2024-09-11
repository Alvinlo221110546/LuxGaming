import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import mysql2 from "mysql2";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

const app = express();
const hostname = "127.0.0.1";
const port = 8020;

const conn = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'admin'
})
conn.connect(err => {
    if (err) {
        console.log("database is disconnected");
        console.log(err)
    }
    else
        console.log("database is connected");
});


app.use(express.urlencoded({ extended: true }));  
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    const sql = `INSERT INTO users (email, password) VALUES (?, ?)`;
    const values = [email, password];

    conn.query(sql, values, (err, results) => {
        if (err) {
            console.error("Error while saving user registration data to the database.");
            console.error(err);
            res.status(500).json({ message: "Registration failed." });
        } else {
            console.log("User registration data saved to the database.");
            const script = '<script>alert("Registrasi berhasil");</script>';
            fs.readFile('register.html', 'utf8', (err, data) => {
                if (err) {
                    console.error("Error reading registrasi.html");
                    res.status(500).send("An error occurred.");
                } else {
                    const modifiedHtml = data.replace('</body>', script + '</body>');
                    res.send(modifiedHtml);
                }
            });
        }
    });
});





app.get("/getGames", (req, res) => {
    fs.readFile('games.json', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      const gamesData = JSON.parse(data);
      res.json(gamesData);
    });
  });
  
app.get("/", (req, res) => {
    res.sendFile("home.html", { root: __dirname })
});

app.get("/home.html", (req, res) => {
    res.sendFile("home.html", { root: __dirname })
});
app.get("/register.html", (req, res) => {
    res.sendFile("register.html", { root: __dirname })
});

app.get("/contact.html", (req, res) => {
    res.sendFile("contact.html", { root: __dirname })
});

app.get("/product-review.html", (req, res) => {
    res.sendFile("product-review.html", { root: __dirname })
});

app.get("/shop.html", (req, res) => {
    res.sendFile("shop.html", { root: __dirname })
});



app.get("*.css", (req, res) => {
    const url = req.url;
    console.log(url);

    if (url.startsWith("http")) {
        res.sendFile(url);
    } else {
        const cssFileName = req.params[0]
        res.sendFile(cssFileName + ".css", { root: __dirname })
    }
})

app.get("/*.png", (req, res) => {
    const pngFileName = req.params[0]
    res.sendFile(pngFileName + ".png", { root: __dirname })
})

app.get("/*.jpg", (req, res) => {
    const pngFileName = req.params[0]
    res.sendFile(pngFileName + ".jpg", { root: __dirname })
})

app.get("/*.js", (req, res) => {
    const jsFileName = req.params[0]
    res.sendFile(jsFileName + ".js", { root: __dirname })
})

app.get("*", (req, res) => {
    res.send("404 Error Page not Found");
})

app.listen(port, () => {
    console.log(`Server running at ${hostname}:${port}`);
});




