import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { X, Loader2, ShieldCheck, Gamepad2 } from 'lucide-react';
import { GAMES } from '../data';

interface StaticPageProps {
  pageName: "About Us" | "Contact Us" | "Privacy Policy" | "Terms of Service";
}

const StaticPage: React.FC<StaticPageProps> = ({ pageName }) => {
  useEffect(() => {
    document.title = `${pageName} | Classroom 6x`;
    window.scrollTo(0, 0);
  }, [pageName]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto glass rounded-3xl p-8 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-4xl md:text-5xl font-display uppercase tracking-tight text-gradient">
          {pageName}
        </h1>
        <Link 
          to="/"
          className="p-3 glass rounded-2xl hover:bg-black/5 transition-all"
        >
          <X size={24} />
        </Link>
      </div>

      <div className="prose prose-slate max-w-none text-slate-600 space-y-8 font-medium">
        {pageName === "Contact Us" && (
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-display uppercase tracking-tight text-gradient">Get in Touch with Classroom 6x</h2>
              <p className="text-lg leading-relaxed">
                We value our community of students, teachers, and gamers. Whether you have found a technical issue with a specific unblocked game, have a suggestion for a new title, or want to discuss business opportunities, our dedicated team is here to help. At <strong>Classroom 6x</strong>, your feedback is the engine that drives our platform's growth and ensures we remain the best destination for unblocked gaming at school.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-3xl space-y-4 border-l-4 border-brand-purple">
                <div className="flex items-center gap-3 text-brand-purple">
                  <Loader2 className="animate-spin" size={20} />
                  <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm">Priority Email Support</h3>
                </div>
                <p className="text-slate-500 text-sm">For game-related technical support, report a broken mirror, or general inquiries.</p>
                <p className="text-brand-purple font-bold text-xl select-all">support@classroom6x.com</p>
              </div>
              <div className="glass p-8 rounded-3xl space-y-4 border-l-4 border-brand-purple">
                <div className="flex items-center gap-3 text-brand-purple">
                  <ShieldCheck size={20} />
                  <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm">Business & Advertising</h3>
                </div>
                <p className="text-slate-500 text-sm">For partnerships, server sponsorships, and detailed advertising inquiries.</p>
                <p className="text-brand-purple font-bold text-xl select-all">business@classroom6x.com</p>
              </div>
            </div>

            <div className="glass p-8 lg:p-12 rounded-[2rem] space-y-8 bg-brand-purple/5">
              <div className="space-y-2">
                 <h3 className="text-2xl font-bold text-slate-900">Direct Support Message</h3>
                 <p className="text-slate-500">Expect a response within 24-48 hours during standard business days.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Your Name</label>
                  <input type="text" placeholder="e.g., John Doe" className="w-full bg-white border border-black/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-purple/50 transition-all font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Your Email Address</label>
                  <input type="email" placeholder="e.g., name@school.edu" className="w-full bg-white border border-black/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-purple/50 transition-all font-medium" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Message Details</label>
                <textarea placeholder="Describe how we can help you today..." rows={6} className="w-full bg-white border border-black/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-purple/50 resize-none transition-all font-medium"></textarea>
              </div>
              <button className="w-full py-5 bg-brand-purple text-white font-bold rounded-2xl shadow-xl shadow-brand-purple/20 hover:scale-[1.02] transition-all uppercase tracking-widest text-sm">
                Submit Official Inquiry
              </button>
            </div>
          </div>
        )}

        {pageName === "About Us" && (
          <div className="space-y-10">
             <header className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tight text-gradient leading-tight">About Classroom 6x: The Mission Behind the Games</h2>
              <p className="text-lg leading-relaxed">
                Founded with a simple vision—to provide students with a safe, reliable, and high-performance sanctuary for digital entertainment—<strong>Classroom 6x</strong> has grown into the world's most trusted hub for unblocked gaming. We understand that the modern classroom can be intense, and a well-timed five-minute break can be the difference between burnout and a productive study session.
              </p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900">Our History</h3>
                <p className="text-slate-600 leading-relaxed">
                  The "Classroom 6x" project began in the early 2020s as a small collection of optimized HTML5 mirrors. While other sites were cluttered with intrusive ads and slow-loading Flash files, we focused on "The 6x Standard": lightweight assets, zero installations, and immediate accessibility. 
                </p>
                <p className="text-slate-600 leading-relaxed">
                  By 2026, we have expanded our infrastructure to support millions of monthly active users across the globe. Our engineering team continues to innovate with advanced CDN routing and edge-level mirroring to bypass restrictive school firewalls securely and responsibly.
                </p>
              </div>
              <img 
                src="https://picsum.photos/seed/about1/600/400" 
                className="rounded-3xl shadow-2xl" 
                alt="Classroom 6x team working" 
                referrerPolicy="no-referrer"
              />
            </section>

            <section className="space-y-6 glass p-8 rounded-[2rem] border-l-8 border-brand-purple">
              <h3 className="text-2xl font-bold text-slate-900">The 6x Philosophy</h3>
              <p className="text-slate-600 leading-relaxed">
                We believe that "Unblocked Gaming" is not about distraction—it's about <strong>accessibility</strong>. Access to fun shouldn't be limited by your Choice of hardware or your location.
              </p>
              <ul className="list-disc pl-6 space-y-3 text-slate-600">
                <li><strong>Security First:</strong> Every game mirror is vetted for safety.</li>
                <li><strong>Performance Always:</strong> optimized for minimal loading times.</li>
                <li><strong>Community Driven:</strong> library shaped by student feedback.</li>
              </ul>
            </section>
          </div>
        )}

        {pageName === "Privacy Policy" && (
          <div className="space-y-10">
            <header className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-display uppercase tracking-tight text-gradient leading-tight">Privacy Policy</h1>
              <p className="text-lg text-slate-500 bg-black/5 p-4 rounded-xl border-l-4 border-brand-purple italic">Last Updated: April 19, 2026</p>
              <p className="text-lg leading-relaxed">
                Your privacy is a cornerstone of the <strong>Classroom 6x</strong> mission. We recognize that students and educators require a safe, anonymous, and secure environment to enjoy unblocked gaming content.
              </p>
            </header>

            <section className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 border-b border-black/5 pb-2">1. Data Collection Philosophy</h3>
              <p>
                At <strong>Classroom 6x unblocked</strong>, we operate under a "Privacy by Design" model. We <strong>do not</strong> require users to create accounts, provide emails, or link social media profiles to play our games. Every session is anonymous.
              </p>
            </section>

            <section className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 border-b border-black/5 pb-2">2. Children's Privacy</h3>
              <p>
                Classroom 6x is designed to be a safe gateway for all students. We do not knowingly collect or solicit any personal information from children under the age of 13.
              </p>
            </section>
          </div>
        )}

        {pageName === "Terms of Service" && (
          <div className="space-y-10">
            <header className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-display uppercase tracking-tight text-gradient leading-tight">Terms of Service</h1>
              <p className="text-lg text-slate-500 bg-black/5 p-4 rounded-xl border-l-4 border-brand-purple italic">Binding Agreement: April 2026</p>
              <p className="text-lg leading-relaxed">
                By accessing and using <strong>Classroom 6x</strong>, you confirm your acceptance of these Terms of Service.
              </p>
            </header>

            <section className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 border-b border-black/5 pb-2">1. Permitted Use</h3>
              <p>
                Classroom 6x is provided for personal, non-commercial entertainment purposes. You agree to use the site in compliance with all local laws and your respective school or workplace internet usage policies.
              </p>
            </section>
          </div>
        )}
      </div>

      <div className="pt-12 border-t border-black/5 flex justify-center">
        <Link 
           to="/"
           className="px-10 py-4 bg-brand-purple text-white font-bold rounded-2xl shadow-xl shadow-brand-purple/20 hover:scale-105 transition-all uppercase tracking-widest text-xs"
        >
          Back to Gaming Hub
        </Link>
      </div>
    </motion.div>
  );
};

export default StaticPage;
