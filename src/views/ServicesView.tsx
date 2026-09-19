import React from 'react';
import { useApp } from '../context/AppContext';
import { Monitor, Calculator, Code, Keyboard, Laptop, BookMarked, ArrowRight } from 'lucide-react';

export const ServicesView: React.FC = () => {
  const { services, setPage, setEnquiryPreselectedCourse } = useApp();

  const activeServices = services.filter((s) => s.status === 'active');

  const getServiceIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'calculator':
        return <Calculator className="w-6 h-6 text-blue-700" />;
      case 'code':
        return <Code className="w-6 h-6 text-blue-700" />;
      case 'keyboard':
        return <Keyboard className="w-6 h-6 text-blue-700" />;
      case 'laptop':
        return <Laptop className="w-6 h-6 text-blue-700" />;
      default:
        return <Monitor className="w-6 h-6 text-blue-700" />;
    }
  };

  const handleEnquireService = (title: string) => {
    setEnquiryPreselectedCourse(title);
    setPage('contact');
  };

  return (
    <div id="services-view" className="py-10 lg:py-16 space-y-12">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
            Capabilities & Programs
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Center Educational Services
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            In addition to full curriculum programs, Ekta Computer Center provides targeted computer training, specialized lab practice, and skill assessment services.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeServices.map((service) => (
              <div
                key={service.id}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center font-bold">
                    {getServiceIcon(service.iconName)}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleEnquireService(service.title)}
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900 group"
                  >
                    <span>Enquire for details</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
            <BookMarked className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Services Configured</h3>
            <p className="text-xs text-slate-500">
              Services can be configured and managed by center staff from the Admin Portal.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
