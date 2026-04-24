import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { BLOGS } from '../data';

export const BlogListPage = () => {
  useEffect(() => {
    document.title = "Classroom 6x - Survival & Gaming Guides";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="space-y-12 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-5xl font-display uppercase tracking-tight text-gradient">Classroom 6x Blog</h1>
        <p className="text-slate-500 text-lg font-medium">Inside the world of unblocked gaming, strategy, and student survival guides.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOGS.map((blog, index) => (
          <Link key={blog.id} to={`/blog/${blog.id}`}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-3xl overflow-hidden hover:border-brand-purple/50 transition-all group flex flex-col h-full"
            >
              <div className="aspect-video bg-brand-purple/5 flex items-center justify-center group-hover:bg-brand-purple/10 transition-colors">
                <ChevronRight className="text-brand-purple/20 group-hover:text-brand-purple transition-colors" size={48} />
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-brand-purple transition-colors line-clamp-2">{blog.title}</h2>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{blog.excerpt}</p>
                <div className="pt-4 mt-auto flex items-center text-brand-purple font-bold text-[10px] uppercase tracking-widest gap-2">
                   Read Guide <ChevronRight size={14} />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const blog = BLOGS.find(b => b.id === id);

  useEffect(() => {
    if (blog) {
      document.title = `${blog.title} | Classroom 6x Guides`;
      window.scrollTo(0, 0);
    } else {
      navigate('/blogs');
    }
  }, [blog, navigate]);

  if (!blog) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link to="/blogs" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-purple font-bold uppercase tracking-widest text-[10px] transition-colors">
        <ArrowLeft size={16} /> Back to Blog
      </Link>

      <article className="glass rounded-[3rem] p-8 md:p-16 space-y-12">
        <header className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-display uppercase tracking-tight text-gradient leading-tight">
            {blog.title}
          </h1>
          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-400">
             <span>Classroom6x Editorial</span>
             <span>•</span>
             <span>Update: 2026</span>
          </div>
        </header>

        <div 
          className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tight prose-a:text-brand-purple prose-li:marker:text-brand-purple text-slate-600 font-medium"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <div className="pt-12 border-t border-black/5">
           <Link 
             to="/"
             className="px-10 py-4 bg-brand-purple text-white font-bold rounded-2xl shadow-xl shadow-brand-purple/20 hover:scale-105 transition-all uppercase tracking-widest text-xs inline-block"
           >
             Explore Game Directory
           </Link>
        </div>
      </article>
    </div>
  );
};
