import React from 'react';
import IssueForm from '../components/IssueForm'; // 1. Import our new component

function SubmitPage() {
  return (
    <div>
      {/* This is our "Page" component. 
        It provides the overall page structure and
        renders the specific components needed for this view.
      */}
      <IssueForm />
    </div>
  );
}

export default SubmitPage;