import { useEffect, useState } from "react";
import { ENDPOINTS } from '../config/api';

// Principio SRP: Este hook solo se encarga de la lógica de obtención de datos para el dashboard
// Principio DIP: El componente Dashboard depende de este hook, no de la implementación concreta de fetch
export default function useDashboardData() {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [newUsersByMonth, setNewUsersByMonth] = useState<number[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [monthlyReports] = await Promise.all([
          fetch(ENDPOINTS.MONTHLY_REPORTS).then(res => res.json())
        ]);
        if (monthlyReports) {
          setTotalUsers(monthlyReports.totalUsers);
          setNewUsersByMonth(monthlyReports.newUsersByMonth);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchDashboardData();
  }, []);

  return { totalUsers, newUsersByMonth };
} 