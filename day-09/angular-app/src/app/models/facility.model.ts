export interface Facility {
  id: number;
  name: string;
  location: string;
  capacity: number;
  status: 'Good' | 'Needs Cleaning' | 'Under Maintenance' | 'Critical';
  cleanliness_score: number;
  odor_score: number;
  waste_level: 'Low' | 'Medium' | 'High';
  footfall: number;
  created_at?: string;
  updated_at?: string;
  inspections_count?: number;
  complaints_count?: number;
}

export interface DashboardMetrics {
  total_facilities: number;
  average_cleanliness: number;
  critical_facilities: number;
  needs_cleaning: number;
  pending_complaints: number;
  total_inspections: number;
}
