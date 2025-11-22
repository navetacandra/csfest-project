import React from 'react';

const TaskDetailPage: React.FC = () => {
  return (
    <main className="flex-grow w-full mx-auto bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6 sm:p-8 md:p-12">
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl sm:text-4xl font-bold text-sky-600 dark:text-sky-400">Post or Task Title</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">posted_at: &lt;timestamp&gt;</p>
          <p className="mt-4 text-gray-700 dark:text-gray-300">Here is message of post or task. This is only for placeholder.</p>
          <a className="mt-6 inline-flex items-center gap-2 px-4 py-2 border border-sky-500 dark:border-sky-400 text-sky-600 dark:text-sky-400 rounded-lg text-sm font-medium hover:bg-sky-50 dark:hover:bg-sky-900/50 transition-colors" href="#">
            <span className="material-icons-outlined text-lg">attach_file</span>
            file1.pdf
          </a>
        </section>
        <hr className="border-t border-primary/50" />
        <section className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Your Submission</h3>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 border border-green-500 dark:border-green-400 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/40 rounded-lg text-sm font-medium">
                <span className="material-icons-outlined text-lg">check_circle_outline</span>
                submitted.pdf
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed border-primary/60 rounded-xl bg-background-light dark:bg-gray-800/60 text-center">
            <span className="material-icons-outlined text-4xl text-primary mb-4">cloud_upload</span>
            <label className="relative cursor-pointer font-medium text-gray-600 dark:text-gray-300" htmlFor="file-upload">
              <span>Choose File or</span>
              <span className="text-primary">Drag n Drop</span>
              <span>File to Upload</span>
              <input className="sr-only" id="file-upload" name="file-upload" type="file" />
            </label>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">PDF, DOCX, PNG, JPG up to 10MB</p>
          </div>
          <div className="flex justify-end">
            <button className="px-8 py-2.5 bg-primary/10 dark:bg-primary/20 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/20 dark:hover:bg-primary/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background-light dark:focus:ring-offset-background-dark transition-all" type="submit">
              Submit
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default TaskDetailPage;
