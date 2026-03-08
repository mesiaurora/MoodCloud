import client from "./client";

export interface FieldValue {
    id: number;
    field: {
        id: number;
        name: string;
        field_type: 'numeric' | 'boolean' | 'text';
    };
    numeric_value: number | null;
    boolean_value: boolean | null;
    text_value: string | null;
}

export interface CreateLogEntryData {
    field_values: FieldValue[];
}

export interface LogEntry {
    id: number;
    field_values: FieldValue[];
    logged_at: string;
}

export const createLogEntry = async (data: CreateLogEntryData) => {
    try {
        const response = await client.post('/create_log_entry/', data);
        return response.data;
    } catch (error) {
        console.error('Error creating log entry:', error);
        throw error;
    }
};

export const getLogEntries = async () => {
    try {
        const response = await client.get('/mood-log-entries/');
        return response.data;
    } catch (error) {
        console.error('Error fetching log entries:', error);
        throw error;
    }
};

export const deleteLogEntry = async (id: number) => {
    await client.delete(`/mood-log-entries/${id}/`);
}