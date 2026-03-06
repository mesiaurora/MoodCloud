import client from '../api/client';

export interface DashboardData {
    streak: number;
    has_entries_last_7_days: boolean;
    has_entries_last_30_days: boolean;
}


export const getDashboardData = async (): Promise<DashboardData> => {
    try {
        const response = await client.get('/dashboard/');
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
};