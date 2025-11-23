import React from 'react';

const TaskDetailPage: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark min-h-screen font-display">
      <div className="max-w-7xl mx-auto border-3 bg-secondary-background border-border shadow-shadow p-6 rounded-base  dark:border-gray-600 sm:p-8">
        <main className="flex-grow w-full">
          <div className="space-y-8">
            <section>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary">Post or Task Title</h2>
              <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">posted_at: &lt;timestamp&gt;</p>
              <p className="mt-4 text-text-main-light dark:text-text-main-dark">Here is message of post or task. This is only for placeholder.</p>
              <a className="mt-6 inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg text-md font-bold hover:bg-green-100 transition-colors shadow-[-3px_3px_0px_0px_black] hover:shadow-none hover:translate-y-[1px]" href="#">
                <span className="material-icons-outlined text-lg">attach_file</span>
                file1.pdf
              </a>
            </section>
            <hr className="border-t-2 border-primary" />
            <section className="space-y-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4">Your Submission</h3>
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-2 px-4 py-2 border-2 border-green-500 text-green-600 bg-green-100 rounded-lg text-md font-bold shadow-[-3px_3px_0px_0px_black]">
                    <span className="material-icons-outlined text-lg">check_circle_outline</span>
                    submitted.pdf
                  </span>
                </div>
              </div>
              <label htmlFor="file-upload" className="flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed border-primary rounded-xl bg-green-50 text-center cursor-pointer">
                <span className="material-icons-outlined text-3xl sm:text-4xl text-primary mb-4">cloud_upload</span>
                <div className="relative font-bold text-primary text-sm sm:text-base">
                  <span>Choose File or </span>
                  <span className="text-blue-500">Drag n Drop </span>
                  <span>File to Upload</span>
                </div>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                <p className="mt-2 text-xs text-text-secondary-light dark:text-text-secondary-dark">PDF, DOCX, PNG, JPG up to 10MB</p>
              </label>
              <div className="flex justify-end">
                <button className="px-8 py-2.5 bg-green-400 border-2 border-black shadow-[-4px_4px_0px_0px_black] text-white font-bold rounded-lg hover:translate-y-1 hover:shadow-none transition-all w-full sm:w-auto" type="submit">
                  Submit
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskDetailPage;
