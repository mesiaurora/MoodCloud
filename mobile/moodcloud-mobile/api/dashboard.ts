import client from './client';

export interface DashboardData {
    streak: number;
    has_entries_last_7_days: boolean;
    entries_last_30_days: string[];
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