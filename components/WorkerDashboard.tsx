import React from 'react';
import { Award, Clock, DollarSign, TrendingUp, Calendar, MapPin, Shield } from 'lucide-react';

const WorkerDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Performance</h1>
        <p className="text-slate-500">Welcome back, Worker 111. Here is your progress for this month.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Earnings Card */}
        <div className="bg-white overflow-hidden shadow rounded-xl border border-slate-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-emerald-50 rounded-md p-3">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Est. Earnings</dt>
                  <dd>
                    <div className="text-2xl font-bold text-slate-900">€2,450.00</div>
                    <div className="text-xs text-emerald-600 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1"/> +12% vs last month
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 px-5 py-3 border-t border-slate-200">
            <div className="text-xs text-slate-500">Next payout: 28th of the month</div>
          </div>
        </div>

        {/* Hours Card */}
        <div className="bg-white overflow-hidden shadow rounded-xl border border-slate-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-50 rounded-md p-3">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Hours Worked</dt>
                  <dd>
                    <div className="text-2xl font-bold text-slate-900">124h</div>
                    <div className="text-xs text-slate-500 mt-1">
                        Target: 160h
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 px-5 py-3 border-t border-slate-200">
             <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '77%' }}></div>
             </div>
          </div>
        </div>

        {/* Achievements Card */}
        <div className="bg-white overflow-hidden shadow rounded-xl border border-slate-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-50 rounded-md p-3">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Achievements</dt>
                  <dd>
                    <div className="text-2xl font-bold text-slate-900">Level 4</div>
                    <div className="text-xs text-purple-600 mt-1">
                        Pro Promoter
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex space-x-2">
             <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center" title="Top Seller">
                 <Shield className="w-3 h-3 text-yellow-600"/>
             </div>
             <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center" title="Punctual">
                 <Clock className="w-3 h-3 text-indigo-600"/>
             </div>
             <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center" title="Hot Streak">
                 <TrendingUp className="w-3 h-3 text-red-600"/>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Shifts */}
          <div className="lg:col-span-2 bg-white shadow rounded-lg border border-slate-200">
              <div className="px-6 py-5 border-b border-slate-200">
                  <h3 className="text-lg font-medium text-slate-900">Recent Shifts</h3>
              </div>
              <ul className="divide-y divide-slate-200">
                  {[1, 2, 3].map((i) => (
                      <li key={i} className="px-6 py-4">
                          <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                  <span className="text-sm font-medium text-slate-900">Auchan Kirchberg</span>
                                  <span className="text-xs text-slate-500 flex items-center mt-1">
                                      <Calendar className="w-3 h-3 mr-1"/> {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                                  </span>
                              </div>
                              <div className="flex flex-col items-end">
                                  <span className="text-sm font-semibold text-green-600">+ €145.00</span>
                                  <span className="text-xs text-slate-400">8h 30m</span>
                              </div>
                          </div>
                      </li>
                  ))}
              </ul>
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-center">
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">View All History</button>
              </div>
          </div>

          {/* Upcoming Schedule */}
          <div className="bg-white shadow rounded-lg border border-slate-200">
              <div className="px-6 py-5 border-b border-slate-200">
                  <h3 className="text-lg font-medium text-slate-900">Upcoming</h3>
              </div>
              <div className="p-6 space-y-6">
                  <div className="flex items-start">
                      <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold flex-col leading-none">
                              <span className="text-xs uppercase">Oct</span>
                              <span className="text-sm">24</span>
                          </div>
                      </div>
                      <div className="ml-4">
                          <h4 className="text-sm font-medium text-slate-900">Belle Etoile Promotion</h4>
                          <p className="text-xs text-slate-500 mt-1 flex items-center">
                              <Clock className="w-3 h-3 mr-1"/> 09:00 - 17:00
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 flex items-center">
                              <MapPin className="w-3 h-3 mr-1"/> Shopping Center
                          </p>
                      </div>
                  </div>

                   <div className="flex items-start">
                      <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold flex-col leading-none">
                              <span className="text-xs uppercase">Oct</span>
                              <span className="text-sm">26</span>
                          </div>
                      </div>
                      <div className="ml-4">
                          <h4 className="text-sm font-medium text-slate-900">City Center Leafleting</h4>
                          <p className="text-xs text-slate-500 mt-1 flex items-center">
                              <Clock className="w-3 h-3 mr-1"/> 13:00 - 18:00
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 flex items-center">
                              <MapPin className="w-3 h-3 mr-1"/> Hamilius
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;