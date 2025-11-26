import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/lib/api';
import type { PostWithFile, ApiResponse } from '@/types';
import { CheckCircleIcon } from 'lucide-react';

const TaskDetailPage: React.FC = () => {
  const { class_id, id } = useParams<{ class_id: string, id: string }>();
  const [post, setPost] = useState<PostWithFile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await api.get<ApiResponse<PostWithFile>>(`/classes/${class_id}/posts/${id}`);
        setPost(response.data.data);
      } catch (error) {
        console.error('Failed to fetch post details', error);
      }
    };

    if (class_id && id) {
      fetchPostDetails();
    }
  }, [class_id, id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Please select a file to submit.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await api.post(`/classes/${class_id}/posts/${id}/task`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Task submitted successfully!');
      // Optionally, refresh post details to show submission
    } catch (error) {
      console.error('Failed to submit task', error);
      alert('Failed to submit task.');
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark min-h-screen font-display">
      <div className="max-w-7xl mx-auto border-3 bg-secondary-background border-border shadow-shadow p-6 rounded-base  dark:border-gray-600 sm:p-8">
        <main className="flex-grow w-full">
          <div className="space-y-8">
            <section>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary">{post.message}</h2>
              <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">posted_at: {new Date(post.created_at).toLocaleString()}</p>
              {post.file && (
                <a className="mt-6 inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg text-md font-bold hover:bg-green-100 transition-colors shadow-[-3px_3px_0px_0px_black] hover:shadow-none hover:translate-y-[1px]" href={`/storage/${post.file.id}`} target="_blank" rel="noopener noreferrer">
                  <span className="material-icons-outlined text-lg">attach_file</span>
                  {post.file.upload_name}
                </a>
              )}
            </section>
            {post.type === 'task' && (
              <>
                <hr className="border-t-2 border-primary" />
                <section className="space-y-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4">Your Submission</h3>
                  {post.task ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="inline-flex items-center gap-2 px-4 py-2 border-2 border-green-500 text-green-600 bg-green-100 rounded-lg text-md font-bold shadow-[-3px_3px_0px_0px_black]">
                          <CheckCircleIcon className="w-6 h-6" />
                          Submitted
                        </span>
                      </div>
                      {post.task.file && (
                        <a className="mt-6 inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg text-md font-bold hover:bg-green-100 transition-colors shadow-[-3px_3px_0px_0px_black] hover:shadow-none hover:translate-y-[1px]" href={`/storage/${post.task.file.id}`} target="_blank" rel="noopener noreferrer">
                          <span className="material-icons-outlined text-lg">attach_file</span>
                          {post.task.file.upload_name}
                        </a>
                      )}
                      <p className="text-text-secondary-light dark:text-text-secondary-dark">
                        Submitted at: {new Date(post.task.created_at).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <>
                      <label htmlFor="file-upload" className="flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed border-primary rounded-xl bg-green-50 text-center cursor-pointer">
                        <span className="material-icons-outlined text-3xl sm:text-4xl text-primary mb-4">cloud_upload</span>
                        <div className="relative font-bold text-primary text-sm sm:text-base">
                          <span>Choose File or </span>
                          <span className="text-blue-500">Drag n Drop </span>
                          <span>File to Upload</span>
                        </div>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                        <p className="mt-2 text-xs text-text-secondary-light dark:text-text-secondary-dark">PDF, DOCX, PNG, JPG up to 10MB</p>
                      </label>
                      <div className="flex justify-end">
                        <button onClick={handleSubmit} className="px-8 py-2.5 bg-green-400 border-2 border-black shadow-[-4px_4px_0px_0px_black] text-white font-bold rounded-lg hover:translate-y-1 hover:shadow-none transition-all w-full sm:w-auto" type="submit">
                          Submit
                        </button>
                      </div>
                    </>
                  )}
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskDetailPage;
