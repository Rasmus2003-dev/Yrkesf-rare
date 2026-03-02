import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building2, Clock, ExternalLink, ChevronLeft, ChevronRight, Briefcase, Loader2, Filter, X, Calendar, ArrowRight, Bell, BellRing, ClipboardCheck, Heart, Bookmark, Trash2, Share2, Check, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface JobAd {
  id: string;
  headline: string;
  employer: {
    name: string;
    workplace: string;
  };
  workplace_address: {
    municipality: string;
    region: string;
    street_address: string;
  };
  publication_date: string;
  description: {
    text: string;
    text_formatted: string;
  };
  application_deadline: string;
  webpage_url: string;
  application_details?: {
    url?: string;
    email?: string;
    reference?: string;
    information?: string;
  };
  logo_url?: string;
  occupation: {
    label: string;
  };
  employment_type: {
    label: string;
  };
  salary_type: {
    label: string;
  };
  duration: {
    label: string;
  };
  must_have?: {
    skills?: { label: string }[];
    languages?: { label: string }[];
    work_experiences?: { label: string }[];
  };
  nice_to_have?: {
    skills?: { label: string }[];
    languages?: { label: string }[];
    work_experiences?: { label: string }[];
  };
}

interface SearchResult {
  total: {
    value: number;
  };
  hits: JobAd[];
}

interface Notification {
  id: number;
  job_id: string;
  headline: string;
  employer: string;
  timestamp: string;
  read: number;
}

const getLicenses = (job: JobAd) => {
  const allSkills = [
    ...(job.must_have?.skills || []),
    ...(job.nice_to_have?.skills || [])
  ];
  
  const licenses = new Set<string>();
  
  allSkills.forEach(skill => {
    const label = skill.label.toLowerCase();
    if (label.includes('ce-körkort')) licenses.add('CE');
    else if (label.includes('c-körkort')) licenses.add('C');
    if (label.includes('d-körkort')) licenses.add('D');
    if (label.includes('ykb')) licenses.add('YKB');
    if (label.includes('adr')) licenses.add('ADR');
    if (label.includes('truck')) licenses.add('Truck');
  });
  
  return Array.from(licenses);
};

