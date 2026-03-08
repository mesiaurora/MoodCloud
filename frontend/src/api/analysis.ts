import client from './client';

export interface NumericResult {
    field: string;
    type: 'numeric';
    mean: number;
    median: number;
}

export interface BooleanResult {
    field: string;
    type: 'boolean';
    true_count: number;
    false_count: number;
}

export interface TextResult {
    field: string;
    type: 'text';
    word_counts: { word: string; count: number }[];
}

export type FieldAnalysis = NumericResult | BooleanResult | TextResult;

export interface AnalysisResponse {
    analysis: FieldAnalysis[];
}

export const getAnalysis = async (start_date: string, end_date: string): Promise<AnalysisResponse> => {
    try {
        const response = await client.get(`/analysis/?start_date=${start_date}&end_date=${end_date}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching analysis:', error);
        throw error;
    }
};