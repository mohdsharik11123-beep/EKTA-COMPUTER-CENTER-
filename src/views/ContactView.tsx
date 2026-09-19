import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  ExternalLink,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { settings, courses, services, submitEnquiry, enquiryPreselectedCourse, setEnquiryPreselectedCourse } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Pre-fill course if passed from Course Detail
  useEffect(() => {
    if (enquiryPreselectedCourse) {
      setFormData((prev) => ({ ...prev, course: enquiryPreselectedCourse }));
    } else if (courses.length > 0 && !formData.course) {
      setFormData((prev) => ({ ...prev, course: courses[0].title }));
    }
  }, [enquiryPreselectedCourse, courses]);

  const activeCourses = courses.filter((c) => c.status === 'active');
  const activeServices = services.filter((s) => s.status === 'active');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    if (cleanPhone.length < 8) {
      setErrorMessage('Please provide a valid contact phone number.');
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!formData.message.trim()) {
      setErrorMessage('Please enter a brief message or question about your learning goals.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitEnquiry({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        course: formData.course || 'General Enquiry',
        message: formData.message
      });

      if (result.success) {
        setSubmissionSuccess(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          course: activeCourses.length > 0 ? activeCourses[0].title : 'General Enquiry',
          message: ''
        });
        setEnquiryPreselectedCourse('');
      } else {
        setErrorMessage(result.message);
      }
    } catch {
      setErrorMessage('Network or storage error occurred while sending enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasAnyContactConfig = Boolean(
    settings.phone || settings.whatsapp || settings.email || settings.address || settings.openingHours
  );

  return (
    <div id="contact-view" className="py-10 lg:py-16 space-y-12">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
            Admissions & Assistance
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Contact & Admission Enquiry
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Submit your course enquiry or questions using the form below. Center staff will contact you with batch availability and curriculum guidance.
          </p>
        </div>
      </section>

      {/* Main Grid: Form + Center Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Send an Enquiry</h2>
              <p className="text-sm text-slate-500 mb-6">
                All enquiries are securely stored in the Center Admin Portal. Private student details are never shared publicly.
              </p>

              {submissionSuccess ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-950">
                    Enquiry Submitted Successfully!
                  </h3>
                  <p className="text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                    Thank you for your interest in Ekta Computer Center. Your details have been recorded in our admissions system. Our academic advisor will contact you soon.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmissionSuccess(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl font-semibold text-xs text-emerald-900 bg-emerald-200/70 hover:bg-emerald-200 transition-colors"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMessage && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="enquiry-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="enquiry-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="enquiry-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Mobile Phone <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="enquiry-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="enquiry-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Email Address <span className="text-slate-400 font-normal text-xs">(Optional)</span>
                      </label>
                      <input
                        id="enquiry-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. name@example.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="enquiry-course" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Course / Program of Interest
                      </label>
                      <select
                        id="enquiry-course"
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      >
                        <option value="General Enquiry">General / Not Sure Yet</option>
                        <optgroup label="Available Courses">
                          {activeCourses.map((c) => (
                            <option key={c.id} value={c.title}>
                              {c.title} ({c.duration})
                            </option>
                          ))}
                        </optgroup>
                        {activeServices.length > 0 && (
                          <optgroup label="Services">
                            {activeServices.map((s) => (
                              <option key={s.id} value={s.title}>
                                {s.title}
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="enquiry-message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Questions or Educational Goals <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="enquiry-message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please mention your preferred batch timing, prior computer experience, or any questions..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-y"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-700 hover:bg-blue-800 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-blue-700/20 transition-all"
                  >
                    <span>{isSubmitting ? 'Recording Enquiry...' : 'Submit Admission Enquiry'}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Center Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Ekta Computer Center
                </h3>
                <p className="text-xs text-slate-400">
                  Official Technical Education & Skills Center
                </p>
              </div>

              {hasAnyContactConfig ? (
                <ul className="space-y-4 text-sm text-slate-300">
                  {settings.address && (
                    <li className="flex items-start gap-3.5">
                      <div className="p-2 rounded-xl bg-slate-800 text-blue-400 shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold">
                          Address
                        </span>
                        <span className="text-white mt-0.5 block leading-relaxed">
                          {settings.address}
                        </span>
                      </div>
                    </li>
                  )}

                  {settings.phone && (
                    <li className="flex items-start gap-3.5">
                      <div className="p-2 rounded-xl bg-slate-800 text-blue-400 shrink-0 mt-0.5">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold">
                          Phone
                        </span>
                        <a
                          href={`tel:${settings.phone}`}
                          className="text-white hover:text-blue-300 transition-colors mt-0.5 block font-medium"
                        >
                          {settings.phone}
                        </a>
                      </div>
                    </li>
                  )}

                  {settings.whatsapp && (
                    <li className="flex items-start gap-3.5">
                      <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0 mt-0.5">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs text-emerald-400 uppercase tracking-wider font-semibold">
                          WhatsApp
                        </span>
                        <a
                          href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-300 hover:underline transition-colors mt-0.5 inline-flex items-center gap-1.5 font-medium"
                        >
                          <span>Chat on WhatsApp ({settings.whatsapp})</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </li>
                  )}

                  {settings.email && (
                    <li className="flex items-start gap-3.5">
                      <div className="p-2 rounded-xl bg-slate-800 text-blue-400 shrink-0 mt-0.5">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold">
                          Email
                        </span>
                        <a
                          href={`mailto:${settings.email}`}
                          className="text-white hover:text-blue-300 transition-colors mt-0.5 block"
                        >
                          {settings.email}
                        </a>
                      </div>
                    </li>
                  )}

                  {settings.openingHours && (
                    <li className="flex items-start gap-3.5">
                      <div className="p-2 rounded-xl bg-slate-800 text-blue-400 shrink-0 mt-0.5">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold">
                          Working Hours
                        </span>
                        <span className="text-white mt-0.5 block leading-relaxed">
                          {settings.openingHours}
                        </span>
                      </div>
                    </li>
                  )}
                </ul>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 space-y-2">
                  <p>
                    Center phone number and address can be configured by administration in the Admin Portal.
                  </p>
                  <p>
                    Please use the enquiry form to contact our center counselors.
                  </p>
                </div>
              )}
            </div>

            {/* Google Maps Embed / Link ONLY if actual URL is entered by admin */}
            {settings.mapsUrl && (
              <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Center Location Map
                </span>
                <div className="rounded-2xl overflow-hidden aspect-16/9 bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <iframe
                    src={settings.mapsUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    title="Ekta Computer Center Location"
                  ></iframe>
                </div>
                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-700 hover:underline inline-flex items-center gap-1"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
