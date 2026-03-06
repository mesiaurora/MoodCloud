import client from "./client";

export interface FieldValue {
    field_id: number;
    numeric_value?: number;
    boolean_value?: boolean;
    text_value?: string;
}

export interface CreateLogEntryData {
    field_values: FieldValue[];
}


export const createLogEntry = async (entryData: { mood: number; note?: string; fields?: Record<string, any> }) => {
    try {
        const response = await client.post('/logentry/', entryData);
        return response.data;
    } catch (error) {
        console.error('Error creating log entry:', error);
        throw error;
    }
};