// Author: Roger Villeda
// ISU-Id: rvilleda@iastate.edu
// Date: 11/11/2024

const express = require("express");
const cors = require("cors");
const fs = require("fs"); // Import fs only once
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const mysql = require("mysql2");

// Server
const app = express();
const port = 8081;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads")); // Serve images statically

// MySQL
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "password",
  database: "secoms3190",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage: storage });

// Create "uploads" folder if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Endpoint to get all contacts
app.get("/contact", (req, res) => {
  try {
    db.query("SELECT * FROM contact", (err, result) => {
      if (err) {
        console.error({ error: "Error reading all contacts:" + err });
        return res.status(500).send({ error: "Error reading all contacts: " + err });
      }
      res.status(200).send(result);
    });
  } catch (err) {
    console.error({ error: "An unexpected error occurred: " + err });
    res.status(500).send({ error: "An unexpected error occurred: " + err });
  }
});

// Endpoint to add a new contact
app.post("/contact", upload.single("image"), (req, res) => {
  try {
    const { contact_name, phone_number, message } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
     
    // Check if contact name already exists
    const checkQuery = "SELECT * FROM contact WHERE contact_name = ?";
    db.query(checkQuery, [contact_name], (checkErr, checkResult) => {
      if (checkErr) {
        console.error("Database error during validation:", checkErr);
        return res.status(500).send({ error: "Error checking contact name: " + checkErr.message });
      }
      if (checkResult.length > 0) {
        return res.status(409).send({ error: "Contact name already exists." });
      }
        
      // Insert new contact
      const query = "INSERT INTO contact (contact_name, phone_number, message, image_url) VALUES (?, ?, ?, ?)";
      db.query(query, [contact_name, phone_number, message, imageUrl], (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send({ error: "Error adding contact: " + err });
        } else {
          res.status(201).send("Contact added successfully");
        }
      });
    });
  } catch (err) {
    console.error("Error in POST /contact:", err);
    res.status(500).send({ error: "An unexpected error occurred: " + err.message });
  }
});

// Endpoint to update a contact by ID
app.put("/contact/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { contact_name, phone_number, message } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // Check if contact exists
    const checkQuery = "SELECT * FROM contact WHERE id = ?";
    db.query(checkQuery, [id], (checkErr, checkResult) => {
      if (checkErr) {
        console.error("Error checking contact:", checkErr);
        return res.status(500).send({ error: "Error checking contact: " + checkErr.message });
      }

      if (checkResult.length === 0) {
        return res.status(404).send({ error: "Contact not found" });
      }

      // Update the contact
      const updateQuery = `
        UPDATE contact 
        SET 
          contact_name = ?, 
          phone_number = ?, 
          message = ?, 
          image_url = COALESCE(?, image_url) 
        WHERE id = ?`;
      db.query(updateQuery, [contact_name, phone_number, message, imageUrl, id], (updateErr, result) => {
        if (updateErr) {
          console.error("Error updating contact:", updateErr);
          return res.status(500).send({ error: "Error updating contact: " + updateErr.message });
        }

        res.status(200).send({ message: "Contact updated successfully" });
      });
    });
  } catch (err) {
    console.error("Error in PUT /contact/:id:", err);
    res.status(500).send({ error: "An unexpected error occurred: " + err.message });
  }
});

// Endpoint to delete a contact by ID
app.delete("/contact/:id", (req, res) => {
  const { id } = req.params;

  try {
    const query = "DELETE FROM contact WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error deleting contact:", err);
        return res.status(500).send({ error: "Error deleting contact: " + err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).send({ error: "Contact not found" });
      }

      res.status(200).send({ message: "Contact deleted successfully" });
    });
  } catch (err) {
    console.error("Error in DELETE /contact/:id:", err);
    res.status(500).send({ error: "An unexpected error occurred: " + err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
