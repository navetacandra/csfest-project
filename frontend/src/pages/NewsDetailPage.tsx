import React from 'react';

const NewsDetailPage: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark min-h-screen font-display">
      <div className="max-w-7xl mx-auto border-3 bg-secondary-background border-border shadow-shadow p-6 rounded-base  dark:border-gray-600 sm:p-8">
        <main className="mt-8">
          <article>
            <header className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2">Example of Long Headline News Title to Show on News Page</h2>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">posted at: &lt;timestamp&gt;</p>
            </header>
            <div className="mb-12 flex justify-center">
              <div className="w-full max-w-3xl aspect-video bg-green-200 border-2 border-primary rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold">News Thumbnail</span>
              </div>
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none text-text-main-light dark:text-text-main-dark">
              <p>Here is news content.</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim.</p>
              <p>Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam. Proin sed libero.</p>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
};

export default NewsDetailPage;
