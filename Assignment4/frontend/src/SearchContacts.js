import React, { useState, useEffect } from 'react';

const SearchContacts = ({ contacts, setContacts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [triggerSearch, setTriggerSearch] = useState(false);  // This state is used for the button click

  // Automatically fetch search results when searchTerm changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8081/contact/name?contact_name=${searchTerm}`);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const results = await response.json();
        setSearchResults(results);
      } catch (error) {
        console.error('Error during search:', error);
      }
    };

    if (triggerSearch) {
      fetchSearchResults();
      setTriggerSearch(false);  // Reset triggerSearch after the search is made
    }

  }, [searchTerm, triggerSearch]);

  const handleSearchButtonClick = () => {
    setTriggerSearch(true);  // Set this to true to trigger the search manually on button click
  };

  return (
    <div>
      <h2>Search Contacts</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter contact name"
        className="form-control mb-2"
      />
      <button onClick={handleSearchButtonClick} className="btn btn-primary">
        Search
      </button>

      <ul className="list-group mt-3">
        {searchResults.map((contact) => (
          <li key={contact.id} className="list-group-item">
            <strong>{contact.contact_name}</strong><br />
            Phone: {contact.phone_number}<br />
            Message: {contact.message}<br />
            Message Sent At: {new Date(contact.message_timestamp).toLocaleString()}<br /> {/* Format timestamp */}
            {contact.image_url && (
              <img
                src={`http://localhost:8081${contact.image_url}`}
                alt={contact.contact_name}
                style={{ maxWidth: '100px', maxHeight: '100px' }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchContacts;
