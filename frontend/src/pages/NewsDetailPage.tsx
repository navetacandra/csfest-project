import React from 'react';

const NewsDetailPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 ">
      <div className="max-w-7xl mx-auto border-2 border-gray-400 dark:border-gray-600 rounded-2xl p-6 sm:p-8">
        <main className="mt-8">
          <article>
            <header className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-amber-500 mb-2">Example of Long Headline News Title to Show on News Page</h2>
              <p className="text-slate-500 dark:text-slate-400">posted at: &lt;timestamp&gt;</p>
            </header>
            <div className="mb-12 flex justify-center">
              <div className="w-full max-w-3xl aspect-video bg-amber-900/50 dark:bg-amber-900/80 border-2 border-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-slate-300 dark:text-slate-400">News Thumbnail</span>
              </div>
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
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
