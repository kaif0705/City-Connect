import React, { useState } from 'react';
// Import our API function from the service
import { createIssue } from '../services/issueService';

function IssueForm() {
  // Use useState hooks to manage the form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Pothole'); // Default category

  // States for loading and error messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    // 1. Prevent the default form submission (which reloads the page)
    e.preventDefault();

    setLoading(true);
    setError(null);

    const issueData = {
      title,
      description,
      category,
      // We'll hardcode location for now
      latitude: 18.5204,
      longitude: 73.8567,
      // We will add imageUrl here in Slice 6
    };

    // 2. Use a try...catch block to handle API errors
    try {
      // 3. Call the createIssue function from our service
      const response = await createIssue(issueData);

      // 4. Show a success alert and clear the form
      alert(`Successfully submitted issue! ID: ${response.id}`);
      setTitle('');
      setDescription('');
      setCategory('Pothole');
    } catch (apiError) {
      // 5. Show an error alert if the API call fails
      console.error("Error submitting issue:", apiError);
      // Use the error message from our backend's GlobalExceptionHandler
      const errorMessage = apiError.message || "Failed to submit issue. Please try again.";
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Report a New Issue</h2>
      
      {/* Title Field */}
      <div>
        <label htmlFor="title">Title:</label><br />
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description">Description:</label><br />
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      {/* Category Field */}
      <div>
        <label htmlFor="category">Category:</label><br />
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Pothole">Pothole</option>
          <option value="Streetlight Out">Streetlight Out</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Vandalism">Vandalism</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <br />

      {/* Submit Button */}
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Issue'}
      </button>

      {/* Show error message if one exists */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default IssueForm;