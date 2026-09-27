export interface Inspection {
  id: number;
  facility_id: number;
  facility_name?: string;
  inspector_id?: number;
  inspector_name?: string;
  cleanliness_score: number; // 1 - 10
  odor_score: number;        // 1 - 10
  waste_level: 'Low' | 'Medium' | 'High';
  water_available: boolean;
  notes?: string;
  inspection_date: string;
  created_at?: string;
}

export interface CreateInspectionDto {
  facility_id: number;
  cleanliness_score: number;
  odor_score: number;
  waste_level: 'Low' | 'Medium' | 'High';
  water_available: boolean;
  notes?: string;
  inspection_date: string;
}
