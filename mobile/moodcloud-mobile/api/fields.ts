import client from "./client";

export interface Field {
    id: number;
    name: string;
    field_type: 'numeric' | 'boolean' | 'text';
    created_at: string;
    is_active: boolean;
}

export interface CreateFieldData {
    name: string;
    field_type: 'numeric' | 'boolean' | 'text';
}


export const getFields = async (): Promise<Field[]> => {
    try {
        const response = await client.get('/fields/');
        return response.data;
    } catch (error) {
        console.error('Error fetching fields:', error);
        throw error;
    }
};

export const createField = async (field: CreateFieldData): Promise<Field> => {
    try {
        const response = await client.post('/fields/', field);
        console.log('Created field:', field.name);
        return response.data;
    } catch (error) {
        console.error('Error creating field:', error);
        throw error;
    }
};

export const updateField = async (field: Field): Promise<Field> => {
    try {
        const response = await client.put(`/fields/${field.id}/`, field);
        return response.data;
    } catch (error) {
        console.error('Error updating field:', error);
        throw error;
    }
};

export const deleteField = async (fieldId: number): Promise<void> => {
    try {
        await client.patch(`/fields/${fieldId}/`, { is_active: false });
    } catch (error) {
        console.error('Error deleting field:', error);
        throw error;
    }
};

