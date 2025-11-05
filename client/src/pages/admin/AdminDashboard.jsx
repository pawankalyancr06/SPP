import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, Calendar, DollarSign, Search } from 'lucide-react';

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { icon: Users, label: 'Total Users', value: '2,543', color: 'primary' },
    { icon: Building2, label: 'Total Venues', value: '156', color: 'accent2' },
    { icon: Calendar, label: 'Active Bookings', value: '89', color: 'accent1' },
    { icon: DollarSign, label: 'Revenue', value: '₹12.5L', color: 'primary' },
  ];

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'owner', status: 'active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'inactive' },
  ];

  return (
    <div className="min-h-screen bg-secondary pt-24">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-heading font-black gradient-text mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 card-hover"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}/20 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
              </div>
              <h3 className="text-3xl font-heading font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-neutral">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Users Table */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-bold text-white">Users Management</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-secondary/50 border border-neutral/20 rounded-xl pl-12 pr-4 py-2 text-white placeholder-neutral focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral/20">
                  <th className="text-left py-4 px-4 text-neutral font-bold">Name</th>
                  <th className="text-left py-4 px-4 text-neutral font-bold">Email</th>
                  <th className="text-left py-4 px-4 text-neutral font-bold">Role</th>
                  <th className="text-left py-4 px-4 text-neutral font-bold">Status</th>
                  <th className="text-left py-4 px-4 text-neutral font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-neutral/10 hover:bg-neutral/5 transition"
                  >
                    <td className="py-4 px-4 text-white">{user.name}</td>
                    <td className="py-4 px-4 text-neutral">{user.email}</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-primary">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.status === 'active'
                            ? 'bg-primary/20 text-primary'
                            : 'bg-accent1/20 text-accent1'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-primary hover:text-accent2 transition text-sm font-bold">
                        Edit
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
