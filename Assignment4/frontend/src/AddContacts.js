import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

const AddContact = () => {
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addOneContact();
    setContactName('');
    setPhoneNumber('');
    setMessage('');
    setImage(null);
    setPreview(null);
  };

  const addOneContact = async () => {
    try {
      const formData = new FormData();
      formData.append("contact_name", contactName);
      formData.append("phone_number", phoneNumber);
      formData.append("message", message);
      formData.append("image", image);

      const response = await fetch("http://localhost:8081/contact", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + errorData.error);
      } else {
        const successMessage = await response.text();
        alert(successMessage);
      }
    } catch (err) {
      alert("An error occurred: " + err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Add New Contact</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Contact Name</label>
          <input type="text" className="form-control" value={contactName} onChange={(e) => setContactName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input type="text" className="form-control" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Message</label>
          <textarea className="form-control" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Contact Image</label>
          <input type="file" className="form-control" onChange={handleImageChange} />
          {preview && (<img src={preview} alt="Preview" className="mt-3" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />)}
        </div>
        <button type="submit" className="btn btn-primary">Add Contact</button>
      </form>
    </div>
  );
};

export default AddContact;
