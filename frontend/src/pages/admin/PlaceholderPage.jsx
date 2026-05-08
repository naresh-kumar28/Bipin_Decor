import React from 'react';

const PlaceholderPage = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
        <iconify-icon icon="lucide:construction" class="text-3xl text-muted-foreground"></iconify-icon>
      </div>
      <h2 className="text-2xl font-heading font-bold text-foreground">{title} Page Under Construction</h2>
      <p className="text-muted-foreground mt-2 max-w-md">We're working hard to bring you this management module. Please check back soon!</p>
      <button 
        onClick={() => window.history.back()}
        className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors"
      >
        Go Back
      </button>
    </div>
  );
};

export default PlaceholderPage;