const JobLogo = ({ job, className = "" }: { job: JobAd; className?: string }) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setError(false);
    setLoaded(false);
  }, [job.id, job.logo_url]);
  
  const logoUrl = job.logo_url || `/api/jobs/${job.id}/logo`;

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-100 dark:bg-slate-700`}>
        <Building2 className="text-slate-400" size={className?.includes('h-16') ? 32 : 24} />
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden bg-white dark:bg-slate-800`}>
      <img
        src={logoUrl}
        alt={`${job.employer.name} logo`}
        className={`h-full w-full object-contain ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth <= 1 && img.naturalHeight <= 1) {
            setError(true);
          } else {
            setLoaded(true);
          }
        }}
        onError={() => setError(true)}
      />
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-800 animate-pulse">
          <Building2 className="text-slate-200" size={className?.includes('h-16') ? 32 : 24} />
        </div>
      )}
    </div>
  );
};

export default function JobSearch() {
  const [query, setQuery] = useState('lastbilsförare');
  const [city, setCity] = useState('');
  const [country] = useState<'se'>('se'); // Fixed to Sweden

  const [publishedToday, setPublishedToday] = useState(false);
  const [jobs, setJobs] = useState<JobAd[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobAd | null>(null);
  const [totalHits, setTotalHits] = useState(0);
  const [offset, setOffset] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [monitoring, setMonitoring] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'saved'>('search');
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const LIMIT = 10;

  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    licenses: string[];
    employment: string[];
    schedule: string[];
  }>({
    licenses: [],
    employment: [],
    schedule: []
  });

  const FILTER_OPTIONS = {
    licenses: ['C-körkort', 'CE-körkort', 'YKB', 'ADR', 'Truckkort', 'Spetsbyte'],
    employment: ['Heltid', 'Deltid', 'Sommarjobb', 'Behovsanställning'],
    schedule: ['Dagtid', 'Natt', 'Skift', 'Helg', 'Liggute']
  };

  const toggleFilter = (category: keyof typeof activeFilters, value: string) => {
    setActiveFilters(prev => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const clearFilters = () => {
    setActiveFilters({ licenses: [], employment: [], schedule: [] });
  };

  useEffect(() => {
    searchJobs(true);
    fetchNotifications();
    fetchSavedJobs();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 30000);
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const res = await fetch('/api/saved-jobs');
      if (res.ok) {
        const data = await res.json();
        setSavedJobs(data);
      }
    } catch (error) {
      console.error('Failed to fetch saved jobs:', error);
    }
  };

  const toggleSaveJob = async (job: JobAd) => {
    const isSaved = savedJobs.some(sj => sj.id === job.id);
    try {
      if (isSaved) {
        await fetch(`/api/saved-jobs/${job.id}`, { method: 'DELETE' });
        setSavedJobs(prev => prev.filter(sj => sj.id !== job.id));
        showToast('Jobbet har tagits bort från sparade', 'info');
      } else {
        await fetch('/api/saved-jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: job.id,
            headline: job.headline,
            employer: job.employer?.name,
            municipality: job.workplace_address?.municipality
          }),
        });
        setSavedJobs(prev => [{
          id: job.id,
          headline: job.headline,
          employer: job.employer?.name,
          municipality: job.workplace_address?.municipality
        }, ...prev]);
        showToast('Jobbet har sparats!');
      }
    } catch (error) {
      console.error('Failed to toggle save job:', error);
    }
  };

  const markNotificationsRead = async () => {
    try {
      await fetch('/api/notifications/mark-read', { method: 'POST' });
      setNotifications(prev => prev.map(n => ({ ...n, read: 1 })));
    } catch (error) {
      console.error('Failed to mark notifications read:', error);
    }
  };

  const createMonitor = async () => {
    if (!query) return;
    setMonitoring(true);
    try {
      const res = await fetch('/api/monitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, city }),
      });
      if (res.ok) {
        showToast(`Bevakar nu jobb för "${query}" ${city ? `i ${city}` : ''}`);
      }
    } catch (error) {
      console.error('Failed to create monitor:', error);
    } finally {
      setMonitoring(false);
    }
  };

  const searchJobs = async (reset = false, publishedTodayOverride?: boolean) => {
    const currentOffset = reset ? 0 : offset;
    const isPublishedToday = publishedTodayOverride !== undefined ? publishedTodayOverride : publishedToday;
    
    if (reset) {
      setLoading(true);
      setJobs([]);
      setOffset(0);
    } else {
      setLoadingMore(true);
    }

    try {
      let searchQuery = query;
      if (city) {
        searchQuery += ` ${city}`;
      }

      // Add active filters to query
      const filterTerms = [
        ...activeFilters.licenses,
        ...activeFilters.employment,
        ...activeFilters.schedule
      ];
      if (filterTerms.length > 0) {
        searchQuery += ` ${filterTerms.join(' ')}`;
      }

      let url = `/api/jobs?q=${encodeURIComponent(searchQuery)}&offset=${currentOffset}&limit=${LIMIT}&country=${country}`;

      if (isPublishedToday) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}T00:00:00`;
        url += `&published-after=${dateString}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data: SearchResult = await res.json();
        if (reset) {
          setJobs(data.hits);
        } else {
          setJobs(prev => [...prev, ...data.hits]);
        }
        setTotalHits(data.total.value);
        if (!reset) {
          setOffset(prev => prev + LIMIT);
        } else {
          setOffset(LIMIT);
        }
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchJobs(true);
  };

  const fetchJobDetails = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs/${id}`);
      if (res.ok) {
        const data: JobAd = await res.json();
        setSelectedJob(data);
      }
    } catch (error) {
      console.error('Failed to fetch job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just nu';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min sedan`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} tim sedan`;
    if (diffInSeconds < 172800) return 'Igår';
    return `${Math.floor(diffInSeconds / 86400)} dagar sedan`;
  };

  const isNew = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    return (now.getTime() - date.getTime()) < 86400000;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (selectedJob) {
    const hasRequirements = (selectedJob.must_have?.skills?.length || 0) > 0 || 
                          (selectedJob.must_have?.languages?.length || 0) > 0 || 
                          (selectedJob.must_have?.work_experiences?.length || 0) > 0;
    const isSaved = savedJobs.some(sj => sj.id === selectedJob.id);

    return (
      <div className="p-4 pb-24">
        <button 
          onClick={() => setSelectedJob(null)}
          className="mb-4 flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ChevronLeft size={16} /> Tillbaka till listan
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-800"
        >
          <div className="relative border-b border-slate-100 p-6 dark:border-slate-700">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  {isNew(selectedJob.publication_date) && (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      Ny
                    </span>
                  )}
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Publicerad {formatTimeAgo(selectedJob.publication_date)}
                  </span>
                </div>
                <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white leading-tight">{selectedJob.headline}</h1>
                <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-center gap-1.5">
                    <Building2 size={16} className="text-blue-500" />
                    <span className="font-medium">{selectedJob.employer?.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-red-500" />
                    <span>{selectedJob.workplace_address?.municipality}, {selectedJob.workplace_address?.region}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <JobLogo 
                  job={selectedJob} 
                  className="h-16 w-16 rounded-lg object-contain bg-white p-1 shadow-sm border border-slate-100 dark:border-slate-700"
                />
                <button 
                  onClick={() => toggleSaveJob(selectedJob)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-all active:scale-90 ${
                    isSaved ? 'bg-red-50 text-red-500 dark:bg-red-900/20' : 'bg-slate-50 text-slate-400 dark:bg-slate-700/50'
                  }`}
                >
                  <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/50">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1">Anställning</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{selectedJob.employment_type?.label || 'Ej angivet'}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/50">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1">Varaktighet</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{selectedJob.duration?.label || 'Ej angivet'}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/50">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1">Lön</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{selectedJob.salary_type?.label || 'Ej angivet'}</div>
              </div>
              <div className="rounded-xl bg-red-50 p-3 ring-1 ring-red-100 dark:bg-red-900/20 dark:ring-red-900/30">
                <div className="text-[10px] uppercase font-bold tracking-wider text-red-600/70 dark:text-red-400/70 mb-1">Sista ansökan</div>
                <div className="text-base font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                  <Clock size={16} className="shrink-0" />
                  {selectedJob.application_deadline ? new Date(selectedJob.application_deadline).toLocaleDateString() : 'Snarast'}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {hasRequirements && (
              <section>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                  <ClipboardCheck size={20} className="text-blue-500" />
                  Krav för tjänsten
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.must_have?.skills?.map((skill, i) => {
                    const label = skill.label.toLowerCase();
                    const isKeyRequirement = label.includes('ce-körkort') || label.includes('ykb') || label.includes('adr');
                    
                    return (
                      <span 
                        key={i} 
                        className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium border ${
                          isKeyRequirement 
                            ? 'bg-amber-100 text-amber-800 border-amber-200 shadow-sm ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-700/50 dark:ring-amber-700/30 font-bold' 
                            : 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50'
                        }`}
                      >
                        {isKeyRequirement && <Check size={12} className="mr-1.5" strokeWidth={3} />}
                        {skill.label}
                      </span>
                    );
                  })}
                  {selectedJob.must_have?.languages?.map((lang, i) => (
                    <span key={i} className="inline-flex items-center rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50">
                      {lang.label}
                    </span>
                  ))}
                  {selectedJob.must_have?.work_experiences?.map((exp, i) => (
                    <span key={i} className="inline-flex items-center rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border border-purple-100 dark:border-purple-800/50">
                      {exp.label}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {(selectedJob.nice_to_have?.skills?.length || 0) > 0 && (
              <section>
                <h3 className="mb-4 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Meriterande
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.nice_to_have?.skills?.map((skill, i) => (
                    <span key={i} className="inline-flex items-center rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 dark:bg-slate-700/30 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                      {skill.label}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Beskrivning</h3>
              <div 
                className="prose prose-slate max-w-none dark:prose-invert prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-headings:text-slate-900 dark:prose-headings:text-white prose-li:text-slate-600 dark:prose-li:text-slate-300 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: selectedJob.description.text_formatted || selectedJob.description.text }}
              />
            </section>
          </div>

          <div className="sticky bottom-0 border-t border-slate-100 bg-white/80 p-4 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80 flex gap-3">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: selectedJob.headline,
                    text: `Kolla in detta jobb: ${selectedJob.headline} hos ${selectedJob.employer.name}`,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Länk kopierad!');
                }
              }}
              className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all active:scale-95 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"
            >
              <Share2 size={20} />
            </button>
            <a
              href={selectedJob.application_details?.url || selectedJob.webpage_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] hover:bg-blue-700 hover:shadow-blue-600/40"
            >
              Ansök nu <ExternalLink size={18} />
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50">
      <div className="p-4 pb-24 max-w-4xl mx-auto">
        <header className="mb-8 flex items-center justify-between pt-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Jobbportal</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Hitta din nästa utmaning idag</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications && unreadCount > 0) {
                    markNotificationsRead();
                  }
                }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all active:scale-95 hover:ring-blue-500 dark:bg-slate-800 dark:ring-slate-700 dark:hover:ring-blue-500"
              >
                {unreadCount > 0 ? (
                  <BellRing size={22} className="text-blue-600 animate-pulse" />
                ) : (
                  <Bell size={22} className="text-slate-400" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white ring-4 ring-slate-50 dark:ring-slate-900">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-14 z-50 w-80 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 dark:text-white">Notiser</h3>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto space-y-2 pr-1">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center">
                          <Bell size={32} className="mx-auto mb-2 text-slate-200" />
                          <p className="text-sm text-slate-500">Inga nya notiser</p>
                        </div>
                      ) : (
                        notifications.map(notif => (
                          <div 
                            key={notif.id}
                            onClick={() => {
                              fetchJobDetails(notif.job_id);
                              setShowNotifications(false);
                            }}
                            className={`cursor-pointer rounded-xl p-3 text-sm transition-all ${
                              !notif.read ? 'bg-blue-50/50 dark:bg-blue-900/20 ring-1 ring-blue-100 dark:ring-blue-900/40' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                            }`}
                          >
                            <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{notif.headline}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{notif.employer}</div>
                            <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-slate-400">
                              <Clock size={10} />
                              {formatTimeAgo(notif.timestamp)}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="mb-8 flex gap-1.5 rounded-2xl bg-slate-200/50 p-1.5 dark:bg-slate-800/50 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
              activeTab === 'search' 
                ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-white' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Search size={18} />
            Sök jobb
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
              activeTab === 'saved' 
                ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-white' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Heart size={18} fill={activeTab === 'saved' ? "currentColor" : "none"} />
            Sparade ({savedJobs.length})
          </button>
        </div>

        {activeTab === 'search' ? (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-2xl shadow-blue-900/20"
            >
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold tracking-tight">Hitta ditt nästa jobb</h3>
                <p className="mt-2 text-blue-100">Sök bland tusentals lediga tjänster i hela Sverige</p>
              </div>

              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex flex-col gap-3 md:flex-row">
                  <div className="relative flex-1 group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm transition-colors group-focus-within:bg-white group-focus-within:text-blue-600">
                      <Search size={20} />
                    </div>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Vad vill du jobba med?"
                      className="w-full rounded-2xl border-0 bg-white/10 py-4 pl-16 pr-4 text-white placeholder:text-blue-200 shadow-inner ring-1 ring-inset ring-white/20 focus:bg-white focus:text-slate-900 focus:placeholder:text-slate-400 focus:ring-2 focus:ring-white/50 transition-all"
                    />
                  </div>
                  <div className="relative flex-1 group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm transition-colors group-focus-within:bg-white group-focus-within:text-blue-600">
                      <MapPin size={20} />
                    </div>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Var vill du jobba? (Stad)"
                      className="w-full rounded-2xl border-0 bg-white/10 py-4 pl-16 pr-4 text-white placeholder:text-blue-200 shadow-inner ring-1 ring-inset ring-white/20 focus:bg-white focus:text-slate-900 focus:placeholder:text-slate-400 focus:ring-2 focus:ring-white/50 transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setCity('');
                      setActiveFilters({ licenses: [], employment: [], schedule: [] });
                      setPublishedToday(false);
                    }}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-4 font-bold text-white transition-all active:scale-95 hover:bg-white/20 hover:text-red-200"
                    title="Återställ sökning"
                  >
                    <RotateCcw size={20} />
                  </button>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-blue-600 shadow-lg shadow-black/10 transition-all active:scale-95 hover:bg-blue-50"
                  >
                    SÖK <ArrowRight size={20} />
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all border ${
                        showFilters || (activeFilters.licenses.length + activeFilters.employment.length + activeFilters.schedule.length) > 0
                          ? 'bg-white text-blue-600 border-white' 
                          : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
                      }`}
                    >
                      <Filter size={18} />
                      Filter {(activeFilters.licenses.length + activeFilters.employment.length + activeFilters.schedule.length) > 0 && `(${(activeFilters.licenses.length + activeFilters.employment.length + activeFilters.schedule.length)})`}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const newValue = !publishedToday;
                        setPublishedToday(newValue);
                        searchJobs(true, newValue);
                      }}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all border ${
                        publishedToday 
                          ? 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/30' 
                          : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
                      }`}
                    >
                      <Calendar size={18} />
                      {publishedToday ? 'Publicerad idag' : 'Alla datum'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={createMonitor}
                      disabled={monitoring}
                      className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white border border-white/10 transition-all hover:bg-white/20 disabled:opacity-50"
                    >
                      <BellRing size={18} />
                      Bevaka
                    </button>
                  </div>
                </div>
              </form>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 border-t border-white/10 pt-6">
                      <div className="grid gap-6 md:grid-cols-3">
                        <div>
                          <h4 className="mb-3 text-sm font-bold text-white/80">Krav & Behörighet</h4>
                          <div className="flex flex-wrap gap-2">
                            {FILTER_OPTIONS.licenses.map(license => (
                              <button
                                key={license}
                                onClick={() => toggleFilter('licenses', license)}
                                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                  activeFilters.licenses.includes(license)
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                              >
                                {activeFilters.licenses.includes(license) && <Check size={12} />}
                                {license}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="mb-3 text-sm font-bold text-white/80">Anställningsform</h4>
                          <div className="flex flex-wrap gap-2">
                            {FILTER_OPTIONS.employment.map(type => (
                              <button
                                key={type}
                                onClick={() => toggleFilter('employment', type)}
                                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                  activeFilters.employment.includes(type)
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                              >
                                {activeFilters.employment.includes(type) && <Check size={12} />}
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="mb-3 text-sm font-bold text-white/80">Arbetstider</h4>
                          <div className="flex flex-wrap gap-2">
                            {FILTER_OPTIONS.schedule.map(time => (
                              <button
                                key={time}
                                onClick={() => toggleFilter('schedule', time)}
                                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                  activeFilters.schedule.includes(time)
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                              >
                                {activeFilters.schedule.includes(time) && <Check size={12} />}
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end border-t border-white/10 pt-4">
                        <button
                          onClick={clearFilters}
                          className="text-xs font-bold text-white/60 hover:text-white transition-colors"
                        >
                          Rensa alla filter
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="mb-8 flex flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest py-2 mr-2">Populära sökningar:</span>
              {['Lastbilsförare', 'Sjuksköterska', 'Lagerarbetare', 'Butikssäljare', 'Utvecklare'].map(tag => (
                <button
                  key={tag}
                  onClick={() => { setQuery(tag); searchJobs(true); }}
                  className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200 hover:ring-blue-500 hover:text-blue-600 transition-all dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:ring-blue-500"
                >
                  {tag}
                </button>
              ))}
            </div>

          {loading && jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-slate-500">Söker efter jobb...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {totalHits} lediga jobb
                </p>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <span>Sorterat på:</span>
                  <select className="bg-transparent font-bold text-slate-700 dark:text-white focus:outline-none">
                    <option>Relevans</option>
                    <option>Datum</option>
                  </select>
                </div>
              </div>
              
              <AnimatePresence mode="popLayout">
                {jobs.map((job) => (
                  <motion.div 
                    key={job.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: 10 }}
                    onClick={() => fetchJobDetails(job.id)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-xl hover:shadow-blue-900/5 hover:ring-blue-500/20 dark:bg-slate-800 dark:ring-slate-700 dark:hover:ring-blue-500/30"
                  >
                    <div className="flex gap-5">
                      <div className="hidden sm:block shrink-0">
                        <JobLogo 
                          job={job} 
                          className="h-16 w-16 rounded-xl object-contain bg-white p-2 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors leading-tight line-clamp-2">
                              {job.headline}
                            </h3>
                            <div className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                              <span className="text-slate-900 dark:text-white font-bold">{job.employer?.name}</span>
                              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                              <span>{job.workplace_address?.municipality || 'Hela Sverige'}</span>
                            </div>
                          </div>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveJob(job);
                            }}
                            className={`shrink-0 rounded-full p-2 transition-all hover:bg-slate-100 dark:hover:bg-slate-700 ${
                              savedJobs.some(sj => sj.id === job.id) 
                                ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                                : 'text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400'
                            }`}
                          >
                            <Heart size={20} fill={savedJobs.some(sj => sj.id === job.id) ? "currentColor" : "none"} />
                          </button>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-700/50 dark:text-slate-300 dark:ring-slate-700">
                            <Briefcase size={12} />
                            {job.employment_type?.label}
                          </span>
                          {isNew(job.publication_date) && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-800">
                              <Clock size={12} />
                              Ny idag
                            </span>
                          )}
                          {getLicenses(job).map(license => (
                            <span key={license} className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-800">
                              {license}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {jobs.length === 0 && !loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800/50">
                    <Search size={40} className="text-slate-300" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">Inga jobb hittades</h3>
                  <p className="max-w-xs text-slate-500 dark:text-slate-400">
                    Vi kunde inte hitta några jobb som matchar din sökning.
                  </p>
                  <button 
                    onClick={() => { setQuery('lastbilsförare'); setCity(''); searchJobs(true); }}
                    className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                  >
                    Rensa sökning
                  </button>
                </motion.div>
              )}

              {jobs.length < totalHits && (
                <button
                  onClick={() => searchJobs(false)}
                  disabled={loadingMore}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 text-sm font-bold text-slate-900 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:shadow-md disabled:opacity-50 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Laddar fler annonser...
                    </>
                  ) : (
                    'Visa fler jobb'
                  )}
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dina sparade annonser</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {savedJobs.length} sparade
            </span>
          </div>
          
          {savedJobs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800/50">
                <Heart size={40} className="text-slate-300" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">Inga sparade jobb än</h3>
              <p className="max-w-xs text-slate-500 dark:text-slate-400">
                Spara jobb du är intresserad av genom att klicka på hjärtat i annonsen.
              </p>
              <button 
                onClick={() => setActiveTab('search')}
                className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
              >
                Börja söka
              </button>
            </motion.div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {savedJobs.map(job => (
                <motion.div 
                  key={job.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  onClick={() => fetchJobDetails(job.id)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-xl hover:shadow-blue-900/5 hover:ring-blue-500/20 dark:bg-slate-800 dark:ring-slate-700 dark:hover:ring-blue-500/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-2 text-lg font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 leading-tight line-clamp-2 transition-colors">
                        {job.headline}
                      </h3>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                          <Building2 size={14} className="text-slate-400" />
                          <span className="font-bold text-slate-700 dark:text-slate-300">{job.employer}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                          <MapPin size={14} className="text-slate-400" />
                          <span>{job.municipality}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveJob({ id: job.id } as JobAd);
                      }}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-all hover:bg-red-100 hover:scale-110 dark:bg-red-900/20 dark:hover:bg-red-900/40"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-4 dark:border-slate-700/50">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sparad annons</span>
                    <div className="flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                      Visa <ArrowRight size={16} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 z-[100] -translate-x-1/2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-md dark:bg-white dark:text-slate-900"
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                  <ClipboardCheck size={12} className="text-white" />
                </div>
              ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                  <Bell size={12} className="text-white" />
                </div>
              )}
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}
