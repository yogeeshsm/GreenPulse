import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Theme = 'light' | 'dark' | 'system';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9">
        <Sun className="w-4 h-4" />
      </Button>
    );
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4 text-yellow-400" />;
      case 'dark':
        return <Moon className="w-4 h-4 text-purple-400" />;
      default:
        return <Monitor className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="w-9 h-9 hover:bg-white/5"
        >
          {getIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-panel border-slate-700">
        <DropdownMenuItem 
          onClick={() => handleThemeChange('light')}
          className={`flex items-center gap-2 ${theme === 'light' ? 'text-yellow-400' : 'text-slate-300'}`}
        >
          <Sun className="w-4 h-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange('dark')}
          className={`flex items-center gap-2 ${theme === 'dark' ? 'text-purple-400' : 'text-slate-300'}`}
        >
          <Moon className="w-4 h-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange('system')}
          className={`flex items-center gap-2 ${theme === 'system' ? 'text-blue-400' : 'text-slate-300'}`}
        >
          <Monitor className="w-4 h-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
