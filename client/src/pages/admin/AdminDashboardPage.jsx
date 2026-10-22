import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Skeleton from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [latestEnquiries, setLatestEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      api.get('/admin/stats').catch(() => ({ data: { data: {} } })),
      api.get('/admin/enquiries?limit=5').catch(() => ({ data: { data: [] } })),
    ]).then(([statsRes, enqRes]) => {
      if (isMounted) {
        setStats(statsRes.data?.data || {});
        setLatestEnquiries(enqRes.data?.data || []);
      }
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-medium text-cocoa">
          Dashboard
        </h1>
        <p className="text-cocoa/70 text-sm mt-0.5">
          Overview of showroom puppies, pending customer enquiries, and website activity.
        </p>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rect" className="h-28 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-3xl bg-white border border-cocoa/10 p-6 shadow-card space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cocoa/50">Available Puppies</span>
            <p className="font-display text-3xl font-bold text-emerald-600">
              {stats?.puppies?.available || 0}
            </p>
            <span className="text-xs text-cocoa/60 block">In showroom & ready</span>
          </div>

          <div className="rounded-3xl bg-white border border-cocoa/10 p-6 shadow-card space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cocoa/50">Reserved</span>
            <p className="font-display text-3xl font-bold text-amber-500">
              {stats?.puppies?.reserved || 0}
            </p>
            <span className="text-xs text-cocoa/60 block">Deposit received</span>
          </div>

          <div className="rounded-3xl bg-white border border-cocoa/10 p-6 shadow-card space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cocoa/50">Gone Home</span>
            <p className="font-display text-3xl font-bold text-rose-500">
              {stats?.puppies?.goneHome || 0}
            </p>
            <span className="text-xs text-cocoa/60 block">Adopted babies</span>
          </div>

          <div className="rounded-3xl bg-white border border-cocoa/10 p-6 shadow-card space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cocoa/50">New Enquiries</span>
            <p className="font-display text-3xl font-bold text-cocoa">
              {stats?.enquiries?.new || 0}
            </p>
            <span className="text-xs text-cocoa/60 block">Awaiting response</span>
          </div>
        </div>
      )}

      {/* Latest Enquiries */}
      <div className="rounded-3xl bg-white border border-cocoa/10 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-medium text-cocoa">
              Recent Enquiries
            </h2>
            <p className="text-xs text-cocoa/60">Customers who sent messages from website</p>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-xs font-bold text-apricot-dark hover:underline"
          >
            View all enquiries →
          </Link>
        </div>

        {latestEnquiries.length === 0 ? (
          <p className="text-sm text-cocoa/60 py-6 text-center">No recent enquiries found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-cocoa/10 text-cocoa/50 uppercase text-[11px] font-bold">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">Puppy / Source</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cocoa/5">
                {latestEnquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-sand/20">
                    <td className="py-3 font-semibold text-cocoa">{enq.name}</td>
                    <td className="py-3 text-cocoa/80">{enq.phone}</td>
                    <td className="py-3">
                      {enq.puppy ? (
                        <span className="font-medium text-apricot-dark">{enq.puppy.name}</span>
                      ) : (
                        <span className="text-cocoa/60">{enq.source}</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        enq.status === 'new' ? 'bg-amber-100 text-amber-800' :
                        enq.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-cocoa/60 text-xs">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
