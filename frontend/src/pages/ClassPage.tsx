import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, FileText, HelpCircle } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import type { ClassDetails, ApiResponse } from '@/types';

const ClassPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostMessage, setNewPostMessage] = useState("");
  const [newPostType, setNewPostType] = useState<"post" | "task">("post");
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');

  const fetchClassDetails = async () => {
    try {
      const response = await api.get<ApiResponse<ClassDetails>>(`/classes/${id}`);
      setClassDetails(response.data.data);
    } catch (error) {
      console.error('Failed to fetch class details', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchClassDetails();
    }
  }, [id]);

  const handleCreatePost = async () => {
    if (!id) return;
    try {
      await api.post(`/classes/${id}/posts`, {
        message: newPostMessage,
        type: newPostType,
      });
      setNewPostMessage("");
      setNewPostType("post");
      setIsCreatingPost(false);
      fetchClassDetails(); 
    } catch (error) {
      console.error('Failed to create post', error);
    }
  };

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <ClipboardList className="w-8 h-8 sm:w-10 sm:h-10" />;
      case 'post':
        return <FileText className="w-8 h-8 sm:w-10 sm:h-10" />;
      default:
        return <HelpCircle className="w-8 h-8 sm:w-10 sm:h-10" />;
    }
  };
  
  if (!classDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark min-h-screen font-display">
      <div className="max-w-7xl mx-auto border-3 bg-secondary-background border-border shadow-shadow p-6 rounded-base  dark:border-gray-600 sm:p-8">
        <main>
          <div className="flex flex-col sm:flex-row justify-between  sm:items-center mb-8 gap-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">{classDetails.name}</h2>
            <div className='flex flex-col sm:flex-row gap-4'>
              {userRole === 'dosen' && (
                <Link to={`/class/${classDetails.id}/presence`}>
                  <Button className="bg-green-400 border-2 border-black shadow-[-4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none w-full sm:w-auto">
                    Presence
                  </Button>
                </Link>
              )}
              <Button 
                onClick={() => setIsCreatingPost(!isCreatingPost)}
                className="bg-green-400 border-2 border-black shadow-[-4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none w-full sm:w-auto"
              >
                Create New Post
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            {isCreatingPost && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Create New Post</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input 
                      placeholder="Post message"
                      value={newPostMessage}
                      onChange={(e) => setNewPostMessage(e.target.value)}
                      className="sm:col-span-2"
                    />
                    <Select onValueChange={(value: "post" | "task") => setNewPostType(value)} value={newPostType}>
                      <SelectTrigger className="sm:col-span-2">
                        <SelectValue placeholder="Select post type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="post">Post</SelectItem>
                        <SelectItem value="task">Task</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleCreatePost}
                      className="sm:col-span-2 bg-green-400 border-2 border-black shadow-[-4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none"
                    >
                      Submit Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {classDetails.posts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate(`/class/${classDetails.id}/task/${post.id}`)}
                className="flex items-center gap-4 sm:gap-5 p-4 sm:p-6 border-2 border-primary rounded-lg bg-[#E0FFE8] cursor-pointer transition-all duration-200 hover:-translate-x-1 hover:shadow-none shadow-shadow"
              >
                <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-green-200 text-primary rounded-lg flex items-center justify-center border-2 border-primary">
                  {getPostIcon(post.type)}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-primary">{post.message}</h3>
                  <p className="text-sm sm:text-base text-text-secondary-light dark:text-text-secondary-dark mt-1">Posted on {new Date(post.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClassPage;
