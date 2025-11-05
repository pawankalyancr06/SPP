import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, DollarSign, Users, Settings } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const OwnerDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 125000,
    utilization: 75,
    upcomingBookings: 12,
    totalVenues: 3,
  });

  const revenueData = [
    { month: 'Jan', revenue: 40000 },
    { month: 'Feb', revenue: 35000 },
    { month: 'Mar', revenue: 50000 },
  ];

  const utilizationData = [
    { name: 'Booked', value: 75, color: '#00FF87' },
    { name: 'Available', value: 25, color: '#1E90FF' },
  ];

  const bookingsData = [
    { day: 'Mon', bookings: 8 },
    { day: 'Tue', bookings: 12 },
    { day: 'Wed', bookings: 10 },
    { day: 'Thu', bookings: 15 },
    { day: 'Fri', bookings: 18 },
    { day: 'Sat', bookings: 22 },
    { day: 'Sun', bookings: 20 },
  ];

  const dashboardCards = [
    {
      icon: DollarSign,
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      change: '+12%',
      color: 'primary',
    },
    {
      icon: TrendingUp,
      title: 'Turf Utilization',
      value: `${stats.utilization}%`,
      change: '+5%',
      color: 'accent2',
    },
    {
      icon: Calendar,
      title: 'Upcoming Bookings',
      value: stats.upcomingBookings,
      change: '+3',
      color: 'accent1',
    },
    {
      icon: Users,
      title: 'Total Venues',
      value: stats.totalVenues,
      change: 'Active',
      color: 'primary',
    },
  ];

  return (
    <div className="min-h-screen bg-secondary pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-heading font-black gradient-text">Owner Dashboard</h1>
          <button className="btn-glow glass border border-primary/50 text-primary px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:border-primary">
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 card-hover"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${card.color}/20 flex items-center justify-center`}>
                  <card.icon className={`w-6 h-6 text-${card.color}`} />
                </div>
                <span className="text-sm text-neutral">{card.change}</span>
              </div>
              <h3 className="text-2xl font-heading font-bold text-white mb-1">{card.value}</h3>
              <p className="text-sm text-neutral">{card.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-xl font-heading font-bold mb-6 text-white">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#00FF87"
                  strokeWidth={3}
                  dot={{ fill: '#00FF87', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Utilization Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-xl font-heading font-bold mb-6 text-white">Turf Utilization</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={utilizationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {utilizationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Bookings Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-xl font-heading font-bold mb-6 text-white">Weekly Bookings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="bookings" fill="#00FF87" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
