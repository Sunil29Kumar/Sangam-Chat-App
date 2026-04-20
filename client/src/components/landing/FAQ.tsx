import  { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) => {
  return (
    <div className={`border-b border-slate-100 last:border-0 transition-all duration-300 ${isOpen ? 'bg-indigo-50/30' : 'bg-transparent'}`}>
      <button
        onClick={onClick}
        className="w-full py-6 px-4 flex items-center justify-between text-left group"
      >
        <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-indigo-600' : 'text-slate-900 group-hover:text-indigo-600'}`}>
          {question}
        </span>
        <ChevronDown 
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} 
          size={20} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="px-4 pb-6 text-slate-500 font-medium leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Is Sangam Chat really secure?",
      answer: "Yes, we use industry-standard encryption and HTTP-only cookies to ensure your authentication is safe. Your messages are delivered in real-time through secure Socket.io connections."
    },
    {
      question: "Can I use it on my mobile device?",
      answer: "Absolutely! Sangam is built with a mobile-first responsive design. It works perfectly on browsers across iOS, Android, and Desktop."
    },
    {
      question: "Do I need to pay for anything?",
      answer: "No, Sangam is currently free to use. It's a project built for the community to experience seamless real-time communication."
    },
    {
      question: "How do I add friends to chat?",
      answer: "Once you log in, you can search for users by their email or unique username and start an instant conversation."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-slate-50/50 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
             <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                <HelpCircle size={24} />
             </div>
          </div>
          <h2 className="text-4xl font-[1000] text-slate-900 tracking-tight">Common Questions</h2>
          <p className="mt-4 text-slate-500 font-medium">Everything you need to know about Sangam.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-slate-500 font-medium">
            Still have questions? <a href="mailto:support@sangam.com" className="text-indigo-600 font-bold hover:underline">Contact our team</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;