import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Contacts from "./Contacts";
import Sidebar from "./Sidebar";
import AddContact from "./AddContacts.js";
import DeleteContact from "./DeleteContact.js";
import UpdateContact from "./UpdateContact.js";
import  SearchContacts from "./SearchContacts.js";

function App() {
    const [contacts, setContacts] = useState([]);

    return (
        <Router>
            <div className="d-flex">
                <Sidebar />
                <div className="flex-grow-1 p-3">
                    <h1 className="text-center">Phone Contacts App</h1>
                    <Routes>
                        <Route path="/" element={<div>Welcome to the Contacts App!</div>} />
                        <Route path="/contacts" element={<Contacts contacts={contacts} setContacts={setContacts} />} />
                        <Route path="/add-contact" element={<AddContact contacts={contacts} setContacts={setContacts} />} /> {/* Fix the component usage */}
                        <Route path="/delete-contact" element={<DeleteContact contacts={contacts} setContacts={setContacts} />} /> {/* Fix the component usage */}
                        <Route path="/update-contact" element={<UpdateContact contacts={contacts} setContacts={setContacts} />} /> {/* Fix the component usage */}
                        <Route path="/search-contacts" element={<SearchContacts contacts={contacts} setContacts={setContacts} />} /> {/* Add the search contacts route */}
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
