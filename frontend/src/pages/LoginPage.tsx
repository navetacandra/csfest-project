import LoginForm from '@/components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 antialiased">
      <div className="flex flex-col min-h-screen">
        <header className="py-4 px-6 sm:px-10">
          <div className="container mx-auto flex justify-between items-center">
            <a className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white" href="#">KU-LMSin</a>
            <nav>
              <a className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors" href="#">Login</a>
            </nav>
          </div>
        </header>
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </main>
      </div>
    </div>
  );
};

export default LoginPage;
