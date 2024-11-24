import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const DeleteContact = () => {
  const [contactId, setContactId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    deleteOneContact();
    setContactId("");
  };

  const deleteOneContact = async () => {
    try {
      const response = await fetch(`http://localhost:8081/contact/${contactId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + errorData.error);
      } else {
        const successMessage = await response.json();
        alert(successMessage.message);
      }
    } catch (err) {
      alert("An error occurred: " + err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Delete Contact</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Contact ID</label>
          <input
            type="text"
            className="form-control"
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-danger">
          Delete Contact
        </button>
      </form>
    </div>
  );
};

export default DeleteContact;
