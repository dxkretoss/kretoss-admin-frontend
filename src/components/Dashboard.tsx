
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';

const Dashboard: React.FC = () => {
  const { jobs, applications, contacts } = useApp();

  const stats = [
    {
      title: 'Total Jobs',
      value: jobs.length,
      description: 'Active job postings',
      color: 'bg-blue-500',
    },
    {
      title: 'Applications',
      value: applications.length,
      description: 'Total applications received',
      color: 'bg-green-500',
    },
    {
      title: 'New Applications',
      value: applications.filter(app => app.status === 'New').length,
      description: 'Pending review',
      color: 'bg-yellow-500',
    },
    {
      title: 'Contact Forms',
      value: contacts.length,
      description: 'Contact inquiries',
      color: 'bg-purple-500',
    },
  ];

  const recentApplications = applications.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to Kretoss Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`w-4 h-4 rounded-full ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentApplications.map((application) => (
                <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{application.applicantName}</p>
                    <p className="text-sm text-gray-600">{application.jobTitle}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    application.status === 'New' ? 'bg-blue-100 text-blue-800' :
                    application.status === 'Reviewing' ? 'bg-yellow-100 text-yellow-800' :
                    application.status === 'Shortlisted' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {application.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {jobs.filter(job => job.status === 'Active').slice(0, 5).map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-600">{job.category} • {job.jobType}</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
